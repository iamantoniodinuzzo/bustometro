import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { regioni, THEME } from './constants';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useStats } from './hooks/useStats';
import { useToast } from './hooks/useToast';
import { useBusyGuard } from './hooks/useBusyGuard';
import { useCalcolo } from './hooks/useCalcolo';
import { useShareUrl } from './hooks/useShareUrl';
import { useStatsSubmit } from './hooks/useStatsSubmit';
import { Atmosphere } from './components/Atmosphere';
import { Envelope3D } from './components/Envelope3D';
import { Toast } from './components/Toast';
import { Header } from './components/Header';
import { StepParentela } from './components/StepParentela';
import { StepPartecipanti } from './components/StepPartecipanti';
import { StepFigura } from './components/StepFigura';
import { ResultCard } from './components/ResultCard';
import { ShareCard } from './components/ShareCard';
import { Disclaimer } from './components/Disclaimer';
import { CreditsFooter } from './components/CreditsFooter';

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
  const [nomineSposi, setNomineSposi] = useState('');
  const [cardFormat, setCardFormat] = useState('story');
  const [cardCopied, setCardCopied] = useState(false);
  const [testimone, setTestimone] = useState(false);
  const [suocera, setSuocera] = useState(false);
  const [regione, setRegione] = useState('centro');
  const reducedMotion = usePrefersReducedMotion();
  const stats = useStats();
  const { toast, showToast } = useToast();
  const { busyCard, withBusy } = useBusyGuard();

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

  const { isComplete, calcolo, arrotondato, rangeMin, rangeMax, displayedAmount, sweepKey, easterEggMessage } =
    useCalcolo({ parentela, adulti, bambini, costoCoperto, figura, testimone });

  useStatsSubmit(isComplete, parentela, arrotondato);

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

  const { buildShareUrl, copyLink, linkCopied } = useShareUrl({
    parentela, adulti, bambini, costoCoperto, figura, regione, testimone, suocera, showToast,
  });

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
      showToast('Immagine scaricata ✓');
    }, 'image/png');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`💌 Bustometro dice €${arrotondato} in busta!\n${buildShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    showToast('Aperto WhatsApp');
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
          showToast('Copia immagine non supportata');
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
    } catch { showToast('Condivisione annullata'); }
  };

  const c = THEME;

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
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-icon { animation: spin .8s linear infinite; display: inline-block; }
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

        <Header stats={stats} />

        <StepParentela
          parentela={parentela} setParentela={setParentela}
          testimone={testimone} setTestimone={setTestimone}
        />

        <StepPartecipanti
          regione={regione} selectRegione={selectRegione}
          adulti={adulti} setAdulti={setAdulti}
          bambini={bambini} setBambini={setBambini}
          costoCoperto={costoCoperto} setCostoCoperto={setCostoCoperto}
        />

        <StepFigura
          figura={figura} setFigura={setFigura}
          suocera={suocera} setSuocera={setSuocera}
        />

        <ResultCard
          isComplete={isComplete} reducedMotion={reducedMotion}
          displayedAmount={displayedAmount} sweepKey={sweepKey}
          rangeMin={rangeMin} rangeMax={rangeMax}
          suocera={suocera} easterEggMessage={easterEggMessage}
          stats={stats} parentela={parentela}
          showBreakdown={showBreakdown} setShowBreakdown={setShowBreakdown}
          bambini={bambini} adulti={adulti} costoCoperto={costoCoperto}
          figura={figura} testimone={testimone} calcolo={calcolo} arrotondato={arrotondato}
          reset={reset} copyLink={copyLink} linkCopied={linkCopied}
        />

        {isComplete && (
          <ShareCard
            nomineSposi={nomineSposi} setNomineSposi={setNomineSposi}
            cardFormat={cardFormat} setCardFormat={setCardFormat}
            busyCard={busyCard} withBusy={withBusy}
            downloadCard={downloadCard} shareWhatsApp={shareWhatsApp}
            copyCard={copyCard} nativeShare={nativeShare}
            cardCopied={cardCopied}
          />
        )}

        <Disclaimer />

        <CreditsFooter showCredits={showCredits} setShowCredits={setShowCredits} />
      </div>
      <Analytics />
      <Toast message={toast} />
    </div>
  );
};

export default Bustometro;
