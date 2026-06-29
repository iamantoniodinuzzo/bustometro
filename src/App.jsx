import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Analytics } from "@vercel/analytics/react"
import * as THREE from 'three';
import { Users, Baby, Utensils, Sparkles, ExternalLink, RefreshCw, BookOpen, Crown, Github, Code2, Link2, Check } from 'lucide-react';

// ============================================================
// HOOKS
// ============================================================

const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(target);
  const previousRef = useRef(target);

  useEffect(() => {
    const start = previousRef.current;
    const startTime = performance.now();
    let raf;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      setCount(current);
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        previousRef.current = target;
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return count;
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
};

// Mappa coefficiente parentela → categoria stats
const mapParentela = (coeff) => {
  if (coeff === 2.0) return 'genitori';
  if (coeff === 1.5) return 'fratelli';
  if (coeff === 1.2) return 'cugini';
  return 'amici';
};

const useStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.available) setStats(data);
      })
      .catch(() => { /* degradation: stats resta null */ });
  }, []);

  return stats;
};

// ============================================================
// ATMOSPHERIC LAYER — Gold dust + petals burst
// ============================================================

const Atmosphere = ({ celebrate, reducedMotion }) => {
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

// ============================================================
// 3D ENVELOPE — Three.js
// ============================================================

const Envelope3D = ({ isOpen, reducedMotion }) => {
  const mountRef = useRef(null);
  const flapTargetRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff4e0, 0.55));
    const key = new THREE.DirectionalLight(0xffe8c2, 1.0);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xf5e6d3, 0.35);
    fill.position.set(-3, -1, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xb8924f, 0.25);
    rim.position.set(0, 2, -3);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    const bodyGeom = new THREE.BoxGeometry(2.4, 1.6, 0.08);
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d2, roughness: 0.88, metalness: 0.02 });
    group.add(new THREE.Mesh(bodyGeom, paperMat));

    const innerGeom = new THREE.PlaneGeometry(2.3, 1.5);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xe8d9bd, roughness: 0.92 });
    const inner = new THREE.Mesh(innerGeom, innerMat);
    inner.position.set(0, 0, 0.041);
    group.add(inner);

    const sealGeom = new THREE.CylinderGeometry(0.17, 0.17, 0.05, 48);
    const sealMat = new THREE.MeshStandardMaterial({ color: 0x7a1f2b, roughness: 0.35, metalness: 0.18 });
    const seal = new THREE.Mesh(sealGeom, sealMat);
    seal.rotation.x = Math.PI / 2;
    seal.position.set(0, -0.08, 0.075);
    group.add(seal);

    const embossGeom = new THREE.TorusGeometry(0.075, 0.013, 10, 32);
    const embossMat = new THREE.MeshStandardMaterial({ color: 0xb8924f, roughness: 0.35, metalness: 0.5 });
    const emboss = new THREE.Mesh(embossGeom, embossMat);
    emboss.position.set(0, -0.08, 0.105);
    group.add(emboss);

    const dotGeom = new THREE.SphereGeometry(0.018, 16, 16);
    const dot = new THREE.Mesh(dotGeom, embossMat);
    dot.position.set(0, -0.08, 0.108);
    group.add(dot);

    const flapShape = new THREE.Shape();
    flapShape.moveTo(-1.21, 0);
    flapShape.lineTo(1.21, 0);
    flapShape.lineTo(0, -0.92);
    flapShape.lineTo(-1.21, 0);
    const flapGeom = new THREE.ShapeGeometry(flapShape);
    const flapMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc6, roughness: 0.85, side: THREE.DoubleSide });
    const flap = new THREE.Mesh(flapGeom, flapMat);
    flap.position.set(0, 0.8, 0.055);
    group.add(flap);

    group.rotation.x = -0.04;
    const target = { x: -0.04, y: 0 };
    const current = { x: -0.04, y: 0 };
    let flapCurrent = 0;

    const handlePointer = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      target.y = ((x / window.innerWidth) * 2 - 1) * 0.28;
      target.x = (-((y / window.innerHeight) * 2 - 1)) * 0.18 - 0.04;
    };
    window.addEventListener('mousemove', handlePointer);
    window.addEventListener('touchmove', handlePointer, { passive: true });

    let raf;
    let t = 0;
    const animate = () => {
      t += 0.008;
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      group.rotation.x = current.x + Math.sin(t * 0.7) * 0.018;
      group.rotation.y = current.y + Math.sin(t * 0.5) * 0.022;
      group.position.y = Math.sin(t * 0.6) * 0.045;

      flapCurrent += (flapTargetRef.current - flapCurrent) * 0.07;
      flap.rotation.x = flapCurrent;

      const openAmt = -flapCurrent / 2.0;
      emboss.scale.setScalar(1 + openAmt * 0.15 + Math.sin(t * 2) * 0.02 * openAmt);
      dot.scale.setScalar(1 + openAmt * 0.3);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handlePointer);
      window.removeEventListener('touchmove', handlePointer);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      [bodyGeom, innerGeom, sealGeom, embossGeom, flapGeom, dotGeom].forEach((g) => g.dispose());
      [paperMat, innerMat, sealMat, embossMat, flapMat].forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [reducedMotion]);

  useEffect(() => {
    flapTargetRef.current = isOpen ? -2.0 : 0;
  }, [isOpen]);

  if (reducedMotion) {
    return (
      <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', opacity: 0.6 }}>
        ✉️
      </div>
    );
  }

  return <div ref={mountRef} style={{ width: '100%', height: '240px', cursor: 'grab' }} />;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const Bustometro = () => {
  const [parentela, setParentela] = useState(null);
  const [adulti, setAdulti] = useState(1);
  const [bambini, setBambini] = useState(0);
  const [costoCoperto, setCostoCoperto] = useState(80);
  const [figura, setFigura] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [nomineSposi, setNomineSposi] = useState('');
  const [cardFormat, setCardFormat] = useState('story');
  const [cardCopied, setCardCopied] = useState(false);
  const [testimone, setTestimone] = useState(false);
  const [suocera, setSuocera] = useState(false);
  const [regione, setRegione] = useState('centro');
  const reducedMotion = usePrefersReducedMotion();
  const stats = useStats();
  const [sweepKey, setSweepKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = parseFloat(params.get('p'));
    const i = parseInt(params.get('i'), 10);
    const b = parseInt(params.get('b'), 10);
    const cv = parseFloat(params.get('c'));
    const d = parseFloat(params.get('d'));
    const validParentele = [2.0, 1.5, 1.2, 1.0];
    const validFigure = [1.5, 1.3, 1.2, 1.0];
    if (validParentele.includes(p)) setParentela(p);
    if (Number.isFinite(i) && i >= 1 && i <= 10) setAdulti(i);
    if (Number.isFinite(b) && b >= 0 && b <= 10) setBambini(b);
    if (Number.isFinite(cv) && cv >= 30 && cv <= 200) setCostoCoperto(cv);
    if (validFigure.includes(d)) setFigura(d);
    if (params.get('t') === '1') setTestimone(true);
    if (params.get('s') === '1') setSuocera(true);
    const r = params.get('r');
    if (['nord', 'centro', 'sud'].includes(r)) setRegione(r);
  }, []);

  const VERSION = '1.6.0';

  const parentele = [
    { value: 2.0, label: 'Genitore', sublabel: 'Mamma o papà', icon: '👨‍👩‍👧' },
    { value: 1.5, label: 'Fratello / Sorella', sublabel: 'Stesso sangue', icon: '🫂' },
    { value: 1.2, label: 'Cugino', sublabel: 'Famiglia allargata', icon: '🌿' },
    { value: 1.0, label: 'Amico', sublabel: 'O collega', icon: '🤝' },
  ];

  const figure = [
    { value: 1.5, label: 'Massimo', subnap: '«Squarcione»', emoji: '😎', desc: 'Spendere senza pensieri' },
    { value: 1.3, label: 'Medio', subnap: '«Ngannaruto»', emoji: '🙂', desc: 'Generoso ma con misura' },
    { value: 1.2, label: 'Sufficiente', subnap: '«Bella figura»', emoji: '🤏', desc: 'Dignitoso, niente di più' },
    { value: 1.0, label: 'Normale', subnap: '«Standard»', emoji: '😐', desc: 'Né troppo né troppo poco' },
  ];

  const regioni = [
    { id: 'nord',   label: 'Nord',   emoji: '🏔️', coperto: 70, figura: 1.0  },
    { id: 'centro', label: 'Centro', emoji: '🏛️', coperto: 80, figura: null },
    { id: 'sud',    label: 'Sud',    emoji: '🌋', coperto: 90, figura: 1.2  },
  ];

  const presetCoperto = [50, 80, 120, 160];
  const isComplete = parentela !== null && figura !== null;
  const calcolo = isComplete ? (bambini / 2 + adulti) * (costoCoperto * 1.3) * parentela * figura * (testimone ? 1.3 : 1) : 0;
  const arrotondato = Math.round(calcolo / 10) * 10;
  const rangeMin = Math.round((arrotondato * 0.9) / 10) * 10;
  const rangeMax = Math.round((arrotondato * 1.1) / 10) * 10;
  const displayedAmount = useCountUp(isComplete ? arrotondato : 0, 1100);

  // Bump sweepKey dopo il count-up: fa rimontare l'overlay gold sweep
  useEffect(() => {
    if (!isComplete) return;
    const t = setTimeout(() => setSweepKey((k) => k + 1), 1150);
    return () => clearTimeout(t);
  }, [isComplete, arrotondato]);

  const easterEggMessage = useMemo(() => {
    if (!isComplete) return null;
    if (parentela === 2.0 && figura === 1.5 && adulti >= 3)
      return 'Gli sposi ti vogliono come padrino di battesimo del primo figlio.';
    if (arrotondato > 800)
      return 'A questo punto compragli anche la casa.';
    if (parentela === 1.0 && figura === 1.0 && adulti === 1 && bambini === 0 && costoCoperto <= 50)
      return 'Vabbè dai, almeno gli auguri sinceri 💀';
    return null;
  }, [isComplete, parentela, figura, adulti, bambini, costoCoperto, arrotondato]);

  // Incremento stats anonimo — una sola volta per sessione, debounce 2s
  useEffect(() => {
    if (!isComplete) return;
    const timer = setTimeout(() => {
      if (sessionStorage.getItem('bm_stat_sent')) return;
      sessionStorage.setItem('bm_stat_sent', '1');
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: mapParentela(parentela), amount: arrotondato }),
      }).catch(() => { /* silenzioso */ });
    }, 2000);
    return () => clearTimeout(timer);
  }, [isComplete, parentela, arrotondato]);

  const selectRegione = (id) => {
    const cfg = regioni.find((r) => r.id === id);
    setRegione(id);
    setCostoCoperto(cfg.coperto);
    setFigura(cfg.figura);
  };

  const reset = () => {
    setParentela(null);
    setAdulti(1);
    setBambini(0);
    setCostoCoperto(80);
    setFigura(null);
    setRegione('centro');
    setShowBreakdown(false);
    setTestimone(false);
    setSuocera(false);
    window.history.replaceState(null, '', window.location.pathname);
  };

  const buildShareUrl = () => {
    const obj = { p: parentela, i: adulti, b: bambini, c: costoCoperto, d: figura, r: regione };
    if (testimone) obj.t = '1';
    if (suocera) obj.s = '1';
    const params = new URLSearchParams(obj);
    return `${window.location.origin}${window.location.pathname}?${params}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* clipboard non disponibile, ignora */
    }
  };

  const generateCard = async (format) => {
    await document.fonts.ready;
    const isStory = format === 'story';
    const W = 1080;
    const H = isStory ? 1920 : 1080;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const BG = '#F5EFE4';
    const INK = '#2B1810';
    const BURGUNDY = '#7A1F2B';
    const GOLD = '#B8924F';
    const GOLD_SOFT = '#D4B584';
    const INK_SOFT = '#6B5B4F';
    const BORDER = '#D8CDB8';

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    const M = 56;
    ctx.strokeStyle = BORDER;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(M, M, W - M * 2, H - M * 2);

    const CL = 44;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 3;
    [[M, M + CL, M, M, M + CL, M], [W - M - CL, M, W - M, M, W - M, M + CL],
     [M, H - M - CL, M, H - M, M + CL, H - M], [W - M - CL, H - M, W - M, H - M, W - M, H - M - CL]]
      .forEach(([x1, y1, x2, y2, x3, y3]) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.stroke();
      });

    const CX = W / 2;
    const nomeText = nomineSposi.trim();
    const amountStr = `€${arrotondato}`;
    const rangeStr = `€${rangeMin} — €${rangeMax}`;

    if (isStory) {
      let Y = H * 0.15;
      ctx.fillStyle = GOLD;
      ctx.font = '500 38px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BUSTOMETRO', CX, Y);
      Y += 50;
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(CX - 100, Y); ctx.lineTo(CX + 100, Y); ctx.stroke();
      Y += 90;
      if (nomeText) {
        ctx.fillStyle = INK;
        ctx.font = 'italic 400 58px "Fraunces", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(nomeText, CX, Y);
        Y += 90;
      }
      ctx.fillStyle = INK_SOFT;
      ctx.font = '300 30px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LA TUA BUSTA', CX, Y);
      Y += 60;
      if (testimone) {
        ctx.fillStyle = BURGUNDY;
        ctx.font = 'italic 500 36px "Fraunces", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('💍 Testimone', CX, Y);
        Y += 50;
      }
      Y += 40;
      ctx.fillStyle = BURGUNDY;
      const amtSize = arrotondato >= 10000 ? 200 : arrotondato >= 1000 ? 250 : 300;
      ctx.font = `700 ${amtSize}px "Fraunces", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.fillText(amountStr, CX, Y + amtSize * 0.85);
      Y += amtSize + 40;
      ctx.fillStyle = GOLD_SOFT;
      ctx.font = 'italic 400 54px "Fraunces", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(rangeStr, CX, Y);
      Y += 60;
      ctx.fillStyle = INK_SOFT;
      ctx.font = '300 28px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('range consigliato', CX, Y);
      ctx.fillStyle = GOLD;
      ctx.font = '400 34px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('bustometro.vercel.app', CX, H - 170);
      if (suocera) {
        ctx.fillStyle = GOLD_SOFT;
        ctx.font = 'italic 300 26px "DM Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👁️ Tua suocera lo sa', CX, H - 200);
      }
      ctx.fillStyle = INK_SOFT;
      ctx.font = '300 26px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('by Indisparte', CX, H - 120);
    } else {
      let Y = H * 0.15;
      ctx.fillStyle = GOLD;
      ctx.font = '500 32px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BUSTOMETRO', CX, Y);
      Y += 44;
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(CX - 80, Y); ctx.lineTo(CX + 80, Y); ctx.stroke();
      Y += 70;
      if (nomeText) {
        ctx.fillStyle = INK;
        ctx.font = 'italic 400 46px "Fraunces", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(nomeText, CX, Y);
        Y += 70;
      }
      ctx.fillStyle = INK_SOFT;
      ctx.font = '300 26px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LA TUA BUSTA', CX, Y);
      Y += 44;
      if (testimone) {
        ctx.fillStyle = BURGUNDY;
        ctx.font = 'italic 500 30px "Fraunces", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('💍 Testimone', CX, Y);
        Y += 40;
      }
      Y += 36;
      ctx.fillStyle = BURGUNDY;
      const amtSize = arrotondato >= 10000 ? 160 : arrotondato >= 1000 ? 200 : 230;
      ctx.font = `700 ${amtSize}px "Fraunces", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.fillText(amountStr, CX, Y + amtSize * 0.85);
      Y += amtSize + 40;
      ctx.fillStyle = GOLD_SOFT;
      ctx.font = 'italic 400 44px "Fraunces", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(rangeStr, CX, Y);
      Y += 52;
      ctx.fillStyle = INK_SOFT;
      ctx.font = '300 24px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('range consigliato', CX, Y);
      ctx.fillStyle = GOLD;
      ctx.font = '400 28px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('bustometro.vercel.app', CX, H - 140);
      if (suocera) {
        ctx.fillStyle = GOLD_SOFT;
        ctx.font = 'italic 300 22px "DM Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👁️ Tua suocera lo sa', CX, H - 166);
      }
      ctx.fillStyle = INK_SOFT;
      ctx.font = '300 22px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('by Indisparte', CX, H - 96);
    }

    return canvas;
  };

  const downloadCard = async (format) => {
    const canvas = await generateCard(format);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bustometro-${format}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`💌 Bustometro dice €${arrotondato} in busta!\n${buildShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyCard = async (format) => {
    try {
      const canvas = await generateCard(format);
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCardCopied(true);
          setTimeout(() => setCardCopied(false), 2000);
        } catch {
          /* Clipboard API immagini non supportata */
        }
      }, 'image/png');
    } catch { /* ignora */ }
  };

  const nativeShare = async (format) => {
    try {
      const canvas = await generateCard(format);
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `bustometro-${format}.png`, { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Bustometro', text: `La mia busta: €${arrotondato} 💌` });
        }
      }, 'image/png');
    } catch { /* ignora */ }
  };

  const c = {
    bg: '#F5EFE4', bgAlt: '#EBE3D2', card: '#FBF8F1',
    ink: '#2B1810', inkSoft: '#6B5B4F',
    burgundy: '#7A1F2B', gold: '#B8924F', goldSoft: '#D4B584', goldFocus: '#9A7634',
    border: '#D8CDB8',
  };

  const stepper = (val, setter, min, max) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button className="stepper-btn" disabled={val <= min} onClick={() => setter(Math.max(min, val - 1))} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: c.bgAlt, color: c.ink, border: `1px solid ${c.border}`, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: val <= min ? 0.35 : 1, cursor: val <= min ? 'default' : 'pointer', transition: 'opacity .15s, transform .1s' }}>−</button>
      <span className="display-font" style={{ fontSize: '24px', width: '32px', textAlign: 'center', color: c.ink, display: 'inline-block' }}>{val}</span>
      <button className="stepper-btn" disabled={val >= max} onClick={() => setter(Math.min(max, val + 1))} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: c.bgAlt, color: c.ink, border: `1px solid ${c.border}`, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: val >= max ? 0.35 : 1, cursor: val >= max ? 'default' : 'pointer', transition: 'opacity .15s, transform .1s' }}>+</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: c.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: c.ink, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .display-font { font-family: 'Fraunces', Georgia, serif; font-feature-settings: "ss01" 1, "ss02" 1; }
        .number-display { font-family: 'Fraunces', Georgia, serif; font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes drawLine { from { width:0; opacity:0; } to { width:6rem; opacity:1; } }
        @keyframes stampIn { 0%{transform:scale(1)} 40%{transform:scale(1.045) rotate(-0.6deg)} 70%{transform:scale(0.99)} 100%{transform:scale(1)} }
        @keyframes shimmer { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes envelopeRise { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes numberSweep { from { background-position: 120% center; } to { background-position: -120% center; } }
        .number-sweep { position:absolute; inset:0; pointer-events:none; display:flex; align-items:center; justify-content:center; background:linear-gradient(105deg,transparent 38%,rgba(212,181,132,.7) 50%,transparent 62%) no-repeat; background-size:240% auto; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:transparent; animation:numberSweep .9s cubic-bezier(.16,1,.3,1) both; }
        .reveal-1{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .15s both}
        .reveal-2{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .30s both}
        .reveal-3{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .45s both}
        .reveal-4{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .60s both}
        .reveal-5{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .75s both}
        .envelope-container{animation:envelopeRise .9s cubic-bezier(.16,1,.3,1) both}
        .deco-line{animation:drawLine 1.2s cubic-bezier(.16,1,.3,1) .5s both}
        .shimmer-text{animation:shimmer 2.4s ease-in-out infinite}
        .step-card{transition:background-color .3s,border-color .3s,color .3s,box-shadow .3s,transform .2s}
        .step-card:hover{transform:translateY(-2px)}
        .step-card:active{transform:scale(.99)}
        .stamped{animation:stampIn .45s cubic-bezier(.34,1.56,.64,1)}
        .grain{background-image:radial-gradient(${c.inkSoft} .5px,transparent .5px);background-size:3px 3px;opacity:.025;pointer-events:none;position:fixed;inset:0;z-index:2}
        input[type="range"]::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:${c.burgundy};cursor:pointer;box-shadow:0 2px 6px rgba(122,31,43,.3);transition:width .1s,height .1s,box-shadow .1s}
        input[type="range"]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:${c.burgundy};cursor:pointer;border:none}
        input[type="range"]::-webkit-slider-thumb:active{width:22px;height:22px;box-shadow:0 0 0 4px rgba(122,31,43,.18)}
        input[type="range"]::-moz-range-thumb:active{width:22px;height:22px;box-shadow:0 0 0 4px rgba(122,31,43,.18)}
        .stepper-btn:not(:disabled):active{transform:scale(.88)}
        .stepper-btn:not(:disabled):hover{background-color:${c.border}}
        .pill-btn:active{transform:scale(.94)}
        button:focus-visible,input:focus-visible,a:focus-visible{outline:2px solid ${c.goldFocus};outline-offset:3px;border-radius:4px}
        input[type="range"]:focus-visible{outline:none;box-shadow:0 0 0 2px ${c.goldFocus}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
      `}</style>

      <Atmosphere celebrate={isComplete} reducedMotion={reducedMotion} />
      <div className="grain" />

      <div style={{ position: 'relative', zIndex: 3, maxWidth: '640px', margin: '0 auto', padding: '32px 20px 48px' }}>

        {/* 3D ENVELOPE */}
        <div className="envelope-container" style={{ marginBottom: '12px' }}>
          <Envelope3D isOpen={isComplete} reducedMotion={reducedMotion} />
        </div>

        {/* HEADER */}
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <span className="shimmer-text" style={{ color: c.gold, fontSize: '11px', letterSpacing: '0.4em' }}>✦ ✦ ✦</span>
          </div>
          <div className="reveal-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', marginBottom: stats?.total ? '8px' : '16px', backgroundColor: c.bgAlt, color: c.inkSoft, fontSize: '11px', letterSpacing: '0.1em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.burgundy, display: 'inline-block' }} />
            BUSTOMETRO · v{VERSION}
          </div>
          {stats?.total > 0 && (
            <div className="reveal-1" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: c.inkSoft, letterSpacing: '0.08em' }}>
                <span style={{ color: c.gold }}>✦</span>{' '}
                {stats.total.toLocaleString('it-IT')} buste calcolate questo mese
              </span>
            </div>
          )}
          <h1 className="display-font reveal-2" style={{ color: c.ink, fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 400, lineHeight: '0.95', margin: '0 0 12px', fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>
            Quanto metto<br />
            <em style={{ color: c.burgundy, fontStyle: 'italic', fontWeight: 300 }}>in busta?</em>
          </h1>
          <div className="deco-line" style={{ height: '1px', margin: '20px auto', background: `linear-gradient(to right, transparent, ${c.gold}, transparent)` }} />
          <p className="reveal-3" style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6, color: c.inkSoft }}>
            La formula napoletana per non fare brutta figura agli sposi.
            Compilala e scopri la cifra giusta.
          </p>
        </header>

        {/* STEP i – Parentela */}
        <section className="reveal-3" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
            <span className="display-font" style={{ color: c.gold, fontStyle: 'italic', fontSize: '24px' }}>i.</span>
            <h2 className="display-font" style={{ color: c.ink, fontSize: '22px', margin: 0 }}>Per chi è la busta?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {parentele.map((p) => {
              const sel = parentela === p.value;
              return (
                <button key={p.value} onClick={() => setParentela(p.value)}
                  className={`step-card${sel ? ' stamped' : ''}`}
                  style={{ padding: '16px', borderRadius: '8px', textAlign: 'left', backgroundColor: sel ? c.burgundy : c.card, border: `1px solid ${sel ? c.burgundy : c.border}`, color: sel ? '#FFFCF5' : c.ink, boxShadow: sel ? '0 6px 18px rgba(122,31,43,.18)' : 'none', cursor: 'pointer' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{p.icon}</div>
                  <div className="display-font" style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.2 }}>{p.label}</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: sel ? c.goldSoft : c.inkSoft }}>
                    {p.sublabel} · ×{p.value}
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => setTestimone(!testimone)}
            className={`step-card${testimone ? ' stamped' : ''}`}
            style={{ marginTop: '12px', width: '100%', padding: '14px 16px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: testimone ? c.burgundy : c.card, border: `1px solid ${testimone ? c.burgundy : c.border}`, color: testimone ? '#FFFCF5' : c.ink, boxShadow: testimone ? '0 6px 18px rgba(122,31,43,.18)' : 'none', cursor: 'pointer' }}>
            <div>
              <div className="display-font" style={{ fontSize: '14px', fontWeight: 500 }}>Testimone 💍</div>
              <div style={{ fontSize: '11px', marginTop: '2px', color: testimone ? c.goldSoft : c.inkSoft }}>Hai detto sì. Anche al portafogli.</div>
            </div>
            <div className="display-font" style={{ fontSize: '13px', color: testimone ? c.goldSoft : c.inkSoft }}>×1.3</div>
          </button>
        </section>

        {/* STEP ii – Partecipanti */}
        <section className="reveal-4" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
            <span className="display-font" style={{ color: c.gold, fontStyle: 'italic', fontSize: '24px' }}>ii.</span>
            <h2 className="display-font" style={{ color: c.ink, fontSize: '22px', margin: 0 }}>Chi partecipa?</h2>
          </div>

          {/* Selettore regionale */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {regioni.map((reg) => {
                const sel = regione === reg.id;
                return (
                  <button key={reg.id} className="pill-btn" onClick={() => selectRegione(reg.id)} style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '13px', backgroundColor: sel ? c.gold : 'transparent', color: sel ? c.ink : c.inkSoft, border: `1px solid ${sel ? c.gold : c.border}`, fontWeight: sel ? 600 : 400, cursor: 'pointer', transition: 'all .2s' }}>
                    {reg.emoji} {reg.label}
                  </button>
                );
              })}
            </div>
            <div className="display-font" style={{ fontSize: '12px', fontStyle: 'italic', color: c.inkSoft }}>
              <Sparkles size={12} style={{ display: 'inline', marginBottom: '-2px', marginRight: '4px', color: c.gold }} />
              <em>Le aspettative variano. Come i cognati.</em>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: <Users size={18} style={{ color: c.burgundy }} />, label: 'Adulti', sub: 'Te incluso', val: adulti, setter: setAdulti, min: 1, max: 10 },
              { icon: <Baby size={18} style={{ color: c.burgundy }} />, label: 'Bambini', sub: 'Contano la metà', val: bambini, setter: setBambini, min: 0, max: 10 },
            ].map((row) => (
              <div key={row.label} style={{ padding: '16px', borderRadius: '8px', backgroundColor: c.card, border: `1px solid ${c.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {row.icon}
                    <div>
                      <div className="display-font" style={{ fontWeight: 500 }}>{row.label}</div>
                      <div style={{ fontSize: '11px', color: c.inkSoft }}>{row.sub}</div>
                    </div>
                  </div>
                  {stepper(row.val, row.setter, row.min, row.max)}
                </div>
              </div>
            ))}
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: c.card, border: `1px solid ${c.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Utensils size={18} style={{ color: c.burgundy }} />
                  <div>
                    <div className="display-font" style={{ fontWeight: 500 }}>Costo coperto</div>
                    <div style={{ fontSize: '11px', color: c.inkSoft }}>Stima a persona</div>
                  </div>
                </div>
                <div className="display-font" style={{ fontSize: '24px', color: c.ink }}>€{costoCoperto}</div>
              </div>
              <input type="range" min="30" max="200" step="5" value={costoCoperto} onChange={(e) => setCostoCoperto(Number(e.target.value))} style={{ width: '100%', marginBottom: '12px', accentColor: c.burgundy }} />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {presetCoperto.map((p) => {
                  const sel = costoCoperto === p;
                  return (
                    <button key={p} className="pill-btn" onClick={() => setCostoCoperto(p)} style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', backgroundColor: sel ? c.gold : 'transparent', color: sel ? c.ink : c.inkSoft, border: `1px solid ${sel ? c.gold : c.border}`, fontWeight: sel ? 500 : 400, cursor: 'pointer', transition: 'all .2s' }}>
                      €{p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* STEP iii – Figura */}
        <section className="reveal-5" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
            <span className="display-font" style={{ color: c.gold, fontStyle: 'italic', fontSize: '24px' }}>iii.</span>
            <h2 className="display-font" style={{ color: c.ink, fontSize: '22px', margin: 0 }}>Che figura vuoi fare?</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {figure.map((f) => {
              const sel = figura === f.value;
              return (
                <button key={f.value} onClick={() => setFigura(f.value)}
                  className={`step-card${sel ? ' stamped' : ''}`}
                  style={{ width: '100%', padding: '16px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: sel ? c.burgundy : c.card, border: `1px solid ${sel ? c.burgundy : c.border}`, color: sel ? '#FFFCF5' : c.ink, boxShadow: sel ? '0 6px 18px rgba(122,31,43,.18)' : 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: '24px' }}>{f.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="display-font" style={{ fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {f.label}
                      <span style={{ fontSize: '11px', fontStyle: 'italic', color: sel ? c.goldSoft : c.gold, fontWeight: 300 }}>{f.subnap}</span>
                    </div>
                    <div style={{ fontSize: '11px', marginTop: '2px', color: sel ? '#FFFCF5' : c.inkSoft, opacity: 0.85 }}>{f.desc}</div>
                  </div>
                  <div className="display-font" style={{ fontSize: '13px', color: sel ? c.goldSoft : c.inkSoft }}>×{f.value}</div>
                </button>
              );
            })}
          </div>
          <button onClick={() => setSuocera(!suocera)}
            className={`step-card${suocera ? ' stamped' : ''}`}
            style={{ marginTop: '12px', width: '100%', padding: '14px 16px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: suocera ? c.burgundy : c.card, border: `1px solid ${suocera ? c.burgundy : c.border}`, color: suocera ? '#FFFCF5' : c.ink, boxShadow: suocera ? '0 6px 18px rgba(122,31,43,.18)' : 'none', cursor: 'pointer' }}>
            <div>
              <div className="display-font" style={{ fontSize: '14px', fontWeight: 500 }}>Modalità Suocera 👁️</div>
              <div style={{ fontSize: '11px', marginTop: '2px', color: suocera ? c.goldSoft : c.inkSoft }}>Lei lo sa. Sempre.</div>
            </div>
          </button>
        </section>

        {/* RESULT */}
        <section style={{ marginBottom: '40px', padding: '32px 24px', borderRadius: '8px', backgroundColor: isComplete ? c.ink : c.bgAlt, color: isComplete ? c.bg : c.inkSoft, border: `1px solid ${isComplete ? c.ink : c.border}`, transition: 'all .5s cubic-bezier(.16,1,.3,1)', position: 'relative', overflow: 'hidden', boxShadow: isComplete ? '0 20px 50px -20px rgba(43,24,16,.4)' : 'none' }}>
          {isComplete && ['tl', 'tr', 'bl', 'br'].map((pos, i) => (
            <div key={pos} style={{ position: 'absolute', top: pos.includes('t') ? 12 : undefined, bottom: pos.includes('b') ? 12 : undefined, left: pos.includes('l') ? 12 : undefined, right: pos.includes('r') ? 12 : undefined, color: c.gold, opacity: 0.6, fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '12px', animation: `fadeUp .5s cubic-bezier(.16,1,.3,1) ${i * 0.1}s both` }}>~</div>
          ))}
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px', color: isComplete ? c.goldSoft : c.inkSoft }}>
              La tua busta
            </div>
            {isComplete ? (
              <>
                <div style={{ position: 'relative', display: 'inline-block', margin: '12px 0' }}>
                  <div className="number-display" style={{ fontSize: 'clamp(4rem,18vw,7rem)', lineHeight: 1, color: c.bg, fontWeight: 300 }}>
                    €{displayedAmount}
                  </div>
                  {!reducedMotion && (
                    <span
                      key={sweepKey}
                      className="number-sweep number-display"
                      aria-hidden="true"
                      style={{ fontSize: 'clamp(4rem,18vw,7rem)', lineHeight: 1, fontWeight: 300, whiteSpace: 'nowrap' }}
                    >
                      €{displayedAmount}
                    </span>
                  )}
                </div>
                <div className="display-font" style={{ fontStyle: 'italic', fontSize: '13px', marginBottom: '12px', color: c.goldSoft }}>
                  range consigliato: €{rangeMin} — €{rangeMax}
                </div>
                {suocera && (
                  <div className="reveal-4 display-font" style={{ fontStyle: 'italic', fontSize: '12px', marginBottom: '16px', color: c.gold, opacity: 0.8 }}>
                    👁️ Tua suocera sa già quanto hai messo. Lo sa.
                  </div>
                )}
                {easterEggMessage && (
                  <div className="reveal-5 display-font" style={{ fontStyle: 'italic', fontSize: '13px', marginBottom: '16px', padding: '10px 16px', borderRadius: '6px', border: `1px dashed ${c.gold}`, color: c.goldSoft }}>
                    {easterEggMessage}
                  </div>
                )}
                {stats?.categories?.[mapParentela(parentela)]?.avg != null && (
                  <div className="reveal-5" style={{ fontSize: '11px', marginBottom: '16px', color: c.goldSoft, opacity: 0.8 }}>
                    Media in questa categoria:{' '}
                    <span style={{ color: c.gold }}>€{stats.categories[mapParentela(parentela)].avg}</span>
                  </div>
                )}
                <button onClick={() => setShowBreakdown(!showBreakdown)} style={{ fontSize: '11px', textDecoration: 'underline', textUnderlineOffset: '4px', background: 'none', border: 'none', color: c.goldSoft, cursor: 'pointer' }}>
                  {showBreakdown ? 'Nascondi calcolo' : 'Vedi come è stato calcolato'}
                </button>
                {showBreakdown && (
                  <div className="reveal-1" style={{ marginTop: '20px', paddingTop: '20px', textAlign: 'left', borderTop: `1px solid ${c.inkSoft}`, color: c.bg }}>
                    <div className="display-font" style={{ fontStyle: 'italic', fontSize: '12px', marginBottom: '12px', textAlign: 'center', color: c.goldSoft }}>
                      € = (B/2 + I) × (C + C×30%) × P × D
                    </div>
                    {[
                      ['Bambini ÷ 2 + Adulti:', `${bambini / 2 + adulti}`],
                      ['Coperto × 1,3:', `€${(costoCoperto * 1.3).toFixed(2)}`],
                      ['× Parentela:', `×${parentela}`],
                      ['× Figura:', `×${figura}`],
                      ...(testimone ? [['× Testimone:', '×1.3']] : []),
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'monospace', opacity: 0.9, marginBottom: '6px' }}>
                        <span>{label}</span><span>{val}</span>
                      </div>
                    ))}
                    <div className="display-font" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '8px', borderTop: `1px dashed ${c.inkSoft}` }}>
                      <span>Totale grezzo:</span><span>€{calcolo.toFixed(2)}</span>
                    </div>
                    <div className="display-font" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, color: c.goldSoft, marginTop: '4px' }}>
                      <span>Arrotondato:</span><span>€{arrotondato}</span>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', padding: '8px 16px', borderRadius: '999px', border: `1px solid ${c.goldSoft}`, color: c.goldSoft, background: 'transparent', cursor: 'pointer' }}>
                    <RefreshCw size={12} /> Ricomincia
                  </button>
                  <button onClick={copyLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', padding: '8px 16px', borderRadius: '999px', border: `1px solid ${linkCopied ? c.gold : c.goldSoft}`, color: linkCopied ? c.gold : c.goldSoft, background: linkCopied ? 'rgba(184,146,79,0.12)' : 'transparent', cursor: 'pointer', transition: 'all .2s' }}>
                    {linkCopied ? <><Check size={12} /> Link copiato!</> : <><Link2 size={12} /> Copia link</>}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '32px 0' }}>
                <div className="display-font" style={{ fontStyle: 'italic', fontSize: '28px', marginBottom: '8px', color: c.inkSoft }}>€ — , —</div>
                <div style={{ fontSize: '11px', color: c.inkSoft }}>Completa i passaggi i. e iii. per scoprire la cifra</div>
              </div>
            )}
          </div>
        </section>

        {/* SHARE CARD */}
        {isComplete && (
          <section style={{ marginBottom: '40px', padding: '24px', borderRadius: '8px', backgroundColor: c.card, border: `1px solid ${c.border}` }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: c.inkSoft, marginBottom: '16px' }}>
              Condividi risultato
            </div>
            <input
              type="text"
              placeholder="Nome sposi (es. Marco & Giulia)"
              value={nomineSposi}
              onChange={(e) => setNomineSposi(e.target.value)}
              maxLength={50}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: `1px solid ${c.border}`, background: c.bg, color: c.ink, fontSize: '13px', fontFamily: 'inherit', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {['story', 'post'].map(f => (
                <button key={f} onClick={() => setCardFormat(f)} style={{ flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', border: `1px solid ${cardFormat === f ? c.burgundy : c.border}`, backgroundColor: cardFormat === f ? c.burgundy : 'transparent', color: cardFormat === f ? '#FFFCF5' : c.inkSoft, cursor: 'pointer', transition: 'all .2s' }}>
                  {f === 'story' ? '📱 Story 9:16' : '⬛ Post 1:1'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => downloadCard(cardFormat)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${c.border}`, color: c.ink, background: c.bg, cursor: 'pointer' }}>
                ⬇ Scarica
              </button>
              <button onClick={shareWhatsApp} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${c.border}`, color: c.ink, background: c.bg, cursor: 'pointer' }}>
                💬 WhatsApp
              </button>
              <button onClick={() => copyCard(cardFormat)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${cardCopied ? c.gold : c.border}`, color: cardCopied ? c.gold : c.ink, background: cardCopied ? 'rgba(184,146,79,0.1)' : c.bg, cursor: 'pointer', transition: 'all .2s' }}>
                {cardCopied ? '✓ Copiata!' : '📋 Copia immagine'}
              </button>
              {typeof navigator !== 'undefined' && navigator.share && (
                <button onClick={() => nativeShare(cardFormat)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${c.border}`, color: c.ink, background: c.bg, cursor: 'pointer' }}>
                  ↗ Condividi
                </button>
              )}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div style={{ textAlign: 'center', marginBottom: '32px', fontSize: '12px', fontStyle: 'italic', padding: '0 16px', color: c.inkSoft }}>
          <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', marginRight: '4px', color: c.gold }} />
          La formula è ironica per natura. Il risultato è un'ottima guida, ma alla fine il vero metro è l'affetto.{' '}
          <em>E quanto puoi permetterti.</em>
        </div>

        {/* Credits */}
        <footer style={{ borderTop: `1px solid ${c.border}`, paddingTop: '24px' }}>
          <button onClick={() => setShowCredits(!showCredits)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', marginBottom: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={14} style={{ color: c.burgundy }} />
              <span className="display-font" style={{ fontSize: '14px', fontWeight: 500, color: c.ink }}>Crediti e fonti</span>
            </div>
            <span style={{ fontSize: '12px', color: c.inkSoft }}>{showCredits ? '−' : '+'}</span>
          </button>

          {showCredits && (
            <div className="reveal-1" style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px', color: c.inkSoft }}>
              {/* Developer */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Code2 size={14} style={{ color: c.gold }} />
                  <span className="display-font" style={{ fontWeight: 500, color: c.ink }}>Sviluppatore</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '6px', backgroundColor: c.bgAlt }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: c.burgundy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#FFFCF5', fontSize: '14px', fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>A</span>
                  </div>
                  <div>
                    <div className="display-font" style={{ fontWeight: 600, color: c.ink }}>Antonio Di Nuzzo</div>
                    <a href="https://github.com/iamantoniodinuzzo" target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: c.gold, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      <Github size={11} /> github.com/iamantoniodinuzzo
                    </a>
                  </div>
                </div>
              </div>

              {/* Formula author */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Crown size={14} style={{ color: c.gold }} />
                  <span className="display-font" style={{ fontWeight: 500, color: c.ink }}>Inventore della formula</span>
                </div>
                <p style={{ lineHeight: 1.6, paddingLeft: '24px', margin: 0 }}>
                  Formula ideata da <strong style={{ color: c.burgundy }}>Amedeo Colella</strong>, scrittore e docente di napoletanità presso la fondazione Humaniter. Pubblicata a <em>pagina 145</em> del <em>Manuale di filosofia napoletana</em> (Cultura Nova editore).
                </p>
              </div>

              {/* Formula */}
              <div>
                <div className="display-font" style={{ fontWeight: 500, marginBottom: '8px', color: c.ink }}>La formula originale</div>
                <div style={{ padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px', backgroundColor: c.bgAlt, color: c.ink }}>
                  € = (B/2 + I) × (C + C×30%) × P × D
                </div>
                <p style={{ fontSize: '11px', marginTop: '8px', lineHeight: 1.6 }}>
                  Nell'originale napoletano, D si chiama <em>"squarciunaria"</em>: Squarcione (1,5), Ngannaruto (1,3), «Amma fa' 'na bella figura» (1,2), Normale (1,0).
                </p>
              </div>

              {/* References */}
              <div>
                <div className="display-font" style={{ fontWeight: 500, marginBottom: '8px', color: c.ink }}>Riferimenti</div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    ['https://www.restoalsud.it/primo-piano/quanto-mettere-nella-busta-del-matrimonio-lo-svela-una-formula-matematica-napoletana/', 'Resto al Sud · La formula matematica napoletana'],
                    ['https://www.sfilate.it/376460/sposi-non-sai-quanto-mettere-nella-busta-il-calcolo-esatto-per-evitare-figuracce/', 'Sfilate · Il calcolo esatto'],
                    ['https://www.trend-online.com/lusso/matrimonio-quanto-regalare-soldi-busta/', 'Trend Online · Quanto regalare al matrimonio'],
                  ].map(([href, label]) => (
                    <li key={href} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px' }}>
                      <ExternalLink size={11} style={{ marginTop: '2px', flexShrink: 0, color: c.gold }} />
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: c.burgundy, textDecoration: 'none' }}>{label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Changelog */}
              <div>
                <div className="display-font" style={{ fontWeight: 500, marginBottom: '8px', color: c.ink }}>Changelog</div>
                <div style={{ fontSize: '11px', lineHeight: 1.9, paddingLeft: '8px' }}>
                  <div><strong style={{ color: c.burgundy }}>v1.3.1</strong> — Busta 3D Three.js, polvere d'oro, coriandoli, count-up, micro-animazioni</div>
                  <div style={{ opacity: 0.6 }}><strong>v1.0.0</strong> — Versione iniziale</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', paddingTop: '16px', marginTop: '8px', fontSize: '11px', color: c.inkSoft, borderTop: `1px dashed ${c.border}` }}>
            <div className="display-font" style={{ fontStyle: 'italic' }}>
              Bustometro <span style={{ color: c.gold }}>·</span> v{VERSION}
            </div>
            <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>
              Formula © Amedeo Colella · Sviluppato da{' '}
              <a href="https://github.com/iamantoniodinuzzo" target="_blank" rel="noopener noreferrer" style={{ color: c.gold, textDecoration: 'none' }}>Antonio Di Nuzzo</a>
            </div>
          </div>
        </footer>
      </div>
      <Analytics />
    </div>
  );
};

export default Bustometro;
