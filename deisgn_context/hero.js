/* ============================================================
   hero.js — WebGL hero background
   Domain-warped fbm "aurora" glow + drifting particles + cursor light.
   Theme-aware (reads CSS vars), DPR-capped, pauses off-screen.
   Exposes window.HeroGL.setTheme() so main.js can re-sync on toggle.
   ============================================================ */
(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Fallback: gradient wash if no WebGL ----
  if (!gl) {
    canvas.style.background =
      'radial-gradient(ellipse 70% 60% at 60% 38%, var(--accent-soft), transparent 70%)';
    return;
  }

  const VERT = `
    attribute vec2 p;
    void main(){ gl_Position = vec4(p, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    uniform vec2  u_res;
    uniform float u_time;
    uniform vec2  u_mouse;     // 0..1
    uniform float u_mouseAmt;  // glow strength under cursor
    uniform vec3  u_bg;
    uniform vec3  u_accent;
    uniform vec3  u_accent2;
    uniform float u_dark;      // 1 dark, 0 light

    // --- hash / noise ---
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

    // particle layer — soft drifting points
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

      // domain warp
      vec2 q = vec2(fbm(p*1.4 + vec2(0.0, t)), fbm(p*1.4 + vec2(5.2, -t)));
      vec2 r = vec2(fbm(p*1.4 + 3.0*q + vec2(1.7, 9.2) + t*0.7),
                    fbm(p*1.4 + 3.0*q + vec2(8.3, 2.8) - t*0.6));
      float f = fbm(p*1.4 + 2.5*r);
      f = clamp(f*0.5 + 0.5, 0.0, 1.0);

      // concentrate glow toward upper-center
      vec2 c = uv - vec2(0.58, 0.46);
      c.x *= u_res.x / u_res.y;
      float falloff = smoothstep(0.95, 0.05, length(c));

      float glow = pow(f, 1.7) * falloff;

      // cursor light
      vec2 mc = uv - u_mouse;
      mc.x *= u_res.x / u_res.y;
      float ml = smoothstep(0.42, 0.0, length(mc)) * (0.5 + 0.9*u_mouseAmt);

      vec3 col = u_bg;
      vec3 aur = mix(u_accent, u_accent2, clamp(r.x+0.5, 0.0, 1.0));
      col += aur * glow * (u_dark > 0.5 ? 0.85 : 0.34);
      col += u_accent * ml * (u_dark > 0.5 ? 0.30 : 0.14);

      // particles
      float pt = particles(uv, u_time*0.5);
      col += u_accent * pt * (u_dark > 0.5 ? 0.55 : 0.30);

      // vignette + grain
      col *= 1.0 - 0.25*pow(length(uv-0.5), 2.2);
      float g = (hash2(uv*u_res + u_time).x) * (u_dark > 0.5 ? 0.025 : 0.018);
      col += g;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('shader error:', gl.getShaderInfoLog(s));
    }
    return s;
  }

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

  // ---- theme colors ----
  // Hardcoded to match the CSS tokens so the shader never depends on a
  // (sometimes stale) getComputedStyle read when the theme flips.
  function hexToRgb(str) {
    str = String(str).trim();
    if (str.startsWith('#')) {
      const n = str.slice(1);
      const v = n.length === 3
        ? n.split('').map((c) => parseInt(c + c, 16))
        : [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
      return v.map((x) => x / 255);
    }
    const m = str.match(/[\d.]+/g);
    if (m) return [m[0] / 255, m[1] / 255, m[2] / 255];
    return [0, 0, 0];
  }
  const THEMES = {
    dark:  { bg: '#07080c', accent: '#3a86ff', accent2: '#7d6bff' },
    light: { bg: '#fbf8f4', accent: '#2f6fe0', accent2: '#6f63e6' },
  };
  let theme = { bg: [0.03, 0.03, 0.05], accent: [0.23, 0.52, 1], accent2: [0.5, 0.4, 1], dark: 1 };
  function syncTheme() {
    const mode = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const t = THEMES[mode];
    theme.bg = hexToRgb(t.bg);
    theme.accent = hexToRgb(t.accent);
    theme.accent2 = hexToRgb(t.accent2);
    theme.dark = mode === 'light' ? 0 : 1;
  }
  syncTheme();

  // ---- resize ----
  let W = 0, H = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.floor(rect.width * dpr));
    H = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
    }
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- mouse ----
  const mouse = { x: 0.58, y: 0.54, tx: 0.58, ty: 0.54, amt: 0, tamt: 0 };
  window.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.tx = (e.clientX - rect.left) / rect.width;
    mouse.ty = 1 - (e.clientY - rect.top) / rect.height;
    mouse.tamt = 1;
  });
  window.addEventListener('pointerleave', () => { mouse.tamt = 0; });

  // ---- visibility / on-screen gating ----
  let visible = true, onScreen = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((ents) => { onScreen = ents[0].isIntersecting; }, { threshold: 0.01 })
      .observe(canvas);
  }

  // ---- render ----
  const start = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || !onScreen) return;
    resize();
    const t = reduce ? 12.0 : (now - start) / 1000;

    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    mouse.amt += (mouse.tamt - mouse.amt) * 0.05;

    gl.uniform2f(U.res, W, H);
    gl.uniform1f(U.time, reduce ? 12.0 : t);
    gl.uniform2f(U.mouse, mouse.x, mouse.y);
    gl.uniform1f(U.mouseAmt, mouse.amt);
    gl.uniform3fv(U.bg, theme.bg);
    gl.uniform3fv(U.accent, theme.accent);
    gl.uniform3fv(U.accent2, theme.accent2);
    gl.uniform1f(U.dark, theme.dark);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (reduce) visible = false; // draw one static frame then idle
  }
  requestAnimationFrame(frame);

  window.HeroGL = {
    setTheme() { syncTheme(); visible = true; requestAnimationFrame(frame); },
  };
})();
