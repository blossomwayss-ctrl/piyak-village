#!/usr/bin/env python3
"""삐약마을 빌드: 배포본(base.html, v60) + 패치 + 새 모듈 → PWA(index.html) · 아티팩트(art.html)
   - base.html : GitHub에 올라가 있던 v60 그대로 (건드리지 않음)
   - patches.py: base 안의 글자를 딱 한 군데씩 바꾸는 목록 (PATCHES = [(이전, 이후), ...])
   - MODULES   : 맨 뒤(게임 시작 직전)에 차례로 끼워 넣는 새 모듈"""
import hashlib, re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
MODULES = ['cal.js', 'southdeco.js', 'uses.js', 'hunt3.js', 'wintercrop.js', 'propuse.js', 'small2.js', 'bosslook.js']
MARK = "tilesImg.onload = () => {"
PWA_ONLY = ['<script>window.__PWA=1;</script>', '<link rel="manifest" href="./manifest.webmanifest">', '<link rel="apple-touch-icon" href="./apple-touch-icon.png">',
            '<meta name="apple-mobile-web-app-capable" content="yes">', '<meta name="mobile-web-app-capable" content="yes">',
            '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">', '<meta name="apple-mobile-web-app-title" content="삐약마을">']
CDN = [('<script src="./three.min.js"></script>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'),
       ('<script src="./GLTFLoader.js"></script>', '<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>')]


def main():
    src = open(os.path.join(HERE, 'base.html'), encoding='utf8').read()
    sys.path.insert(0, HERE)
    from patches import PATCHES
    for i, (a, b) in enumerate(PATCHES):
        n = src.count(a)
        assert n == 1, f'patch {i}: found {n} times: {a[:70]!r}'
        src = src.replace(a, b)
    assert src.count(MARK) == 1
    mods = ''
    for m in MODULES:
        p = os.path.join(HERE, m)
        if not os.path.exists(p):
            print('skip (없음):', m); continue
        code = open(p, encoding='utf8').read()
        for ln, line in enumerate(code.split('\n'), 1):   # 줄 중간 // 주석은 뒤 코드를 삼켜요 → 금지
            s = re.sub(r"'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\"|`(?:[^`\\]|\\.)*`", "''", line)
            k = s.find('//')
            if k > 0 and s[:k].strip() and not s[:k].rstrip().endswith(':') and 'http' not in s[max(0, k - 6):k]:
                tail = s[k:]
                if re.search(r"[;{}]\s*\S", tail[2:]) and not tail.strip().startswith('// '):
                    print(f'  ! {m}:{ln} 줄 중간 // 주석 확인')
        mods += code.rstrip() + '\n'
    out = src.replace(MARK, mods + '\n' + MARK)
    pwa = os.path.join(HERE, '..', 'piyak-village')
    open(os.path.join(pwa, 'index.html'), 'w', encoding='utf8').write(out)
    h = hashlib.sha1(out.encode()).hexdigest()[:8]
    sw = open(os.path.join(pwa, 'sw.js'), encoding='utf8').read()
    sw = re.sub(r'\([0-9a-f]{8}\)', f'({h})', sw, count=1); sw = re.sub(r"piyak-[0-9a-f]{8}", f'piyak-{h}', sw, count=1)
    open(os.path.join(pwa, 'sw.js'), 'w', encoding='utf8').write(sw)
    art = out
    for l in PWA_ONLY:
        assert art.count(l + '\n') == 1, l; art = art.replace(l + '\n', '')
    for a, b in CDN:
        assert art.count(a) == 1; art = art.replace(a, b)
    open(os.path.join(HERE, 'art.html'), 'w', encoding='utf8').write(art)
    print(f'built {len(out)} bytes · hash {h} · modules {[m for m in MODULES if os.path.exists(os.path.join(HERE, m))]}')


main()
