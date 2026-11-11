# 삐약마을 소스 (v61 · 2026-11)

`index.html` 한 파일이 게임 전체예요. 이 폴더는 v61 업데이트를 어떻게 만들었는지 남겨 둔 기록이에요.

- `cal.js` — 게임 달력 (한 계절 = 7일 · 명절 · 생일) → 세팅은 `CAL_CFG`
- `southdeco.js` — 남쪽 큰 밭 · 목장 꾸미기 → 세팅은 `SDECO_CFG`
- `uses.js` — 새 요리 · 공방 '만들기' · 연금술 · 교환 · 주간 주문 → 세팅은 `USES_CFG`
- `hunt3.js` — 사냥터 지형 기믹 · 보스 패턴 · 드롭 → 세팅은 `H3_CFG`
- `patches.py` — 기존 코드에서 글자만 바꾼 곳 목록
- `build.py` — `base.html`(= 바로 앞 버전의 index.html) + 패치 + 위 모듈 → `index.html`

앞 버전 파일 꺼내기: `git show 87708d6:index.html > base.html`
