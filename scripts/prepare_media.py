"""Prepare one journal image; never overwrite the source. Requires Pillow and pillow-heif for HEIC."""
import argparse
from pathlib import Path
from PIL import Image, ImageOps, ImageChops

def prepare(source, dest, kind):
    if source.suffix.lower() in ('.heic','.heif'):
        import pillow_heif
        pillow_heif.register_heif_opener()
    im=ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    # Only trim an enclosing white margin of CAD/screen/diagram assets, never photographs.
    if kind in ('cad','screen','diagram'):
        mask=im.point(lambda x: 255 if x < 240 else 0)
        mask=ImageChops.lighter(ImageChops.lighter(mask.getchannel('R'),mask.getchannel('G')),mask.getchannel('B'))
        box=mask.getbbox()
        if box and box != (0,0,*im.size):
            im=im.crop(box)
            pad=round(max(im.size)*.04)
            im=ImageOps.expand(im,border=pad,fill='white')
    im.thumbnail((2400,2400),Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True,exist_ok=True)
    im.save(dest,quality=82,optimize=True)
    return im.size
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('destination',type=Path);p.add_argument('--kind',choices=['photo','cad','screen','diagram','concept'],required=True);a=p.parse_args()
    if a.source.resolve()==a.destination.resolve():p.error('Use a separate destination; preserve the original.')
    print(prepare(a.source,a.destination,a.kind))
