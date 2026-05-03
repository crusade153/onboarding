'use client';

import { useEffect, useRef } from 'react';

interface Participant { id: number; name: string; department: string; }
interface DotCanvasProps { participants: Participant[]; connected: boolean; }

const DEPT_COLORS: Record<string, string> = {
  마케팅: '#6C3BF5', 영업: '#00C9A7', 생산: '#FF3B6B', 구매: '#FF7A35',
  원가기획: '#00C9A7', 경영기획: '#6C3BF5', 물류: '#FFD600', 품질: '#FF3B6B',
  연구개발: '#818cf8', 기타: '#8A8AAF',
};

interface DotState {
  id: number; name: string; dept: string; color: string;
  x: number; y: number; tx: number; ty: number; r: number; alpha: number;
}

export default function DotCanvas({ participants, connected }: DotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<DotState[]>([]);
  const rafRef = useRef<number>(0);
  const connectedRef = useRef(connected);

  useEffect(() => {
    connectedRef.current = connected;
  }, [connected]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width || canvas.offsetWidth;
    const H = canvas.height || canvas.offsetHeight;
    const existing = new Set(dotsRef.current.map((d) => d.id));
    for (const p of participants) {
      if (!existing.has(p.id)) {
        dotsRef.current.push({
          id: p.id, name: p.name, dept: p.department,
          color: DEPT_COLORS[p.department] ?? '#8A8AAF',
          x: Math.random() * W, y: Math.random() * H,
          tx: Math.random() * W, ty: Math.random() * H,
          r: 8 + Math.random() * 6, alpha: 0,
        });
      }
    }
  }, [participants]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !connected) return;
    const W = canvas.width;
    const H = canvas.height;
    const dots = dotsRef.current;
    const n = dots.length;
    dots.forEach((dot, i) => {
      const t = n <= 1 ? 0.5 : i / (n - 1);
      dot.tx = W * 0.08 + t * W * 0.84;
      dot.ty = H / 2 + Math.sin(t * Math.PI) * -H * 0.22;
    });
  }, [connected]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx.clearRect(0, 0, W, H);

      // Light background pattern
      ctx.fillStyle = '#F4F2FF';
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = 'rgba(108,59,245,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const dots = dotsRef.current;

      for (const dot of dots) {
        dot.x += (dot.tx - dot.x) * 0.04;
        dot.y += (dot.ty - dot.y) * 0.04;
        dot.alpha = Math.min(1, dot.alpha + 0.05);
        if (!connectedRef.current) {
          dot.tx += (Math.random() - 0.5) * 2;
          dot.ty += (Math.random() - 0.5) * 2;
          dot.tx = Math.max(dot.r, Math.min(W - dot.r, dot.tx));
          dot.ty = Math.max(dot.r, Math.min(H - dot.r, dot.ty));
        }
      }

      // Connection lines
      if (connectedRef.current && dots.length > 1) {
        const sorted = [...dots].sort((a, b) => a.tx - b.tx);
        ctx.beginPath();
        ctx.moveTo(sorted[0].x, sorted[0].y);
        for (let i = 1; i < sorted.length; i++) ctx.lineTo(sorted[i].x, sorted[i].y);
        ctx.strokeStyle = 'rgba(108,59,245,0.25)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Glow
        ctx.beginPath();
        ctx.moveTo(sorted[0].x, sorted[0].y);
        for (let i = 1; i < sorted.length; i++) ctx.lineTo(sorted[i].x, sorted[i].y);
        ctx.strokeStyle = 'rgba(108,59,245,0.08)';
        ctx.lineWidth = 14;
        ctx.stroke();
      }

      // Dots
      for (const dot of dots) {
        ctx.save();
        ctx.globalAlpha = dot.alpha;

        // Shadow
        ctx.shadowColor = dot.color;
        ctx.shadowBlur = 16;

        // Outer ring
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r + 4, 0, Math.PI * 2);
        ctx.fillStyle = dot.color + '30';
        ctx.fill();

        // Main dot
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();

        // White center highlight
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(dot.x - dot.r * 0.2, dot.y - dot.r * 0.2, dot.r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();

        // Label
        if (connectedRef.current && dot.alpha > 0.7) {
          ctx.shadowBlur = 0;
          ctx.font = `600 12px 'Pretendard', system-ui`;
          ctx.fillStyle = 'var(--text)';
          ctx.textAlign = 'center';
          const metrics = ctx.measureText(dot.name);
          const pw = metrics.width + 12, ph = 22;
          const px = dot.x - pw / 2, py = dot.y - dot.r - 28;
          ctx.fillStyle = '#fff';
          ctx.shadowColor = 'rgba(0,0,0,0.1)';
          ctx.shadowBlur = 8;
          roundRect(ctx, px, py, pw, ph, 8);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#0F0F1A';
          ctx.fillText(dot.name, dot.x, dot.y - dot.r - 12);
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
