# 삐약마을 소스 (v62 · 2026-11)

`index.html` 한 파일이 게임 전체예요. 이 폴더는 v61 · v62 업데이트를 어떻게 만들었는지 남겨 둔 기록이에요.

## v61
- `cal.js` — 게임 달력 (한 계절 = 7일 · 명절 · 생일) → 세팅은 `CAL_CFG`
- `southdeco.js` — 남쪽 큰 밭 · 목장 꾸미기 → 세팅은 `SDECO_CFG`
- `uses.js` — 새 요리 · 공방 '만들기' · 연금술 · 교환 · 주간 주문 → 세팅은 `USES_CFG`
- `hunt3.js` — 사냥터 지형 기믹 · 보스 패턴 · 드롭 → 세팅은 `H3_CFG`

## v62
- `wintercrop.js` — 겨울 작물 4종(대파 · 마늘 · 겨울무 · 보리) · 가루 2종 · 요리 5종 → 세팅은 `WCROP_CFG`
- `propuse.js` — 풍차 방앗간 · 우물 · 소풍 탁자 · 허수아비 · 연못 오리 헤엄 → 세팅은 `PU_CFG`
- `small2.js` — 오늘의 소동 3종(건초 받기 · 오리 줄서기 · 무궁화 꽃) → 세팅은 `SM2_CFG`
- `bosslook.js` — 보스 3마리 전용 모형 · 6단계 설원 눈 색 · 오로라 → 세팅은 `BL_CFG`
- `uses.js` 만들기 목록에 장비 4종 · 가구 3종 추가, `hunt3.js` 1단계에 흔들 덤불 추가, `southdeco.js` 풍차 날개 빠르기

## 공통
- `patches.py` — 기존 코드에서 글자만 바꾼 곳 목록 (v62: 화면 후처리에 설원용 `cool` 값 추가)
- `build.py` — `base.html`(= v60 index.html) + 패치 + 위 모듈 → `index.html`

v60 파일 꺼내기: `git show 87708d6:index.html > base.html`
