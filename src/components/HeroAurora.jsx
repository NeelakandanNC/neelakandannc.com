import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HeroAurora.css';

/* ---------- WebGL aurora shader (ported from the design prototype) ---------- */
const VERT = `
  attribute vec2 p;
  void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;
const FRAG = `
  precision highp float;
  uniform vec2  u_res;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform float u_mouseAmt;
  uniform vec3  u_bg;
  uniform vec3  u_accent;
  uniform vec3  u_accent2;
  uniform float u_dark;

  vec2 hash2(vec2 p){
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(dot(hash2(i+vec2(0,0)), f-vec2(0,0)),
                   dot(hash2(i+vec2(1,0)), f-vec2(1,0)), u.x),
               mix(dot(hash2(i+vec2(0,1)), f-vec2(0,1)),
                   dot(hash2(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }
  float particles(vec2 uv, float t){
    float acc = 0.0;
    for(int i=0;i<28;i++){
      float fi = float(i);
      vec2 seed = hash2(vec2(fi*1.7, fi*3.1));
      float sp = 0.04 + 0.10*fract(seed.x*0.5+0.5);
      vec2 pos = vec2(
        fract(seed.x*0.5+0.5 + sin(t*sp + fi)*0.04),
        fract(seed.y*0.5+0.5 + t*sp*0.5 + fi*0.13)
      );
      float d = length((uv - pos) * vec2(u_res.x/u_res.y, 1.0));
      float tw = 0.55 + 0.45*sin(t*1.6 + fi*2.0);
      acc += smoothstep(0.014, 0.0, d) * tw;
    }
    return acc;
  }
  void main(){
    vec2 uv = gl_FragCoord.xy / u_res.xy;
    vec2 p = uv;
    p.x *= u_res.x / u_res.y;
    float t = u_time * 0.06;

    vec2 q = vec2(fbm(p*1.4 + vec2(0.0, t)), fbm(p*1.4 + vec2(5.2, -t)));
    vec2 r = vec2(fbm(p*1.4 + 3.0*q + vec2(1.7, 9.2) + t*0.7),
                  fbm(p*1.4 + 3.0*q + vec2(8.3, 2.8) - t*0.6));
    float f = fbm(p*1.4 + 2.5*r);
    f = clamp(f*0.5 + 0.5, 0.0, 1.0);

    vec2 c = uv - vec2(0.58, 0.46);
    c.x *= u_res.x / u_res.y;
    float falloff = smoothstep(0.95, 0.05, length(c));
    float glow = pow(f, 1.7) * falloff;

    vec2 mc = uv - u_mouse;
    mc.x *= u_res.x / u_res.y;
    float ml = smoothstep(0.42, 0.0, length(mc)) * (0.5 + 0.9*u_mouseAmt);

    vec3 col = u_bg;
    vec3 aur = mix(u_accent, u_accent2, clamp(r.x+0.5, 0.0, 1.0));
    col += aur * glow * (u_dark > 0.5 ? 0.85 : 0.34);
    col += u_accent * ml * (u_dark > 0.5 ? 0.30 : 0.14);

    float pt = particles(uv, u_time*0.5);
    col += u_accent * pt * (u_dark > 0.5 ? 0.55 : 0.30);

    col *= 1.0 - 0.25*pow(length(uv-0.5), 2.2);
    float g = (hash2(uv*u_res + u_time).x) * (u_dark > 0.5 ? 0.025 : 0.018);
    col += g;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const THEMES = {
  dark: { bg: '#07080c', accent: '#3a86ff', accent2: '#7d6bff' },
  light: { bg: '#fbf8f4', accent: '#2f6fe0', accent2: '#6f63e6' },
};
function hexToRgb(hex) {
  const n = hex.replace('#', '');
  return [
    parseInt(n.slice(0, 2), 16) / 255,
    parseInt(n.slice(2, 4), 16) / 255,
    parseInt(n.slice(4, 6), 16) / 255,
  ];
}

const titleLines = [
  { text: 'I build systems', italic: false },
  { text: 'that create', italic: false },
  { text: 'leverage.', italic: true },
];

// Read the active theme straight from the DOM — the same source the CSS uses —
// so the canvas can never desync from the visible theme.
const currentMode = () =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

export default function HeroAurora() {
  const canvasRef = useRef(null);
  const wakeRef = useRef(() => {});
  const clockRef = useRef(null);

  // ---- WebGL setup (mount once) ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) {
      // No WebGL: sit a subtle brand glow over the theme-correct .hero bg.
      canvas.style.background =
        'radial-gradient(ellipse 70% 60% at 58% 40%, var(--accent-soft), transparent 70%)';
      return;
    }

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      res: gl.getUniformLocation(prog, 'u_res'),
      time: gl.getUniformLocation(prog, 'u_time'),
      mouse: gl.getUniformLocation(prog, 'u_mouse'),
      mouseAmt: gl.getUniformLocation(prog, 'u_mouseAmt'),
      bg: gl.getUniformLocation(prog, 'u_bg'),
      accent: gl.getUniformLocation(prog, 'u_accent'),
      accent2: gl.getUniformLocation(prog, 'u_accent2'),
      dark: gl.getUniformLocation(prog, 'u_dark'),
    };

    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width * dpr));
      H = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
        gl.viewport(0, 0, W, H);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: 0.58, y: 0.54, tx: 0.58, ty: 0.54, amt: 0, tamt: 0 };
    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height;
      mouse.tamt = 1;
    };
    const onPointerLeave = () => {
      mouse.tamt = 0;
    };
    window.addEventListener('pointermove', onPointer);
    window.addEventListener('pointerleave', onPointerLeave);

    let visible = true;
    let onScreen = true;
    const onVis = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);
    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (ents) => {
          onScreen = ents[0].isIntersecting;
        },
        { threshold: 0.01 }
      );
      io.observe(canvas);
    }

    // wake on theme flip so it redraws even when idle (reduced-motion)
    wakeRef.current = () => {
      visible = true;
    };
    const themeObs = new MutationObserver(() => wakeRef.current());
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const start = performance.now();
    let raf;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible || !onScreen) return;
      resize();
      const t = reduce ? 12.0 : (now - start) / 1000;

      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.amt += (mouse.tamt - mouse.amt) * 0.05;

      const mode = currentMode();
      const tc = THEMES[mode];

      gl.uniform2f(U.res, W, H);
      gl.uniform1f(U.time, reduce ? 12.0 : t);
      gl.uniform2f(U.mouse, mouse.x, mouse.y);
      gl.uniform1f(U.mouseAmt, mouse.amt);
      gl.uniform3fv(U.bg, hexToRgb(tc.bg));
      gl.uniform3fv(U.accent, hexToRgb(tc.accent));
      gl.uniform3fv(U.accent2, hexToRgb(tc.accent2));
      gl.uniform1f(U.dark, mode === 'light' ? 0 : 1);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (reduce) visible = false; // draw one static frame then idle
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVis);
      if (io) io.disconnect();
      themeObs.disconnect();
      wakeRef.current = () => {};
    };
  }, []);

  // ---- live local clock ----
  useEffect(() => {
    const el = clockRef.current;
    if (!el) return;
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const d = new Date();
      el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero" id="hero">
      <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero__grid-tex" aria-hidden="true" />
      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__marquee-track">
          <span>NEELAKANDAN</span>
          <span>NEELAKANDAN</span>
          <span>NEELAKANDAN</span>
        </div>
      </div>

      <div className="hero__inner container">
        <motion.div
          className="hero__tags"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className="chip">
            <span className="chip__dot" />Available — open to build
          </span>
          <span className="chip mono">Founder @ Agentronics</span>
        </motion.div>

        <h1 className="hero__title" aria-label="I build systems that create leverage.">
          {titleLines.map((line, i) => (
            <span className="hero__title-line" key={line.text}>
              <motion.span
                className={`hero__word${line.italic ? ' italic-blue serif' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="hero__foot">
          <motion.p
            className="hero__bio"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            I'm <em>Neelakandan</em> — founder at the intersection of AI and markets.
            I build the autonomous systems that create leverage, and journal the
            journey here.
          </motion.p>
          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62 }}
          >
            <Link to="/purpose" className="btn btn--solid magnetic" data-cursor="View">
              See the work <span className="arrow">→</span>
            </Link>
            <Link to="/contact" className="btn btn--ghost magnetic">
              Get in touch
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="hero__meta" aria-hidden="true">
        <span className="hero__meta-item">
          <span className="hero__meta-k">Local time</span>
          <span className="hero__meta-v mono" ref={clockRef}>
            —:—:—
          </span>
        </span>
        <span className="hero__meta-item">
          <span className="hero__meta-k">Status</span>
          <span className="hero__meta-v">
            <span className="hero__live-dot" />Building in public
          </span>
        </span>
        <span className="hero__meta-item">
          <span className="hero__meta-k">Based in</span>
          <span className="hero__meta-v">India → Anywhere</span>
        </span>
        <span className="hero__meta-item">
          <span className="hero__meta-k">Since</span>
          <span className="hero__meta-v mono">2017</span>
        </span>
      </div>

      <div className="hero__fade" aria-hidden="true" />
      <span className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero__scroll-bar" />
      </span>
    </section>
  );
}
