"""Build the public résumé PDF from dist/resume.html (requires reportlab)."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
import re
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import reportlab
font_dir=Path(reportlab.__file__).parent/'fonts'
regular=Path('/System/Library/Fonts/Supplemental/Arial.ttf')
bold=Path('/System/Library/Fonts/Supplemental/Arial Bold.ttf')
if not regular.exists() or not bold.exists():
    regular,bold=font_dir/'Vera.ttf',font_dir/'VeraBd.ttf'
pdfmetrics.registerFont(TTFont('Resume',str(regular)))
pdfmetrics.registerFont(TTFont('Resume-Bold',str(bold)))
pdfmetrics.registerFontFamily('Resume',normal='Resume',bold='Resume-Bold',italic='Resume',boldItalic='Resume-Bold')

ROOT = Path(__file__).resolve().parents[1]
class Element:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []
    def find_all(self, tag=None, cls=None):
        result = []
        for child in self.children:
            if isinstance(child, Element):
                if (tag is None or child.tag == tag) and (cls is None or cls in child.attrs.get('class', '').split()):
                    result.append(child)
                result.extend(child.find_all(tag, cls))
        return result
    def find(self, tag=None, cls=None):
        return self.find_all(tag, cls)[0]
    def text(self):
        return ''.join(c.text() if isinstance(c, Element) else c for c in self.children)
class Document(HTMLParser):
    def __init__(self):
        super().__init__(); self.root = Element(); self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs); self.stack[-1].children.append(node)
        if tag not in {'meta','link','br','hr','img','input','source','wbr'}: self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Element(tag, attrs))
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]; break
    def handle_data(self, text): self.stack[-1].children.append(text)
def normal(text):
    for a,b in [('—','-'),('–','-'),('‑','-'),('→',' > '),('’',"'"),('‘',"'"),('“','"'),('”','"')]: text=text.replace(a,b)
    return re.sub(r'\s+', ' ', text).strip()
def rich(node):
    chunks=[]
    for child in node.children:
        if isinstance(child, Element):
            text=rich(child)
            chunks.append('<b>'+text+'</b>' if child.tag in {'strong','b'} else text)
        else: chunks.append(escape(normal(child)))
    return ' '.join(c for c in chunks if c)

parsed=Document(); parsed.feed((ROOT/'dist/resume.html').read_text())
resume=parsed.root.find('main','resume')
ink=HexColor('#242a27'); muted=HexColor('#596157'); accent=HexColor('#a6402d'); line=HexColor('#d9ddd3')
styles={
    'name':ParagraphStyle('Name',fontName='Resume-Bold',fontSize=27,leading=31,textColor=ink,spaceAfter=3),
    'headline':ParagraphStyle('Headline',fontName='Resume',fontSize=10,leading=13,textColor=ink,spaceAfter=5),
    'contact':ParagraphStyle('Contact',fontName='Resume',fontSize=8.5,leading=11,textColor=muted),
    'summary':ParagraphStyle('Summary',fontName='Resume',fontSize=9.7,leading=12.5,textColor=ink,spaceBefore=7,spaceAfter=6),
    'section':ParagraphStyle('Section',fontName='Resume-Bold',fontSize=8.5,leading=12,textColor=accent,spaceBefore=7,spaceAfter=6),
    'company':ParagraphStyle('Company',fontName='Resume-Bold',fontSize=10.4,leading=13,textColor=ink),
    'date':ParagraphStyle('Date',fontName='Resume',fontSize=8.7,leading=13,textColor=muted,alignment=TA_RIGHT),
    'role':ParagraphStyle('Role',fontName='Resume',fontSize=9,leading=12,textColor=muted,spaceAfter=4),
    'bullet':ParagraphStyle('Bullet',fontName='Resume',fontSize=9.5,leading=12.1,textColor=ink,leftIndent=10,firstLineIndent=-8,spaceAfter=3),
    'small':ParagraphStyle('Small',fontName='Resume',fontSize=8.1,leading=10.3,textColor=muted,spaceBefore=3),
    'body':ParagraphStyle('Body',fontName='Resume',fontSize=9.2,leading=12,textColor=ink),
}
def para(text,style): return Paragraph(text, styles[style])
story=[para('Nana Abekah','name'),para(escape(normal(resume.find('p','headline').text())).replace('·',' | '),'headline')]
story += [para('Canada | <link href="mailto:abekah12345@gmail.com">abekah12345@gmail.com</link> | <link href="https://nanabekah.com/">nanabekah.com</link>','contact'),
          para('<link href="https://www.linkedin.com/in/nana-abekah-936960151/">LinkedIn: nana-abekah-936960151</link> | <link href="https://github.com/Nanared1">GitHub: Nanared1</link>','contact'),
          para(rich(resume.find('p','summary')),'summary'),para('EXPERIENCE','section')]
for article in resume.find_all('article'):
    heading=article.find('div','job-head')
    row=Table([[para(escape(normal(heading.find('h3').text())),'company'),para(escape(normal(heading.find('span').text())),'date')]],colWidths=[330,186],hAlign='LEFT')
    row.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0),('VALIGN',(0,0),(-1,-1),'TOP')]))
    block=[row,para(rich(article.find('p','role')),'role')]
    block += [para('- '+rich(li),'bullet') for li in article.find_all('li')]
    for cls in ['earlier-scope','progression']:
        for node in article.find_all('p',cls): block.append(para(rich(node),'small'))
    block.append(Spacer(1,2))
    story.append(KeepTogether(block))
story += [para('TECHNICAL EXPERIENCE','section'),para(rich(resume.find('p','skills')).replace('·',' | '),'body'),para('EDUCATION','section'),para(rich(resume.find('p','education')),'body')]
output=ROOT/'dist/assets/nana-abekah-resume.pdf'
output.parent.mkdir(parents=True,exist_ok=True)
doc=SimpleDocTemplate(str(output),pagesize=letter,rightMargin=42,leftMargin=42,topMargin=36,bottomMargin=34,title='Nana Abekah - Resume',author='Nana Abekah',subject='Public professional experience and selected achievements',pageCompression=1)
doc.build(story)
print(output)
