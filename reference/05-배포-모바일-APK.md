# 배포 · 모바일 · APK — 통합 레퍼런스

> 자체 AWS 서버 https 배포 + 안드로이드 APK(WebView 래퍼) 시연까지, 처음부터 따라 하는 실전 절차.
> 사람이 읽는 참고 문서다. 명령은 실제 환경(아래 "내 배포 환경")에 맞춰져 있다.
> ✅ 2026-06-21 전 과정 검증 완료(서버 빌드 → APK → USB 설치 → scrcpy 미러링).
> ⚠️ 인프라 식별자(계정ID·IP·인스턴스ID)는 본인 인프라라 그대로 둔다. **단, AWS 액세스 키/시크릿은 어디에도 적지 않는다.**

---

## 0. 산출물 전략 (왜 이 구성인가)

- **배포**: 자체 보유 AWS 서버에 **https로 직접 배포**. 외부 호스팅(Vercel/Netlify 등)은 쓰지 않는다.
- **기본 산출물**: **네이티브 안드로이드 APK** — Capacitor WebView 래퍼, `server.url = 배포 https URL`. "진짜 앱처럼" 보이게.
- **폴백**: **PWA(홈 화면에 추가)** — APK 세팅/빌드가 막힐 때만. (PWA 매니페스트·아이콘은 키트에 이미 포함)

**왜 이 순서인가.** https 배포가 전제되면 APK도 견고해진다 — 위치가 secure context에서 자동 동작하고, USB 터널/공인 IP 의존이 사라진다. 단 APK 기본은 **사람이 Gradle 빌드를 돌려야 하는 하드 의존**이라 시간 제약에서 위험이 있다. 그래서 PWA를 안전망으로 항상 남겨 둔다.

> 이 앱은 `/api/*` 라우트가 있어 **정적 export 불가** → Node 런타임에서 `next start`가 상주해야 한다. (정적 호스팅으로 끝낼 수 없는 이유.)

---

## 1. 내 배포 환경 (확정된 실제 값)

> 본인 인프라의 실제 값. 새 환경/재구축 시 이 표가 기준.

| 항목 | 값 |
|---|---|
| AWS 계정 / 리전 | `632752099407` / `ap-northeast-2`(서울) |
| IAM 사용자 | `Me` (**AdministratorAccess** — EC2 Instance Connect 포함 전부 허용) |
| EC2 인스턴스 | `i-02e07f23649fd05fe` (Name `ejy`, t3.small, **Amazon Linux 2023**) |
| 보안그룹 | `sg-0144bd538dfba7047` (80·443 전체 오픈, 22 특정 IP) |
| 고정 IP (EIP) | **`3.34.113.37`** |
| 도메인 | **`projectamo.co.kr`** (가비아, A 레코드: `@`·`www` → `3.34.113.37`, TTL 600) |
| 서버 빌드환경 | **설치됨**: JDK21(corretto) + Android SDK `~/android-sdk`(platform-36, build-tools-36) + 2G swap |
| 앱(PM2) | `work2` (`~/work2/web`, 포트 3000), appId `kr.example.app`, 앱이름 `<앱이름>` |
| 로컬 SSH 키 | `~/.ssh/projectamo_rsa` (RSA — EC2 Instance Connect CLI가 RSA만 받음) |
| 로컬 adb/scrcpy | `C:\Users\John\scrcpy\` |
| AWS CLI(Win) | `C:\Program Files\Amazon\AWSCLIV2\aws.exe` |

> appId·앱이름은 주제에 맞는 실제 값으로 교체. 변경 시 APK 재빌드 필요(아래 §6 재빌드 규칙).

---

## 2. 한 번만 하는 세팅 (이미 완료 — 재구축 시 참고)

### 2.1 AWS CLI + 로그인
```powershell
winget install -e --id Amazon.AWSCLI      # 또는 https://awscli.amazonaws.com/AWSCLIV2.msi
aws configure                              # 기존 액세스 키 입력, region ap-northeast-2, format json
aws sts get-caller-identity                # Account 632752099407 나오면 OK
```
> 기존 액세스 키가 있으면 **IAM 사용자를 새로 안 만들어도 된다**(키는 PC가 아니라 사용자에 종속). 분실 시에만 IAM에서 새 키 발급 + `AdministratorAccess` 부여.

### 2.2 고정 IP / DNS
- EIP `3.34.113.37` → `ejy` 연결됨. (새 인스턴스일 때만 `aws ec2 allocate-address` + `associate-address`)
- 가비아 DNS A 레코드: `@`·`www` → `3.34.113.37` (TTL 600). 확인: `nslookup projectamo.co.kr`.

### 2.3 서버 배포 환경
- nginx + Next(`next start` 3000) + PM2(`work2`) + certbot https.
- 서버 빌드환경(JDK21 + Android SDK36) 설치됨.
- certbot로 Let's Encrypt 인증서 발급(`sudo certbot --nginx -d projectamo.co.kr -d www.projectamo.co.kr`). 갱신은 certbot 타이머가 자동.

---

## 3. 서버 접속하는 법 (.pem 없이, 어느 컴퓨터에서든)

서버 OS = Amazon Linux 2023 → **EC2 Instance Connect 내장.** 다른 컴퓨터에서 접속할 때 챙길 건 **AWS 액세스 키 하나뿐.**

> **대회는 새 노트북 + 새 인터넷에서 진행 확정.** "저장된 키·IP" 가정은 전부 무효 — 서버/배포/APK 작업 시 **매번 아래 0단계 부트스트랩을 수행**한다. (실측 2026-06: IP 바뀐 새 환경에서 성공.)
> 권한: IAM 사용자에 **AdministratorAccess**(또는 `ec2-instance-connect:SendSSHPublicKey`)면 EC2 Instance Connect 자동 포함.
> ⚠️ **EC2 Instance Connect CLI는 RSA 키만 받는다**(구버전 CLI가 ed25519 거부). 반드시 `-t rsa`.

### 0단계 — 부트스트랩 (서버 접속 전 항상)
- **0a. AWS CLI 없으면 설치** — `winget install -e --id Amazon.AWSCLI`.
- **0b. ★자격증명 게이트★** — `aws sts get-caller-identity` 실패 시 **즉시 멈추고** 사용자에게 요청: "터미널에서 직접 `aws configure` 실행(Access Key ID / Secret Access Key / region `ap-northeast-2` / format `json`). ⚠️ **시크릿 키를 채팅·env·git에 적지 말 것.** 끝나면 알려주세요." → 완료 후 재시도.
  **AI는 시크릿을 받지·명령에 넣지·파일에 쓰지 않는다.** 공인 IP도 사용자가 알려줄 필요 없다(아래 1)에서 자동 감지).

```powershell
$AWS="C:\Program Files\Amazon\AWSCLIV2\aws.exe"
# 0c) 인스턴스 running 확인 — stopped면 켜고 기다린다
& $AWS ec2 start-instances --instance-ids i-02e07f23649fd05fe 2>$null
& $AWS ec2 wait instance-running --instance-ids i-02e07f23649fd05fe
# 1) 이 컴퓨터 공인 IP를 자동 감지해 SSH(22) 허용에 추가 (사용자가 IP 알려줄 필요 없음)
$myip=(Invoke-WebRequest https://checkip.amazonaws.com -UseBasicParsing).Content.Trim()
& $AWS ec2 authorize-security-group-ingress --group-id sg-0144bd538dfba7047 --protocol tcp --port 22 --cidr "$myip/32" 2>$null   # 이미 있으면 Duplicate=정상
# 2) 임시 RSA 키 생성 (기존 키 있으면 지우고 새로)
Remove-Item $HOME\.ssh\projectamo_rsa* -ErrorAction SilentlyContinue
ssh-keygen -t rsa -b 2048 -f $HOME\.ssh\projectamo_rsa -N '""' -q
# 3) EC2 Instance Connect로 공개키 푸시(60초 창) → 사이에 딴짓 없이 즉시 접속
& $AWS ec2-instance-connect send-ssh-public-key --instance-id i-02e07f23649fd05fe `
  --availability-zone ap-northeast-2c --instance-os-user ec2-user `
  --ssh-public-key (Get-Content $HOME\.ssh\projectamo_rsa.pub -Raw)
ssh -i $HOME\.ssh\projectamo_rsa ec2-user@3.34.113.37    # 60초 안에
```
> 새 노트북엔 로컬 키가 없어 **매번 Instance Connect로 60초 창 안에 접속**한다(영구 키 등록에 기대지 말 것). 운영은 키(Instance Connect) 단일 경로로 — 비밀번호 SSH는 SG 개방이 필요해 쓰지 않는다.

---

## 4. 웹앱 → 서버 배포 (계속 반복하는 루프)

```bash
# 로컬 앱폴더 → 서버로 전송
tar -C <앱폴더> -cf - . | ssh -i ~/.ssh/projectamo_rsa ec2-user@3.34.113.37 "rm -rf ~/work2 && mkdir ~/work2 && tar -x -C ~/work2"
# 서버에서 빌드 + 재시작
ssh -i ~/.ssh/projectamo_rsa ec2-user@3.34.113.37 "cd ~/work2/web && npm install && npm run build && ln -sfn .next-build .next && pm2 restart work2"
```
- 확인: 브라우저로 `https://projectamo.co.kr`
- ⚠️ `.next-build` → `.next` 심볼릭 링크 필수(이 앱의 `next.config`가 빌드를 `.next-build`에 넣는다).
- 💡 **웹 기능만 바꾸면 이 단계만 반복.** APK는 그대로 둬도 폰 앱이 자동으로 최신 화면을 불러온다(server.url이 배포 URL을 가리키므로).

**환경변수**(카카오 JS 키 등)는 코드에 하드코딩하지 말고 서버에 둔다: `~/work2/web/.env.local` 작성 후 `pm2 restart work2`. 미설정 시 폴백 모드로 동작.

---

## 5. APK 빌드 — ★ 서버에서 (이름·아이콘·권한·server.url 바꿀 때만)

> 로컬에서 `gradlew`는 AI 샌드박스가 막지만(loopback, 아래 §8 함정 D), **서버 SSH로 빌드하면 정상.** 서버에 빌드환경이 이미 있다. (사람이 본인 터미널에서 직접 빌드해도 됨 — `adb` 설치·실행은 AI 터미널도 가능.)

### 5.1 Capacitor 구성 (`web/`에서 — 최초 1회)
```powershell
cd web
npm install -D @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor/geolocation   # 위치 쓸 때만(§9 G). 안 쓰면 생략.
```
`web/capacitor.config.ts`:
```ts
import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'kr.example.app', appName: '<앱이름>',
  webDir: 'capacitor-www',                 // server.url 쓰므로 자리표시 폴더(index.html 한 장)면 됨
  server: { url: 'https://projectamo.co.kr' },   // https라 cleartext:true 불필요
};
export default config;
```
`web/capacitor-www/index.html` 한 장 만들고 → `npx cap add android`.

**네이티브 손보기** (`android/app/src/main/AndroidManifest.xml`) — 권한:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```
> https 배포를 가리키면 `usesCleartextTraffic`는 불필요. (localhost+`adb reverse` 로컬 검증 경로를 쓸 때만 cleartext 필요.)

### 5.2 서버에서 빌드 + APK 내려받기
```bash
ssh -i ~/.ssh/projectamo_rsa ec2-user@3.34.113.37 'bash -s' <<'EOS'
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
export ANDROID_HOME=$HOME/android-sdk
cd ~/work2/web
# (이름/아이콘 바꿨으면 capacitor.config.ts·아이콘 먼저 수정 — server.url 은 https://projectamo.co.kr 유지)
npx cap sync android
cd android
sed -i 's/\r$//' gradlew          # ⚠️ CRLF 줄바꿈 고치기(윈도우 체크아웃 시 필수)
chmod +x gradlew
./gradlew assembleDebug --no-daemon
EOS
# apk 내려받기 (서버 → 이 컴퓨터)
scp -i ~/.ssh/projectamo_rsa ec2-user@3.34.113.37:~/work2/web/android/app/build/outputs/apk/debug/app-debug.apk .
```
- AndroidManifest 권한 포함: INTERNET, 위치(FINE/COARSE), 알림(POST_NOTIFICATIONS).
- 위치/알림은 https라 WebView에서 그대로 작동(secure context).
- ⚠️ **함정 E:** `capacitor.config.ts`나 플러그인을 바꾸면 **반드시 `npx cap sync android`**. 안 하면 번들된 `assets/capacitor.config.json`이 옛 `server.url`을 그대로 가리킨다.

---

## 6. ★ 재빌드가 필요한 때 / 아닌 때 (시간 절약)

`server.url` APK는 화면을 **배포 서버에서 실시간 로드**한다. 그래서 대부분은 재빌드가 필요 없다.

| 바꾼 것 | 필요한 것 |
|---|---|
| React 컴포넌트/로직/CSS (JS) | **재빌드 X** — 서버에 배포(§4)만 하면 폰 앱이 자동 반영. 앱 재실행(`adb shell am force-stop <id>` → `am start ...`) |
| 새 Capacitor 플러그인 | `npx cap sync android` → 재빌드 → 재설치 |
| Manifest 권한 · `capacitor.config.ts` · 아이콘 · 앱이름 · appId | `npx cap sync android` → 재빌드 → 재설치 |

**로컬 알림**(서버 불필요, 앱 내 이벤트용): `npm i @capacitor/local-notifications` + `POST_NOTIFICATIONS` 권한 + `cap sync` + 재빌드 1회. "검색 결과"가 아니라 사용자가 기대하는 **핵심 이벤트**(예: 분석 완료)에 붙이고, 웹/PWA에선 no-op이 되도록 `isNativePlatform()`로 분기.

---

## 7. 🏁 시연 당일 절차

### 7.1 시연용 컴퓨터 준비 (시작 시 1회)
1. **AWS CLI 설치 + `aws configure`** (액세스 키 지참)
2. **scrcpy + adb** 받아 압축 풀기 (GitHub `Genymobile/scrcpy`, adb 포함) — `winget install --id Genymobile.scrcpy -e` 도 가능
3. **삼성 USB 드라이버 설치** → developer.samsung.com/android-usb-driver  ← **USB 미러링의 핵심**
4. **서버 접속 키 확보** (§3)

### 7.2 폰 설치 + 미러링 — ★ USB 기본
```powershell
$adb="C:\Users\John\scrcpy\adb.exe"; $env:ADB=$adb
& $adb devices                                   # USB 시리얼(예 R3CY300E0FB)이 device로 떠야 함
& $adb -s <시리얼> install -r app-debug.apk
#  서명 충돌나면:  & $adb -s <시리얼> uninstall kr.example.app   먼저, 다시 install
# 미러링 (풀 화질)
& "C:\Users\John\scrcpy\scrcpy.exe" -s <시리얼>
```
- 폰: **USB 연결 + USB 디버깅 ON + (MTP 모드)** + "USB 디버깅 허용" 한 번 수락.
- 데모: 위치·카메라·푸시를 미러 창에서 시연. **그 미러 창을 빔프로젝터로 출력.**
- scrcpy = 안드로이드 화면을 USB로 노트북에 저지연 미러링(+노트북 마우스로 폰 조작). 무료·오픈소스·인터넷 불필요.
- ⚠️ scrcpy 옵션(`--window-title` 등)에 **한글/공백 인자**를 주면 `Start-Process`에서 쪼개져 실패한다 — 옵션 없이 띄우거나 공백 없는 값만.

### 7.3 🔌 USB가 안 잡힐 때 — 무선(페어링 코드) 폴백
> 삼성 드라이버 설치 불가/USB 인식 실패 시. 반응성은 USB보다 떨어짐(가급적 5GHz wifi).

**폰:** 개발자 옵션 → **무선 디버깅 ON** → 탭 → **"페어링 코드로 기기 페어링"** → 화면에 *페어링 IP:포트* + *6자리 코드*. 메인 화면엔 *연결용 IP:포트*(다른 포트).
```powershell
$adb="C:\Users\John\scrcpy\adb.exe"; $env:ADB=$adb
& $adb pair <폰IP>:<페어링포트> <6자리코드>      # 예: pair 192.168.0.5:46553 972141
& $adb connect <폰IP>:<연결포트>                 # 메인 화면의 포트(페어링 포트와 다름)
& $adb -s <폰IP>:<연결포트> install -r app-debug.apk
# 저지연 미러링(무선)
& "C:\Users\John\scrcpy\scrcpy.exe" -s <폰IP>:<연결포트> --max-size 1024 --max-fps 30 --video-bit-rate 4M --no-audio
```
- PC·폰이 **같은 wifi** 여야 함. 페어링 코드는 일회용(매번 바뀜).

### 7.4 시연 체크리스트
- 폰 화면 꺼짐 시간 늘리기 · 잠금 해제 유지
- scrcpy 창을 빔 출력에 배치
- 흐름 예: 입력(사진/텍스트) → 분석 → 결과 카드 → **상단바 내려 알림** 보여주기
- 라이브가 흔들리면 단계별 스크린샷(`demo/`)으로 즉시 전환 (규정상 녹화/스크린샷도 인정)

### 7.5 폴백 = PWA (홈 화면에 추가)
APK가 막힐 때만. 웹앱에 **매니페스트(`app/manifest.ts`) + 아이콘(192·512)** 이 이미 있어 폰 크롬에서 **"홈 화면에 추가"** → 앱 아이콘·전체화면. 위치·알림은 https라 동작. 이름/아이콘만 교체하면 됨.

### 7.6 시연 방법 우선순위
| 방법 | 진짜같음 | 준비 | 비고 |
|---|---|---|---|
| **APK + scrcpy USB 미러링** | ★★★★★ | 서버 빌드 + 폰 | **기본** (위치·카메라·푸시 실기기 시연) |
| 무선(페어링) 미러링 | ★★★★ | adb pair | USB 안 될 때 폴백 |
| PWA(홈 화면 추가) | ★★★★ | 매니페스트(기본 포함) | APK 막힐 때 폴백 |
| 폰에서 배포 URL 직접 접속 | ★★★ | 없음 | https라 가능, 단 "앱처럼"은 약함 |

---

## 8. 빌드 환경 — 로컬에서 직접 빌드할 경우 (서버 빌드 대안)

서버 빌드가 기본이지만, 로컬에서 본인 터미널로 빌드할 수도 있다. 핵심 제약만 정리.

- **JDK 21** (Capacitor 7 = Java 21. JDK 17이면 막판 `invalid source release: 21` 실패).
- **Android SDK는 cmdline-tools만**(platform-tools + `platforms;android-34` + `build-tools;34.0.0`). 에뮬레이터·Studio 불필요 → ~300MB.
- **SDK는 공백 없는 경로**(`C:\Android\sdk`). 사용자 폴더 공백이면 Gradle 깨짐.
- 빌드(`gradlew`)는 **사람 본인 터미널**에서. AI 샌드박스는 Gradle 루프백을 막는다(함정 D). `adb`(설치·실행)는 네이티브라 AI 터미널 OK.

**JDK 21 설치**
```powershell
winget install --id Microsoft.OpenJDK.21 -e --accept-source-agreements --accept-package-agreements
```
**Android SDK(cmdline-tools만)**
```powershell
$sdk='C:\Android\sdk'
New-Item -ItemType Directory -Force "$sdk\cmdline-tools" | Out-Null
Invoke-WebRequest 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip' -OutFile "$env:TEMP\clt.zip"
Expand-Archive "$env:TEMP\clt.zip" "$sdk\cmdline-tools\_t" -Force
Move-Item "$sdk\cmdline-tools\_t\cmdline-tools" "$sdk\cmdline-tools\latest"
# 라이선스: stdin 자동동의가 Windows에서 잘 깨짐 → 해시 파일 직접 작성이 확실
$lic="$sdk\licenses"; New-Item -ItemType Directory -Force $lic | Out-Null
"`n8933bad161af4178b1185d1a37fbf41ea5269c55`nd56f5187479451eabf01fb78af6dfcb131a6481e`n24333f8a63b6825ea9c5514f83c2829b004d1fee" | Set-Content -NoNewline -Encoding ascii "$lic\android-sdk-license"
$env:JAVA_HOME='C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot'
& "$sdk\cmdline-tools\latest\bin\sdkmanager.bat" --sdk_root="$sdk" "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```
**로컬 빌드 + 설치/실행**
```powershell
$env:JAVA_HOME = 'C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot'
$env:ANDROID_HOME = 'C:\Android\sdk'
cd web\android; .\gradlew.bat assembleDebug
# → web\android\app\build\outputs\apk\debug\app-debug.apk
$adb='C:\Android\sdk\platform-tools\adb.exe'
& $adb install -r ...\app-debug.apk
& $adb shell pm grant <appId> android.permission.ACCESS_FINE_LOCATION
& $adb shell am start -n <appId>/.MainActivity
```

**로컬 검증용 localhost 경로(공인 IP/배포 전):** `server.url='http://localhost:3000' + cleartext:true`, 별도로 `npm run dev`, 그리고 `adb reverse tcp:3000 tcp:3000`(폰 localhost:3000 → PC 3000, 네트워크 무관). 케이블 연결 + dev 서버 켜짐 동안만 동작. 완성형은 결국 https 배포가 정답 — localhost 경로는 배포 전 최단 검증용.

---

## 9. 함정표 (재발 방지)

| # | 증상 | 원인 | 해결 |
|---|---|---|---|
| A | `invalid source release: 21` | Capacitor 7=Java 21인데 JDK 17 | **JDK 21** |
| B | Gradle 경로에서 깨짐 | 사용자 폴더 공백 | SDK를 **공백 없는 경로** |
| C | sdkmanager 라이선스 멈춤 | `echo y` stdin 불안정 | **라이선스 해시 파일 직접 작성**(§8) |
| D | `Unable to establish loopback connection` | AI 샌드박스가 AF_UNIX 셀프파이프(JDK 16+) 차단 — `dangerouslyDisableSandbox`로도 안 풀림 | **사람 본인 터미널** 또는 **서버 SSH 빌드**. `adb`는 네이티브라 AI OK |
| E | APK가 옛 server.url 가리킴 | `cap sync` 안 함 | 설정/플러그인 변경 후 **`npx cap sync android`** |
| F | 폰이 LAN IP 접속 못 함 | PC와 폰이 다른 망 | **`localhost`+`adb reverse`** 또는 https 배포 |
| G | 위치 안 됨(권한 줘도) | `navigator.geolocation`은 **http 차단**(secure context 필요) | **https 배포**(자동 해결) 또는 **`@capacitor/geolocation`**(네이티브 위치 API 직접 호출) |
| H | 지도 "결과 못 불러옴" / 401 | origin이 지도 JS SDK 콘솔 도메인 미등록 | 콘솔에 **실제 origin 등록**(`https://projectamo.co.kr`) |
| I | 진짜 origin 모름 | 번들설정·터널 혼동 | `console.error(window.location.origin)` |
| J | 수정마다 재빌드 느림 | server.url APK는 화면을 서버에서 실시간 로드 | **JS/CSS만 바뀌면 재빌드 불필요**(§6) |

**G 상세** — WebView는 https(secure context) 아니면 `navigator.geolocation`을 원천 차단한다. https 배포면 자동 해결. http 환경이 불가피하면 `@capacitor/geolocation`이 네이티브 위치 API를 직접 호출해 http에서도 된다. 웹/PWA는 그대로 두고 네이티브만 분기:
```ts
const cap = (window as any).Capacitor;
if (cap?.isNativePlatform?.()) {
  const { Geolocation } = await import('@capacitor/geolocation');
  const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
  // pos.coords.latitude / longitude
} else {
  navigator.geolocation.getCurrentPosition(/* 웹/PWA: https에서 동작 */);
}
```
> https 배포(`server.url`이 https)면 WebView도 secure context라 `navigator.geolocation`이 그대로 작동 → `@capacitor/geolocation` 플러그인 없이도 될 가능성이 크다(실제 기기에서 확인).

**H 상세** — 지도 콘솔(예: 카카오) → JS SDK 도메인에 앱이 실제 띄우는 **origin 그대로** 등록(localhost:3000 / 공인 IP / 배포 도메인 `https://projectamo.co.kr`). 막히는 건 referer(origin) 미등록 → 401. 미등록 시 지도 컴포넌트는 안내 패널로 폴백.

### 9.1 WebView 카메라/마이크 권한
WebView에서 `getUserMedia`(카메라·마이크)를 쓰면 https(secure context)가 전제다. 네이티브 권한도 함께 필요하다 — Manifest에 `CAMERA`/`RECORD_AUDIO`를 선언하고, Capacitor WebView가 권한 요청을 OS로 전달하도록 한다. 권한이 거부되면 스트림이 조용히 비어 오니, 거부 시 안내 UI로 폴백할 것. (위치와 마찬가지로 http에서는 차단.)

---

## 10. ★ 웹앱을 APK로 감싸면 "레이아웃·UX"를 다시 설계해야 한다 (가장 자주 놓침)

반응형 웹이 폰 폭에서 "안 깨진다"고 모바일 앱이 되는 게 아니다. 데스크톱 흔적(상단 GNB·정부 Masthead·큰 히어로)을 그대로 두면 "폰에 욱여넣은 웹사이트"로 보인다.

- **웹 크롬을 모바일에선 걷어내라**: Masthead·GNB → `hidden md:block`. 앱은 컴팩트 헤더 1줄. 데스크톱은 `md:` 분기로 보존.
- **히어로**: 모바일 패딩·폰트 축소, **핵심 입력이 첫 화면(fold)에 보이게**.
- **하단 탭바는 목적지가 있을 때만**(단일 입력→결과 앱엔 과함).
- **한국어 줄바꿈**: 제목에 `break-keep`(word-break: keep-all) — 안 주면 음절 중간에서 깨진다.
- 사진/파일 입력은 작은 "첨부됨" 배지보다 **입력창을 미리보기 블록으로 대체**가 명확. 칩 라벨은 짧게.

**검증법:** 폰의 `adb shell screencap`은 WebView가 보안 서피스라 **검은 화면**으로 나온다. → **Playwright 모바일 뷰포트(390px)** 로 fold(스크롤 0)·full 캡처. 파일 첨부는 `setInputFiles`로 시뮬. 레이아웃은 전부 JS라 재빌드 불필요(§6).

---

## 11. 제품 원칙 — 기기 실사용에서 드러나는 "매칭 품질"

APK로 실제 입력을 넣으면 데모 밖 입력에서 **AI가 엉뚱하게 분류**하는 게 보인다.
- **AI 자유분류에 의존하지 말고** 핵심 라우팅(담당 기관·처리 URL)은 **결정적 안전망**으로 둔다(키워드 대분류 매핑 등).
- 사안별 위치 성격이 다르다 — 관할 고정 + 온라인 처리 건은 "최근접 지도"가 오히려 틀리니 **온라인 처리 버튼**, 방문형만 최근접 지도.
- 공식 URL은 **실제 접속 확인**(죽은 링크 주의).

---

## 12. 현재 서버 상태 & 시연 후 복구

**상황:** 이 서버엔 원래 사용자 `projectamo`의 다른 앱이 돌고 있었음 → 시연 동안만 **잠시 내리고** WORK2로 운영. **기존 앱은 삭제하지 않음, 복구 가능.**
- 현재 라이브: `https://projectamo.co.kr` = WORK2 (PM2 `work2`, 3000, https)
- 보존: `/opt/projectamo`(파일 그대로), PM2 `projectamo-backend`=stopped, nginx `projectamo.conf.disabled`(+`.orig-bak`)

**시연 후 원래 앱 복구:**
```bash
ssh -i ~/.ssh/projectamo_rsa ec2-user@3.34.113.37 'bash -s' <<"R"
pm2 stop work2
sudo mv /etc/nginx/conf.d/work2.conf /etc/nginx/conf.d/work2.conf.disabled
sudo mv /etc/nginx/conf.d/projectamo.conf.disabled /etc/nginx/conf.d/projectamo.conf
sudo nginx -t && sudo systemctl reload nginx
pm2 start projectamo-backend
pm2 save
R
# 원래 앱은 http(80) 구성이었음 — https 원하면 그 conf에 certbot 재실행
```

---

## 13. 자주 막히는 곳 (운영/접속)

| 증상 | 원인 / 해결 |
|---|---|
| 도메인 접속 안 됨 | DNS 전파 대기 / **EC2 중지됨(서버 켜둘 것)** |
| 502 Bad Gateway | `next start` 안 돎 → `pm2 logs work2` |
| SSH 안 됨 | 현재 IP가 SG 22 허용에 없음(§3-1) / EC2 Instance Connect는 **RSA 키** 필요 |
| EC2 Instance Connect 권한 거부 | IAM 사용자에 AdministratorAccess(또는 `ec2-instance-connect:SendSSHPublicKey`) |
| **gradlew loopback 오류** | **로컬 AI 빌드 불가 → 서버에서 빌드**(§5) 또는 사람 본인 터미널(§8) |
| gradlew `cannot execute` | gradlew가 CRLF → `sed -i 's/\r$//' gradlew` |
| **USB 폰 안 잡힘** | **삼성 USB 드라이버 미설치**(§7.1-3) → 설치 후 재연결. 안 되면 무선 폴백(§7.3) |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | 다른 키로 설치된 동일 앱 → `adb uninstall <appId>` 먼저 |
| 무선 미러링 렉 | wifi 한계 → USB 권장 / scrcpy 저지연 옵션(§7.3) |
| 지도 401 (쓸 경우) | 콘솔 JS SDK 도메인에 `https://projectamo.co.kr` 등록(§9 H) |

---

## 14. 스스로 점검 (배포·시연 전 자가 체크리스트)

- [ ] `nslookup projectamo.co.kr` → `3.34.113.37` 응답
- [ ] `https://projectamo.co.kr` 브라우저 접속 + 인증서 유효(자물쇠)
- [ ] `/api/*` 핵심 엔드포인트 응답 확인(502 아님)
- [ ] 서버 환경변수(지도 키 등) 설정됨, 지도 401 안 뜸
- [ ] 외부/공식 URL 실제 접속 확인(죽은 링크 없음)
- [ ] APK 설치 → 앱 실행 → 배포 화면이 뜸(옛 server.url 아님)
- [ ] 실기기에서 위치·알림·카메라 동작
- [ ] scrcpy 미러링 정상, 빔 출력 배치 확인
- [ ] 라이브 실패 대비 `demo/` 스크린샷 준비
- [ ] PWA 폴백("홈 화면에 추가") 동작 확인
