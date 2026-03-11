"use client"

import { SVGProps } from "react"

// Tractor icon – hand-crafted SVG
export function TractorIcon({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Body */}
      <rect x="20" y="20" width="28" height="16" rx="3" fill="currentColor" opacity="0.9" />
      {/* Hood */}
      <rect x="32" y="14" width="16" height="10" rx="2" fill="currentColor" />
      {/* Exhaust pipe */}
      <rect x="44" y="8" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.7" />
      {/* Smoke dot */}
      <circle cx="45.5" cy="6" r="2" fill="currentColor" opacity="0.4" />
      {/* Cabin window */}
      <rect x="34" y="16" width="8" height="6" rx="1" fill="white" opacity="0.4" />
      {/* Rear big wheel */}
      <circle cx="28" cy="40" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="28" cy="40" r="4" fill="currentColor" opacity="0.5" />
      {/* Tread marks */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1={28 + 6 * Math.cos((angle * Math.PI) / 180)}
          y1={40 + 6 * Math.sin((angle * Math.PI) / 180)}
          x2={28 + 9.5 * Math.cos((angle * Math.PI) / 180)}
          y2={40 + 9.5 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      {/* Front small wheel */}
      <circle cx="46" cy="42" r="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="46" cy="42" r="2" fill="currentColor" opacity="0.5" />
      {/* Axle connection */}
      <line x1="28" y1="36" x2="46" y2="36" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    </svg>
  )
}

// Wheat / grain bundle icon
export function WheatIcon({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Stem */}
      <path d="M32 56 Q32 36 32 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left leaves */}
      <path d="M32 40 Q22 34 18 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M32 32 Q22 26 20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Right leaves */}
      <path d="M32 40 Q42 34 46 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M32 32 Q42 26 44 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Grain head - left */}
      <ellipse cx="20" cy="23" rx="4" ry="6" fill="currentColor" opacity="0.8" transform="rotate(-20 20 23)" />
      <ellipse cx="22" cy="15" rx="3" ry="5" fill="currentColor" opacity="0.8" transform="rotate(-15 22 15)" />
      {/* Grain head - right */}
      <ellipse cx="44" cy="23" rx="4" ry="6" fill="currentColor" opacity="0.8" transform="rotate(20 44 23)" />
      <ellipse cx="42" cy="15" rx="3" ry="5" fill="currentColor" opacity="0.8" transform="rotate(15 42 15)" />
      {/* Top grain */}
      <ellipse cx="32" cy="12" rx="3.5" ry="6" fill="currentColor" opacity="0.9" />
      {/* Awns (Grannen) */}
      <line x1="32" y1="6" x2="30" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="6" x2="32" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="6" x2="34" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Money bag / Förderung icon
export function MoneyBagIcon({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Bag body */}
      <path
        d="M16 38 C16 26 22 20 32 20 C42 20 48 26 48 38 C48 50 42 56 32 56 C22 56 16 50 16 38Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Bag neck */}
      <rect x="26" y="14" width="12" height="8" rx="4" fill="currentColor" opacity="0.7" />
      {/* Knot */}
      <ellipse cx="32" cy="14" rx="6" ry="3" fill="currentColor" />
      {/* Euro sign */}
      <text x="32" y="43" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" fontFamily="sans-serif">€</text>
      {/* Shine */}
      <ellipse cx="24" cy="32" rx="3" ry="5" fill="white" opacity="0.15" transform="rotate(-20 24 32)" />
    </svg>
  )
}

// Barn / Stall icon
export function BarnIcon({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Roof */}
      <path d="M8 26 L32 8 L56 26" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M12 26 L32 12 L52 26 L52 56 L12 56Z" fill="currentColor" opacity="0.15" />
      {/* Roof fill */}
      <path d="M10 26 L32 10 L54 26" fill="currentColor" opacity="0.6" />
      {/* Walls */}
      <rect x="12" y="26" width="40" height="30" rx="1" fill="currentColor" opacity="0.8" />
      {/* Door */}
      <path d="M26 56 L26 40 Q32 36 38 40 L38 56" fill="white" opacity="0.3" />
      {/* Windows */}
      <rect x="16" y="32" width="8" height="7" rx="1" fill="white" opacity="0.35" />
      <rect x="40" y="32" width="8" height="7" rx="1" fill="white" opacity="0.35" />
      {/* Cross on door */}
      <line x1="32" y1="40" x2="32" y2="56" stroke="white" strokeWidth="1" opacity="0.4" />
      <line x1="26" y1="48" x2="38" y2="48" stroke="white" strokeWidth="1" opacity="0.4" />
      {/* Solar panel on roof hint */}
      <rect x="36" y="15" width="10" height="7" rx="1" fill="white" opacity="0.2" />
    </svg>
  )
}

// Sun / sunshine icon for Tierwohl/outdoor
export function SunLeafIcon({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={32 + 14 * Math.cos((angle * Math.PI) / 180)}
          y1={32 + 14 * Math.sin((angle * Math.PI) / 180)}
          x2={32 + 20 * Math.cos((angle * Math.PI) / 180)}
          y2={32 + 20 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      {/* Sun body */}
      <circle cx="32" cy="32" r="10" fill="currentColor" />
      {/* Leaf overlay */}
      <path
        d="M32 36 Q24 28 28 18 Q38 22 36 32 Z"
        fill="white"
        opacity="0.35"
      />
    </svg>
  )
}

// Field rows / planted furrows
export function FieldRowsIcon({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Horizon line */}
      <line x1="4" y1="34" x2="60" y2="34" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      {/* Furrow rows — converging to center horizon (perspective) */}
      <path d="M32 34 L4 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M32 34 L60 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M32 34 L14 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <path d="M32 34 L50 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <path d="M32 34 L22 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M32 34 L42 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Sky: wheat stalks on horizon */}
      <line x1="16" y1="34" x2="16" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="16" cy="21" rx="2.5" ry="4" fill="currentColor" opacity="0.5" />
      <line x1="24" y1="34" x2="24" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="24" cy="19" rx="2.5" ry="4" fill="currentColor" opacity="0.5" />
      <line x1="32" y1="34" x2="32" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="32" cy="17" rx="2.5" ry="4" fill="currentColor" opacity="0.6" />
      <line x1="40" y1="34" x2="40" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="40" cy="19" rx="2.5" ry="4" fill="currentColor" opacity="0.5" />
      <line x1="48" y1="34" x2="48" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="48" cy="21" rx="2.5" ry="4" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

// Cow silhouette
export function CowSilhouetteIcon({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Body */}
      <ellipse cx="32" cy="36" rx="18" ry="11" fill="currentColor" opacity="0.85" />
      {/* Head */}
      <ellipse cx="49" cy="28" rx="8" ry="7" fill="currentColor" opacity="0.85" />
      {/* Snout */}
      <ellipse cx="56" cy="30" rx="4" ry="3" fill="currentColor" opacity="0.7" />
      {/* Nostrils */}
      <circle cx="55" cy="31" r="0.8" fill="white" opacity="0.6" />
      <circle cx="57" cy="31" r="0.8" fill="white" opacity="0.6" />
      {/* Eye */}
      <circle cx="50" cy="26" r="1.2" fill="white" opacity="0.7" />
      {/* Ear */}
      <ellipse cx="44" cy="22" rx="2.5" ry="4" fill="currentColor" opacity="0.7" transform="rotate(-20 44 22)" />
      {/* Legs */}
      <rect x="19" y="44" width="4" height="10" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="26" y="45" width="4" height="10" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="35" y="45" width="4" height="10" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="42" y="44" width="4" height="10" rx="2" fill="currentColor" opacity="0.8" />
      {/* Udder */}
      <ellipse cx="29" cy="46" rx="5" ry="3" fill="currentColor" opacity="0.5" />
      {/* Tail */}
      <path d="M14 34 Q8 28 10 22 Q12 20 14 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Spot */}
      <ellipse cx="30" cy="33" rx="5" ry="4" fill="white" opacity="0.25" />
    </svg>
  )
}

// Gülle / slurry tank
export function GuelleIcon({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Tank cylinder */}
      <ellipse cx="32" cy="20" rx="20" ry="6" fill="currentColor" opacity="0.4" />
      <rect x="12" y="20" width="40" height="24" fill="currentColor" opacity="0.75" />
      <ellipse cx="32" cy="44" rx="20" ry="6" fill="currentColor" opacity="0.85" />
      {/* Cover band */}
      <ellipse cx="32" cy="20" rx="20" ry="6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.9" />
      {/* Dome top */}
      <path d="M12 20 Q32 10 52 20" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Pipe out */}
      <rect x="28" y="44" width="8" height="10" rx="2" fill="currentColor" opacity="0.7" />
      <rect x="24" y="52" width="16" height="4" rx="2" fill="currentColor" opacity="0.7" />
      {/* Valve */}
      <circle cx="32" cy="38" r="4" fill="white" opacity="0.2" />
      <line x1="32" y1="35" x2="32" y2="41" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="29" y1="38" x2="35" y2="38" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

// Checkmark shield (Fördersicherheit)
export function ShieldCheckAgriIcon({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M32 6 L52 14 L52 32 C52 44 42 54 32 58 C22 54 12 44 12 32 L12 14 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Wheat stalk inside shield */}
      <path d="M32 46 Q32 34 32 24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M32 36 Q27 32 25 27" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M32 36 Q37 32 39 27" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Check */}
      <path d="M22 32 L29 39 L42 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
