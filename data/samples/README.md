# data/samples — 실제 레코드 미리보기 (기획 단계용)

`INDEX.md`는 데이터셋의 **필드 이름·건수·용도**만 알려준다. 하지만 그 필드에 **실제로 어떤 값이 들어있는지**는 모른다 (예: `지원대상`이 `"만 65세 이상"`인지 `"전국민"`인지).

그래서 각 데이터셋의 **앞 3건**을 여기에 떠 둔다. 무거운 전체 스냅샷(41MB, 모듈 `2-build`) 없이도 **기획 단계에서 실제 내용·문장 형태·필드 채움 정도**를 눈으로 확인할 수 있다.

| 샘플 | 원본(전체) | 전체 건수 |
|---|---|---|
| `gov24-services.sample.json` | `data/snapshots/gov24-services.json` | 10,957 |
| `welfare-central.sample.json` | `data/snapshots/welfare-central.json` | 452 |
| `welfare-local.sample.json` | `data/snapshots/welfare-local.json` | 4,569 |
| `facilities.sample.json` | `data/snapshots/facilities.json` | 38,440 |
| `shelters-civildefense.sample.json` | `web/public/data/shelters/civildefense/*.json` | 17,197 (좌표O) |

## 보는 법 / 주의
- **이건 미리보기다.** 검색·매칭·지도의 모집단은 항상 **전수**(전체 스냅샷)다 — 05 빌드 단계에서 `2-build` 투입 후 전체를 쓴다.
- 값이 비어있는 필드(`""`)도 그대로 보인다 — 지역(`ctpvNm`)이 채워진 행/빈 행이 섞여 있는 등 **실제 데이터의 결함·편차**를 미리 보는 게 목적.
- 자격기준(`선정기준`)은 산문이라 정밀판정 불가 → "잠재 후보"로 정직하게, 공식 URL 인용(INDEX.md 원칙 그대로).
