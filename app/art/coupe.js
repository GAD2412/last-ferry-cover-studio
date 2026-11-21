// A two-door fastback idles under the terminal's pink canopy.
function coupePlate() {
  return svgPlate(640, 430, `<defs>
  ${bands('sky',[[0,'#293049'],[.5,'#55405d'],[1,'#b56e81']])}
  ${bands('road',[[0,'#705267'],[.45,'#35384f'],[1,'#202d43']])}
  ${bands('paint',[[0,'#ffb6a4'],[.18,'#bf6d8c'],[.4,'#705474'],[.64,'#593b60'],[1,'#252b43']])}
  ${bands('glass',[[0,'#293b56'],[.65,'#69829a'],[1,'#a6c6b8']])}
  ${bands('metal',[[0,'#f6ccac'],[.18,'#9490a2'],[.56,'#4c566b'],[1,'#b2c1b7']])}
  </defs><path fill="url(#sky)" d="M0 0H640V430H0Z"/>
  <circle cx="524" cy="68" r="18" fill="#e9d0af"/><path d="M478 75L524 71 560 75 529 78Z" fill="#72657c"/>
  ${skyline(202,'#3c3d57',1)}${palm(533,200,.98,12,'#252f47')}${palm(580,202,.78,-5,'#2f324a')}
  <path fill="#2f354a" d="M0 128L448 163V222H0Z"/><path fill="#55647a" d="M0 155L451 178V187L0 181Z"/>
  <path fill="#a97e8a" d="M24 145L35 148V234L24 234Z M187 153L197 153V217L187 217Z M366 169L374 169V209L366 208Z"/>
  <path fill="#3d3c54" stroke="#222d43" stroke-width="3" d="M-40 45L323 101 490 143 446 157-5 108Z"/>
  <path fill="#e48a9e" d="M-5 93L446 145 482 139 449 151-5 103Z"/>
  <path fill="#ffb5cb" stroke="#fa719a" stroke-width="2" d="M-5 97L447 147 473 142 447 150-5 100Z"/>
  <path fill="#76617c" d="M0 112L448 159 426 166 0 132Z"/><path fill="#eaa7a8" d="M82 128L141 133 130 136 73 131Z M264 147L310 151 304 153 259 150Z"/>
  <g transform="translate(152 48) rotate(7)"><path d="M-15 3L141 2 140 49-14 48Z" fill="#344458" stroke="#1b2a40" stroke-width="4"/><path d="M-8 10H134M-8 41H134" stroke="#ec8d9f" stroke-width="2"/><text fill="#ffd8c0" font-family="Arial,sans-serif" font-size="22" font-weight="bold" letter-spacing="4" y="33">PORTSIDE</text></g>
  <g fill="#648f8c"><path d="M47 163L71 165V192H47Z M106 169L131 170V196H106Z M222 180L264 182V202H222Z"/></g>
  <path d="M0 221L640 199V430H0Z" fill="url(#road)"/>
  <g fill="#bd8090" opacity=".64"><path d="M0 322L152 294 79 316 0 335Z M0 341L224 296 102 332Z M291 322L432 289 402 301Z M308 347L530 281 446 310Z M124 388L362 325 271 356Z"/></g>
  <path d="M-10 402L354 312 415 301 105 392Z M485 336L640 276V283L523 330Z" fill="#999292" opacity=".7"/>
  <g stroke="#e5a4a2" stroke-width="1.5" opacity=".65"><path d="M0 365L148 335M423 326L539 288M11 382L67 369M515 348L610 310"/></g>
  <ellipse cx="338" cy="310" rx="269" ry="37" transform="rotate(-7 338 310)" fill="#202538" opacity=".93"/>
  <!-- Wheels, far and near. The rear rim carries the warmer reflection. -->
  <g transform="translate(43 12) scale(.86 .94)">
  <g transform="translate(488 269) rotate(10)"><ellipse rx="28" ry="47" fill="#192030"/><ellipse rx="21" ry="36" fill="#796d7a"/><ellipse rx="14" ry="28" fill="#253346"/><path fill="#b0b9b1" d="M-3-25L3-3 11-15 6 1 12 13 3 7 0 24-3 6-12 15-7 0-10-13-3-6Z"/></g>
  <path fill="url(#paint)" stroke="#23243b" stroke-width="4" stroke-linejoin="round" d="M56 268Q62 252 86 246L163 223 219 174Q231 164 255 160L358 151Q381 149 405 162L461 191 525 194Q548 196 556 212L558 240Q557 256 524 267L511 270Q518 229 495 229Q473 228 461 282L327 325 232 337Q204 347 160 339L68 328Q53 325 51 312Z"/>
  <path fill="#a37589" d="M70 253L162 226 243 224 353 213 304 236 164 263Z"/>
  <path stroke="#232840" stroke-width="3" fill="url(#glass)" d="M176 222L224 177Q236 168 254 167L313 162 338 205 244 221Z"/>
  <path fill="#344459" d="M188 216L226 182 250 176 230 215Z M271 171L304 167 326 201 309 204Z"/>
  <path fill="#b8b7b0" d="M237 183L276 174 235 211 209 214Z" opacity=".43"/>
  <path stroke="#2e2b42" stroke-width="3" fill="#405068" d="M332 163L362 160Q376 159 394 170L443 192 358 202Z"/>
  <path fill="#79939c" d="M343 165L360 164Q373 162 387 171L410 182 353 184Z"/><path fill="#282d43" d="M367 158L378 159 397 196 387 197Z"/>
  <path fill="#deb1a0" d="M162 225L218 174Q230 162 255 159L356 151Q380 150 396 158L412 168 381 158 357 155 251 165 228 176 177 222Z"/>
  <path fill="#bd8095" d="M322 211L445 195 501 197 518 202 421 205 359 216Z"/>
  <path fill="#efb7a8" d="M538 206L552 215 468 221 321 261 276 269 298 257 456 216Z"/>
  <path fill="#38374f" d="M334 273L465 237 456 250 333 291Z M349 296L455 263 452 278 331 314Z"/>
  <path fill="#594459" stroke="#2a2b40" stroke-width="2" d="M357 207L445 196 464 207 456 256 347 289 356 250Z"/>
  <path fill="#ae8297" d="M359 216L455 202 459 207 359 226Z"/>
  <path fill="#cabcb2" d="M362 225L379 222 377 226 361 229Z"/>
  <path fill="#7e6279" stroke="#343049" stroke-width="2" d="M428 199L439 190 454 189 457 195 444 201Z"/>
  <path fill="#282b41" d="M56 268L150 275 213 269 255 255 251 283 211 304 154 311 56 299Z"/>
  <path fill="#eb6c79" d="M63 273L128 278 129 290 61 285Z M170 278L211 274 240 265 238 278 211 288 170 291Z"/>
  <path fill="#ffaf9c" d="M64 274L128 279V282L63 278Z M171 278L210 275 239 266V269L211 279 171 282Z"/>
  <g stroke="#873f58" stroke-width="2"><path d="M78 274v13m16-12v13m16-11v13m70-12v12m14-13v11m15-13v12m15-17v12"/></g>
  <path fill="url(#metal)" d="M51 299L149 311 211 305 251 288 246 298 210 315 149 319 51 307Z"/>
  <path fill="#242d40" d="M56 311L150 325 207 319 239 309 232 326 204 335 160 337 64 324Z"/>
  <path fill="#dcbf9f" stroke="#26283b" stroke-width="2" d="M131 291L165 293 165 305 131 301Z"/>
  <text x="134" y="299" transform="rotate(6 134 299)" fill="#463e4e" font-family="monospace" font-size="7" font-weight="bold">BAY 024</text>
  <path fill="#2b2b41" d="M235 331Q239 279 263 254Q288 231 307 243Q338 258 321 320L308 327 250 341Z"/>
  <g transform="translate(279 300) rotate(16)"><ellipse rx="31" ry="49" fill="#1e2537"/><ellipse rx="22" ry="37" fill="url(#metal)"/><ellipse rx="17" ry="29" fill="#394357"/><path fill="#baada9" d="M-3-29L2-8 10-23 7-5 17-11 9 2 16 12 6 8 5 25 0 10-7 27-5 8-15 16-9 2-15-8-6-5-8-24Z"/><ellipse rx="5" ry="8" fill="#8c8490"/></g>
  <path fill="none" stroke="#c38a9a" stroke-width="3" d="M234 321Q240 277 260 256Q287 230 311 250M460 272Q472 221 499 224"/>
  <path fill="#c8b7af" d="M75 325L116 330 115 335 79 331Z M332 314L450 280 447 285 329 322Z"/>
  <path fill="#a5d5cf" d="M454 223L537 211 549 213 455 227 339 259Z M67 301L148 313 200 308 149 316 65 305Z"/>
  <path fill="#ff9b9e" d="M64 279L127 284V287L64 282Z M174 283L204 280 238 270 238 273 206 283 174 287Z"/>
  <g fill="none" stroke="#b17588" stroke-width="1.5"><path d="M92 254L166 233 241 230M97 258L171 238 225 235M168 267L224 259 246 250"/></g>
  </g>`);
}
