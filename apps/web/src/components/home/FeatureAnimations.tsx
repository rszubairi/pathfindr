'use client';

import React from 'react';

export function SearchFiltersAnimation() {
  return (
    <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background card */}
      <rect x="40" y="30" width="400" height="300" rx="20" fill="white" fillOpacity="0.1" />

      {/* Search bar */}
      <g className="animate-feature-fade-in" style={{ animationDelay: '0.2s' }}>
        <rect x="70" y="60" width="340" height="50" rx="12" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="100" cy="85" r="12" stroke="white" strokeWidth="2" fill="none" className="animate-feature-pulse" />
        <line x1="108" y1="93" x2="116" y2="101" stroke="white" strokeWidth="2" strokeLinecap="round" className="animate-feature-pulse" />
        {/* Typing cursor */}
        <rect x="130" y="74" width="2" height="22" fill="white" fillOpacity="0.9" className="animate-feature-blink" />
        {/* Typed text lines */}
        <rect x="138" y="78" width="80" height="6" rx="3" fill="white" fillOpacity="0.5" className="animate-feature-type" />
        <rect x="138" y="90" width="50" height="6" rx="3" fill="white" fillOpacity="0.3" className="animate-feature-type" style={{ animationDelay: '0.5s' }} />
      </g>

      {/* Filter chips row 1 */}
      <g className="animate-feature-slide-up" style={{ animationDelay: '0.6s' }}>
        <rect x="70" y="130" width="100" height="36" rx="18" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
        <rect x="88" y="144" width="64" height="8" rx="4" fill="white" fillOpacity="0.7" />

        <rect x="185" y="130" width="90" height="36" rx="18" fill="white" fillOpacity="0.35" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" className="animate-feature-glow" />
        <rect x="203" y="144" width="54" height="8" rx="4" fill="white" fillOpacity="0.9" />

        <rect x="290" y="130" width="120" height="36" rx="18" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
        <rect x="308" y="144" width="84" height="8" rx="4" fill="white" fillOpacity="0.7" />
      </g>

      {/* Filter chips row 2 */}
      <g className="animate-feature-slide-up" style={{ animationDelay: '0.9s' }}>
        <rect x="70" y="178" width="110" height="36" rx="18" fill="white" fillOpacity="0.35" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" className="animate-feature-glow" style={{ animationDelay: '1s' }} />
        <rect x="88" y="192" width="74" height="8" rx="4" fill="white" fillOpacity="0.9" />

        <rect x="195" y="178" width="85" height="36" rx="18" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
        <rect x="213" y="192" width="49" height="8" rx="4" fill="white" fillOpacity="0.7" />
      </g>

      {/* Result cards */}
      <g className="animate-feature-slide-up" style={{ animationDelay: '1.2s' }}>
        {[0, 1, 2].map((i) => (
          <g key={i} className="animate-feature-fade-in" style={{ animationDelay: `${1.4 + i * 0.2}s` }}>
            <rect x="70" y={234 + i * 28} width="340" height="22" rx="6" fill="white" fillOpacity={0.15 - i * 0.03} />
            <rect x="82" y={240 + i * 28} width={160 - i * 30} height="10" rx="5" fill="white" fillOpacity={0.5 - i * 0.1} />
            <rect x={360} y={240 + i * 28} width="40" height="10" rx="5" fill="white" fillOpacity={0.4 - i * 0.1} />
          </g>
        ))}
      </g>

      {/* Floating magnifying glass accent */}
      <g className="animate-feature-float" style={{ transformOrigin: '400px 50px' }}>
        <circle cx="390" cy="46" r="18" stroke="white" strokeWidth="2.5" fill="white" fillOpacity="0.1" />
        <line x1="402" y1="58" x2="414" y2="70" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function AIMatchingAnimation() {
  return (
    <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background card */}
      <rect x="40" y="30" width="400" height="300" rx="20" fill="white" fillOpacity="0.1" />

      {/* Central brain / AI node */}
      <g className="animate-feature-pulse" style={{ transformOrigin: '240px 170px' }}>
        <circle cx="240" cy="170" r="40" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
        <circle cx="240" cy="170" r="28" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
        {/* AI brain icon */}
        <path d="M228 160 Q232 150 240 150 Q248 150 252 160" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M228 170 Q240 175 252 170" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M230 180 Q240 186 250 180" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="234" cy="165" r="2" fill="white" fillOpacity="0.8" />
        <circle cx="246" cy="165" r="2" fill="white" fillOpacity="0.8" />
      </g>

      {/* Student profiles (left side) */}
      {[
        { x: 90, y: 90, delay: '0.3s' },
        { x: 80, y: 170, delay: '0.5s' },
        { x: 90, y: 250, delay: '0.7s' },
      ].map((pos, i) => (
        <g key={`student-${i}`} className="animate-feature-fade-in" style={{ animationDelay: pos.delay }}>
          <rect x={pos.x - 25} y={pos.y - 20} width="50" height="40" rx="10" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
          <circle cx={pos.x} cy={pos.y - 6} r="8" fill="white" fillOpacity="0.3" />
          <rect x={pos.x - 12} y={pos.y + 6} width="24" height="5" rx="2.5" fill="white" fillOpacity="0.4" />
        </g>
      ))}

      {/* Scholarship targets (right side) */}
      {[
        { x: 390, y: 90, delay: '0.4s' },
        { x: 400, y: 170, delay: '0.6s' },
        { x: 390, y: 250, delay: '0.8s' },
      ].map((pos, i) => (
        <g key={`target-${i}`} className="animate-feature-fade-in" style={{ animationDelay: pos.delay }}>
          <rect x={pos.x - 25} y={pos.y - 20} width="50" height="40" rx="10" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
          <rect x={pos.x - 14} y={pos.y - 10} width="28" height="6" rx="3" fill="white" fillOpacity="0.4" />
          <rect x={pos.x - 10} y={pos.y + 1} width="20" height="4" rx="2" fill="white" fillOpacity="0.25" />
          <rect x={pos.x - 6} y={pos.y + 9} width="12" height="4" rx="2" fill="white" fillOpacity="0.2" />
        </g>
      ))}

      {/* Connection lines from students to center */}
      {[
        { x1: 115, y1: 90, delay: '0.9s' },
        { x1: 105, y1: 170, delay: '1.1s' },
        { x1: 115, y1: 250, delay: '1.3s' },
      ].map((line, i) => (
        <line key={`line-left-${i}`} x1={line.x1} y1={line.y1} x2="200" y2="170"
          stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="6 4"
          className="animate-feature-dash" style={{ animationDelay: line.delay }}
        />
      ))}

      {/* Connection lines from center to targets */}
      {[
        { x2: 365, y2: 90, delay: '1s' },
        { x2: 375, y2: 170, delay: '1.2s' },
        { x2: 365, y2: 250, delay: '1.4s' },
      ].map((line, i) => (
        <line key={`line-right-${i}`} x1="280" y1="170" x2={line.x2} y2={line.y2}
          stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="6 4"
          className="animate-feature-dash" style={{ animationDelay: line.delay }}
        />
      ))}

      {/* Match percentage badges */}
      {[
        { x: 390, y: 65, text: '95%', delay: '1.6s' },
        { x: 400, y: 145, text: '87%', delay: '1.8s' },
        { x: 390, y: 225, text: '72%', delay: '2s' },
      ].map((badge, i) => (
        <g key={`badge-${i}`} className="animate-feature-pop" style={{ animationDelay: badge.delay }}>
          <rect x={badge.x - 4} y={badge.y} width="36" height="18" rx="9" fill="white" fillOpacity="0.25" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
          <text x={badge.x + 14} y={badge.y + 13} textAnchor="middle" fill="white" fontSize="10" fontWeight="600" fontFamily="system-ui">{badge.text}</text>
        </g>
      ))}

      {/* Animated scanning particles */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={`particle-${i}`} r="3" fill="white" fillOpacity="0.6"
          className="animate-feature-orbit"
          style={{ animationDelay: `${i * 1.2}s`, animationDuration: '4.8s', transformOrigin: '240px 170px' }}
        >
          <animateMotion dur="4s" repeatCount="indefinite" begin={`${i * 1}s`}>
            <mpath href={`#orbit-path-${i % 2}`} />
          </animateMotion>
        </circle>
      ))}
      <defs>
        <path id="orbit-path-0" d="M200,170 Q200,120 240,120 Q280,120 280,170 Q280,220 240,220 Q200,220 200,170" />
        <path id="orbit-path-1" d="M210,170 Q210,130 240,130 Q270,130 270,170 Q270,210 240,210 Q210,210 210,170" />
      </defs>
    </svg>
  );
}

export function NotificationsAnimation() {
  return (
    <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background card */}
      <rect x="40" y="30" width="400" height="300" rx="20" fill="white" fillOpacity="0.1" />

      {/* Phone / device frame */}
      <g className="animate-feature-fade-in" style={{ animationDelay: '0.2s' }}>
        <rect x="160" y="50" width="160" height="270" rx="20" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
        {/* Status bar */}
        <rect x="200" y="58" width="80" height="4" rx="2" fill="white" fillOpacity="0.3" />
      </g>

      {/* Bell icon at top of phone */}
      <g className="animate-feature-ring" style={{ transformOrigin: '240px 95px' }}>
        <path d="M228 100 Q228 84 240 80 Q252 84 252 100 L254 104 L226 104 L228 100Z" fill="white" fillOpacity="0.3" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="240" cy="78" r="3" fill="white" fillOpacity="0.5" />
        <path d="M234 104 Q237 110 240 110 Q243 110 246 104" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" fill="none" />
      </g>

      {/* Notification badge */}
      <g className="animate-feature-pop" style={{ animationDelay: '0.8s' }}>
        <circle cx="254" cy="82" r="10" fill="white" fillOpacity="0.3" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
        <text x="254" y="86" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">3</text>
      </g>

      {/* Notification cards stacking in */}
      {[
        { y: 120, delay: '0.5s', opacity: 0.25 },
        { y: 166, delay: '0.8s', opacity: 0.2 },
        { y: 212, delay: '1.1s', opacity: 0.15 },
      ].map((card, i) => (
        <g key={`notif-${i}`} className="animate-feature-slide-in-right" style={{ animationDelay: card.delay }}>
          <rect x="172" y={card.y} width="136" height="38" rx="10" fill="white" fillOpacity={card.opacity} stroke="white" strokeOpacity={0.4 - i * 0.08} strokeWidth="1" />
          {/* Icon circle */}
          <circle cx="190" cy={card.y + 19} r="10" fill="white" fillOpacity={0.2 + (2 - i) * 0.05} />
          {/* Text lines */}
          <rect x="206" y={card.y + 10} width={70 - i * 10} height="6" rx="3" fill="white" fillOpacity={0.5 - i * 0.1} />
          <rect x="206" y={card.y + 22} width={50 - i * 5} height="4" rx="2" fill="white" fillOpacity={0.3 - i * 0.05} />
        </g>
      ))}

      {/* Incoming notification from left */}
      <g className="animate-feature-fly-in" style={{ animationDelay: '2s' }}>
        <rect x="50" y="140" width="90" height="50" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="72" cy="158" r="8" fill="white" fillOpacity="0.2" />
        <rect x="86" y="152" width="40" height="5" rx="2.5" fill="white" fillOpacity="0.4" />
        <rect x="86" y="162" width="28" height="4" rx="2" fill="white" fillOpacity="0.25" />
      </g>

      {/* Incoming notification from right */}
      <g className="animate-feature-fly-in-right" style={{ animationDelay: '2.8s' }}>
        <rect x="340" y="200" width="90" height="50" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="362" cy="218" r="8" fill="white" fillOpacity="0.2" />
        <rect x="376" y="212" width="40" height="5" rx="2.5" fill="white" fillOpacity="0.4" />
        <rect x="376" y="222" width="28" height="4" rx="2" fill="white" fillOpacity="0.25" />
      </g>

      {/* Signal waves from bell */}
      {[0, 1, 2].map((i) => (
        <g key={`wave-${i}`}>
          <path
            d={`M${218 - i * 12} ${90 - i * 6} Q${210 - i * 14} ${80 - i * 8} ${218 - i * 12} ${70 - i * 6}`}
            stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="none"
            className="animate-feature-wave" style={{ animationDelay: `${i * 0.3}s` }}
          />
          <path
            d={`M${262 + i * 12} ${90 - i * 6} Q${270 + i * 14} ${80 - i * 8} ${262 + i * 12} ${70 - i * 6}`}
            stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="none"
            className="animate-feature-wave" style={{ animationDelay: `${i * 0.3 + 0.15}s` }}
          />
        </g>
      ))}

      {/* Floating dots / particles */}
      {[
        { cx: 100, cy: 80, r: 3, delay: '0s' },
        { cx: 380, cy: 100, r: 2, delay: '1s' },
        { cx: 120, cy: 280, r: 2.5, delay: '2s' },
        { cx: 370, cy: 290, r: 3, delay: '0.5s' },
      ].map((dot, i) => (
        <circle key={`dot-${i}`} cx={dot.cx} cy={dot.cy} r={dot.r}
          fill="white" fillOpacity="0.3"
          className="animate-feature-float"
          style={{ animationDelay: dot.delay }}
        />
      ))}
    </svg>
  );
}
