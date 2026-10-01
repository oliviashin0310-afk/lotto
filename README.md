# 🎯 QUANT LOTTO TERMINAL™ PRO
> **1,150회 역대 당첨 빅데이터 통계 분석 & 퀀트 금융 백테스팅 시뮬레이션 시스템 (정가 1,000,000원 상당)**

![QUANT LOTTO BANNER](public/favicon.svg)

---

## 🌟 프로젝트 개요
**QUANT LOTTO TERMINAL™ PRO**는 단순 무작위 난수 생성이 아닌, 2002년부터 축적된 대한민국 동행복권 로또 6/45 역대 1,150회 전수 빅데이터를 기반으로 수학적 최적 분산도와 퀀트 금융 투자 지표를 적용한 **최고급 상업용 웹 애플리케이션**입니다.

---

## ✨ 핵심 기능

### 1. 🎯 4대 퀀트 번호 추출 알고리즘
- **QUANT ALPHA (통계 최적화)**: 역대 1등 당첨번호 통계 가중치, 정규분포 총합(100~175), 산술 복잡도(AC $\ge$ 6), 홀짝 3:3 황금비율 적용
- **COLD CATCHER (미출현 반등)**: 장기 미출현 번호의 평균 회귀(Mean Reversion) 이론 기반 가중치 추출
- **HOT MOMENTUM (핫 모멘텀)**: 최근 20회차 최다 출현 번호 추세 추종 알고리즘
- **MONTE CARLO PRO (몬테카를로 시뮬레이션)**: 5,000회 무작위 시뮬레이션을 가동하여 수학적 엔트로피가 가장 우수한 조합 자동 선별

### 2. 📈 역대 1,150회 가상 백테스팅 시뮬레이터 (킬러 기능)
- 내가 생성한 조합을 역대 1,150회차(약 22년치) 실제 당첨 데이터에 전수 대입
- **가상 총 투자금 (Capital)** vs **총 회수 당첨금 (Payout)**
- **순손익 (Net P&L)** 및 **투자 수익률 (ROI %)**, **당첨 적중률 (Hit Rate)**, **최대 낙폭 (Max Drawdown)** 산출
- **누적 자산 변동 곡선 (Equity Curve SVG 차트)**: 손익분기점(Break-Even) 대비 자산 변동 추이 시각화
- 1등~5등 당첨 매트릭스 및 당시 추첨공 대조 검증 로그 제공

### 3. 📊 빅데이터 통계실
- 1~45번 전체 출현 빈도 및 장기 미출현 주기 인터랙티브 매트릭스
- TOP 5 핫 모멘텀 vs TOP 5 미출현 반등 후보 실시간 랭킹
- 색상별 5대 섹터(골드, 블루, 레드, 그레이, 에메랄드) 비중 차트
- 홀짝 비율 및 총합 정규분포 종형 곡선(Bell Curve) 분석

### 4. 💼 퀀트 분석 티켓 & 포트폴리오 보관함
- 나만의 최적 조합 영구 보관(`localStorage`)
- 위조 방지 SHA-256 해시 및 바코드가 포함된 **공식 퀀트 티켓 출력/PDF 인쇄 (`@media print`)** 완벽 지원

### 5. 💎 100만원 VIP 엔터프라이즈 라이선스 시스템
- VIP 게이트웨이 모달 및 상업용 라이선스 키 인증 시스템
- 활성화 키 예시: `QUANT-VIP-2026`, `PRO-100M-KRW`

---

## 🛠️ 기술 스택 (Tech Stack)
- **Frontend**: React 19, Vite 8, Tailwind CSS v4
- **Icons**: Lucide React
- **Visuals**: Hyper-realistic 3D Neon Lotto Balls, SVG Interactive Charts, Glassmorphism
- **Audio Engine**: Web Audio API Cybernetic Sound Synthesizer
- **Deployment Ready**: Vercel SPA (`vercel.json`), PWA Manifest (`manifest.json`)

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev

# 3. 프로덕션 빌드
npm run build
```

---

## 📄 라이선스 및 유의사항
* 본 프로그램은 동행복권 로또 6/45 역대 통계 데이터 기반 연구/분석용 솔루션이며, 복권의 특성상 100% 당첨을 보장하지 않습니다. 건전한 복권 문화를 준수해 주시기 바랍니다.
* © 2026 QUANT LOTTO LABS. ALL RIGHTS RESERVED.
