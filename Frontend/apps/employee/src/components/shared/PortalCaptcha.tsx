import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface PortalCaptchaProps {
  onCaptchaChange: (code: string) => void;
}

export const PortalCaptcha: React.FC<PortalCaptchaProps> = ({ onCaptchaChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captchaText, setCaptchaText] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(code);
    onCaptchaChange(code);
    renderCanvas(code);
  };

  const renderCanvas = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise background lines
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = `rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2})`;
      ctx.lineWidth = 1 + Math.random();
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Render characters
    ctx.font = 'bold 22px sans-serif';
    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 18 + i * 22;
      const y = 30 + (Math.random() - 0.5) * 6;
      const angle = (Math.random() - 0.5) * 0.4;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = i % 2 === 0 ? '#818cf8' : '#38bdf8';
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="relative rounded-lg overflow-hidden border border-slate-700 shadow-inner">
        <canvas ref={canvasRef} width={150} height={42} className="block cursor-pointer" onClick={generateCaptcha} />
      </div>
      <button
        type="button"
        onClick={generateCaptcha}
        title="Refresh Captcha"
        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
};
