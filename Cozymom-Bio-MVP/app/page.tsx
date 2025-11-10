'use client';

import { useState } from 'react';

// 원료 데이터 타입 정의
interface Ingredient {
  ingredient_kor: string;
  ingredient_eng: string;
  unit: string;
  range_min: number;
  range_max: number;
  functions: string;
  notice: string;
}

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const [formulationRequest, setFormulationRequest] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formulationType, setFormulationType] = useState('고형제형');
  const [customFormulationType, setCustomFormulationType] = useState('');

  // 건강기능식품 원료 목록 (ingredients_seed.csv 기반)
  const availableIngredients: Ingredient[] = [
    { 
      ingredient_kor: '알부민',
      ingredient_eng: 'Albumin',
      unit: 'mg',
      range_min: 50,
      range_max: 500,
      functions: '영양보충|근육회복',
      notice: '단백질 알레르기 체질 주의'
    },
    { 
      ingredient_kor: '비타민C',
      ingredient_eng: 'Vitamin C',
      unit: 'mg',
      range_min: 100,
      range_max: 1000,
      functions: '항산화|면역',
      notice: '과량 섭취 시 위장불편'
    },
    { 
      ingredient_kor: '아연',
      ingredient_eng: 'Zinc',
      unit: 'mg',
      range_min: 3,
      range_max: 15,
      functions: '면역|세포분열',
      notice: '과량 섭취 시 구리 흡수 저해'
    },
    { 
      ingredient_kor: '나이아신',
      ingredient_eng: 'Niacin',
      unit: 'mg',
      range_min: 5,
      range_max: 50,
      functions: '에너지 생성|피부',
      notice: '고용량 시 홍조 가능'
    },
    { 
      ingredient_kor: '비타민D',
      ingredient_eng: 'Vitamin D',
      unit: 'µg',
      range_min: 10,
      range_max: 100,
      functions: '뼈 건강|면역',
      notice: '고용량 장기 섭취 주의'
    },
    { 
      ingredient_kor: '철',
      ingredient_eng: 'Iron',
      unit: 'mg',
      range_min: 6,
      range_max: 18,
      functions: '혈액 생성',
      notice: '과량 섭취 시 위장자극'
    },
    { 
      ingredient_kor: '칼슘',
      ingredient_eng: 'Calcium',
      unit: 'mg',
      range_min: 200,
      range_max: 1000,
      functions: '뼈 건강',
      notice: '과량 섭취 시 신장 결석 위험'
    },
    { 
      ingredient_kor: '마그네슘',
      ingredient_eng: 'Magnesium',
      unit: 'mg',
      range_min: 50,
      range_max: 350,
      functions: '신경·근육 기능',
      notice: '고용량 시 설사'
    },
    { 
      ingredient_kor: '비오틴',
      ingredient_eng: 'Biotin',
      unit: 'µg',
      range_min: 30,
      range_max: 300,
      functions: '에너지 생성|피부',
      notice: '특이 체질 주의'
    },
    { 
      ingredient_kor: '엽산',
      ingredient_eng: 'Folate',
      unit: 'µg',
      range_min: 200,
      range_max: 800,
      functions: '혈액 생성|태아 신경관',
      notice: '임산부 과량 주의'
    },
    { 
      ingredient_kor: '오메가3지방산',
      ingredient_eng: 'Omega-3',
      unit: 'g',
      range_min: 0.5,
      range_max: 2,
      functions: '혈중 중성지방|혈행',
      notice: '항응고제 복용 시 주의'
    },
    { 
      ingredient_kor: '홍삼농축액',
      ingredient_eng: 'Red Ginseng Extract',
      unit: '%',
      range_min: 0.5,
      range_max: 2,
      functions: '피로 개선|면역',
      notice: '카페인 동시 고함량 주의'
    }
  ];

  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactEmail = () => {
    const subject = encodeURIComponent('Cozymom BIO 건강기능식품 AI 문의');
    const body = encodeURIComponent('안녕하세요,\n\nCozymom BIO 건강기능식품 배합 최적화 시스템에 대해 문의드립니다.\n\n[문의 내용을 작성해주세요]');
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=consult@rootinsidegroup.com&su=${subject}&body=${body}`, '_blank');
  };

  const handleDemo = async () => {
    if (!formulationRequest.trim()) {
      alert('제형 요청 사항을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setAiResponse('');

    try {
      // 제형 타입 결정
      const finalFormulationType = formulationType === '기타' && customFormulationType.trim() 
        ? customFormulationType.trim() 
        : formulationType;

      const response = await fetch('/api/formulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          formulationRequest,
          availableIngredients,
          formulationType: finalFormulationType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiResponse(data.response);
      } else {
        const errorMsg = data.details ? `${data.error}\n상세: ${data.details}` : data.error;
        setAiResponse('오류가 발생했습니다: ' + errorMsg);
      }
    } catch (error) {
      console.error('네트워크 에러:', error);
      setAiResponse('배합 검증 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🧬</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Cozymom BIO
                </span>
                <p className="text-xs text-gray-500">MFDS AI MVP</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => handleScrollTo('overview')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">개요</button>
              <button onClick={() => handleScrollTo('features')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">핵심 기능</button>
              <button onClick={() => handleScrollTo('ingredients')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">원료 정보</button>
              <button onClick={() => handleScrollTo('demo')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">데모</button>
            </div>
            <button 
              onClick={handleContactEmail}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium"
            >
              문의하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="mr-2">🤖</span>
                <span>AI-Powered MFDS Compliance Checker</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                건강기능식품
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI 배합 최적화
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                식품의약품안전처(MFDS) 기준에 맞춘 원료 배합을 AI가 자동으로 검증하고 최적화합니다
              </p>
              <p className="text-lg text-gray-500 mb-8">
                12종 이상의 원료 데이터베이스와 배합 규칙 엔진을 통한 실시간 적합성 판정
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setShowDemo(true);
                    handleScrollTo('demo');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                >
                  배합 검증하기
                </button>
                <button 
                  onClick={() => handleScrollTo('ingredients')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  원료 보기
                </button>
              </div>
            </div>
            
            {/* Hero Illustration */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="font-semibold text-gray-700">배합 검증 결과</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">✓ 적합</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">알부민</span>
                      <span className="font-mono text-sm text-gray-800">300mg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">비타민C</span>
                      <span className="font-mono text-sm text-gray-800">150mg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">아연</span>
                      <span className="font-mono text-sm text-gray-800">10mg</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500">MFDS 기준 충족 ✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">왜 AI 배합 최적화인가?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              복잡한 식약처 기준과 배합 규칙을 AI가 자동으로 검증하여<br />
              제품 개발 시간을 단축하고 규정 준수를 보장합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 검증</h3>
              <p className="text-gray-600">
                12종 이상의 원료와 배합 규칙을 실시간으로 검증하여 즉시 적합성 판정
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">MFDS 기준 준수</h3>
              <p className="text-gray-600">
                식약처 공전 및 최신 고시 기준을 반영한 정확한 범위 관리
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">배합 최적화</h3>
              <p className="text-gray-600">
                원료 간 비율, 총량 제한 등 복합 규칙을 AI가 분석하여 최적 배합 제안
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">핵심 기능</h2>
            <p className="text-xl text-gray-600">
              전문적이고 정확한 건강기능식품 배합 검증 시스템
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">다원료 지원</h3>
              <p className="text-sm text-gray-600">알부민, 비타민, 미네랄, 홍삼, 오메가3 등 12종 이상</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-900 mb-2">개별 원료 검증</h3>
              <p className="text-sm text-gray-600">각 원료의 함량이 MFDS 기준 범위 내인지 검증</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🧩</div>
              <h3 className="font-bold text-gray-900 mb-2">배합 규칙 검증</h3>
              <p className="text-sm text-gray-600">원료 간 비율, 총량 상한 등 복합 규칙 적용</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-bold text-gray-900 mb-2">상세 리포트</h3>
              <p className="text-sm text-gray-600">적합/주의/부적합 판정 + 근거 제시</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section id="ingredients" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">지원 원료 데이터베이스</h2>
            <p className="text-xl text-gray-600">
              식약처 기준에 맞춘 12종 이상의 건강기능식품 원료
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIngredients.map((ingredient, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{ingredient.ingredient_kor}</h3>
                    <p className="text-sm text-gray-500">{ingredient.ingredient_eng}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {ingredient.unit}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">권장 범위:</span>
                    <span className="font-mono text-gray-900">
                      {ingredient.range_min}~{ingredient.range_max}{ingredient.unit}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">기능: </span>
                    <span className="text-gray-800">{ingredient.functions.replace('|', ', ')}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-orange-600">⚠️ {ingredient.notice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI 배합 검증 데모</h2>
            <p className="text-xl text-gray-600">
              원하는 배합 요청사항을 입력하면 AI가 자동으로 검증하고 최적화합니다
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                제형 선택
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {['고형제형', '반고형제형', '액상제형', '기타'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormulationType(type)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      formulationType === type
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              {formulationType === '기타' && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={customFormulationType}
                    onChange={(e) => setCustomFormulationType(e.target.value)}
                    placeholder="제형을 직접 입력하세요 (예: 연질캡슐, 츄어블정 등)"
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                배합 요청사항 입력
              </label>
              <textarea
                value={formulationRequest}
                onChange={(e) => setFormulationRequest(e.target.value)}
                placeholder="예: 근육 회복과 면역력 강화를 위한 제품을 만들고 싶습니다. 알부민 300mg, 비타민C 150mg, 아연 10mg으로 배합해주세요."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none text-gray-900"
                rows={6}
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-gray-500">
                💡 원하는 기능, 원료, 함량을 자유롭게 입력해보세요
              </p>
            </div>

            <button
              onClick={handleDemo}
              disabled={isLoading || !formulationRequest.trim()}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isLoading || !formulationRequest.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  AI가 배합을 분석 중입니다...
                </span>
              ) : (
                '🤖 AI로 배합 검증하기'
              )}
            </button>

            {aiResponse && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">검증 결과</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiResponse);
                      alert('결과가 클립보드에 복사되었습니다!');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📋 복사하기
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                    {aiResponse}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Notice Section */}
      <section className="py-16 px-6 bg-yellow-50 border-y border-yellow-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">중요 고지사항</h3>
              <div className="space-y-2 text-gray-700">
                <p>• 본 시스템은 <strong>데모/교육 목적의 MVP</strong>입니다.</p>
                <p>• CSV 데이터는 예시 수치로, 실제 식약처 최신 고시와 다를 수 있습니다.</p>
                <p>• 실제 제품 개발 전 반드시 <strong>최신 「건강기능식품 공전」</strong> 및 전문가 검토가 필요합니다.</p>
                <p>• 표시광고는 식약처 심사/신고 절차 준수가 필수입니다.</p>
                <p>• 본 시스템 사용으로 인한 법적 문제는 사용자 책임입니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🧬</span>
                </div>
                <span className="text-xl font-bold">Cozymom BIO</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-Powered Health Functional Food<br />
                Formulation Compliance Checker
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">빠른 링크</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleScrollTo('overview')} className="hover:text-white transition-colors">개요</button></li>
                <li><button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors">핵심 기능</button></li>
                <li><button onClick={() => handleScrollTo('ingredients')} className="hover:text-white transition-colors">원료 정보</button></li>
                <li><button onClick={() => handleScrollTo('demo')} className="hover:text-white transition-colors">데모</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">문의</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 consult@rootinsidegroup.com</li>
                <li>🌐 www.rootinsidegroup.com</li>
                <li>
                  <button 
                    onClick={handleContactEmail}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    문의하기
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Cozymom BIO Co., Ltd. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ for Healthcare Innovation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
