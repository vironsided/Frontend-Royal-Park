"""Generate Royal Park favicon set from Logo new.pdf.

Crops the tree emblem (upper block of page 0 — gold on white),
makes white transparent, pads to square, and exports PNG/ICO set
into public/images/branding/.

One-off tool; safe to re-run if the source PDF changes.
"""
import os
import sys

import numpy as np
import pypdfium2 as pdfium
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")

SRC_PDF = r"c:\Users\vusal\OneDrive\Desktop\resource\Logo new.pdf"
OUT_DIR = r"c:\Users\vusal\OneDrive\Desktop\Arxiv\RoyalPark\public\images\branding"
os.makedirs(OUT_DIR, exist_ok=True)

doc = pypdfium2.PdfDocument(SRC_PDF) if False else pdfium.PdfDocument(SRC_PDF)
img = doc[0].render(scale=4).to_pil().convert("RGBA")
arr = np.array(img)

mask = (arr[:, :, 0] < 240) | (arr[:, :, 1] < 240) | (arr[:, :, 2] < 240)


# Tree emblem = first vertical run of ink (rows 2232..7303 at scale=4)
tree_top, tree_bot = 2232, 7303
tree_mask = mask[tree_top : tree_bot + 1]
cols = tree_mask.any(axis=0)
xs = np.where(cols)[0]
tree_left, tree_right = int(xs.min()), int(xs.max())

pad = 120
top = max(0, tree_top - pad)
bot = min(arr.shape[0], tree_bot + pad + 1)
left = max(0, tree_left - pad)
right = min(arr.shape[1], tree_right + pad + 1)

cropped = img.crop((left, top, right, bot))
print("cropped size:", cropped.size)

c = np.array(cropped)
white = (c[:, :, 0] > 240) & (c[:, :, 1] > 240) & (c[:, :, 2] > 240)
c[white, 3] = 0
cropped_rgba = Image.fromarray(c, "RGBA")

w, h = cropped_rgba.size
side = max(w, h) + 40
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.paste(cropped_rgba, ((side - w) // 2, (side - h) // 2), cropped_rgba)

square.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT_DIR, "favicon-512.png"))
square.resize((192, 192), Image.LANCZOS).save(os.path.join(OUT_DIR, "favicon-192.png"))
square.resize((32, 32), Image.LANCZOS).save(os.path.join(OUT_DIR, "favicon-32.png"))
square.resize((16, 16), Image.LANCZOS).save(os.path.join(OUT_DIR, "favicon-16.png"))
square.resize((180, 180), Image.LANCZOS).save(os.path.join(OUT_DIR, "apple-touch-icon.png"))

# ICO with classic sizes — browser picks the nearest
square.resize((48, 48), Image.LANCZOS).save(
    os.path.join(OUT_DIR, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
)

print("Saved to:", OUT_DIR)
for name in sorted(os.listdir(OUT_DIR)):
    print(" ", name)
