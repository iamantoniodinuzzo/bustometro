import React, { useEffect, useRef } from 'react';

// ============================================================
// ATMOSPHERIC LAYER — Gold dust + petals burst
// ============================================================

export const Atmosphere = ({ celebrate, reducedMotion }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const petalsRef = useRef([]);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = window.innerWidth;
    const h = window.innerHeight;
    particlesRef.current = Array.from({ length: 32 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.04 - Math.random() * 0.18,
      r: 0.6 + Math.random() * 1.8,
      opacity: 0.06 + Math.random() * 0.18,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let raf;
    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.025;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        const tw = (Math.sin(p.twinkle) + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 146, 79, ${p.opacity * tw})`;
        ctx.fill();
      });

      petalsRef.current = petalsRef.current.filter((p) => p.y < h + 30 && p.life > 0);
      petalsRef.current.forEach((p) => {
        p.x += p.vx + Math.sin(p.swing) * 0.6;
        p.y += p.vy;
        p.swing += 0.05;
        p.rotation += p.rotSpeed;
        p.vy += 0.018;
        p.life -= 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(p.opacity, p.life / 60);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 1.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!celebrate || reducedMotion) return;
    const w = window.innerWidth;
    const colors = [
      'rgba(184, 146, 79, 0.85)',
      'rgba(122, 31, 43, 0.7)',
      'rgba(212, 181, 132, 0.85)',
      'rgba(240, 230, 210, 0.9)',
    ];
    const burst = Array.from({ length: 48 }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: 0.5 + Math.random() * 1.5,
      swing: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.06,
      size: 2 + Math.random() * 3.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.7 + Math.random() * 0.3,
      life: 360,
    }));
    petalsRef.current.push(...burst);
  }, [celebrate, reducedMotion]);

  if (reducedMotion) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 1,
        mixBlendMode: 'multiply',
      }}
    />
  );
};
