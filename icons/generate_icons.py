"""Generate the GameVault PNG icons with Pillow from icons/icon.svg.

Run:  python icons/generate_icons.py
Hexagonal vault + minimal gamepad/d-pad, indigo -> violet (#6366F1 ->
#A855F7), with a subtle inner glow. Drawn at 4x and downsampled with LANCZOS.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
SCALE = 32  # 64 viewBox units -> 2048 px master
N = 64 * SCALE
BG = (13, 16, 23, 255)        # #0D1017
INDIGO = (99, 102, 241, 255)  # #6366F1
VIOLET = (168, 85, 247, 255)  # #A855F7
HEX = [(32, 4), (55, 17), (55, 47), (32, 60), (9, 47), (9, 17)]
INNER = [(32, 11), (49, 21), (49, 43), (32, 53), (15, 43), (15, 21)]


def px(v):
    return int(round(v * SCALE))


def box(*values):
    return tuple(px(v) for v in values)


def gradient():
    n = 256
    data = bytearray()
    for y in range(n):
        for x in range(n):
            t = (x + y) / (2 * (n - 1))
            data.append(int(t * 255 + 0.5))
    ramp = Image.frombytes("L", (n, n), bytes(data)).resize((N, N), Image.Resampling.BICUBIC)
    return Image.composite(Image.new("RGBA", (N, N), VIOLET), Image.new("RGBA", (N, N), INDIGO), ramp)


def apply(mask, opacity=1.0):
    if opacity != 1.0:
        mask = mask.point(lambda v: int(v * opacity))
    layer = gradient()
    layer.putalpha(mask)
    return layer


def polygon(draw, points, **kwargs):
    draw.polygon([(px(x), px(y)) for x, y in points], **kwargs)


def stroke(draw, points, width, fill=255):
    draw.line([(px(x), px(y)) for x, y in points], fill=fill, width=px(width), joint="curve")
    r = int(px(width) / 2)
    for x, y in (points[0], points[-1]):
        draw.ellipse((px(x) - r, px(y) - r, px(x) + r, px(y) + r), fill=fill)


def artwork():
    image = Image.new("RGBA", (N, N), BG)

    glow = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse(box(4, 4, 60, 60), fill=(139, 92, 246, 110))
    gd.ellipse(box(14, 14, 50, 50), fill=(139, 92, 246, 90))
    image = Image.alpha_composite(image, glow.filter(ImageFilter.GaussianBlur(N * 0.055)))

    rim = Image.new("L", (N, N), 0)
    ImageDraw.Draw(rim).rounded_rectangle(box(0.5, 0.5, 63.5, 63.5), radius=px(13.5), outline=255, width=px(1))
    image = Image.alpha_composite(image, apply(rim, 0.42))

    vault = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    polygon(ImageDraw.Draw(vault), HEX, fill=(23, 19, 52, 220))
    image = Image.alpha_composite(image, vault)

    outline = Image.new("L", (N, N), 0)
    stroke(ImageDraw.Draw(outline), HEX + [HEX[0]], 4)
    image = Image.alpha_composite(image, apply(outline))

    inner = Image.new("L", (N, N), 0)
    stroke(ImageDraw.Draw(inner), INNER + [INNER[0]], 1.6, 130)
    image = Image.alpha_composite(image, apply(inner))

    pad = Image.new("L", (N, N), 0)
    d = ImageDraw.Draw(pad)
    d.rounded_rectangle(box(21, 18, 30, 42), radius=px(2.5), fill=255)
    d.rounded_rectangle(box(13.5, 25.5, 37.5, 34.5), radius=px(2.5), fill=255)
    for cx, cy, r in ((43, 25, 3.4), (49, 31, 3.4), (43, 37, 3.4), (37, 31, 3.4)):
        d.ellipse(box(cx - r, cy - r, cx + r, cy + r), fill=255)
    image = Image.alpha_composite(image, apply(pad))

    ImageDraw.Draw(image).ellipse(box(22.5, 27, 28.5, 33), fill=(20, 17, 39, 255))
    return image


def main():
    master = artwork()
    for size in (180, 192, 512):
        path = HERE / f"icon-{size}.png"
        master.resize((size, size), Image.Resampling.LANCZOS).save(path, "PNG", optimize=True)
        print(f"wrote {path.name} ({size}x{size})")


if __name__ == "__main__":
    main()
