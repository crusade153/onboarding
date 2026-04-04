// src/app/survey/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Participant { id: number; name: string; department: string; }

export default function SurveyPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedPid, setSelectedPid] = useState<number | ''>('');
  const [hasConfusion, setHasConfusion] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. 서버에서 현재 접속 중인 전체 참석자 목록을 가져옵니다.
    fetch('/api/participants')
      .then(r => r.json())
      .then(data => setParticipants(data));

    // 2. 만약 내 폰으로 등록한 이력이 있다면 자동으로 내 이름을 찾아줍니다.
    const saved = localStorage.getItem('systema-participant');
    if (saved) {
      const p = JSON.parse(saved);
      setSelectedPid(p.id);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedPid || hasConfusion === null) return;
    setLoading(true);
    
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          participant_id: Number(selectedPid), 
          has_confusion: hasConfusion, 
          comment: comment 
        }),
      });
      setSubmitted(true);
    } catch (e) {
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 제출 완료 화면
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card-lg p-8 w-full max-w-sm">
          <div className="text-4xl mb-4">🙌</div>
          <h1 className="headline text-gold mb-2">작성 완료!</h1>
          <p className="body-md text-text2">소중한 경험담이 등록되었습니다.<br/>앞쪽 강연 화면을 확인해 주세요!</p>
        </div>
      </div>
    );
  }

  // 설문 작성 화면
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass-card-lg p-8 w-full max-w-sm">
        <h1 className="title text-text mb-6" style={{ wordBreak: 'keep-all' }}>
          공감 & 교훈 📝
        </h1>

        {/* 1. 본인 선택 드롭다운 */}
        <div className="mb-6 text-left">
          <label className="caption block mb-2 text-gold">1. 본인을 선택해주세요</label>
          <select
            value={selectedPid}
            onChange={(e) => setSelectedPid(Number(e.target.value))}
            className="w-full bg-glass-light border border-glass-border rounded-lg p-3 text-text outline-none focus:border-gold"
          >
            <option value="">소속과 이름을 선택하세요</option>
            {participants.map(p => (
              <option key={p.id} value={p.id}>[{p.department}] {p.name}</option>
            ))}
          </select>
        </div>

        {/* 2. 질문 선택 */}
        <div className="mb-6 text-left">
          <label className="caption block mb-2 text-gold">2. 업무 기준이 모호해서 헷갈렸던 적이 있나요?</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setHasConfusion(true)}
              className={`btn flex-1 ${hasConfusion === true ? 'btn-gold' : 'btn-ghost'}`}
              style={{ padding: '12px' }}
            >
              네, 있어요 🙋‍♂️
            </button>
            <button 
              onClick={() => { setHasConfusion(false); setComment(''); }}
              className={`btn flex-1 ${hasConfusion === false ? 'btn-gold' : 'btn-ghost'}`}
              style={{ padding: '12px' }}
            >
              아니오 🙅‍♀️
            </button>
          </div>
        </div>

        {/* 3. 코멘트 작성 (네, 있어요를 누른 경우만 표시) */}
        {hasConfusion && (
          <div className="mb-6 anim-up text-left">
            <label className="caption block mb-2 text-gold">3. 어떤 상황이었나요? (자유롭게 작성)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="예: 발주 단위가 박스인지 팩인지 헷갈려서 임의로 처리했어요..."
              className="w-full bg-glass-light border border-glass-border rounded-lg p-3 text-text outline-none focus:border-gold h-24 resize-none"
            />
          </div>
        )}

        {/* 제출 버튼 */}
        <button 
          onClick={handleSubmit} 
          disabled={loading || selectedPid === '' || hasConfusion === null}
          className="btn btn-gold w-full disabled:opacity-50"
        >
          {loading ? '전송 중...' : '게시판에 올리기 🚀'}
        </button>
      </div>
    </div>
  );
}