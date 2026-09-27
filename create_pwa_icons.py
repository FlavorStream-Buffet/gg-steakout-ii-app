from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "public" / "logo.png"
OUT = ROOT / "public" / "icons"
OUT.mkdir(parents=True, exist_ok=True)

logo = Image.open(SOURCE).convert("RGBA")

def make_icon(size, filename, logo_ratio=0.78):
    canvas = Image.new("RGBA", (size, size), "#07172d")
    target = int(size * logo_ratio)
    mark = logo.copy()
    mark.thumbnail((target, target), Image.Resampling.LANCZOS)
    x = (size - mark.width) // 2
    y = (size - mark.height) // 2
    canvas.alpha_composite(mark, (x, y))
    canvas.convert("RGB").save(OUT / filename, "PNG", optimize=True)

make_icon(192, "icon-192.png")
make_icon(512, "icon-512.png")
make_icon(512, "icon-maskable-512.png", logo_ratio=0.66)
make_icon(180, "apple-touch-icon.png")
make_icon(32, "favicon-32.png", logo_ratio=0.84)

print(OUT)
