'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';

const EPILOGUE_ITEMS = [
  {
    title: "우리의 기준정보는 안녕한가요?",
    content: "시스템의 데이터는 단순한 입력값이 아닙니다. 그것은 부서와 부서를 잇는 언어이며, 전체 공정을 움직이는 설계도입니다. 오늘 우리가 입력한 데이터가 내일의 6,000만 원을 지켜냅니다."
  },
  {
    title: "지속 가능한 가치사슬을 위하여",
    content: "디지털 전환(DX)의 핵심은 기술보다 '데이터의 무결성'에 있습니다. 현장의 경험이 정확한 기준정보로 기록될 때, 우리의 시스템은 비로소 살아 움직이는 유기체가 됩니다."
  }
];

export default function EpiloguePage() {
  // 초기값을 null로 설정하여 모든 아코디언이 닫힌 채로 시작하게 합니다.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <NavBar current="Epilogue" step="04/04" />
      
      <main className="container-sm py-20">
        <div className="text-center mb-16">
          <h1 className="display text-gold mb-4">SYSTEM</h1>
          <p className="text-xl text-secondary">연결의 가치, 그 이상의 미래</p>
        </div>

        <div className="space-y-4">
          {EPILOGUE_ITEMS.map((item, idx) => (
            <div key={idx} className="glass-card overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-bold">{item.title}</span>
                <span className={`text-gold transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-8 pb-8 text-secondary leading-relaxed border-t border-white/10 pt-6">
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}