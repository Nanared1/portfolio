"""Generate the portfolio's branded 1200x630 sharing image (requires Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math
ROOT=Path(__file__).resolve().parents[1]
def font(size,serif=False,bold=False):
    candidates=(['/System/Library/Fonts/Supplemental/Georgia Italic.ttf','DejaVuSerif-Italic.ttf'] if serif else ['/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial.ttf','DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf'])
    for candidate in candidates:
        try:return ImageFont.truetype(candidate,size)
        except OSError:pass
    return ImageFont.load_default(size=size)
image=Image.new('RGB',(1200,630),'#f6f5f0'); draw=ImageDraw.Draw(image)
ink='#242a27';accent='#a6402d';muted='#686e67'
draw.text((72,57),'nana abekah',font=font(38,bold=True),fill=ink)
end=72+draw.textlength('nana abekah',font=font(38,bold=True))
draw.text((end,57),'.',font=font(38,bold=True),fill=accent)
for angle in range(0,180,45):
    r=math.radians(angle)
    dx,dy=23*math.cos(r),23*math.sin(r)
    draw.line((1103-dx,86-dy,1103+dx,86+dy),fill=accent,width=2)
draw.line((72,126,1128,126),fill='#d9ddd3',width=1)
draw.text((70,189),'An engineer’s rigor.',font=font(75),fill=ink)
draw.text((72,282),'A founder’s instinct.',font=font(78,serif=True),fill=accent)
draw.text((74,415),'Production AI. Hands-on leadership. Product building.',font=font(25),fill=muted)
draw.line((72,526,1128,526),fill='#d9ddd3',width=1)
draw.text((74,557),'nanabekah.com',font=font(23),fill=ink)
caption='ENGINEER  /  TECHNICAL LEAD  /  COFOUNDER'
width=draw.textlength(caption,font=font(16))
draw.text((1128-width,562),caption,font=font(16),fill=muted)
path=ROOT/'dist/assets/social-preview.png';image.save(path,optimize=True)
print(path)
