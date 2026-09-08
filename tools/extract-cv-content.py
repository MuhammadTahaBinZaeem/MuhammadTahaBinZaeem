"""Read user-supplied CVs as source material; retain text and link evidence."""
from pathlib import Path
import json
import fitz

root = Path(__file__).resolve().parents[1]
out = root / 'qa-artifacts' / 'cv-review'
out.mkdir(parents=True, exist_ok=True)
files = {
    'ambassador': Path(r'\\192.168.122.1\shared\hibafinal\Muhammad_Taha_Bin_Zaeem_Claude_Ambassador_CV.pdf'),
    'general': Path(r'\\192.168.122.1\shared\maheenfinal\Muhammad_Taha_Bin_Zaeem_CV.pdf'),
    'research': Path(r'\\192.168.122.1\shared\maheenfinal\Muhammad_Taha_Bin_Zaeem_Mitacs_CV.pdf'),
}
result = {}
for key, file in files.items():
    doc = fitz.open(file)
    pages = []
    for i, page in enumerate(doc):
        pages.append({'text': page.get_text(), 'links': [x['uri'] for x in page.get_links() if 'uri' in x]})
        page.get_pixmap(matrix=fitz.Matrix(1.3, 1.3)).save(out / f'{key}-{i+1}.png')
    result[key] = {'source': str(file), 'pages': pages}
(out / 'extracted.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
for key, value in result.items():
    print(f'\n=== {key.upper()} ===')
    for page in value['pages']:
        print(page['text'])
        print('LINKS:', json.dumps(page['links']))
