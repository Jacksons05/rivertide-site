"""Re-encode approved assets without resizing, cropping, or changing font glyphs.
Requires Pillow and fonttools[woff]. Originals stay available for recovery.
"""
from pathlib import Path
from PIL import Image
from fontTools.ttLib import TTFont

dist = Path(__file__).resolve().parent.parent / 'dist'
for name in ('edgartown-main-street', 'mad-river-green-shops', 'jackson-sheehan'):
    source = dist / 'assets' / f'{name}.png'
    target = source.with_suffix('.webp')
    with Image.open(source) as image:
        image.save(target, 'WEBP', quality=88, method=6)
    print(f'{source.name}: {source.stat().st_size} -> {target.stat().st_size} bytes')
for number in (3, 4, 5):
    source = dist / 'fonts' / f'rivertide-font-{number}.ttf'
    target = source.with_suffix('.woff2')
    font = TTFont(source, recalcTimestamp=False)
    font.flavor = 'woff2'
    font.save(target)
    assert TTFont(target).getBestCmap() == TTFont(source).getBestCmap()
    print(f'{source.name}: {source.stat().st_size} -> {target.stat().st_size} bytes')
