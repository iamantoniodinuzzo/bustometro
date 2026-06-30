import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { THEME } from './constants';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useStats } from './hooks/useStats';
import { useToast } from './hooks/useToast';
import { useBusyGuard } from './hooks/useBusyGuard';
import { useCalcolo } from './hooks/useCalcolo';
import { useShareUrl } from './hooks/useShareUrl';
import { useStatsSubmit } from './hooks/useStatsSubmit';
import { useFormReducer } from './hooks/useFormReducer';
import { useCardActions } from './hooks/useCardActions';
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
  const {
    parentela, setParentela,
    adulti, setAdulti,
    bambini, setBambini,
    costoCoperto, setCostoCoperto,
    figura, setFigura,
    testimone, setTestimone,
    suocera, setSuocera,
    regione, selectRegione,
    reset: resetForm,
  } = useFormReducer();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [nomineSposi, setNomineSposi] = useState('');
  const [cardFormat, setCardFormat] = useState('story');
  const reducedMotion = usePrefersReducedMotion();
  const stats = useStats();
  const { toast, showToast } = useToast();
  const { busyCard, withBusy } = useBusyGuard();

  const { isComplete, calcolo, arrotondato, rangeMin, rangeMax, displayedAmount, sweepKey, easterEggMessage } =
    useCalcolo({ parentela, adulti, bambini, costoCoperto, figura, testimone });

  useStatsSubmit(isComplete, parentela, arrotondato);

  const reset = () => {
    resetForm();
    setShowBreakdown(false);
    window.history.replaceState(null, '', window.location.pathname);
  };

  const { buildShareUrl, copyLink, linkCopied } = useShareUrl({
    parentela, adulti, bambini, costoCoperto, figura, regione, testimone, suocera, showToast,
  });

  const { downloadCard, copyCard, shareWhatsApp, nativeShare, cardCopied } = useCardActions({
    nomineSposi, arrotondato, rangeMin, rangeMax, testimone, suocera, buildShareUrl, showToast,
  });

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
