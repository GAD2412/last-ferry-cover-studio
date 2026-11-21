// The four plates share ink, maritime shapes and the same fictional stretch of coast.
const ink = "#171b32";
const svgPlate = (width, height, content) =>
  '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' + content + '</svg>';

function bands(id, stops, horizontal = false) {
  const end = horizontal ? 'x2="1" y2="0"' : 'x2="0" y2="1"';
  return '<linearGradient id="' + id + '" ' + end + '>' +
    stops.map(([at, color]) => '<stop offset="' + at + '" stop-color="' + color + '"/>').join('') + '</linearGradient>';
}

function palm(x, y, size, lean, color) {
  return `<g transform="translate(${x} ${y}) scale(${size}) skewX(${lean})" fill="${color}">
  <path d="M-4 3Q4-46 0-99Q13-51 7 3Z"/>
  <path d="M1-96Q-25-124-58-105Q-42-110-35-102L-39-109-27-102-29-108-15-98Z
  M2-96Q-29-111-57-78L-42-91-44-85-32-96-33-90-18-100-18-96Z
  M3-98Q-20-99-33-60L-22-77-23-70-11-85-12-80Z
  M2-97Q-6-124 16-135L9-121 15-124 7-111 11-113Z
  M2-98Q31-129 62-101L46-108 50-102 34-108 36-103 22-106Z
  M3-98Q36-111 56-74L43-86 45-79 32-93 34-87 19-98Z
  M4-97Q27-92 28-58L20-76 20-69 12-86Z"/></g>`;
}

function skyline(y, color, scale = 1) {
  return `<g transform="translate(0 ${y}) scale(${scale})" fill="${color}">
    <path d="M-20 0V-22H8V-37H21V-30H32V-65H38V-69H52V-65H58V-12H65V-25H79V-20H91V-54H95V-62H111V-55H117V-30H132V-82H137V-86H155V-82H160V-24H170V-33H183V-18H198V-57H211V-64H219V-56H230V-16H249V-42H271V-31H290V-66H309V-77H317V-66H331V-34H342V-48H362V-73H383V-41H397V-29H411V-61H428V-66H436V-59H445V-14H460V-31H482V-41H499V-20H516V-57H543V-24H568V-35H598V-13H622V-47H643V-22H681V9H-20Z"/>
    </g>`;
}

function harborRipples(width, height, count, colors, seed) {
  let random = seed;
  const next = () => ((random = (random * 16807) % 2147483647) / 2147483647);
  let strokes = '';
  for (let i = 0; i < count; i++) {
    const x = Math.round(next() * width), y = Math.round(next() * height);
    const length = Math.round(4 + next() * 45 * (0.3 + y / height));
    strokes += `<path fill="${colors[i % colors.length]}" opacity="${(0.25 + next() * .55).toFixed(2)}" d="M${x} ${y}l${length} -1 5 1 -${Math.round(length * .76)} 2Z"/>`;
  }
  return strokes;
}

function signalFlag(x, y, scale, cloth = '#e76c55', light = '#fff0bd') {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
  <path fill="${cloth}" d="M0 0L46 3 37 14 43 25 0 21Z"/>
  <path fill="${light}" d="M4 13H11L18 6H24L19 13H30L25 17H4ZM3 19L21 18 17 20H3Z"/></g>`;
}
