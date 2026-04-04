// src/app/survey/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SurveyPage() {
  const router = useRouter();
  const [participant, setParticipant] = useState<{ id: number; name: string; department: string } | null>(null);
  const [hasConfusion, setHasConfusion] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('systema-participant');
    if (saved) setParticipant(JSON.parse(saved));
    else router.push('/join'); // 정보가 없으면 조인 페이지로
  }, [router]);

  const handleSubmit = async () => {
    if (hasConfusion === null || !participant) return;
    
    await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        participant_id: participant.id, 
        has_confusion: hasConfusion, 
        comment: comment 
      }),
    });
    setSubmitted(true);
  };

  if (!participant) return null;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card-lg p-8 w-full max-w-sm">
          <div className="text-4xl mb-4">🙌</div>
          <h1 className="headline text-gold mb-2">제출 완료</h1>
          <p className="body-md text-text2">솔직한 의견 감사합니다.<br/>앞 화면을 주목해 주세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass-card-lg p-8 w-full max-w-sm">
        <p className="caption text-blue mb-2">{participant.department} • {participant.name}님</p>
        <h1 className="title text-text mb-6" style={{ wordBreak: 'keep-all' }}>
          업무 기준이 모호해서 확신 없이 일 처리를 하거나 헷갈렸던 적이 있나요?
        </h1>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setHasConfusion(true)}
            className={`btn flex-1 ${hasConfusion === true ? 'btn-gold' : 'btn-ghost'}`}
          >
            예, 있습니다 🙋‍♂️
          </button>
          <button 
            onClick={() => { setHasConfusion(false); setComment(''); }}
            className={`btn flex-1 ${hasConfusion === false ? 'btn-gold' : 'btn-ghost'}`}
          >
            아니오 🙅‍♀️
          </button>
        </div>

        {hasConfusion && (
          <div className="mb-6 anim-up">
            <label className="caption block mb-2">어떤 상황이었나요? (선택)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="예: 영업에서 받은 코드가 전산에 없어서 임의로 매핑해서 출고했어요..."
              className="w-full bg-glass-light border border-glass-border rounded-lg p-3 text-text outline-none focus:border-gold h-24 resize-none"
            />
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={hasConfusion === null}
          className="btn btn-gold w-full disabled:opacity-50"
        >
          의견 보내기 🚀
        </button>
      </div>
    </div>
  );
}