from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
HERB_SHEETS = [
    (ROOT / 'output/imagegen/herbs/herb-sheet-01.png', ['banlangen','sangye','niubangzi','jingjie','zisunye','baizhi','xinyi','xiakucao','juemingzi']),
    (ROOT / 'output/imagegen/herbs/herb-sheet-02.png', ['lugen','tianhuafen','kushen','longdan','jinqiancao','haijinsha','peilan','caoguo','laifuzi']),
    (ROOT / 'output/imagegen/herbs/herb-sheet-03.png', ['qingpi','jianghuang','ruxiang','moyao','baiji','banzhilian','baihuasheshecao','tufuling','daqingye']),
    (ROOT / 'output/imagegen/herbs/herb-sheet-04.png', ['machixian','puhuang','huaihua','xianhecao','wangbuliuxing','chuanxinlian','wujiaipi','duzhong','xuduan']),
    (ROOT / 'output/imagegen/herbs/herb-sheet-05.png', ['tusizi','yinyanghuo','nvzhenzi','mohanlian','yuzhu','huangjing','shashen','xiangru','zelan']),
]

def slice_sheet(source, names, out_dir, cols=3, rows=3):
    with Image.open(source) as image:
        image = image.convert('RGB')
        width, height = image.size
        for index, name in enumerate(names):
            col, row = index % cols, index // cols
            left, top = round(col * width / cols), round(row * height / rows)
            right, bottom = round((col + 1) * width / cols), round((row + 1) * height / rows)
            image.crop((left, top, right, bottom)).save(out_dir / f'{name}.jpg', quality=90, optimize=True)

out_dir = ROOT / 'images/herbs'
out_dir.mkdir(parents=True, exist_ok=True)
for source, names in HERB_SHEETS:
    slice_sheet(source, names, out_dir)

heritage = ROOT / 'output/imagegen/herbs/heritage-sheet.png'
heritage_names = ['zhenjiu','paozhi','yuyu','zhenfa','yangsheng','tongrentang']
slice_sheet(heritage, heritage_names, ROOT / 'images/heritage', cols=3, rows=2)
print(f'generated herb assets: {sum(len(names) for _, names in HERB_SHEETS)}; heritage assets: {len(heritage_names)}')
