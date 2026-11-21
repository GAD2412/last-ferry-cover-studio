// Harbor Block is a hand-cut display alphabet. Coordinates describe a 50 by 72 unit metal sort.
const harborAlphabet = {
  A: 'M0 72L11 0H40L50 72H35L33 55H17L15 72ZM19 41H31L26 12H24Z',
  B: 'M0 0H38L48 9V29L41 35 50 42V62L40 72H0ZM15 13V29H31L34 26V16L31 13ZM15 42V59H32L35 56V45L32 42Z',
  C: 'M10 0H39L49 10V24H34V16L31 13H19L15 17V55L19 59H31L34 56V48H49V62L39 72H10L0 62V10Z',
  D: 'M0 0H34L49 14V58L35 72H0ZM15 13V59H28L34 53V20L28 13Z',
  E: 'M0 0H47V13H15V28H43V41H15V59H48V72H0Z',
  F: 'M0 0H48V14H16V30H42V44H16V72H0Z',
  G: 'M10 0H39L49 10V22H34V16L31 13H19L15 17V55L19 59H34V44H25V32H49V72H10L0 62V10Z',
  H: 'M0 0H15V28H34V0H49V72H34V42H15V72H0Z',
  I: 'M0 0H22V72H0Z',
  J: 'M31 0H46V61L35 72H9L0 63V46H14V55L18 59H26L31 54Z',
  K: 'M0 0H15V31L33 0H50L29 34 51 72H33L15 41V72H0Z',
  L: 'M0 0H16V58H46V72H0Z',
  M: 'M0 0H21L30 33 40 0H61V72H46V26L34 59H26L15 26V72H0Z',
  N: 'M0 0H16L35 43V0H49V72H33L15 32V72H0Z',
  O: 'M10 0H39L49 10V62L39 72H10L0 62V10ZM19 13L15 17V55L19 59H30L34 55V17L30 13Z',
  P: 'M0 0H38L49 10V36L38 47H16V72H0ZM16 13V34H29L34 29V17L30 13Z',
  Q: 'M10 0H39L49 10V61L43 66 52 74H32L29 72H10L0 62V10ZM19 13L15 17V55L19 59H30L34 55V17L30 13Z',
  R: 'M0 0H38L49 11V34L39 44 52 72H34L24 47H16V72H0ZM16 13V33H29L34 28V18L29 13Z',
  S: 'M10 0H39L49 10V23H34V16L31 13H19L15 17V25L19 28H36L49 40V61L38 72H10L0 62V49H15V56L18 59H30L34 55V45L31 42H13L0 30V10Z',
  T: 'M0 0H52V14H34V72H18V14H0Z',
  U: 'M0 0H15V55L19 59H30L34 55V0H49V62L39 72H10L0 62Z',
  V: 'M0 0H16L25 53 35 0H51L36 72H15Z',
  W: 'M0 0H15L20 50 29 13H40L48 50 54 0H69L58 72H40L34 44 28 72H11Z',
  X: 'M0 0H17L26 22 36 0H53L35 35 54 72H37L26 48 16 72H0L18 35Z',
  Y: 'M0 0H17L27 30 38 0H55L35 45V72H19V45Z',
  Z: 'M0 0H48V13L18 59H49V72H0V58L30 13H0Z'
};
const glyphWidths = {I:22, M:61, T:52, W:69, X:54, Y:55, L:46, R:52};

function harborWordmark(caption) {
  let advance = 0;
  const letters = [];
  for (const letter of caption.toUpperCase()) {
    if (letter === ' ') { advance += 24; continue; }
    if (!harborAlphabet[letter]) return null;
    letters.push({path:new Path2D(harborAlphabet[letter]), offset:advance});
    advance += (glyphWidths[letter] || 49) + 3;
  }
  return {letters, width: Math.max(1, advance - 3)};
}

function printCaption(ctx, width, height, settings) {
  const text = settings.caption.trim().toUpperCase();
  const sub = settings.subtitle.trim().toUpperCase();
  const unit = Math.min(width, height);
  const mid = settings.placement === 'Center';
  const top = settings.placement === 'Top';
  const mark = settings.type === 'Harbor Block' && harborWordmark(text);
  const wideLower = width > height * 1.5 && !mid && !top;
  // Leave the motel tag visible beyond the sloping edge of the landscape pilot panel.
  const center = width * (wideLower ? .231 : .5);
  const base = height * (top ? .22 : mid ? .53 : wideLower ? .9 : .885);
  const maxWidth = width * (wideLower ? .405 : .885);
  let fontHeight = unit * .137 * settings.typeSize / 100;
  ctx.save();
  ctx.font = settings.type === 'Screen Serif' ? 'italic 900 100px Georgia,serif' : '900 100px Arial Black,Arial,sans-serif';
  const metrics = ctx.measureText(text);
  const nativeHeight = mark ? 72 : Math.max(68,metrics.actualBoundingBoxAscent);
  const nativeWidth = mark ? mark.width : Math.max(1,metrics.width);
  const scaleY = Math.min(fontHeight / nativeHeight, maxWidth / (nativeWidth*.7 + nativeHeight*.15));
  const scaleX = Math.min(scaleY, (maxWidth - scaleY*nativeHeight*.14) / nativeWidth);
  const printed = nativeWidth * scaleX;
  const left = center - (printed + nativeHeight * scaleY * .13) / 2;
  if (text) {
    ctx.translate(left, base);
    ctx.transform(scaleX, 0, -.14*scaleY, scaleY, 0, 0);
    if (mark) ctx.translate(0,-72);
    const y0 = mark ? 0 : -nativeHeight;
    const drawLetters = stroke => {
      if (!mark) {
        if (stroke) ctx.strokeText(text,0,0); else ctx.fillText(text,0,0);
        return;
      }
      for (const letter of mark.letters) {
        ctx.save();ctx.translate(letter.offset,0);
        if (stroke) ctx.stroke(letter.path); else ctx.fill(letter.path,'evenodd');
        ctx.restore();
      }
    };
    const drawStroke = () => drawLetters(true);
    const drawFill = () => drawLetters(false);
    ctx.lineJoin = 'round';
    ctx.save();
    ctx.translate(2.4,5.6); ctx.lineWidth = 6.1; ctx.strokeStyle = '#151d31'; drawStroke();
    ctx.fillStyle = '#ec776c'; drawFill();
    ctx.restore();
    ctx.lineWidth = 4.3; ctx.strokeStyle = '#20283b'; drawStroke();
    const color = ctx.createLinearGradient(0,y0,0,y0+nativeHeight);
    color.addColorStop(0,'#fff8d8'); color.addColorStop(.48,'#ffe7b9');
    color.addColorStop(.54,'#ffd8a1'); color.addColorStop(.82,'#ffa885'); color.addColorStop(1,'#f4847c');
    ctx.fillStyle = color; drawFill();
    ctx.lineWidth = .65; ctx.strokeStyle = '#ffdfb0'; drawStroke();
  }
  ctx.restore();
  if (sub) {
    ctx.save();
    const fontSize = Math.max(11, unit * .016);
    ctx.font = 'bold ' + fontSize + 'px Arial,sans-serif';
    ctx.letterSpacing = (fontSize * .23) + 'px';
    const banner = Math.min(maxWidth,ctx.measureText(sub).width+unit*.047);
    const y = base + unit * .017, h = fontSize * 1.73, left=center-banner/2;
    ctx.fillStyle = '#f2c49d'; ctx.beginPath(); ctx.moveTo(left+4,y);ctx.lineTo(left+banner+4,y);ctx.lineTo(left+banner-3,y+h);ctx.lineTo(left-3,y+h);ctx.fill();
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#252c3e';
    ctx.fillText(sub,center+1,y+h*.55,banner-unit*.025);
    ctx.restore();
  }
}
