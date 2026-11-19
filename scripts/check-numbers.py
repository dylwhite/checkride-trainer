"""Number check: every number in a correct answer, explanation, Study Guide fact, or Notes Check
fix must appear in the text of a source that item cites (the CFR section, AIM paragraph, handbook
page, Chart Users' Guide page, or Chart Supplement entry). Source texts aren't in the repo; see
verify-citations.py. Build the bank dump first:
  npx esbuild scripts/dump-bank.ts --bundle --platform=node --format=esm --outfile=/tmp/dump.mjs && node /tmp/dump.mjs > /tmp/bank.json
  SOURCES_DIR=/path python3 -I scripts/check-numbers.py /tmp/bank.json
Generated items (g-*) are computed from POH tables and rules; those tables were checked against
the POH page images by hand."""
import json, re, sys
import os
B = os.environ.get('SOURCES_DIR', '') + '/'
if B == '/': sys.exit('Set SOURCES_DIR')
T = {k: open(B + k + '.txt', encoding='utf-8', errors='replace').read() for k in
     ['cfr', 'aim', 'phak', 'afh', 'awh', 'rmh', 'wbh', 'poh', 'cug', 'cs_nw', 'gtn650', 'gtx345', 'p141b', 'acs']}
PAGES = {k: T[k].split('\f') for k in T}
lab = re.compile(r'(?<![\w-])(\d{1,2}-\d{1,3}|[A-Z]-\d{1,3}|[ivx]+)(?![\w-])\s*$')

def page_labels(doc):
    out = {}
    for i, pg in enumerate(PAGES[doc]):
        L = [l.strip() for l in pg.split('\n') if l.strip()]
        for l in list(reversed(L[-6:])) + L[:3]:
            m = lab.search(l)
            if m: out.setdefault(m.group(1), []).append(i); break
    return out
LABELS = {d: page_labels(d) for d in ['phak', 'afh', 'awh', 'rmh', 'wbh', 'poh']}

def section(doc_txt, start_re, next_re):
    m = re.search(start_re, doc_txt, re.M)
    if not m: return ''
    n = re.compile(next_re, re.M).search(doc_txt, m.end())
    return doc_txt[m.start(): n.start() if n else m.start() + 20000]

def passage(key):
    doc, ref = key.split(':', 1)
    if doc in ('cfr14', 'cfr49'):
        if ref.startswith('141 App. B'): return T['p141b'] + section(T['cfr'], r'^Appendix B to Part 141', r'^Appendix C to Part 141')
        if ref.startswith('91 App. D'): return section(T['cfr'], r'^Appendix D to Part 91', r'^Appendix E to Part 91')
        sec = re.sub(r'\(.*$', '', ref)
        return section(T['cfr'], r'^§ ' + re.escape(sec) + r' ', r'^§ \d')
    if doc == 'aim':
        return section(T['aim'], r'^' + re.escape(ref) + r'\. ', r'^\d{1,2}-\d{1,2}-\d{1,3}\. ')
    if doc in LABELS:
        idx = LABELS[doc].get(ref, [])
        if not idx and doc == 'poh':  # POH footers often OCR badly: fall back to the whole section
            sec = ref.split('-')[0]
            return '\n'.join(p for p in PAGES['poh'] if re.search(r'SECTION ' + re.escape(sec) + r'\b', p[:200]))
        return '\n'.join(PAGES[doc][j] for i in idx for j in (i - 1, i, i + 1) if 0 <= j < len(PAGES[doc]))
    if doc == 'cug':
        m = re.match(r'p\. (\d+)', ref)
        if not m: return T['cug']
        n = int(m.group(1)) - 1
        return '\n'.join(PAGES['cug'][j] for j in (n - 1, n, n + 1) if 0 <= j < len(PAGES['cug']))
    if doc == 'cs':
        ident = ref[1:] if ref.startswith('K') else ref
        i = T['cs_nw'].find(f'({ident})')
        return T['cs_nw'][i - 200: i + 6000] if i >= 0 else ''
    if doc == 'gtn': return T['gtn650']
    if doc == 'gtx': return T['gtx345']
    return ''

NUM = re.compile(r'(?<![\w.])(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)(?![\w])')
def nums(s):
    return {n.replace(',', '') for n in NUM.findall(s or '')}

def norm_src(s):
    s = s.replace(',', '')
    return nums_set_cache.setdefault(id(s), None) or set(NUM.findall(s))
nums_set_cache = {}

def src_nums(text):
    return set(re.findall(r'(?<![\w.])(\d+(?:\.\d+)?)', text.replace(',', '')))

def strip_md(s): return re.sub(r'[*_`]', '', s or '')

d = json.load(open(sys.argv[1]))
# Flags reviewed by hand (Nov 2026): product names (152, GTN 650), arithmetic shown in the
# explanation, chart notation written out (66 -> 6,600), and values checked on POH page images.
REVIEWED = {
    'c-bdn-block',
    'c-eug-variation',
    'c-khio-block',
    'c-mef',
    'c-pdx-shelf',
    'c-rdm-classd',
    'c2-ast-warning',
    'c2-hood-isogonic',
    'c2-hood-mef',
    'c2-hood-wilderness',
    'c2-olm-mef',
    'c2-olm-pvt',
    'c2-sle-classd',
    'e-low-volt',
    'f-airspace-entry-4',
    'f-chartsym-9',
    'f-engineops-2',
    'f-pohspec-0',
    'f-pohspec-1',
    'f-pohspec-10',
    'f-pohspec-11',
    'f-pohspec-2',
    'f-pohspec-3',
    'f-pohspec-4',
    'f-regional-4',
    'note:n-100hr',
    'outline:a-docs#0',
    'outline:a-perf#3',
    'outline:a-wb#2',
    's-annual',
    's-bend-takeoff',
    's-crosswind-runway',
    's-marine-layer',
    's-medical-date',
    's-prorata',
    's-resignation',
    's-svfr-pdx',
    's-variation',
    's2-density-alt',
    's2-distance-sign',
    's2-load-factor',
    's2-lost-coast',
    's2-ntsb-controls',
    's2-prorata-three',
}
report = []
def check(where, claim_texts, given_texts, cites):
    claims = set()
    for t in claim_texts: claims |= nums(strip_md(t))
    given = set()
    for t in given_texts: given |= nums(strip_md(t))
    claims -= given
    # Ignore numbers that are part of citations/codes/IDs or trivially structural.
    claims = {n for n in claims if n not in {'0', '1', '2'}}
    if not claims: return
    src = set()
    for c in cites:
        if c.startswith('acs:'): continue
        src |= src_nums(passage(c))
    missing = sorted(claims - src, key=lambda x: float(x))
    if missing and where not in REVIEWED: report.append((where, missing, cites))

for it in d['items']:
    if it['id'].startswith('g-') or it['id'] == 'wb-calc': continue  # computed items: checked separately
    ok = [c['t'] for c in it.get('choices') or [] if c.get('ok')]
    given = (it.get('setup') or []) + [it.get('prompt', '')] + ([it['readout']['text']] if it.get('readout') else []) + [' '.join(v) for v in (it.get('vars') or {}).values()]
    check(it['id'], ok + (it.get('answer') or []) + (it.get('explain') or []), given, it.get('c', []))
for t in d['outline']:
    for i, f in enumerate(t['facts']):
        check(f"outline:{t['id']}#{i}", [f['t']], [], f['c'])
for n in d['notes']:
    texts = [v for k, v in n.items() if isinstance(v, str) and k not in ('id', 'kind', 'you', 'topicId')]
    check(f"note:{n.get('id', n.get('topic'))}", texts, [n.get('you', '')], n.get('c', []))

print(len(report), 'new entries with numbers not found in their cited sources')
for w, m, c in report: print(f'{w}: {m}  <- {c}')
sys.exit(1 if report else 0)
