# 복지 도메인 데이터

## curated-benefits.example.json — 큐레이션 혜택 양식
혜택의 정밀 자격기준은 대부분 산문이라 자동 전수 매칭이 불가하다. 그래서 대표 혜택 8~15개를
손으로 규칙화하는 **빈 양식**을 둔다. 주제를 받으면 이 양식만 채우면 정밀 매칭 카드가 동작한다.

- `rules.eligibility`: 사람이 읽고 코드로 옮길 술어(예: `age_between(19,34)`, `income_below(...)`).
- `rules.slots`: 매칭에 필요한 사용자 프로필 필드(되묻기 대상).
- `sampleData: true`: 발표에서 "샘플/큐레이션"임을 정직하게 표시하기 위한 플래그.

전수 후보 카탈로그는 `data/scripts/`(보조금24/복지 덤프) + `data/snapshots/`, 검증 엔드포인트는 `data/data-sources.md` 참조.
