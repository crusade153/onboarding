'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import QRCode from 'react-qr-code';

type Tab = 'intro' | 'mistake' | 'chaos' | 'loss' | 'lesson';

const TABS: { key: Tab; label: string; sub: string }[] = [
  { key: 'intro',   label: '기준정보란?', sub: '회사의 DNA' },
  { key: 'mistake', label: '사소한 오입력', sub: '무심코 한 타이핑' },
  { key: 'chaos',   label: '현장의 나비효과', sub: '물리적 대혼돈' },
  { key: 'loss',    label: '숨겨진 적자', sub: '재무적 재앙' },
  { key: 'lesson',  label: '공감 & 교훈', sub: '우리의 목소리' },
];

export default function Part1Client() {
  const [tab, setTab] = useState<Tab>('intro');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <NavBar current="Part 1" step="01/04" />

      {/* 헤더 영역 압축 */}
      <div style={{ borderBottom: '1px solid var(--glass-border)', padding: '24px 0 16px' }}>
        <div className="slide-container" style={{ paddingBottom: 0 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 6 }}>Part 1</p>
          <h1 className="headline" style={{ color: 'var(--text)', marginBottom: 8, fontSize: '2rem' }}>
            기준이 무너지면 시스템이 무너진다
          </h1>
          <p className="body-md" style={{ color: 'var(--text2)', maxWidth: 700, wordBreak: 'keep-all', lineHeight: 1.5 }}>
            나의 사소한 '0' 하나가 현장의 트럭을 멈추고, 10억 원의 결산 오류를 만듭니다. 각 부서의 데이터가 어떻게 연결되고, 한 줄의 오타가 어떤 나비효과를 부르는지 확인합니다.
          </p>

          <div style={{ display: 'flex', gap: 4, marginTop: 16, background: 'var(--glass-light)', padding: 4, borderRadius: 12, border: '1px solid var(--glass-border)', width: 'fit-content' }}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '8px 20px', borderRadius: 9, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', border: 'none',
                background: tab === t.key ? 'var(--gold-dim)' : 'transparent',
                color: tab === t.key ? 'var(--gold)' : 'var(--text2)',
                outline: tab === t.key ? '1px solid var(--gold)' : 'none',
                transition: 'all 0.15s',
              }}>
                {t.label}
                <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, opacity: 0.7, marginTop: 2 }}>{t.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 (스크롤 방지를 위해 flex-1 적용) */}
      <div className="slide-container" style={{ flex: 1, paddingTop: 24, paddingBottom: 24, overflow: 'hidden' }}>
        {tab === 'intro' && <IntroSection />}
        {tab === 'mistake' && <MistakeSection />}
        {tab === 'chaos' && <ChaosSection />}
        {tab === 'loss' && <LossSection />}
        {tab === 'lesson' && <LessonSection />}
      </div>
    </div>
  );
}

// 1. 도입 (여백 및 글자 잘림 방지 wordBreak 적용)
function IntroSection() {
  const DEPTS = [
    { name: '영업·마케팅', icon: '🎯', color: 'var(--blue)', items: ['제품명 및 규격', '판매 단위 및 할인율', '거래처 마스터 정보'] },
    { name: '생산', icon: '🏭', color: 'var(--warning)', items: ['BOM 및 목표 수율', '공정 순서 (Routing)', '작업장 및 설비 마스터'] },
    { name: '물류', icon: '🚚', color: 'var(--teal)', items: ['제품 바코드 및 식별자', '보관 조건 (상온/냉장)', '부피(CBM) 및 총 중량'] },
    { name: '구매', icon: '🛒', color: '#A78BFA', items: ['협력사 마스터', '발주 및 납품 단위', '자재 표준 단가'] },
    { name: '재무·원가', icon: '💰', color: 'var(--gold)', items: ['코스트센터 (귀속 부서)', '고정비/변동비 배부 기준', '세무 신고용 품목 분류'] },
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderBottom: '3px solid var(--gold)' }}>
        <p className="title" style={{ fontSize: '1.25rem', marginBottom: 8, wordBreak: 'keep-all' }}>
          기준정보(Master Data)는 <span className="text-gold">회사의 DNA</span>입니다.
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', maxWidth: 800, margin: '0 auto', lineHeight: 1.6, wordBreak: 'keep-all' }}>
          ERP 시스템은 스스로 생각하지 않습니다. <strong>내가 입력하는 데이터가 다른 모든 부서 업무의 시작점</strong>이 됩니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, flex: 1 }}>
        {DEPTS.map(dept => (
          <div key={dept.name} className="glass-card" style={{ padding: '16px', borderTop: `3px solid ${dept.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>{dept.icon}</span>
              <p style={{ fontWeight: 800, fontSize: '1rem', color: dept.color, wordBreak: 'keep-all' }}>{dept.name}</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {dept.items.map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: 6, wordBreak: 'keep-all', lineHeight: 1.4 }}>
                  <span style={{ color: dept.color, opacity: 0.5 }}>▪</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. 전개: 사소한 오입력
function MistakeSection() {
  const MISTAKES = [
    { type: '단위 오류', dept: '생산/구매', desc: '건더기스프 소요량 2g을 2kg으로 입력' },
    { type: '중량 오류', dept: '물류/생산', desc: '완제품 중량 500g을 500kg으로 입력' },
    { type: '수량 오류', dept: '생산', desc: 'BOM 포장박스 소요량 1개를 10개로 입력' },
    { type: '보관 오류', dept: '물류/마케팅', desc: '냉동식품의 보관조건을 냉장으로 선택' },
    { type: '기한 오류', dept: '품질/영업', desc: '소비기한 300일을 180일로 축소 입력' },
    { type: '환산 오류', dept: '영업/물류', desc: '라면 1박스(12개입)를 1개로 입력' },
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--warning)' }}>
        <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--warning)', marginBottom: 4 }}>"아차, 단위 하나 잘못 골랐네?"</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {MISTAKES.map((m, i) => (
          <div key={i} className="glass-card pop-in" style={{ padding: '20px', background: 'var(--glass-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className="badge" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}>{m.type}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600 }}>{m.dept}</span>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, wordBreak: 'keep-all' }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. 위기: 현장의 대혼돈
function ChaosSection() {
  const CHAOS = [
    { title: '🚚 트럭 100대가 배차되다', cause: '완제품 500g → 500kg 오입력', effect: '트럭 1대면 될 물량의 부피가 1,000배로 계산되어 초대형 배차 사고가 발생합니다.', icon: '🚛' },
    { title: '🧊 다 녹아내린 제품들', cause: '냉동 → 냉장 보관조건 오류', effect: 'WMS가 냉동식품을 상온 구역으로 입고 지시하여 수억 원어치가 전량 폐기됩니다.', icon: '🔥' },
    { title: '📦 재고는 넘치는데 생산 중단', cause: 'BOM 포장박스 1개 → 10개', effect: '현장엔 박스가 산더미인데 전산상 "자재 부족"이 떠서 공장이 멈춥니다.', icon: '🏭' },
    { title: '📉 증발해버린 실물 재고', cause: '1박스(12개) → 1개 환산 오류', effect: '10박스(120개)를 출고했는데 전산엔 10개만 차감되어 재고 실사 시 대혼란을 겪습니다.', icon: '🕵️‍♂️' },
  ];

  return (
    <div className="anim-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {CHAOS.map((c, i) => (
        <div key={i} className="glass-card pop-in" style={{ padding: '20px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ fontSize: '2.5rem', flexShrink: 0, width: 50, textAlign: 'center' }}>{c.icon}</div>
          <div>
            <p style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--red)', marginBottom: 6, wordBreak: 'keep-all' }}>{c.title}</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(248,113,113,0.1)', color: 'var(--red)', borderRadius: 4, fontWeight: 700 }}>원인</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text2)', fontWeight: 600, wordBreak: 'keep-all' }}>{c.cause}</span>
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text)', marginTop: 6, lineHeight: 1.5, wordBreak: 'keep-all' }}>{c.effect}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 4. 절정: 돌이킬 수 없는 손실
function LossSection() {
  return (
    <div className="anim-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div className="glass-card-lg" style={{ padding: '24px', border: '1px solid rgba(45,212,191,0.3)' }}>
        <p className="caption" style={{ color: 'var(--teal)', marginBottom: 8 }}>원가 왜곡 (허위 적자)</p>
        <p style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 12, wordBreak: 'keep-all' }}>건더기 2g → 2kg의 최후</p>
        <p style={{ color: 'var(--text2)', lineHeight: 1.6, fontSize: '0.9375rem', wordBreak: 'keep-all' }}>
          10원이어야 할 스프 원가가 10,000원으로 결산됩니다. 잘 팔리고 있는 효자 상품이 심각한 적자로 보고되어, 경영진이 생산을 강제로 중단시켜버립니다.
        </p>
      </div>

      <div className="glass-card-lg" style={{ padding: '24px', border: '1px solid rgba(45,212,191,0.3)' }}>
        <p className="caption" style={{ color: 'var(--teal)', marginBottom: 8 }}>매출 왜곡과 자산 손실</p>
        <p style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 12, wordBreak: 'keep-all' }}>단가 표기 & 소비기한 축소</p>
        <ul style={{ color: 'var(--text2)', lineHeight: 1.6, fontSize: '0.9375rem', paddingLeft: 16, margin: 0, wordBreak: 'keep-all' }}>
          <li style={{ marginBottom: 4 }}>1식 1,000원을 1팩(4입) 1,000원으로 입력하여 확정 손실을 입습니다.</li>
          <li>300일짜리를 180일로 오입력해 멀쩡한 제품을 헐값에 덤핑합니다.</li>
        </ul>
      </div>

      <div className="glass-card-lg" style={{ gridColumn: '1 / -1', padding: '20px 24px', background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.3)', display: 'flex', alignItems: 'center', gap: 20 }}>
         <div style={{ flex: 1 }}>
           <p className="caption" style={{ color: 'var(--red)', marginBottom: 8 }}>세무 및 감사 리스크</p>
           <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--red)', marginBottom: 8, wordBreak: 'keep-all' }}>제품을 '상품'으로 오분류</p>
           <p style={{ color: 'var(--text)', lineHeight: 1.6, fontSize: '0.9375rem', wordBreak: 'keep-all' }}>
             제조품을 매입품으로 분류하면 제조원가명세서와 손익계산서가 꼬입니다. <strong>재무 결산이 중단되고 외부 회계감사 거절 등 중대 사고</strong>로 번집니다.
           </p>
         </div>
      </div>
    </div>
  );
}

// 5. 교훈 (실시간 공감 게시판)
function LessonSection() {
  const [qrUrl, setQrUrl] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({ total_responses: 0, yes_count: 0, comments: [] as any[] });

  useEffect(() => {
    setQrUrl(`${window.location.origin}/survey`);

    const fetchData = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          fetch('/api/participants'),
          fetch('/api/survey')
        ]);
        const pData = await pRes.json();
        const sData = await sRes.json();
        setTotalUsers(pData.length);
        setStats(sData);
      } catch (e) { /* ignore */ }
    };

    fetchData();
    const t = setInterval(fetchData, 3000);
    return () => clearInterval(t);
  }, []);

  const yesRatio = stats.total_responses === 0 ? 0 : Math.round((stats.yes_count / stats.total_responses) * 100);

  return (
    <div className="anim-up" style={{ display: 'flex', gap: 24, height: '100%' }}>
      {/* 왼쪽: 통계 및 QR */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="glass-card-lg" style={{ padding: '28px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>우리의 공감대</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, wordBreak: 'keep-all', lineHeight: 1.4 }}>
            업무 기준이 모호해서<br/>헷갈렸던 적이 있나요?
          </h2>
          
          <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '16px', display: 'inline-block', margin: '0 auto 20px' }}>
            <QRCode value={qrUrl} size={140} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
          </div>
          
          <div style={{ background: 'var(--glass-hover)', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginBottom: 4 }}>
              접속자 {totalUsers}명 중 응답자 {stats.total_responses}명
            </p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', wordBreak: 'keep-all' }}>
              <span style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 900 }}>{stats.yes_count}명</span>이 '예'라고 답했습니다 ({yesRatio}%)
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽: 라이브 피드 및 결론 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
        
        {/* 결론 메시지 */}
        <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '4px solid var(--gold)' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
            우리 모두가 겪은 이 혼란은 누군가의 잘못이 아닙니다. <br/>
            <span className="text-gold">그래서 우리가 '정확한 기준정보'라는 약속을 세우려는 것입니다.</span>
          </p>
        </div>

        {/* 댓글 피드 */}
        <div className="glass-card-lg" style={{ flex: 1, padding: '24px', overflowY: 'auto', background: 'var(--glass-light)' }}>
          <p className="caption" style={{ marginBottom: 16 }}>동료들의 실제 경험담 (실시간)</p>
          
          {stats.comments.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>
              스마트폰으로 사연을 남겨주세요...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.comments.map((c: any) => (
                <div key={c.id} className="pop-in" style={{ background: 'var(--glass)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gold)' }}>{c.department}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text3)' }}>{new Date(c.created_at).toLocaleTimeString('ko-KR')}</span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                    "{c.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}