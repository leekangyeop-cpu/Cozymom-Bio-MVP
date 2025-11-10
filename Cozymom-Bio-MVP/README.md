# 🧬 Root Inside – MFDS AI MVP

**건강기능식품 AI 배합 최적화 시스템**  
*AI-Powered Health Functional Food Ingredient & Formulation Compliance Checker*

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 🎯 프로젝트 개요

식품의약품안전처(MFDS) 기준에 맞춘 건강기능식품 원료 배합을 AI가 자동으로 검증하고 최적화하는 전문 시스템입니다.

### ✨ 주요 기능

- 🤖 **AI 배합 검증**: Google Gemini를 활용한 지능형 배합 분석
- 📊 **12종 원료 지원**: 알부민, 비타민, 미네랄, 홍삼, 오메가3 등
- 🔍 **실시간 적합성 판정**: MFDS 기준 범위 자동 검증
- 🧩 **배합 규칙 엔진**: 원료 간 비율, 총량 제한 등 복합 규칙 적용
- 📈 **상세 리포트**: 적합/주의/부적합 판정 + 개선 제안
- 💼 **전문적 UI/UX**: 제약 분야에 적합한 세련된 디자인

---

## 🚀 빠른 시작

### 1️⃣ 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn
- Google Gemini API 키

### 2️⃣ 설치

```bash
# 의존성 설치
npm install

# 또는
yarn install
```

### 3️⃣ 환경변수 설정

`.env.local` 파일이 이미 있습니다. Gemini API 키가 설정되어 있습니다.

새로운 키가 필요한 경우:
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 방문
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. `.env.local` 파일의 `GEMINI_API_KEY` 값 업데이트

### 4️⃣ 개발 서버 실행

```bash
npm run dev

# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 📂 프로젝트 구조

```
root-inside-mfds-mvp/
├── app/
│   ├── api/
│   │   └── formulation/
│   │       └── route.ts          # 배합 검증 API
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 메인 페이지
├── Cozymom-Bio-MVP/
│   ├── ingredients_seed.csv      # 원료 데이터베이스
│   ├── mixture_rules.csv         # 배합 규칙
│   └── README.md                 # 원본 프로젝트 문서
├── .env.local                    # 환경 변수 (API 키)
├── package.json                  # 프로젝트 의존성
├── tsconfig.json                 # TypeScript 설정
├── tailwind.config.js            # Tailwind CSS 설정
└── next.config.js                # Next.js 설정
```

---

## 🧪 테스트 케이스

웹사이트에서 다음 케이스들을 바로 테스트할 수 있습니다:

### 케이스 A: 알부민 복합 제형
```
근육 회복과 면역력 강화를 위한 제품을 만들고 싶습니다.
알부민 300mg, 비타민C 150mg, 아연 10mg
```

**예상 결과**:
- 각 원료 개별 범위: ✅ 적합
- 알부민:비타민C 비율: ⚠️ 권장 범위 초과 주의

### 케이스 B: 골격·혈행 복합
```
골격 건강과 혈행 개선을 위한 제품입니다.
칼슘 600mg, 마그네슘 200mg, 비타민D 20µg, 오메가3지방산 1.5g
```

**예상 결과**:
- 모든 원료: ✅ 적합
- 칼슘:마그네슘 비율 (3.0): ✅ 상한 경계 적합

### 케이스 C: 홍삼 상한 확인
```
피로 개선과 항산화를 위한 제품입니다.
홍삼농축액 5%, 비타민C 200mg, 엽산 400µg
```

**예상 결과**:
- 홍삼농축액: ⚠️ 상한 근접 주의
- 비타민C, 엽산: ✅ 적합

---

## 🎨 주요 기능 상세

### 1. 지능형 배합 검증

Google Gemini AI가 다음을 분석합니다:
- 개별 원료의 MFDS 기준 적합성
- 원료 간 상호작용 및 비율
- 총량 대비 각 원료의 비율
- 안전성 및 주의사항

### 2. 원료 데이터베이스

**지원 원료 (12종 이상)**:
- 알부민 (Albumin)
- 비타민C (Vitamin C)
- 아연 (Zinc)
- 나이아신 (Niacin)
- 비타민D (Vitamin D)
- 철 (Iron)
- 칼슘 (Calcium)
- 마그네슘 (Magnesium)
- 비오틴 (Biotin)
- 엽산 (Folate)
- 오메가3지방산 (Omega-3)
- 홍삼농축액 (Red Ginseng Extract)

각 원료에 대해:
- MFDS 기준 범위 (최소~최대)
- 기능성 정보
- 주의사항
- 관련 법령 참조

### 3. 배합 규칙 엔진

**규칙 유형**:
1. **ratio_min_max**: 원료 간 비율 검증
2. **max_percent_total**: 총량 대비 비율 상한

**적용 규칙 예시**:
- 알부민:비타민C 비율 0.05~0.20
- 총량 대비 알부민 ≤ 10%
- 총량 대비 홍삼농축액 ≤ 5%
- 칼슘:마그네슘 비율 0.5~3.0

---

## 🎨 디자인 특징

### 전문적이고 직관적인 UI

- **제약 산업 표준 컬러**: 블루-인디고 그라데이션
- **명확한 정보 계층**: 섹션별 구분과 시각적 하이어라키
- **반응형 디자인**: 모든 디바이스에 최적화
- **접근성**: WCAG 2.1 AA 수준 준수

### 핵심 섹션

1. **히어로**: 서비스 소개 및 주요 CTA
2. **개요**: 시스템의 필요성과 가치 제안
3. **핵심 기능**: 4가지 주요 기능 소개
4. **원료 데이터베이스**: 12종 원료 상세 정보
5. **AI 데모**: 실시간 배합 검증 체험
6. **고지사항**: 법적 면책 및 주의사항

---

## 🤖 AI 판정 로직

### 개별 원료 검증

```
if 함량 < range_min:
    ❌ 부적합 (하한 미달)
elif range_min ≤ 함량 < range_max × 0.9:
    ✅ 적합
elif range_max × 0.9 ≤ 함량 ≤ range_max:
    ⚠️ 주의 (상한 근접)
elif 함량 > range_max:
    ❌ 부적합 (상한 초과)
```

### 배합 규칙 검증

**비율 검증 (ratio_min_max)**:
```
ratio = amount(B) / amount(A)
if limit_value_min ≤ ratio ≤ limit_value_max:
    ✅ 적합
else:
    ❌ 부적합
```

**총량 비율 검증 (max_percent_total)**:
```
percent = amount(A) / total_amount × 100
if percent ≤ limit_value_max:
    ✅ 적합
else:
    ❌ 부적합
```

---

## 🚢 배포

### Vercel 배포 (권장)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com/) 로그인
3. "Import Project" 클릭
4. GitHub 저장소 선택
5. 환경 변수 설정:
   - `GEMINI_API_KEY`: Google Gemini API 키
6. "Deploy" 클릭

배포 후 자동으로 HTTPS 도메인이 생성됩니다.

### 환경 변수 설정

Vercel 대시보드에서:
1. Settings → Environment Variables
2. Name: `GEMINI_API_KEY`
3. Value: [your_api_key]
4. Environment: Production, Preview, Development 모두 선택

---

## ⚠️ 중요 고지사항

> **본 시스템은 데모/교육 목적의 MVP입니다.**

### 법적 주의사항

1. **CSV 데이터**: 예시 수치로, 실제 식약처 최신 고시와 다를 수 있음
2. **제품 개발 전**: 반드시 최신 「건강기능식품 공전」 및 전문가 검토 필요
3. **표시광고**: 식약처 심사/신고 절차 준수 필수
4. **책임 제한**: 본 시스템 사용으로 인한 법적 문제는 사용자 책임

### 실무 적용 시 필수 조치

- ✅ 최신 공전·고시 데이터로 업데이트
- ✅ 전문가(약사, 식품기사, 변호사) 검토
- ✅ 임상시험 데이터 확보 (필요 시)
- ✅ 식약처 영업등록 및 품목신고/심사

---

## 🛠️ 기술 스택

### Frontend
- **Next.js 14+**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 유틸리티 기반 스타일링

### AI & API
- **Google Gemini API**: AI 배합 분석
- **Gemini 2.0 Flash Exp**: 최신 고성능 모델

### Deployment
- **Vercel**: 자동 배포 및 호스팅
- **Edge Runtime**: 빠른 응답 속도

---

## 📊 데이터 파일

### ingredients_seed.csv

원료별 MFDS 기준 정보:
- 한글명, 영문명
- 단위 (mg, µg, g, %)
- 권장 범위 (최소, 최대)
- 기능성
- 주의사항
- 법령 참조

### mixture_rules.csv

배합 규칙 정보:
- 기준 원료, 페어 원료
- 규칙 타입
- 제한값 (최소, 최대)
- 단위
- 비고

---

## 🔧 개발 가이드

### 로컬 개발

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

### 환경 변수

개발 환경: `.env.local`
프로덕션: Vercel 환경 변수

```bash
GEMINI_API_KEY=your_api_key_here
```

---

## 📞 문의

프로젝트 관련 문의:

- 📧 Email: consult@rootinsidegroup.com
- 🌐 Website: www.rootinsidegroup.com
- 💼 GitHub: [Root Inside](https://github.com/leekangyeop-cpu/Cozymom-Bio-MVP)

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

## 🙏 감사의 말

- [식품의약품안전처](https://www.mfds.go.kr/) - 규제 기준 제공
- [Google AI](https://ai.google.dev/) - Gemini API
- [Next.js](https://nextjs.org/) - 프레임워크
- [Vercel](https://vercel.com/) - 호스팅

---

<div align="center">

**Made with ❤️ by Root Inside**

*Healthcare Innovation through AI*

[🚀 시작하기](#-빠른-시작) • [📖 문서](./README_SETUP.md) • [💬 문의](#-문의)

</div>
