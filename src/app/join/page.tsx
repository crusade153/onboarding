'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState<{ id: number; name: string; department: string } | null>(null);

  // 초기 로드 시 기존 참여 정보 확인
  useEffect(() => {
    const saved = localStorage.getItem('systema-participant');
    if (saved) setParticipant(JSON.parse(saved));
  }, []);

  // 나가기(세션 초기화) 함수
  const handleExit = () => {
    if (confirm('정말 나가시겠습니까? 등록 정보가 삭제됩니다.')) {
      localStorage.removeItem('systema-participant');
      setParticipant(null);
      setName('');
      setDepartment('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department) return;

    setLoading(true);
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, department }),
      });
      const data = await res.json();
      localStorage.setItem('systema-participant', JSON.stringify(data));
      setParticipant(data);
    } catch (err) {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 등록 완료 후 화면
  if (participant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card-lg p-8 w-full max-w-sm">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="headline text-gold mb-2">등록 완료!</h1>
          <p className="body-md text-text2 mb-6">
            <span className="text-text font-bold">{participant.name}</span>님,<br />
            준비가 완료되었습니다. 화면을 주시해 주세요.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-glass-light rounded-lg border border-glass-border">
              <p className="caption mb-1">소속 부서</p>
              <p className="text-text font-bold">{participant.department}</p>
            </div>

            {/* 나가기 버튼 추가 */}
            <button 
              onClick={handleExit}
              className="btn btn-ghost w-full"
              style={{ color: 'var(--red)', borderColor: 'var(--red-dim)' }}
            >
              세션 나가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 초기 등록 화면
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass-card-lg p-8 w-full max-w-sm">
        <h1 className="headline text-gold mb-2">참여하기</h1>
        <p className="body-md text-text2 mb-8">성함과 부서를 입력하여<br />가치 사슬에 연결되세요.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="caption block mb-2">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-glass-light border border-glass-border rounded-lg p-3 text-text outline-none focus:border-gold"
              placeholder="홍길동"
              required
            />
          </div>
          <div>
            <label className="caption block mb-2">부서</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-glass-light border border-glass-border rounded-lg p-3 text-text outline-none focus:border-gold"
              required
            >
              <option value="">부서 선택</option>
              <option value="마케팅">마케팅</option>
              <option value="영업">영업</option>
              <option value="생산">생산</option>
              <option value="구매">구매</option>
              <option value="원가기획">원가기획</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold w-full"
          >
            {loading ? '연결 중...' : '시스템 연결 ✦'}
          </button>
        </form>
      </div>
    </div>
  );
}