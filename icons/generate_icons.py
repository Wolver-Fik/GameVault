"""Generate GameVault PNG icons with Pillow.

Run from the repository root:
    python icons/generate_icons.py

The artwork mirrors icons/icon.svg (gamepad + library, indigo/violet #6366F1,
emerald #10B981, background #090D16). It is drawn at 4x and downsampled with
LANCZOS so the 180/192/512 px files stay crisp on iOS and Android.
"""

from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
SCALE = 4
SIZE = 512 * SCALE

BG = (9, 13, 22, 255)
INDIGO = (99, 102, 241, 255)
INDIGO_DARK = (79, 70, 229, 255)
INDIGO_SHELF = (49, 46, 129, 255)
INDIGO_LIGHT = (129, 140, 248, 255)
EMERALD = (16, 185, 129, 255)
LIGHT = (232, 235, 243, 255)


def box(*values):
    return tuple(int(v * SCALE) for v in values)


def rounded(draw, coords, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(
        box(*coords),
        radius=int(radius * SCALE),
        fill=fill,
        outline=outline,
        width=max(1, int(width * SCALE)) if outline else 1,
    )


def ellipse(draw, coords, fill):
    draw.ellipse(box(*coords), fill=fill)


def artwork():
    image = Image.new("RGBA", (SIZE, SIZE), BG)

    glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    ellipse(gd, (36, 18, 476, 458), (99, 102, 241, 58))
    ellipse(gd, (86, 68, 426, 408), (99, 102, 241, 46))
    image = Image.alpha_composite(image, glow)
    d = ImageDraw.Draw(image)

    # Library spines.
    rounded(d, (104, 128, 150, 384), 18, INDIGO_SHELF)
    rounded(d, (124, 150, 142, 362), 9, INDIGO_DARK)
    rounded(d, (110, 190, 140, 198), 4, EMERALD)
    rounded(d, (110, 240, 140, 248), 4, INDIGO_LIGHT)
    rounded(d, (110, 290, 140, 298), 4, EMERALD)

    # Gamepad body and grips.
    rounded(d, (158, 186, 404, 326), 70, INDIGO)
    ellipse(d, (170, 248, 262, 344), INDIGO)
    ellipse(d, (300, 248, 392, 344), INDIGO_DARK)
    rounded(d, (166, 194, 396, 318), 62, None, outline=(199, 210, 254, 70), width=4)

    # D-pad.
    rounded(d, (208, 214, 236, 290), 7, BG)
    rounded(d, (184, 238, 260, 266), 7, BG)
    ellipse(d, (214, 244, 230, 260), EMERALD)

    # Face buttons.
    ellipse(d, (319, 219, 345, 245), EMERALD)
    ellipse(d, (295, 247, 317, 269), LIGHT)
    ellipse(d, (347, 247, 369, 269), LIGHT)
    ellipse(d, (321, 273, 343, 295), LIGHT)

    # Small library detail.
    rounded(d, (264, 226, 272, 252), 4, BG)
    rounded(d, (280, 226, 288, 252), 4, EMERALD)

    return image


def main():
    master = artwork()
    for size in (180, 192, 512):
        target = master.resize((size, size), Image.Resampling.LANCZOS)
        path = HERE / f"icon-{size}.png"
        target.save(path, format="PNG", optimize=True)
        print(f"wrote {path.name} ({size}x{size})")


if __name__ == "__main__":
    main()
