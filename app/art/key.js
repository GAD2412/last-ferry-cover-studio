// The motel key is passed through the ticket window at dusk.
function keyPlate() {
  return svgPlate(640, 400, `<defs>
  ${bands('sky',[[0,'#548b92'],[.54,'#9cb7a7'],[1,'#f5cd94']])}
  ${bands('hand',[[0,'#faac81'],[.44,'#df8c75'],[.72,'#b96e70'],[1,'#794b61']])}
  ${bands('fob',[[0,'#ffbc8c'],[.32,'#fa9179'],[1,'#dc6871']])}
  </defs><path fill="url(#sky)" d="M0 0H640V400H0Z"/>
  <circle cx="80" cy="153" r="64" fill="#eed5a2" opacity=".78"/>
  ${palm(105,301,1.06,-11,'#678a85')}${palm(65,296,.78,8,'#698d87')}
  <g fill="#c5c6a5"><path d="M-30 82L36 72 75 74 96 68 135 73 168 74 207 78 121 80 83 79 53 83Z M126 113L178 107 235 109 202 112Z"/></g>
  <path d="M0 267L206 203 382 227 442 254V374L0 411Z" fill="#497780"/>
  <path d="M0 259L206 199 393 221 395 231 205 212 0 276Z" fill="#e8c39d"/>
  <path d="M0 286L207 227 365 244V256L205 239 0 299Z" fill="#91aca1"/>
  <g fill="#315867"><path d="M7 298L40 289V357L7 369Z M57 285L91 276V340L57 350Z M112 269L139 261V329L112 335Z M154 256L183 248V312L154 324Z"/></g>
  <g transform="translate(119 137) rotate(-12)"><path d="M13 16V99M78 16V96" stroke="#55757a" stroke-width="6"/><path d="M-15 1L105 1 98 32-23 32Z" fill="#f0cda4" stroke="#658885" stroke-width="2"/><text x="-8" y="23" font-size="21" font-family="Arial,sans-serif" font-weight="bold" letter-spacing="4" fill="#a46566">MOTEL</text></g>
  <path d="M0 378L274 296 640 316V400H0Z" fill="#426975"/>
  <!-- Back fingers curl into the palm beneath the index finger. -->
  <path fill="url(#hand)" stroke="#573d4a" stroke-width="3.5" d="M659-25L661 160Q610 150 578 140L512 145Q487 155 467 163Q449 166 443 156Q439 149 447 136Q432 143 420 140Q408 136 412 126L424 109Q400 119 385 117Q372 111 383 98L412 62 448 31 492 13 545-18Z"/>
  <path fill="#925968" d="M420 127L441 103 484 79 504 80 466 103 448 126 438 132Z M453 149L468 125 505 102 527 101 495 118 469 150Z M555 100L603 81 651 83V122L601 112Z"/>
  <path fill="#f8b389" d="M419 118Q434 94 447 88L475 79 446 98 430 121Z M457 141L471 120 497 108 474 127 467 143Z"/>
  <!-- Brass key and its stamped teeth behind the fob. -->
  <g transform="translate(355 135) rotate(-37)">
  <path fill="#64555b" stroke="#3b404e" stroke-width="3" d="M-11 15Q-23 4-16-12Q-6-28 10-20Q29-10 20 8L13 17 13 120 4 130-6 123-8 108-16 103-14 90-8 87-16 80-15 69-8 65Z"/>
  <path fill="#dbb587" d="M-11 8Q-19-6-7-15Q6-23 15-11Q26 5 9 13L8 119 2 125-3 119-4 104-12 100-10 93-4 90-5 83-12 79-11 72-4 68-5 15Z"/>
  <circle cy="-5" r="6" fill="#686369"/><path d="M3 17V113" stroke="#fff1b3" stroke-width="2"/></g>
  <!-- Coral diamond fob, molded edge, registered lettering and punched eye. -->
  <g transform="translate(344 159) rotate(19)">
  <path d="M-9 0Q-2-7 7 0L72 85Q81 96 72 109L10 201Q2 210-7 201L-72 116Q-82 104-74 92Z" fill="#a25962" stroke="#563f50" stroke-width="4"/>
  <path d="M-9-5Q-2-12 7-5L71 80Q79 91 72 102L8 195Q1 205-7 195L-73 108Q-80 98-72 86Z" fill="url(#fob)" stroke="#754650" stroke-width="2.5"/>
  <path d="M-6 4Q0-3 5 4L65 85Q70 92 64 100L4 185Q1 191-4 185L-65 104Q-72 97-65 88Z" fill="none" stroke="#ffd1a0" stroke-width="2"/>
  <circle cy="14" r="7" fill="#653e4c" stroke="#eca487" stroke-width="2"/>
  <g fill="#56374c" text-anchor="middle"><path d="M-15 51L0 36 15 51 1 47Z M-20 56L0 51 20 55-1 54Z"/>
  <text y="73" font-family="Georgia,serif" font-weight="bold" font-style="italic" font-size="22">Pelican</text>
  <text y="88" font-family="Arial,sans-serif" font-weight="bold" font-size="8" letter-spacing="2.3">MOTOR LODGE</text>
  <path d="M-31 96H31V97H-31Z"/>
  <text y="139" font-family="Georgia,serif" font-size="46" font-weight="bold">07</text>
  <text y="151" font-family="Arial,sans-serif" font-size="6.5" letter-spacing="1.1">RETURN TO DESK</text><circle cy="167" r="2"/></g></g>
  <g fill="none"><ellipse cx="355" cy="130" rx="16" ry="44" transform="rotate(14 355 130)" stroke="#514958" stroke-width="6"/><path d="M339 159Q335 144 345 113Q356 84 366 91Q379 103 364 143Q352 174 343 169" stroke="#f8dfad" stroke-width="3.2"/></g>
  <!-- Index finger meets the side of the thumb around the ring. -->
  <path fill="url(#hand)" stroke="#6b4350" stroke-width="3.4" d="M658-23L578 63Q546 88 501 84L450 73Q428 70 406 75L373 88Q357 98 343 96Q331 92 338 79Q342 69 355 61L397 33Q418 23 450 19L500-6Z"/>
  <path fill="#ffbd8e" d="M350 69L398 38 454 24 488 14 474 28 420 40 375 62Z"/>
  <path fill="#a96064" d="M380 84L406 65 453 56 503 65 539 63 512 78 453 69 426 69 403 76Z"/>
  <path fill="#f2b39c" stroke="#9b6168" stroke-width="1.6" d="M339 83Q343 72 357 65Q367 65 371 75L354 88Q340 96 339 89Z"/>
  <path fill="url(#hand)" stroke="#67404e" stroke-width="3" d="M543 42Q523 58 498 68L460 74Q432 79 411 96L383 114Q372 123 357 122Q342 122 342 114Q343 104 356 94L387 68Q401 58 418 48L445 32"/>
  <path d="M346 109Q353 99 362 96Q372 94 378 105L369 114Q357 121 347 117Z" fill="#eeb5a2" stroke="#aa6b70" stroke-width="1.5"/>
  <path fill="#f9b18a" d="M385 89Q407 65 428 55L452 43 460 44 425 64Z"/>
  <g fill="none" stroke="#a66769" stroke-linecap="round" stroke-width="2"><path d="M392 65L400 72M399 62L406 67M426 77Q437 76 442 79M453 38L464 38M485 95L496 92M507 112L517 109"/></g>
  <path fill="#293e55" stroke="#38384c" stroke-width="3" d="M574-14L665-12V149Q631 142 598 129L554 88Q585 61 604 31Z"/>
  <path fill="#799b98" d="M564 88Q591 65 611 31L618 38Q600 72 572 96Z"/>
  <path fill="#426777" d="M601 110L641 74 625 108 651 102 645 134Z"/>
  `);
}
