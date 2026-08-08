"""Generate the arc-reactor favicon set and the OG card.

Mirrors components/hud/ArcReactor.tsx: metal housing ring with notches and
mounting screws, ten copper-wound coils on silver plates, inner glowing
well, triangular core. Original generated geometry — no traced assets.

Rendered at 4x (icons) / 3x (OG) and downsampled.
"""
import math
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")
FAV = f"{ROOT}/favicon"
os.makedirs(FAV, exist_ok=True)

BLUE = (58, 134, 255)
BLUE_HI = (150, 195, 255)
COPPER = (224, 169, 46)
COPPER_HI = (249, 220, 138)
METAL = (141, 155, 173)
METAL_HI = (232, 238, 246)
METAL_LO = (95, 108, 125)
DARK = (4, 7, 14)
HANGAR = (5, 8, 16)
WHITE = (255, 255, 255)


def draw_reactor(size, bg, detail=True):
    """detail=False strips coils/screws for tiny sizes, where they'd turn to mud."""
    S = size * 4
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0) if bg is None else (*bg, 255))
    c = S / 2

    def polar(r, deg):
        a = math.radians(deg - 90)
        return c + r * math.cos(a), c + r * math.sin(a)

    # bloom
    bloom = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bloom)
    r = S * 0.33
    bd.ellipse((c - r, c - r, c + r, c + r), fill=(*BLUE, 110))
    img.alpha_composite(bloom.filter(ImageFilter.GaussianBlur(S * 0.05)))

    d = ImageDraw.Draw(img, "RGBA")
    U = S / 100.0  # viewBox unit, matching the component

    def ring(radius, color, width):
        rr = radius * U
        d.ellipse((c - rr, c - rr, c + rr, c + rr), outline=color, width=max(int(width * U), 1))

    # metal housing (approximates the component's brushed-metal gradient
    # with a mid-tone body plus a highlight arc on the upper-left)
    ring(44, METAL, 6)
    rr = 44 * U
    d.arc((c - rr, c - rr, c + rr, c + rr), 175, 315, fill=METAL_HI, width=max(int(2.4 * U), 1))
    d.arc((c - rr, c - rr, c + rr, c + rr), 20, 140, fill=METAL_LO, width=max(int(2.2 * U), 1))
    ring(41, (10, 18, 32), 1)
    ring(47, (10, 18, 32), 0.8)

    if detail:
        # notches
        for i in range(24):
            a, major = i * 15, i % 2 == 0
            d.line((*polar(40.5 * U, a), *polar((43.5 if major else 42.4) * U, a)),
                   fill=(63, 76, 92), width=max(int((0.9 if major else 0.45) * U), 1))
        # mounting screws
        for i in range(8):
            x, y = polar(44.5 * U, i * 45 + 22.5)
            s = 1.05 * U
            d.ellipse((x - s, y - s, x + s, y + s), fill=(219, 228, 239), outline=(92, 106, 124))

        # copper coil assembly
        r_in, r_out, gap = 24 * U, 38 * U, 5
        for i in range(10):
            a0, a1 = i * 36 + gap / 2, (i + 1) * 36 - gap / 2
            d.polygon([polar(r_in, a0), polar(r_out, a0), polar(r_out, a1), polar(r_in, a1)],
                      fill=(122, 136, 155), outline=(65, 80, 95))
            for k, t in enumerate((0.16, 0.30, 0.44, 0.58, 0.72, 0.86)):
                rr2 = r_in + (r_out - r_in) * t
                d.line((*polar(rr2, a0 + 0.6), *polar(rr2, a1 - 0.6)),
                       fill=COPPER_HI if k % 2 == 0 else COPPER,
                       width=max(int(1.5 * U), 1))

    # inner housing + glowing well
    ring(23, METAL, 3)
    rr = 20.5 * U
    d.ellipse((c - rr, c - rr, c + rr, c + rr), fill=DARK)
    ring(19.5, (*BLUE, 245), 1.6)
    rr = 16 * U
    d.ellipse((c - rr, c - rr, c + rr, c + rr), fill=(*BLUE, 48))

    # triangular core
    d.polygon([polar(13.5 * U, 0), polar(13.5 * U, 120), polar(13.5 * U, 240)],
              outline=(*BLUE, 245), width=max(int(1.5 * U), 1))
    core = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(core).polygon(
        [polar(8.5 * U, 0), polar(8.5 * U, 120), polar(8.5 * U, 240)], fill=(*BLUE_HI, 255))
    img.alpha_composite(core.filter(ImageFilter.GaussianBlur(S * 0.006)))
    d = ImageDraw.Draw(img, "RGBA")
    rr = 3.2 * U
    d.ellipse((c - rr, c - rr, c + rr, c + rr), fill=WHITE)

    return img.resize((size, size), Image.LANCZOS)


draw_reactor(16, None, detail=False).save(f"{FAV}/favicon-16x16.png")
draw_reactor(32, None, detail=False).save(f"{FAV}/favicon-32x32.png")
draw_reactor(192, None).save(f"{FAV}/favicon-192.png")
draw_reactor(512, None).save(f"{FAV}/favicon-512.png")
draw_reactor(180, HANGAR).save(f"{FAV}/apple-touch-icon.png")


def padded(size, pad=0.20):
    inner = int(size * (1 - pad))
    base = Image.new("RGBA", (size, size), (*HANGAR, 255))
    r = draw_reactor(inner, None)
    base.paste(r, ((size - inner) // 2, (size - inner) // 2), r)
    return base


padded(512).save(f"{FAV}/maskable-512.png")
draw_reactor(256, None).save(
    f"{FAV}/favicon.ico", format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

# ── OG card ────────────────────────────────────────────────────────
W, H, SS = 1200, 630, 3
og = Image.new("RGB", (W * SS, H * SS), HANGAR)
d = ImageDraw.Draw(og, "RGBA")

step = 64 * SS
for x in range(0, W * SS, step):
    d.line((x, 0, x, H * SS), fill=(*BLUE, 22), width=SS)
for y in range(0, H * SS, step):
    d.line((0, y, W * SS, y), fill=(*BLUE, 22), width=SS)

inset = 34 * SS
d.rectangle((inset, inset, W * SS - inset, H * SS - inset), outline=(*BLUE, 110), width=SS)
blen = 34 * SS
for cx, cy, sx, sy in ((inset, inset, 1, 1), (W * SS - inset, inset, -1, 1),
                       (inset, H * SS - inset, 1, -1), (W * SS - inset, H * SS - inset, -1, -1)):
    d.line((cx, cy, cx + sx * blen, cy), fill=COPPER, width=3 * SS)
    d.line((cx, cy, cx, cy + sy * blen), fill=COPPER, width=3 * SS)

reactor = draw_reactor(392 * SS, None)
og.paste(reactor, (int(116 * SS), int(119 * SS)), reactor)


def load(p, s, i=None):
    return ImageFont.truetype(p, s, index=i) if i is not None else ImageFont.truetype(p, s)


mono = load("/System/Library/Fonts/Menlo.ttc", 25 * SS, 0)
mono_sm = load("/System/Library/Fonts/Menlo.ttc", 21 * SS, 0)


def tracked(xy, text, font, fill, tracking):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tracking


LX, RIGHT, TRACK = 566 * SS, (W - 62) * SS, 4 * SS

# Anton isn't installed locally. Impact is the closest local match — the
# same heavy-condensed grotesque register — so the card reads like the site.
size = 96 * SS
while size > 30 * SS:
    f = load("/System/Library/Fonts/Supplemental/Impact.ttf", size)
    if LX + sum(d.textlength(ch, font=f) + TRACK for ch in "NEELAKANDAN") - TRACK <= RIGHT:
        break
    size -= 2 * SS

tracked((LX, 186 * SS), "MARK XIV", mono_sm, BLUE_HI, 7 * SS)
tracked((LX, 236 * SS), "NEELAKANDAN", f, (232, 244, 248), TRACK)
tracked((LX, 236 * SS + int(size * 1.02)), "N C", f, (232, 244, 248), TRACK)
d.line((LX, 458 * SS, RIGHT, 458 * SS), fill=(*COPPER, 200), width=SS)
tracked((LX, 482 * SS), "STILL IN THE CAVE", mono, BLUE_HI, 6 * SS)
tracked((LX, 524 * SS), "FOURTEEN BUILDS IN THREE YEARS", mono_sm, (138, 151, 168), 5 * SS)

og.resize((W, H), Image.LANCZOS).save(f"{ROOT}/og.png", optimize=True)
print("done")
