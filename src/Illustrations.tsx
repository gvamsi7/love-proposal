import { useId } from 'react';

function Bunny({ x, y, pink = false, rotation = 0 }: { x: number; y: number; pink?: boolean; rotation?: number }) {
  const fur = pink ? '#f5bcc3' : '#fffaf0';
  return <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    <ellipse cx="0" cy="105" rx="63" ry="12" fill="#b57162" opacity=".1" />
    <path d="M-40 45C-67 80-44 109 0 109S64 81 40 44" fill={fur} stroke="#754f43" strokeWidth="2.2" />
    <ellipse cx="-25" cy="-48" rx="15" ry="49" transform="rotate(-11 -25 -48)" fill={fur} stroke="#754f43" strokeWidth="2.2" />
    <ellipse cx="23" cy="-48" rx="15" ry="49" transform="rotate(11 23 -48)" fill={fur} stroke="#754f43" strokeWidth="2.2" />
    <ellipse cx="-25" cy="-50" rx="5" ry="30" transform="rotate(-11 -25 -50)" fill="#ed959e" opacity=".65" />
    <ellipse cx="23" cy="-50" rx="5" ry="30" transform="rotate(11 23 -50)" fill="#ed959e" opacity=".65" />
    <ellipse cx="0" cy="11" rx="59" ry="49" fill={fur} stroke="#754f43" strokeWidth="2.2" />
    <ellipse cx="-23" cy="12" rx="3" ry="5" fill="#65463c" />
    <ellipse cx="22" cy="12" rx="3" ry="5" fill="#65463c" />
    <ellipse cx="-36" cy="26" rx="11" ry="6" fill="#e48c91" opacity=".65" />
    <ellipse cx="35" cy="26" rx="11" ry="6" fill="#e48c91" opacity=".65" />
    <path d="M-4 24Q0 20 4 24L0 28Z" fill="#9e6256" />
    <path d="M0 28v5m0-1q-6 7-11 1m11-1q6 7 11 1" fill="none" stroke="#754f43" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="-26" cy="103" rx="24" ry="10" fill={fur} stroke="#754f43" strokeWidth="2" />
    <ellipse cx="28" cy="103" rx="24" ry="10" fill={fur} stroke="#754f43" strokeWidth="2" />
    <path d="M-26 66q12 5 12 20m40-20q-12 5-12 20" fill="none" stroke="#754f43" strokeWidth="2" strokeLinecap="round" />
    {pink && <g transform="translate(35 -32) rotate(17)"><path d="M0 0Q-28-24-24-1Q-27 21 0 0Q27-22 25-1Q29 24 0 0Z" fill="#c66170" stroke="#754f43" strokeWidth="1.5"/><circle r="5" fill="#ea8998" stroke="#754f43" strokeWidth="1.5"/></g>}
  </g>;
}

export function BunnyScene({ celebration = false }: { celebration?: boolean }) {
  const uid = useId().replaceAll(':', '');
  return <svg className="bunny-scene" viewBox="0 0 520 430" role="img" aria-label={celebration ? 'Two happy bunnies together, surrounded by hearts' : 'Two little bunnies sharing a heart in a flower garden'}>
    <defs><pattern id={`dots${uid}`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1" fill="#b68470" opacity=".12"/></pattern></defs>
    <path d="M88 105C105 33 195 26 257 48C310 9 411 60 430 134C487 195 461 304 392 338C330 392 236 386 194 351C110 374 51 306 67 250C29 194 48 140 88 105Z" fill="#f8dfce" />
    <path d="M88 105C105 33 195 26 257 48C310 9 411 60 430 134C487 195 461 304 392 338C330 392 236 386 194 351C110 374 51 306 67 250C29 194 48 140 88 105Z" fill={`url(#dots${uid})`} />
    <g className="scene-cloud" fill="#fff9ed"><path d="M93 121q3-21 23-17q13-28 32-6q26-6 27 23Z"/><path d="M347 152q3-19 20-16q12-24 30-5q23-5 25 21Z"/></g>
    <g className="scene-sparkles" fill="#aeaa73"><path d="M115 188l4-10 4 10 10 4-10 4-4 10-4-10-10-4Z"/><path d="M405 217l3-8 3 8 8 3-8 3-3 8-3-8-8-3Z"/><path d="M364 65l3-8 3 8 8 3-8 3-3 8-3-8-8-3Z"/></g>
    <ellipse cx="267" cy="340" rx="151" ry="24" fill="#e7c6ad" opacity=".65" />
    <g className="bunny-left"><Bunny x={202} y={223} rotation={-6} /></g>
    <g className="bunny-right"><Bunny x={329} y={226} pink rotation={7} /></g>
    <g className="scene-heart" transform="translate(267 283)"><path d="M0 31C-12 21-45 2-34-20C-24-40-4-27 0-18C5-30 25-37 35-20C48 1 12 23 0 31Z" fill="#d16e7b" stroke="#9c5361" strokeWidth="2"/><path d="M-24-18q7-12 16-6" fill="none" stroke="#ed9aa3" strokeWidth="4" strokeLinecap="round"/></g>
    <g fill="#d16e7b" className="floating-heart"><path d="M261 133c-8-6-25-17-19-29q9-14 19-3q11-11 19 3c6 12-11 23-19 29Z"/><path d="M357 186c-5-4-16-11-12-18q6-9 12-2q7-7 12 2c4 8-7 15-12 18Z"/></g>
    <g stroke="#8e9768" strokeWidth="2" strokeLinecap="round"><path d="M125 335q-9-26-5-41m8 21q12-10 13-6m-19 15q-13-13-17-8m301 16q4-29-3-40m1 15q-10-12-15-8m16 23q13-16 18-11" fill="none"/></g>
    <g fill="#f9f2bf" stroke="#cfac73" strokeWidth="1.4"><circle cx="118" cy="288" r="9"/><circle cx="399" cy="289" r="8"/></g>
    <g fill="#dd9573"><circle cx="118" cy="288" r="3"/><circle cx="399" cy="289" r="3"/></g>
    <path d="M113 74q21-16 42-3" fill="none" stroke="#b79976" strokeWidth="1.8" strokeDasharray="3 5" strokeLinecap="round" />
    <g transform="translate(401 104) rotate(13)" stroke="#754f43" strokeWidth="1.5"><path d="M0 0q-12-32-30-23q-11 8 8 23q-19 16-8 23q18 9 30-23q12-32 30-23q11 8-8 23q19 16 8 23Q12 32 0 0Z" fill="#faf1ba"/><ellipse rx="4" ry="13" fill="#b4a476"/></g>
    {celebration && <g fill="#d16e7b"><path d="M150 175q-26-20-14-28q9-5 14 3q7-9 14-3q13 10-14 28Z"/><path d="M306 63q-20-16-10-22q7-4 10 2q6-7 11-2q10 8-11 22Z"/></g>}
  </svg>;
}

export function Flower({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 110" aria-hidden="true"><path d="M50 62q-4 25-1 42m0-18q-31-17-28-1q12 10 28 1m0-10q27-23 27-4q-9 11-27 4" fill="#8e9b76" stroke="#768460" strokeWidth="2"/><g fill="#f0afba" stroke="#b96274" strokeWidth="1.7"><ellipse cx="50" cy="30" rx="13" ry="20"/><ellipse cx="50" cy="30" rx="13" ry="20" transform="rotate(60 50 47)"/><ellipse cx="50" cy="30" rx="13" ry="20" transform="rotate(120 50 47)"/><ellipse cx="50" cy="30" rx="13" ry="20" transform="rotate(180 50 47)"/><ellipse cx="50" cy="30" rx="13" ry="20" transform="rotate(240 50 47)"/><ellipse cx="50" cy="30" rx="13" ry="20" transform="rotate(300 50 47)"/></g><circle cx="50" cy="47" r="11" fill="#f6dd98" stroke="#b28c54" strokeWidth="1.7"/></svg>;
}

export function Envelope({ open }: { open: boolean }) {
  return <svg viewBox="0 0 380 245" className={`envelope-art ${open ? 'is-open' : ''}`} aria-hidden="true"><rect x="19" y="47" width="342" height="175" rx="9" fill="#e8b7a7" stroke="#ab7164" strokeWidth="2"/><g className="envelope-paper"><rect x="54" y="22" width="272" height="154" rx="5" fill="#fff9ef" stroke="#d9c7b2"/><path d="M96 66h105m-105 20h187M96 106h168" stroke="#d8bca7" strokeWidth="3" strokeLinecap="round"/><path d="M193 144q-24-17-13-26q8-7 13 2q7-10 15-2q10 10-15 26Z" fill="#d27281"/></g><path d="M20 56L190 164 360 56V214q0 8-8 8H28q-8 0-8-8Z" fill="#f2d0bd" stroke="#ab7164" strokeWidth="2"/><path d="M22 219l131-93m205 93-130-93" fill="none" stroke="#c88e7c" strokeWidth="1.6"/><g className="envelope-flap"><path d="M20 51h340L203 160q-13 9-26 0Z" fill="#f4d6c6" stroke="#ab7164" strokeWidth="2"/><circle cx="190" cy="144" r="24" fill="#b76270"/><path d="M190 153q-18-11-11-18q6-6 11 1q6-7 12-1q6 8-12 18Z" fill="#f9e0d7"/></g></svg>;
}
