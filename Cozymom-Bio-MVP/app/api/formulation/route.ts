import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Ensure this route runs in a Node runtime on Vercel so process.env is available at request time
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { formulationRequest, availableIngredients, formulationType } = await req.json();
    
    console.log('=== 건강기능식품 배합 검증 API 요청 시작 ===');
    console.log('요청 내용:', formulationRequest);
    console.log('제형 타입:', formulationType);

    if (!formulationRequest || !formulationRequest.trim()) {
      console.log('에러: 요청사항 없음');
      return NextResponse.json(
        { error: '배합 요청사항을 입력해주세요.' },
        { status: 400 }
      );
    }

    // API 키 확인 (런타임에 다시 확인)
    const apiKey = process.env.GEMINI_API_KEY;
    const mfdsUnifiedApiKey = process.env.MFDS_UNIFIED_API_KEY;
    const mfdsApiKeyIngredient = mfdsUnifiedApiKey || process.env.MFDS_API_KEY_INGREDIENT;
    const mfdsApiKeyNutrition = mfdsUnifiedApiKey || process.env.MFDS_API_KEY_NUTRITION;
    const mfdsServiceIngredient = process.env.MFDS_SERVICE_INGREDIENT || 'I2710';
    const mfdsServiceNutrition = process.env.MFDS_SERVICE_NUTRITION || 'I0030';
    
    console.log('API 키 존재 여부:', !!apiKey);
    console.log('API 키 길이:', apiKey?.length || 0);
    console.log('MFDS 통합 API 키:', !!mfdsUnifiedApiKey);
    console.log('MFDS 원료 API 키:', !!mfdsApiKeyIngredient);
    console.log('MFDS 영양 API 키:', !!mfdsApiKeyNutrition);
    console.log('MFDS 원료 서비스 코드:', mfdsServiceIngredient);
    console.log('MFDS 영양 서비스 코드:', mfdsServiceNutrition);
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.log('에러: API 키 미설정');
      return NextResponse.json(
        { error: 'Gemini API 키가 설정되지 않았습니다. 환경 변수에 GEMINI_API_KEY를 설정해주세요.' },
        { status: 500 }
      );
    }

    // 식약처 API 데이터 가져오기
    let mfdsIngredientData = '';
    let mfdsNutritionData = '';

    // 1. 식품안전나라 건강기능식품 기능성원료 API 호출
    if (mfdsApiKeyIngredient) {
      try {
        console.log('식품안전나라 기능성원료 API 호출 중...');
        const ingredientApiUrl = `http://openapi.foodsafetykorea.go.kr/api/${mfdsApiKeyIngredient}/${mfdsServiceIngredient}/json/1/50`;
        console.log('요청 URL:', ingredientApiUrl);
        
        const ingredientResponse = await fetch(ingredientApiUrl);
        const ingredientText = await ingredientResponse.text();
        
        // HTML 에러 응답 체크 (인증키 오류 등)
        if (ingredientText.includes('<script') || ingredientText.includes('alert')) {
          console.log('식품안전나라 기능성원료 API: 인증키 오류 (더미 데이터 사용)');
          mfdsIngredientData = `\n\n**식품안전나라 기능성원료 API 상태**: ⚠️ 인증키 미설정 (더미 데이터 사용)\n- API 키 발급 필요: https://www.foodsafetykorea.go.kr/api/\n- 서비스 코드: ${mfdsServiceIngredient}`;
        } else {
          try {
            const ingredientJson = JSON.parse(ingredientText);
            mfdsIngredientData = `\n\n**식품안전나라 실시간 기능성원료 데이터 연동 완료 ✓**\n서비스: ${mfdsServiceIngredient}\n조회된 데이터: ${JSON.stringify(ingredientJson).substring(0, 500)}...`;
            console.log('식품안전나라 기능성원료 API 호출 성공');
          } catch (parseError) {
            console.log('JSON 파싱 오류:', parseError);
            mfdsIngredientData = `\n\n**식품안전나라 기능성원료 API 상태**: ⚠️ 응답 파싱 실패`;
          }
        }
      } catch (error) {
        console.error('식품안전나라 기능성원료 API 오류:', error);
        mfdsIngredientData = `\n\n**식품안전나라 기능성원료 API 상태**: ❌ 연결 실패`;
      }
    }

    // 2. 식품안전나라 식품영양성분 데이터베이스 API 호출
    if (mfdsApiKeyNutrition) {
      try {
        console.log('식품안전나라 영양성분 API 호출 중...');
        const nutritionApiUrl = `http://openapi.foodsafetykorea.go.kr/api/${mfdsApiKeyNutrition}/${mfdsServiceNutrition}/json/1/50`;
        console.log('요청 URL:', nutritionApiUrl);
        
        const nutritionResponse = await fetch(nutritionApiUrl);
        const nutritionText = await nutritionResponse.text();
        
        // HTML 에러 응답 체크 (인증키 오류 등)
        if (nutritionText.includes('<script') || nutritionText.includes('alert')) {
          console.log('식품안전나라 영양성분 API: 인증키 오류 (더미 데이터 사용)');
          mfdsNutritionData = `\n\n**식품안전나라 영양성분 API 상태**: ⚠️ 인증키 미설정 (더미 데이터 사용)\n- API 키 발급 필요: https://www.foodsafetykorea.go.kr/api/\n- 서비스 코드: ${mfdsServiceNutrition}`;
        } else {
          try {
            const nutritionJson = JSON.parse(nutritionText);
            mfdsNutritionData = `\n\n**식품안전나라 실시간 영양성분 데이터 연동 완료 ✓**\n서비스: ${mfdsServiceNutrition}\n조회된 데이터: ${JSON.stringify(nutritionJson).substring(0, 500)}...`;
            console.log('식품안전나라 영양성분 API 호출 성공');
          } catch (parseError) {
            console.log('JSON 파싱 오류:', parseError);
            mfdsNutritionData = `\n\n**식품안전나라 영양성분 API 상태**: ⚠️ 응답 파싱 실패`;
          }
        }
      } catch (error) {
        console.error('식품안전나라 영양성분 API 오류:', error);
        mfdsNutritionData = `\n\n**식품안전나라 영양성분 API 상태**: ❌ 연결 실패`;
      }
    }

    // 런타임에 API 키로 새 인스턴스 생성    // 런타임에 API 키로 새 인스턴스 생성
    const genAIRuntime = new GoogleGenerativeAI(apiKey);
    const model = genAIRuntime.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 배합 규칙 데이터 (mixture_rules.csv 기반)
    const mixtureRules = [
      {
        base_ingredient: '알부민',
        paired_ingredient: '비타민C',
        rule_type: 'ratio_min_max',
        limit_value_min: 0.05,
        limit_value_max: 0.20,
        note: '단백질+비타민C 복합 권장비율'
      },
      {
        base_ingredient: '알부민',
        paired_ingredient: '',
        rule_type: 'max_percent_total',
        limit_value_min: null,
        limit_value_max: 10,
        note: '총 배합량 대비 알부민 ≤ 10%'
      },
      {
        base_ingredient: '홍삼농축액',
        paired_ingredient: '',
        rule_type: 'max_percent_total',
        limit_value_min: null,
        limit_value_max: 5,
        note: '홍삼농축액 총량 상한 5%'
      },
      {
        base_ingredient: '나이아신',
        paired_ingredient: '비오틴',
        rule_type: 'ratio_min_max',
        limit_value_min: 0.01,
        limit_value_max: 0.05,
        note: '피부계통 복합 조합 주의'
      },
      {
        base_ingredient: '오메가3지방산',
        paired_ingredient: '',
        rule_type: 'max_percent_total',
        limit_value_min: null,
        limit_value_max: 25,
        note: '총량 대비 오메가3 ≤ 25%'
      },
      {
        base_ingredient: '칼슘',
        paired_ingredient: '마그네슘',
        rule_type: 'ratio_min_max',
        limit_value_min: 0.5,
        limit_value_max: 3.0,
        note: '칼마비 비율 가이드'
      },
      {
        base_ingredient: '비타민D',
        paired_ingredient: '칼슘',
        rule_type: 'ratio_min_max',
        limit_value_min: 0.005,
        limit_value_max: 0.05,
        note: '비타민D:칼슘 보조비율'
      },
      {
        base_ingredient: '철',
        paired_ingredient: '아연',
        rule_type: 'ratio_min_max',
        limit_value_min: 0.1,
        limit_value_max: 1.0,
        note: '흡수 경쟁 주의: 철:아연 비율 가이드'
      }
    ];

    // 프롬프트 작성
    const context = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 Cozymom BIO - 건강기능식품 AI 배합 검증 시스템
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

당신은 건강기능식품 제조 및 식품의약품안전처(MFDS) 규정 전문가입니다.
입력된 배합 요청을 분석하여 MFDS 기준 적합성을 검증하고 최적화된 배합을 제안합니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
� 제형 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**목표 제형**: ${formulationType || '지정되지 않음'}

제형에 따른 고려사항:
- 고형제형(정제, 캡슐): 압축성, 붕해성, 안정성 고려
- 반고형제형(젤리, 겔): 점도, 유화 안정성, 보존성 고려
- 액상제형(음료, 시럽): 용해도, pH 안정성, 침전 방지 고려
- 기타 제형: 해당 제형의 특성에 맞는 배합 검토

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 사용 가능한 원료 데이터베이스 (MFDS 기준)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**데이터 출처**:
1. 식품의약품안전처 건강기능식품 공전 (https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionality.do)
2. 식품의약품안전처 기능성원료 인정현황 API (공공데이터포털)
3. 식품의약품안전처 영양성분 데이터베이스 API (공공데이터포털)

${JSON.stringify(availableIngredients, null, 2)}

**식약처 실시간 API 연동 상태**:
${mfdsApiKeyIngredient ? '✓ 기능성원료 API 연동 중' : '✗ 기능성원료 API 미연동'}
${mfdsApiKeyNutrition ? '✓ 영양성분 API 연동 중' : '✗ 영양성분 API 미연동'}
${mfdsIngredientData}
${mfdsNutritionData}

**주의**: 위 데이터는 데모용 예시이며, 실제 제품 개발 시 최신 공전 확인 필수

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧩 배합 규칙 (Mixture Rules)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**규칙 출처**: 건강기능식품 제조 실무 가이드라인 및 제조사 자체 기준

${JSON.stringify(mixtureRules, null, 2)}

**주의**: 위 배합 규칙은 예시이며, 실제 제조 시 제형별 특성 고려 필수

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 검증 프로세스
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **개별 원료 검증**
   - 함량 < range_min → ❌ 부적합 (하한 미달)
   - range_min ≤ 함량 < range_max × 0.9 → ✅ 적합
   - range_max × 0.9 ≤ 함량 ≤ range_max → ⚠️ 주의 (상한 근접)
   - 함량 > range_max → ❌ 부적합 (상한 초과)

2. **배합 규칙 검증**
   
   **ratio_min_max** (비율 검증):
   - amount(B) / amount(A)가 limit_value_min ~ limit_value_max 범위 내
   
   **max_percent_total** (총량 대비 비율):
   - amount(A) / 총량 × 100 ≤ limit_value_max

3. **제형 적합성 검토**
   - 선택된 제형(${formulationType})에 적합한 원료 배합인지 평가
   - 제형별 물리화학적 안정성 검토
   - 제조 공정상 주의사항 제시

4. **종합 평가**
   - 모든 원료의 개별 검증 결과
   - 배합 규칙 적용 결과
   - 제형 적합성 평가
   - 최종 적합/주의/부적합 판정
   - 개선 제안 (부적합 시)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 중요 지침
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 정확한 수치 계산과 MFDS 기준 준수
• 모든 주장에 대한 근거 명시
• 식품공전 및 관련 법령 참조
• 불확실한 부분은 명확히 표기
• 전문가 검토 필요성 강조
• 책임 소재 및 면책 조항 포함
• **반드시 각 원료별로 데이터 출처를 명시할 것**

**데이터 출처 표기 방법**:
각 원료 검증 시 다음 형식으로 출처 표시:
"출처: 식품의약품안전처 건강기능식품 공전, [원료명] 기준규격"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 출력 형식 (필수 준수)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

다음 형식으로 답변해주세요:

═══════════════════════════════════════════
🧬 Cozymom BIO - 건강기능식품 배합 검증 결과
═══════════════════════════════════════════

📋 **요청 분석**
[사용자가 요청한 내용 요약]
**목표 제형**: ${formulationType}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 1. 개별 원료 검증 결과
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[각 원료별로 아래 형식으로 작성]

▶ 원료명 (영문명) - 함량
   상태: ✅ 적합 / ⚠️ 주의 / ❌ 부적합
   MFDS 기준: [range_min]~[range_max] [unit]
   판정 근거: [구체적인 이유]
   주의사항: [notice 내용]
   **📚 출처**: 식품의약품안전처 건강기능식품 공전, [원료명] 기준규격

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧩 2. 배합 규칙 검증 결과
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[적용되는 배합 규칙별로 검증]

▶ 규칙: [규칙 설명]
   상태: ✅ 적합 / ⚠️ 주의 / ❌ 부적합
   계산: [구체적인 계산식과 결과]
   판정: [이유]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
� 3. 제형 적합성 평가
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**선택 제형**: ${formulationType}

[제형에 따른 평가]
- 원료의 물리화학적 특성과 제형의 적합성
- 제조 공정상 주의사항
- 안정성 및 보존성 검토
- 제형별 권장사항

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
�📊 4. 종합 평가
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 적합: [개수]개
⚠️ 주의: [개수]개
❌ 부적합: [개수]개

**최종 판정**: [전체적인 적합성 평가]

**권장사항**:
[개선이 필요한 부분 또는 추가 고려사항]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 5. 최적화 제안 (선택사항)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[더 나은 배합을 위한 제안사항]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 면책 조항
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

본 검증은 AI 기반 참고용 분석이며, 실제 제품 개발 시에는:
• 최신 「건강기능식품 공전」 확인 필수
• 식품기사, 약사 등 전문가 검토 필수
• 식약처 품목신고/심사 절차 준수 필수
• 임상시험 및 안전성 평가 고려 필수

**데이터 출처**:
• 식품의약품안전처 건강기능식품 공전 (https://www.foodsafetykorea.go.kr)
• 식품안전나라 Open API 실시간 연동 데이터 (https://www.foodsafetykorea.go.kr/api)
  - 건강기능식품 기능성원료 인정현황 API ${mfdsApiKeyIngredient ? '(실시간 연동 ✓)' : '(미연동)'}
  - 식품 영양성분 데이터베이스 API ${mfdsApiKeyNutrition ? '(실시간 연동 ✓)' : '(미연동)'}

═══════════════════════════════════════════
`;

    const prompt = `${context}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📝 사용자 배합 요청\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${formulationRequest}\n\n위 요청을 분석하여 지정된 출력 형식에 맞춰 상세한 검증 결과를 제공해주세요.\n정확한 수치 계산과 MFDS 기준을 반드시 확인하고, 모든 판정에는 명확한 근거를 제시하세요.`;

    console.log('Gemini API 호출 중...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('응답 성공, 길이:', text.length);
    console.log('=== API 요청 완료 ===');

    return NextResponse.json({ response: text });
  } catch (error) {
    const err = error as Error;
    console.error('=== 에러 발생 ===');
    console.error('에러 타입:', err.constructor.name);
    console.error('에러 메시지:', err.message);
    console.error('에러 스택:', err.stack);
    
    return NextResponse.json(
      { 
        error: 'AI 배합 검증 중 오류가 발생했습니다.',
        details: err.message || '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
