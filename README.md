# 🧠 Root Inside – MFDS AI MVP

**AI-Powered Health Functional Food Ingredient & Formulation Compliance Checker**  
*Multi-Ingredient Support for Korean MFDS Standards*

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 프로젝트 개요 | Project Overview

**Root Inside MFDS AI MVP**는 건강기능식품 제조 단계에서 입력된 원료와 함량이 식품의약품안전처(MFDS) 기준에 부합하는지 AI가 자동으로 판정하는 시스템입니다.

This system automatically validates ingredient compositions and dosages against Korean Ministry of Food and Drug Safety (MFDS) standards for health functional foods manufacturing.

### ✨ 주요 기능 | Key Features

- ✅ **다원료 지원**: 12종 이상의 원료 동시 검증 (알부민, 비타민, 미네랄, 홍삼, 오메가3 등)
- 🔍 **실시간 적합성 판정**: 개별 원료 + 배합 규칙 통합 검증
- 📊 **식약처 API 연동**: 공식 기능성원료 데이터베이스 참조
- 🧩 **배합 규칙 검증**: 원료 간 비율, 총량 상한 등 복합 규칙 적용
- 📈 **상세 리포트**: 적합/주의/부적합 판정 + 근거 제시

---

## 🏗️ 기술 스택 | Tech Stack

- **Frontend**: Next.js 14+, React, TypeScript
- **Styling**: Tailwind CSS
- **API Integration**: 
  - 식약처 공공데이터포털 API (기능성원료인정현황)
  - 식약처 영양성분 데이터베이스 API
- **Data Management**: CSV-based rule engine
- **Deployment**: Vercel (권장)

---

## 📂 프로젝트 구조 | Project Structure

```
root-inside-mfds-mvp/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── page.tsx          # Main page
├── data/                  # 핵심 데이터 파일
│   ├── ingredients_seed.csv    # 원료별 기준값
│   └── mixture_rules.csv       # 배합 규칙
├── lib/                   # 유틸리티 함수
├── public/               # 정적 파일
├── .env.local           # 환경변수 (생성 필요)
└── README.md
```

---

## 🚀 빠른 시작 | Quick Start

### 1️⃣ 사전 요구사항 | Prerequisites

- Node.js 18.0 이상
- npm 또는 yarn
- 식약처 공공데이터포털 API 키 2개 (아래 참조)

### 2️⃣ 설치 | Installation

```bash
# 저장소 클론
git clone https://github.com/your-username/root-inside-mfds-mvp.git
cd root-inside-mfds-mvp

# 의존성 설치
npm install
# 또는
yarn install
```

### 3️⃣ 데이터 파일 설정 | Data Setup

프로젝트 루트에 `data/` 폴더를 생성하고 아래 두 파일을 추가하세요:

#### `data/ingredients_seed.csv`

```csv
ingredient_kor,ingredient_eng,unit,range_min,range_max,functions,notice,decree_ref
알부민,Albumin,mg,50,500,영양보충|근육회복,단백질 알레르기 체질 주의,공전 예시 - 알부민 1일 50~500mg
비타민C,Vitamin C,mg,100,1000,항산화|면역,과량 섭취 시 위장불편,공전 예시 - 비타민C 1일 100~1000mg
아연,Zinc,mg,3,15,면역|세포분열,과량 섭취 시 구리 흡수 저해,공전 예시 - 아연 3~15mg
나이아신,Niacin,mg,5,50,에너지 생성|피부,고용량 시 홍조 가능,공전 예시 - 나이아신 5~50mg
비타민D,Vitamin D,µg,10,100,뼈 건강|면역,고용량 장기 섭취 주의,공전 예시 - 비타민D 10~100µg
철,Iron,mg,6,18,혈액 생성,과량 섭취 시 위장자극,공전 예시 - 철 6~18mg
칼슘,Calcium,mg,200,1000,뼈 건강,과량 섭취 시 신장 결석 위험,공전 예시 - 칼슘 200~1000mg
마그네슘,Magnesium,mg,50,350,신경·근육 기능,고용량 시 설사,공전 예시 - 마그네슘 50~350mg
비오틴,Biotin,µg,30,300,에너지 생성|피부,특이 체질 주의,공전 예시 - 비오틴 30~300µg
엽산,Folate,µg,200,800,혈액 생성|태아 신경관,임산부 과량 주의,공전 예시 - 엽산 200~800µg
오메가3지방산,Omega-3,g,0.5,2,혈중 중성지방|혈행,항응고제 복용 시 주의,공전 예시 - 오메가3 0.5~2g
홍삼농축액,Red Ginseng Extract,%,0.5,2,피로 개선|면역,카페인 동시 고함량 주의,공전 예시 - 홍삼농축액 0.5~2%
```

#### `data/mixture_rules.csv`

```csv
base_ingredient,paired_ingredient,rule_type,limit_value_min,limit_value_max,limit_unit,note
알부민,비타민C,ratio_min_max,0.05,0.20,ratio,단백질+비타민C 복합 권장비율(데모)
알부민,,max_percent_total,,10,percent_total,총 배합량 대비 알부민 ≤ 10%(데모)
홍삼농축액,,max_percent_total,,5,percent_total,홍삼농축액 총량 상한 5%(데모)
나이아신,비오틴,ratio_min_max,0.01,0.05,ratio,피부계통 복합 조합 주의(데모)
오메가3지방산,,max_percent_total,,25,percent_total,총량 대비 오메가3 ≤ 25%(제형 가정)
칼슘,마그네슘,ratio_min_max,0.5,3.0,ratio,칼마비 비율 가이드(데모 범위)
비타민D,칼슘,ratio_min_max,0.005,0.05,ratio,비타민D:칼슘 보조비율(데모)
철,아연,ratio_min_max,0.1,1.0,ratio,흡수 경쟁 주의: 철:아연 비율 가이드(데모)
```

### 4️⃣ 환경변수 설정 | Environment Variables

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 식약처 공공데이터포털 API 키
MFDS_API_KEY_INGREDIENT=여기에_기능성원료인정현황_API_KEY
MFDS_API_KEY_NUTRITION=여기에_영양DB_API_KEY
```

#### 🔑 API 키 발급 방법

1. [공공데이터포털](https://www.data.go.kr/) 회원가입
2. 다음 API 신청:
   - **식품의약품안전처_건강기능식품 기능성원료 인정현황**
   - **식품의약품안전처_영양성분 데이터베이스**
3. 승인 후 받은 인증키를 `.env.local`에 입력

### 5️⃣ 실행 | Run Development Server

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 🧪 테스트 케이스 | Test Cases

시스템에서 바로 테스트할 수 있는 케이스들입니다:

### 케이스 A: 알부민 복합 제형

```
알부민 300mg
비타민C 150mg
아연 10mg
```

**예상 결과**:
- 각 원료 개별 범위: ✅ 적합
- 알부민:비타민C 비율 (1:0.5): ⚠️ 권장 범위(0.05~0.2) 초과 주의

### 케이스 B: 골격·혈행 복합

```
칼슘 600mg
마그네슘 200mg
비타민D 20µg
오메가3지방산 1.5g
```

**예상 결과**:
- 모든 원료: ✅ 적합
- 칼슘:마그네슘 비율 (3.0): ✅ 상한 경계 적합
- 오메가3 총량 비율: ✅ 적합

### 케이스 C: 홍삼 상한 확인

```
홍삼농축액 5%
비타민C 200mg
엽산 400µg
```

**예상 결과**:
- 홍삼농축액: ⚠️ 상한 근접 주의
- 비타민C, 엽산: ✅ 적합

---

## 🤖 AI 판정 로직 | Validation Logic

### 1. 개별 원료 검증

```
- 함량 < range_min → ❌ 부적합 (하한 미달)
- range_min ≤ 함량 < range_max × 0.9 → ✅ 적합
- range_max × 0.9 ≤ 함량 ≤ range_max → ⚠️ 주의 (상한 근접)
- 함량 > range_max → ❌ 부적합 (상한 초과)
```

### 2. 배합 규칙 검증

**ratio_min_max** (비율 검증):
```
amount(B) / amount(A)가 limit_value_min ~ limit_value_max 범위 내
```

**max_percent_total** (총량 대비 비율):
```
amount(A) / 총량 × 100 ≤ limit_value_max
```

### 3. 종합 평가

최종 결과는 다음 형식으로 출력:
```
✅ 원료명 용량 → 적합 (근거)
⚠️ 원료명 용량 → 주의 (사유)
❌ 원료명 용량 → 부적합 (사유)
🧩 배합 검토: [규칙별 결과]
📊 종합평가: 적합 N · 주의 N · 부적합 N
```

---

## 🚢 배포 | Deployment

### Vercel 배포 (권장)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com/) 로그인
3. "Import Project" → GitHub 저장소 선택
4. Environment Variables 설정:
   - `MFDS_API_KEY_INGREDIENT`
   - `MFDS_API_KEY_NUTRITION`
5. Deploy 클릭

### 기타 플랫폼

- **Netlify**: `netlify.toml` 추가 후 배포
- **AWS Amplify**: Amplify Console 연동
- **Docker**: `Dockerfile` 작성 후 컨테이너화

---

## ⚠️ 중요 고지사항 | Important Notice

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

## 🛠️ 개발 로드맵 | Roadmap

- [ ] 실시간 식약처 API 데이터 동기화
- [ ] 사용자 맞춤 원료 데이터베이스 관리
- [ ] PDF/Excel 리포트 자동 생성
- [ ] 다국어 지원 (영어, 일본어, 중국어)
- [ ] 모바일 앱 버전
- [ ] 블록체인 기반 이력 추적

---

## 🤝 기여 | Contributing

기여를 환영합니다! 다음 절차를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 가이드라인

- 코드 스타일: ESLint + Prettier 준수
- 커밋 메시지: [Conventional Commits](https://www.conventionalcommits.org/) 형식
- 테스트: 새 기능 추가 시 유닛 테스트 작성

---

## 📄 라이선스 | License

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 👥 개발자 | Author

**Root Inside Co., Ltd.**  
Aiden (Founder & Principal Consultant)

- 📧 Email: [이메일 주소]
- 🌐 Website: [회사 웹사이트]
- 💼 LinkedIn: [LinkedIn 프로필]

---

## 📞 문의 | Contact

프로젝트 관련 문의사항은 다음을 통해 연락주세요:

- GitHub Issues: [이슈 페이지 링크]
- Email: [지원 이메일]
- 카카오톡 오픈채팅: [링크]

---

## 🙏 감사의 말 | Acknowledgments

- [식품의약품안전처](https://www.mfds.go.kr/) - 공공데이터 제공
- [공공데이터포털](https://www.data.go.kr/) - API 서비스
- [Next.js](https://nextjs.org/) - 프레임워크
- [Vercel](https://vercel.com/) - 호스팅 플랫폼

---

<div align="center">

**Made with ❤️ by Root Inside**

[⬆ Back to top](#-root-inside--mfds-ai-mvp)

</div>
