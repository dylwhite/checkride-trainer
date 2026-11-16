#!/usr/bin/env python3
"""Checks that every citation in src/data/*.ts points to something that exists in the
source documents. Source texts are NOT in the repo (copyright/size): download them and set
SOURCES_DIR to a folder holding cfr.txt, aim.txt, phak.txt, afh.txt, awh.txt, rmh.txt,
wbh.txt, poh.txt, cug.txt, acs.txt (made with `pdftotext -layout`; POH via OCR).
Usage: SOURCES_DIR=/path python3 -I scripts/verify-citations.py"""
import os, re, sys, glob
D = os.environ.get('SOURCES_DIR')
if not D: sys.exit('Set SOURCES_DIR')
txt = {k: open(os.path.join(D, k + '.txt'), encoding='utf-8', errors='replace').read()
       for k in ['cfr', 'aim', 'phak', 'afh', 'awh', 'rmh', 'wbh', 'poh', 'cug', 'acs']}

def labels(doc):
    out = set()
    for pg in txt[doc].split('\f'):
        for m in re.finditer(r'(?<![\w-])(\d{1,2}-\d{1,3})(?![\w-])', pg):
            out.add(m.group(1))
    return out
LAB = {d: labels(d) for d in ['phak', 'afh', 'awh', 'rmh', 'wbh', 'poh']}
cug_pages = len(txt['cug'].split('\f'))

# POH pages whose footer OCR misreads; each was verified by eye on the page image.
HAND_VERIFIED = {'poh:2-4', 'poh:2-6'}

def check(key):
    if key in HAND_VERIFIED: return True
    doc, ref = key.split(':', 1)
    if doc in ('cfr14', 'cfr49'):
        if ref.startswith('141 App. B'):
            return 'Appendix B to Part 141' in txt['cfr']
        sec = re.sub(r'\(.*$', '', ref)
        return re.search(r'^§ ' + re.escape(sec) + r' ', txt['cfr'], re.M) is not None
    if doc == 'aim':
        return re.search(r'^' + re.escape(ref) + r'\. ', txt['aim'], re.M) is not None
    if doc in LAB:
        if ref.startswith('ch. ') or ref.startswith('Sec. '): return True
        return ref in LAB[doc]
    if doc == 'cug':
        m = re.match(r'p\. (\d+)$', ref)
        return bool(m) and int(m.group(1)) <= cug_pages or not m
    if doc == 'acs':
        return ref.split('.')[0] == 'PA' and ref in txt['acs']
    return True  # cs, gtn, gtx, sec: checked by hand

keys = set()
for f in glob.glob('src/data/*.ts'):
    s = open(f, encoding='utf-8').read()
    keys |= set(re.findall(r"'((?:cfr14|cfr49|aim|phak|afh|awh|rmh|wbh|poh|cug|acs|cs|gtn|gtx|sec):[^']+)'", s))
    # ACS codes listed in acs: [...] arrays
    for arr in re.findall(r"acs: \[([^\]]*)\]", s):
        keys |= {'acs:' + c for c in re.findall(r"'(PA\.[^']+)'", arr)}
bad = sorted(k for k in keys if not check(k))
print(f'{len(keys)} distinct citations checked, {len(bad)} problems')
for k in bad: print('  MISSING:', k)
sys.exit(1 if bad else 0)
