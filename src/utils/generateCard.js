import { THEME } from '../constants';

const { bg: BG, ink: INK, burgundy: BURGUNDY, gold: GOLD, goldSoft: GOLD_SOFT, inkSoft: INK_SOFT, border: BORDER } = THEME;

export const generateCard = async ({ format, nomineSposi, arrotondato, rangeMin, rangeMax, testimone, suocera }) => {
  await document.fonts.ready;
  const isStory = format === 'story';
  const W = 1080;
  const H = isStory ? 1920 : 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

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
