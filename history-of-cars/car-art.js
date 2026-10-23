/**
 * The History of Cars - Vector Art & Silhouette Engine
 * Generates custom, stylized SVG automotive silhouettes with glowing headlights,
 * wheels with rotating hubs, and authentic bodywork contours.
 */

export function renderCarSvg(car, options = {}) {
  const { width = 480, height = 220, isInteractive = true } = options;
  const theme = car.colorTheme || '#38bdf8';
  const id = car.id;
  
  // Specific custom SVG profiles for key vehicle types
  switch (car.svgSilhouette) {
    case 'steam-cart':
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="boiler-${id}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#b45309" />
              <stop offset="100%" stop-color="#78350f" />
            </radialGradient>
          </defs>
          <!-- Steam Smoke Puffs -->
          <circle cx="80" cy="50" r="14" fill="#ffffff" opacity="0.25" class="steam-particle" />
          <circle cx="95" cy="30" r="22" fill="#ffffff" opacity="0.18" class="steam-particle" />
          <circle cx="115" cy="15" r="30" fill="#ffffff" opacity="0.1" class="steam-particle" />
          <!-- Heavy Front Copper Boiler -->
          <ellipse cx="105" cy="130" rx="45" ry="50" fill="url(#boiler-${id})" stroke="#d97706" stroke-width="3" />
          <rect x="95" y="65" width="20" height="40" fill="#451a03" stroke="#92400e" stroke-width="2" rx="4" />
          <!-- Steam Pipes & Levers -->
          <path d="M110 75 Q150 70 190 120" stroke="#b45309" stroke-width="6" fill="none" />
          <line x1="175" y1="120" x2="230" y2="70" stroke="#78350f" stroke-width="5" />
          <!-- Massive Wooden Beam Chassis -->
          <rect x="80" y="145" width="360" height="22" fill="#713f12" stroke="#451a03" stroke-width="3" rx="3" />
          <!-- High Driver Bench Seat -->
          <path d="M210 145 L225 100 L265 100 L275 145 Z" fill="#451a03" stroke="#292524" stroke-width="2" />
          <rect x="220" y="90" width="50" height="12" fill="#854d0e" rx="2" />
          <!-- Front Single Drive Wheel -->
          <g class="wheel-group">
            <circle cx="105" cy="175" r="42" fill="#292524" stroke="#d97706" stroke-width="6" />
            <circle cx="105" cy="175" r="10" fill="#d97706" />
            <line x1="105" y1="133" x2="105" y2="217" stroke="#a16207" stroke-width="3" />
            <line x1="63" y1="175" x2="147" y2="175" stroke="#a16207" stroke-width="3" />
            <line x1="75" y1="145" x2="135" y2="205" stroke="#a16207" stroke-width="3" />
            <line x1="75" y1="205" x2="135" y2="145" stroke="#a16207" stroke-width="3" />
          </g>
          <!-- Rear Giant Wagon Wheels -->
          <g class="wheel-group">
            <circle cx="380" cy="165" r="56" fill="#1c1917" stroke="#78350f" stroke-width="8" />
            <circle cx="380" cy="165" r="12" fill="#d97706" />
            <line x1="380" y1="109" x2="380" y2="221" stroke="#a16207" stroke-width="4" />
            <line x1="324" y1="165" x2="436" y2="165" stroke="#a16207" stroke-width="4" />
            <line x1="340" y1="125" x2="420" y2="205" stroke="#a16207" stroke-width="3" />
            <line x1="340" y1="205" x2="420" y2="125" stroke="#a16207" stroke-width="3" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="225" rx="190" ry="8" fill="#000000" opacity="0.4" />
        </svg>
      `;

    case 'motorwagen':
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="brass-${id}">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="100%" stop-color="#ca8a04" />
            </radialGradient>
          </defs>
          <!-- Tubular Steel Framework -->
          <path d="M120 180 L220 175 L360 175 L330 115 L220 120 L150 145 Z" fill="none" stroke="#262626" stroke-width="5" />
          <line x1="120" y1="180" x2="220" y2="120" stroke="#171717" stroke-width="4" />
          <line x1="220" y1="175" x2="260" y2="90" stroke="#171717" stroke-width="4" />
          <line x1="360" y1="175" x2="300" y2="120" stroke="#171717" stroke-width="4" />
          <!-- Steering Tiller Column -->
          <line x1="120" y1="180" x2="160" y2="95" stroke="#ca8a04" stroke-width="4" />
          <line x1="145" y1="95" x2="175" y2="95" stroke="#171717" stroke-width="5" />
          <!-- Leather Padded Bench Seat -->
          <path d="M220 120 Q240 70 270 75 L285 118 Z" fill="#451a03" stroke="#78350f" stroke-width="3" />
          <rect x="230" y="112" width="60" height="10" fill="#713f12" rx="3" />
          <!-- Rear Horizontal Flywheel Engine -->
          <ellipse cx="330" cy="155" rx="28" ry="12" fill="#78716c" stroke="#44403c" stroke-width="3" />
          <circle cx="330" cy="155" r="6" fill="#ca8a04" />
          <!-- Front Single Wire-Spoke Wheel -->
          <g class="wheel-group">
            <circle cx="120" cy="180" r="38" fill="none" stroke="#52525b" stroke-width="3" />
            <circle cx="120" cy="180" r="5" fill="#ca8a04" />
            ${Array.from({length: 12}).map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const x2 = 120 + 38 * Math.cos(angle);
              const y2 = 180 + 38 * Math.sin(angle);
              return `<line x1="120" y1="180" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#a1a1aa" stroke-width="1" />`;
            }).join('')}
          </g>
          <!-- Large Rear Wire-Spoke Wheel -->
          <g class="wheel-group">
            <circle cx="360" cy="165" r="58" fill="none" stroke="#52525b" stroke-width="4" />
            <circle cx="360" cy="165" r="8" fill="#ca8a04" />
            ${Array.from({length: 16}).map((_, i) => {
              const angle = (i * 22.5) * (Math.PI / 180);
              const x2 = 360 + 58 * Math.cos(angle);
              const y2 = 165 + 58 * Math.sin(angle);
              return `<line x1="360" y1="165" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#a1a1aa" stroke-width="1.2" />`;
            }).join('')}
          </g>
          <!-- Soft Shadow -->
          <ellipse cx="240" cy="225" rx="160" ry="7" fill="#000000" opacity="0.4" />
        </svg>
      `;

    case 'bullet-car': // La Jamais Contente
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="metal-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#e2e8f0" />
              <stop offset="60%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
          </defs>
          <!-- High Exposed Driver -->
          <circle cx="270" cy="95" r="14" fill="#38bdf8" />
          <path d="M260 110 L285 110 L290 135 L255 135 Z" fill="#1e293b" />
          <line x1="280" y1="115" x2="260" y2="125" stroke="#e2e8f0" stroke-width="3" />
          <!-- Cigar Torpedo Aerodynamic Body -->
          <path d="M60 148 C100 120 380 120 440 148 C420 170 360 178 60 178 Z" fill="url(#metal-${id})" stroke="#cbd5e1" stroke-width="2" />
          <!-- Nose Conical Tip -->
          <polygon points="440,148 470,154 440,160" fill="#94a3b8" />
          <!-- Rivet seams along torpedo -->
          <line x1="140" y1="128" x2="140" y2="175" stroke="#334155" stroke-dasharray="3,3" stroke-width="2" />
          <line x1="240" y1="124" x2="240" y2="177" stroke="#334155" stroke-dasharray="3,3" stroke-width="2" />
          <line x1="340" y1="126" x2="340" y2="175" stroke="#334155" stroke-dasharray="3,3" stroke-width="2" />
          <!-- Electric Battery/Motor Sump Box -->
          <rect x="180" y="172" width="160" height="18" fill="#1e293b" rx="4" />
          <!-- Front & Rear Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="180" r="34" fill="#1e293b" stroke="#64748b" stroke-width="5" />
            <circle cx="140" cy="180" r="8" fill="#e2e8f0" />
          </g>
          <g class="wheel-group">
            <circle cx="360" cy="180" r="34" fill="#1e293b" stroke="#64748b" stroke-width="5" />
            <circle cx="360" cy="180" r="8" fill="#e2e8f0" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="216" rx="180" ry="7" fill="#000000" opacity="0.45" />
        </svg>
      `;

    case 'model-t':
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="body-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#262626" />
              <stop offset="100%" stop-color="#0a0a0a" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="440,150 510,120 510,210 440,165" fill="#fef08a" opacity="0.25" class="headlight-beam" />
          <!-- Brass Lanterns -->
          <circle cx="435" cy="155" r="9" fill="#eab308" stroke="#ca8a04" stroke-width="2" class="headlight" />
          <!-- Tall Carriage Cabin Top -->
          <path d="M120 95 L140 60 L330 60 L345 95 Z" fill="#171717" stroke="#404040" stroke-width="2" />
          <!-- Window Pillars & Folding Windscreen -->
          <rect x="145" y="66" width="70" height="42" fill="#38bdf8" opacity="0.3" stroke="#262626" stroke-width="2" />
          <rect x="235" y="66" width="85" height="42" fill="#38bdf8" opacity="0.3" stroke="#262626" stroke-width="2" />
          <line x1="330" y1="60" x2="335" y2="115" stroke="#eab308" stroke-width="3" />
          <!-- Main Body Tub -->
          <path d="M110 115 L345 115 L350 145 L430 145 L430 170 L110 170 Z" fill="url(#body-${id})" stroke="#262626" stroke-width="2" />
          <!-- Louvered Engine Hood -->
          <line x1="370" y1="125" x2="370" y2="140" stroke="#525252" stroke-width="2" />
          <line x1="385" y1="125" x2="385" y2="140" stroke="#525252" stroke-width="2" />
          <line x1="400" y1="125" x2="400" y2="140" stroke="#525252" stroke-width="2" />
          <line x1="415" y1="125" x2="415" y2="140" stroke="#525252" stroke-width="2" />
          <!-- Sweeping Fenders & Running Board -->
          <path d="M85 170 C95 135 155 135 170 170 L340 170 C355 135 415 135 435 170" fill="none" stroke="#171717" stroke-width="8" />
          <!-- Spoke Wheels -->
          <g class="wheel-group">
            <circle cx="130" cy="180" r="38" fill="#171717" stroke="#713f12" stroke-width="6" />
            <circle cx="130" cy="180" r="8" fill="#ca8a04" />
          </g>
          <g class="wheel-group">
            <circle cx="390" cy="180" r="38" fill="#171717" stroke="#713f12" stroke-width="6" />
            <circle cx="390" cy="180" r="8" fill="#ca8a04" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="222" rx="190" ry="7" fill="#000000" opacity="0.45" />
        </svg>
      `;

    case 'atlantic-coupe': // Bugatti Type 57SC Atlantic
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="atlantic-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="40%" stop-color="#0284c7" />
              <stop offset="100%" stop-color="#082f49" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="455,145 520,110 520,200 455,160" fill="#bae6fd" opacity="0.25" class="headlight-beam" />
          <!-- Art Deco Teardrop Body -->
          <path d="M70 160 C80 100 180 65 260 70 C340 75 420 115 450 145 C455 160 440 170 410 170 C370 170 340 135 300 135 C240 135 190 170 110 170 Z" fill="url(#atlantic-${id})" stroke="#0369a1" stroke-width="2" />
          <!-- Riveted Dorsal Fin (The defining Atlantic feature!) -->
          <path d="M90 150 C120 90 200 62 270 65 C340 68 400 105 440 140" fill="none" stroke="#e0f2fe" stroke-width="3" stroke-dasharray="4,3" />
          <!-- Small Kidney Windows -->
          <path d="M210 85 C240 80 270 82 285 105 L215 105 Z" fill="#0284c7" opacity="0.4" stroke="#e0f2fe" stroke-width="1.5" />
          <!-- Front Swept Teardrop Fenders -->
          <path d="M340 170 C350 115 435 115 450 170" fill="none" stroke="#0284c7" stroke-width="10" />
          <circle cx="445" cy="148" r="9" fill="#fef08a" stroke="#ca8a04" stroke-width="2" class="headlight" />
          <!-- Rear Covered Spats Fender -->
          <path d="M80 170 C90 120 180 120 190 170" fill="none" stroke="#0284c7" stroke-width="12" />
          <!-- Spoke Wire Wheels with Knockoffs -->
          <g class="wheel-group">
            <circle cx="140" cy="175" r="36" fill="#0f172a" stroke="#94a3b8" stroke-width="6" />
            <circle cx="140" cy="175" r="10" fill="#38bdf8" />
          </g>
          <g class="wheel-group">
            <circle cx="395" cy="175" r="36" fill="#0f172a" stroke="#94a3b8" stroke-width="6" />
            <circle cx="395" cy="175" r="10" fill="#38bdf8" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="216" rx="200" ry="7" fill="#000000" opacity="0.5" />
        </svg>
      `;

    case 'beetle':
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="beetle-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#0369a1" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="440,150 515,120 515,200 440,165" fill="#fef08a" opacity="0.25" class="headlight-beam" />
          <circle cx="435" cy="152" r="11" fill="#fef08a" stroke="#cbd5e1" stroke-width="2" class="headlight" />
          <!-- Round Bubble Roof & Body -->
          <path d="M85 160 C90 110 160 65 250 65 C340 65 410 110 440 160 L435 170 L85 170 Z" fill="url(#beetle-${id})" stroke="#0284c7" stroke-width="2" />
          <!-- Curved Windows -->
          <path d="M165 110 C180 80 230 75 245 75 L245 112 Z" fill="#bae6fd" opacity="0.4" stroke="#0284c7" stroke-width="1.5" />
          <path d="M255 75 C275 75 320 80 335 110 L255 110 Z" fill="#bae6fd" opacity="0.4" stroke="#0284c7" stroke-width="1.5" />
          <!-- Pronounced Rounded Fenders -->
          <path d="M80 170 C90 120 180 120 190 170" fill="none" stroke="#0284c7" stroke-width="12" />
          <path d="M330 170 C340 120 430 120 445 170" fill="none" stroke="#0284c7" stroke-width="12" />
          <!-- Chrome Hubcap Wheels -->
          <g class="wheel-group">
            <circle cx="135" cy="175" r="36" fill="#1e293b" stroke="#cbd5e1" stroke-width="5" />
            <circle cx="135" cy="175" r="14" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
          </g>
          <g class="wheel-group">
            <circle cx="385" cy="175" r="36" fill="#1e293b" stroke="#cbd5e1" stroke-width="5" />
            <circle cx="385" cy="175" r="14" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="216" rx="190" ry="7" fill="#000000" opacity="0.45" />
        </svg>
      `;

    case 'gullwing': // Mercedes-Benz 300 SL
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="silver-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f1f5f9" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="455,145 520,110 520,195 455,160" fill="#fef08a" opacity="0.3" class="headlight-beam" />
          <circle cx="450" cy="148" r="10" fill="#fef08a" stroke="#e2e8f0" stroke-width="2" class="headlight" />
          <!-- Low-Slung Gullwing Silhouette -->
          <path d="M70 155 C80 135 150 115 210 110 C240 75 300 75 340 108 C390 112 445 125 460 148 C465 160 440 168 400 168 C350 168 330 135 290 135 C230 135 200 168 110 168 Z" fill="url(#silver-${id})" stroke="#94a3b8" stroke-width="2" />
          <!-- Gullwing Door Cutline (Roof Pivot) -->
          <path d="M245 76 L250 110 L300 110 L310 77" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="3,2" />
          <!-- Side Fender "Eyebrow" Flairs -->
          <path d="M100 140 Q140 128 180 140" fill="none" stroke="#475569" stroke-width="3" />
          <path d="M350 140 Q390 128 430 140" fill="none" stroke="#475569" stroke-width="3" />
          <!-- Side Vent Strakes -->
          <line x1="335" y1="130" x2="355" y2="130" stroke="#334155" stroke-width="3" />
          <line x1="335" y1="136" x2="355" y2="136" stroke="#334155" stroke-width="3" />
          <!-- Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="170" r="35" fill="#1e293b" stroke="#cbd5e1" stroke-width="6" />
            <circle cx="140" cy="170" r="12" fill="#3b82f6" stroke="#cbd5e1" stroke-width="2" />
          </g>
          <g class="wheel-group">
            <circle cx="390" cy="170" r="35" fill="#1e293b" stroke="#cbd5e1" stroke-width="6" />
            <circle cx="390" cy="170" r="12" fill="#3b82f6" stroke="#cbd5e1" stroke-width="2" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="210" rx="200" ry="6" fill="#000000" opacity="0.5" />
        </svg>
      `;

    case 'porsche-911':
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="p911-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ea580c" />
              <stop offset="50%" stop-color="#c2410c" />
              <stop offset="100%" stop-color="#7c2d12" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="455,140 520,105 520,195 455,155" fill="#fef08a" opacity="0.3" class="headlight-beam" />
          <circle cx="448" cy="142" r="11" fill="#fef08a" stroke="#e2e8f0" stroke-width="2" class="headlight" />
          <!-- The Iconic Unmistakable 911 Flyline -->
          <path d="M70 155 C75 140 100 128 140 120 C185 80 270 70 340 75 C370 100 420 125 455 140 C465 155 440 168 400 168 C355 168 335 135 290 135 C230 135 200 168 110 168 Z" fill="url(#p911-${id})" stroke="#9a3412" stroke-width="2" />
          <!-- Targa / Coupe Quarter Window Curve -->
          <path d="M210 115 C240 85 295 85 330 115 Z" fill="#fed7aa" opacity="0.35" stroke="#7c2d12" stroke-width="1.5" />
          <!-- Fuchs Cloverleaf Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="170" r="35" fill="#18181b" stroke="#71717a" stroke-width="5" />
            <circle cx="140" cy="170" r="14" fill="#000000" stroke="#e4e4e7" stroke-width="3" />
          </g>
          <g class="wheel-group">
            <circle cx="390" cy="170" r="35" fill="#18181b" stroke="#71717a" stroke-width="5" />
            <circle cx="390" cy="170" r="14" fill="#000000" stroke="#e4e4e7" stroke-width="3" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="210" rx="200" ry="6" fill="#000000" opacity="0.5" />
        </svg>
      `;

    case 'miura': // Lamborghini Miura
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="miura-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fbbf24" />
              <stop offset="50%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="460,140 520,105 520,195 460,155" fill="#fef08a" opacity="0.3" class="headlight-beam" />
          <!-- Pop-up Headlight with Eyelash details -->
          <ellipse cx="448" cy="138" rx="10" ry="7" fill="#fef08a" stroke="#171717" stroke-width="2" class="headlight" />
          <line x1="440" y1="128" x2="442" y2="133" stroke="#171717" stroke-width="2" />
          <line x1="448" y1="126" x2="448" y2="132" stroke="#171717" stroke-width="2" />
          <line x1="456" y1="128" x2="454" y2="133" stroke="#171717" stroke-width="2" />
          <!-- Sensuous Mid-Engine S-curve Profile -->
          <path d="M60 155 C70 135 120 115 170 110 C210 82 280 80 320 105 C380 110 440 120 465 142 C470 155 450 166 405 166 C360 166 340 135 300 135 C230 135 200 166 110 166 Z" fill="url(#miura-${id})" stroke="#b45309" stroke-width="2" />
          <!-- Rear Window Louvers -->
          <line x1="190" y1="112" x2="225" y2="112" stroke="#171717" stroke-width="2" />
          <line x1="200" y1="104" x2="235" y2="104" stroke="#171717" stroke-width="2" />
          <line x1="210" y1="96" x2="245" y2="96" stroke="#171717" stroke-width="2" />
          <!-- Campagnolo Gold Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="168" r="36" fill="#18181b" stroke="#ca8a04" stroke-width="6" />
            <circle cx="140" cy="168" r="10" fill="#eab308" />
          </g>
          <g class="wheel-group">
            <circle cx="395" cy="168" r="36" fill="#18181b" stroke="#ca8a04" stroke-width="6" />
            <circle cx="395" cy="168" r="10" fill="#eab308" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="208" rx="205" ry="6" fill="#000000" opacity="0.5" />
        </svg>
      `;

    case 'countach': // Lamborghini Countach
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="countach-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="40%" stop-color="#facc15" />
              <stop offset="100%" stop-color="#a16207" />
            </linearGradient>
          </defs>
          <!-- Pop-up Headlight Beam -->
          <polygon points="465,145 520,110 520,200 465,160" fill="#fef08a" opacity="0.35" class="headlight-beam" />
          <!-- Sharp Origami Wedge Body -->
          <polygon points="50,152 70,140 180,115 280,90 380,125 470,148 465,168 410,168 360,138 290,138 210,168 100,168" fill="url(#countach-${id})" stroke="#ca8a04" stroke-width="2" />
          <!-- Scissor Door Cutline -->
          <line x1="280" y1="90" x2="300" y2="148" stroke="#713f12" stroke-width="2" />
          <!-- Massive Rear Intake Shoulder Box & NACA Duct -->
          <polygon points="160,120 220,118 200,132" fill="#171717" />
          <polygon points="120,115 155,100 170,120 135,125" fill="#ca8a04" stroke="#713f12" stroke-width="1.5" />
          <!-- Iconic Countach Revolver Phone-Dial Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="170" r="36" fill="#18181b" stroke="#cbd5e1" stroke-width="6" />
            <circle cx="140" cy="170" r="16" fill="#f8fafc" stroke="#475569" stroke-width="2" />
            <!-- Phone dial holes -->
            <circle cx="140" cy="160" r="3.5" fill="#18181b" />
            <circle cx="149" cy="167" r="3.5" fill="#18181b" />
            <circle cx="146" cy="178" r="3.5" fill="#18181b" />
            <circle cx="134" cy="178" r="3.5" fill="#18181b" />
            <circle cx="131" cy="167" r="3.5" fill="#18181b" />
          </g>
          <g class="wheel-group">
            <circle cx="400" cy="170" r="36" fill="#18181b" stroke="#cbd5e1" stroke-width="6" />
            <circle cx="400" cy="170" r="16" fill="#f8fafc" stroke="#475569" stroke-width="2" />
            <circle cx="400" cy="160" r="3.5" fill="#18181b" />
            <circle cx="409" cy="167" r="3.5" fill="#18181b" />
            <circle cx="406" cy="178" r="3.5" fill="#18181b" />
            <circle cx="394" cy="178" r="3.5" fill="#18181b" />
            <circle cx="391" cy="167" r="3.5" fill="#18181b" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="210" rx="210" ry="6" fill="#000000" opacity="0.55" />
        </svg>
      `;

    case 'ferrari-f40':
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="f40-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ef4444" />
              <stop offset="50%" stop-color="#dc2626" />
              <stop offset="100%" stop-color="#991b1b" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="465,145 525,110 525,200 465,160" fill="#fef08a" opacity="0.35" class="headlight-beam" />
          <!-- Twin Pop-up Lights / Lexan covers -->
          <rect x="430" y="132" width="22" height="8" fill="#fef08a" stroke="#7f1d1d" stroke-width="1.5" class="headlight" />
          <!-- Massive Squared Rear Wing -->
          <path d="M50 115 L105 115 L105 155 L65 155 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="2" />
          <line x1="50" y1="112" x2="115" y2="112" stroke="#dc2626" stroke-width="5" />
          <!-- Low Slung Carbon-Kevlar Wedge Body -->
          <polygon points="70,150 110,140 210,120 280,95 380,122 470,145 465,168 410,168 360,138 290,138 210,168 100,168" fill="url(#f40-${id})" stroke="#b91c1c" stroke-width="2" />
          <!-- Twin Front Hood NACA Ducts -->
          <polygon points="380,125 410,132 400,138" fill="#18181b" />
          <polygon points="340,122 370,129 360,135" fill="#18181b" />
          <!-- Slotted Lexan Rear Engine Cover Louvers -->
          <line x1="160" y1="125" x2="190" y2="125" stroke="#18181b" stroke-width="3" />
          <line x1="170" y1="117" x2="200" y2="117" stroke="#18181b" stroke-width="3" />
          <line x1="180" y1="109" x2="210" y2="109" stroke="#18181b" stroke-width="3" />
          <!-- Speedline 5-Spoke Star Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="170" r="36" fill="#18181b" stroke="#cbd5e1" stroke-width="5" />
            <circle cx="140" cy="170" r="12" fill="#ef4444" />
          </g>
          <g class="wheel-group">
            <circle cx="400" cy="170" r="36" fill="#18181b" stroke="#cbd5e1" stroke-width="5" />
            <circle cx="400" cy="170" r="12" fill="#ef4444" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="210" rx="210" ry="6" fill="#000000" opacity="0.6" />
        </svg>
      `;

    case 'mclaren-f1':
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="f1-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fb923c" />
              <stop offset="50%" stop-color="#f97316" />
              <stop offset="100%" stop-color="#c2410c" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="460,145 520,110 520,200 460,160" fill="#fef08a" opacity="0.35" class="headlight-beam" />
          <!-- Roof Air Snorkel Scoop -->
          <path d="M260 75 Q275 62 290 62 L300 76 Z" fill="#18181b" stroke="#ea580c" stroke-width="2" />
          <!-- Central Cockpit Greenhouse -->
          <path d="M200 115 C220 75 290 75 330 115 Z" fill="#0f172a" opacity="0.6" stroke="#c2410c" stroke-width="1.5" />
          <!-- Pure Carbon Monocoque Curves -->
          <path d="M60 152 C70 135 140 120 180 115 C210 80 290 80 340 108 C390 112 445 125 465 145 C470 158 440 168 400 168 C355 168 335 138 290 138 C230 138 200 168 110 168 Z" fill="url(#f1-${id})" stroke="#c2410c" stroke-width="2" />
          <!-- OZ Racing 5-Spoke Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="170" r="36" fill="#18181b" stroke="#94a3b8" stroke-width="5" />
            <circle cx="140" cy="170" r="10" fill="#000000" />
          </g>
          <g class="wheel-group">
            <circle cx="395" cy="170" r="36" fill="#18181b" stroke="#94a3b8" stroke-width="5" />
            <circle cx="395" cy="170" r="10" fill="#000000" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="210" rx="205" ry="6" fill="#000000" opacity="0.55" />
        </svg>
      `;

    case 'veyron': // Bugatti Veyron 16.4
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="veyron-blue-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#1d4ed8" />
            </linearGradient>
            <linearGradient id="veyron-dark-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1e293b" />
              <stop offset="100%" stop-color="#020617" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="460,145 525,110 525,200 460,160" fill="#38bdf8" opacity="0.35" class="headlight-beam" />
          <!-- Active Rear Spoiler / Airbrake deployed slightly -->
          <line x1="70" y1="125" x2="115" y2="120" stroke="#3b82f6" stroke-width="4" />
          <line x1="85" y1="125" x2="85" y2="135" stroke="#0f172a" stroke-width="2" />
          <!-- Base Dark Muscular Body (Lower & Rear) -->
          <path d="M60 155 C70 135 140 120 180 115 C210 82 290 82 340 108 C390 112 450 125 465 148 C470 160 440 168 400 168 C355 168 335 138 290 138 C230 138 200 168 110 168 Z" fill="url(#veyron-dark-${id})" stroke="#0f172a" stroke-width="2" />
          <!-- Iconic Two-Tone Side Horseshoe Ellipse -->
          <path d="M170 120 C230 110 320 110 350 145 C350 165 320 168 280 168 C220 168 190 145 170 120 Z" fill="url(#veyron-blue-${id})" stroke="#60a5fa" stroke-width="2" />
          <!-- Front Horseshoe Radiator Grille -->
          <ellipse cx="460" cy="155" rx="8" ry="12" fill="#0f172a" stroke="#cbd5e1" stroke-width="2" />
          <!-- Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="170" r="36" fill="#0f172a" stroke="#94a3b8" stroke-width="6" />
            <circle cx="140" cy="170" r="14" fill="#1e3a8a" stroke="#cbd5e1" stroke-width="2" />
          </g>
          <g class="wheel-group">
            <circle cx="395" cy="170" r="36" fill="#0f172a" stroke="#94a3b8" stroke-width="6" />
            <circle cx="395" cy="170" r="14" fill="#1e3a8a" stroke="#cbd5e1" stroke-width="2" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="210" rx="210" ry="6" fill="#000000" opacity="0.6" />
        </svg>
      `;

    case 'rimac-nevera':
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rimac-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#06b6d4" />
              <stop offset="50%" stop-color="#0891b2" />
              <stop offset="100%" stop-color="#0e7490" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="465,145 525,110 525,200 465,160" fill="#22d3ee" opacity="0.4" class="headlight-beam" />
          <!-- LED Headlight Strip -->
          <line x1="440" y1="140" x2="465" y2="148" stroke="#a5f3fc" stroke-width="3" class="headlight" />
          <!-- Sculpted Carbon Body with Cravat Side Aero Tunnel -->
          <path d="M55 152 C70 135 140 120 180 115 C210 82 290 82 340 108 C390 112 450 125 470 145 C475 160 440 168 400 168 C355 168 335 138 290 138 C230 138 200 168 110 168 Z" fill="url(#rimac-${id})" stroke="#0891b2" stroke-width="2" />
          <!-- Iconic Necktie / Cravat Side Air Intake -->
          <path d="M220 125 Q250 145 280 130 Q260 155 230 150 Z" fill="#020617" stroke="#22d3ee" stroke-width="1.5" />
          <!-- Neon Electric Cyan Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="170" r="36" fill="#020617" stroke="#22d3ee" stroke-width="4" />
            <circle cx="140" cy="170" r="14" fill="#0891b2" stroke="#a5f3fc" stroke-width="2" />
          </g>
          <g class="wheel-group">
            <circle cx="400" cy="170" r="36" fill="#020617" stroke="#22d3ee" stroke-width="4" />
            <circle cx="400" cy="170" r="14" fill="#0891b2" stroke="#a5f3fc" stroke-width="2" />
          </g>
          <!-- Electric Neon Ground Glow -->
          <ellipse cx="260" cy="208" rx="205" ry="7" fill="#06b6d4" opacity="0.35" class="neon-underglow" />
        </svg>
      `;

    case 'cybertruck':
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="steel-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#94a3b8" />
              <stop offset="45%" stop-color="#64748b" />
              <stop offset="100%" stop-color="#334155" />
            </linearGradient>
          </defs>
          <!-- Front Full-Width Lightbar Beam -->
          <polygon points="460,135 525,115 525,190 460,145" fill="#f8fafc" opacity="0.4" class="headlight-beam" />
          <line x1="455" y1="135" x2="465" y2="135" stroke="#ffffff" stroke-width="4" class="headlight" />
          <!-- The Unmistakable Triangle Origami Exoskeleton -->
          <polygon points="65,160 70,128 250,72 460,135 465,168 415,168 380,145 320,145 285,168 185,168 150,145 95,145 65,160" fill="url(#steel-${id})" stroke="#cbd5e1" stroke-width="2.5" />
          <!-- Angular Window Greenhouse -->
          <polygon points="175,130 250,82 340,118 340,132 175,130" fill="#0f172a" opacity="0.75" stroke="#94a3b8" stroke-width="1.5" />
          <!-- Angular Wheel Arches & Cyber Wheels -->
          <g class="wheel-group">
            <polygon points="105,170 120,145 160,145 175,170 160,195 120,195" fill="#020617" stroke="#475569" stroke-width="4" />
            <circle cx="140" cy="170" r="12" fill="#334155" />
          </g>
          <g class="wheel-group">
            <polygon points="365,170 380,145 420,145 435,170 420,195 380,195" fill="#020617" stroke="#475569" stroke-width="4" />
            <circle cx="400" cy="170" r="12" fill="#334155" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="214" rx="205" ry="6" fill="#000000" opacity="0.55" />
        </svg>
      `;

    case 'safety-shield': // Volvo 3-point seatbelt milestone
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="shield-glow-${id}">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1" />
            </radialGradient>
          </defs>
          <!-- Glowing Safety Crest -->
          <path d="M260 40 L340 70 L340 140 Q260 200 260 200 Q180 140 180 70 Z" fill="url(#shield-glow-${id})" stroke="#38bdf8" stroke-width="4" />
          <!-- The V-shaped 3-Point Belt Straps -->
          <line x1="210" y1="75" x2="280" y2="155" stroke="#f8fafc" stroke-width="14" stroke-linecap="round" />
          <line x1="210" y1="155" x2="280" y2="155" stroke="#f8fafc" stroke-width="14" stroke-linecap="round" />
          <!-- The Iconic Center Latch Buckle -->
          <rect x="270" y="145" width="26" height="22" fill="#ef4444" rx="4" stroke="#ffffff" stroke-width="2" />
          <text x="260" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8" text-anchor="middle">LIFE-SAVING OPEN PATENT (1959)</text>
        </svg>
      `;

    case 'future-aero': // 2030+ Morphing Hyper-GT
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="future-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10b981" />
              <stop offset="50%" stop-color="#059669" />
              <stop offset="100%" stop-color="#047857" />
            </linearGradient>
          </defs>
          <!-- Holographic Light Sweep -->
          <polygon points="465,145 525,100 525,210 465,160" fill="#34d399" opacity="0.45" class="headlight-beam" />
          <!-- Morphing Aero Ribbon Body -->
          <path d="M50 145 C60 120 120 100 170 95 C220 70 290 70 340 95 C410 100 460 120 480 140 C470 155 430 162 380 162 C330 162 310 140 270 140 C210 140 180 162 100 162 Z" fill="url(#future-${id})" stroke="#6ee7b7" stroke-width="2" />
          <!-- Cockpit AI Holographic Dome -->
          <path d="M210 98 Q260 75 310 98 Z" fill="#a7f3d0" opacity="0.4" stroke="#34d399" stroke-width="2" />
          <!-- In-Wheel Flux Hubless Rings -->
          <g class="wheel-group">
            <circle cx="130" cy="162" r="32" fill="none" stroke="#10b981" stroke-width="6" />
            <circle cx="130" cy="162" r="18" fill="none" stroke="#34d399" stroke-width="3" stroke-dasharray="8,4" />
          </g>
          <g class="wheel-group">
            <circle cx="410" cy="162" r="32" fill="none" stroke="#10b981" stroke-width="6" />
            <circle cx="410" cy="162" r="18" fill="none" stroke="#34d399" stroke-width="3" stroke-dasharray="8,4" />
          </g>
          <!-- Magnetic Levitation Ground Glow -->
          <ellipse cx="260" cy="202" rx="210" ry="8" fill="#10b981" opacity="0.4" class="neon-underglow" />
        </svg>
      `;

    default: // Universal sleek sports silhouette tailored by theme color
      return `
        <svg viewBox="0 0 500 240" class="car-vector" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gen-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${theme}" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
          </defs>
          <!-- Headlight Beam -->
          <polygon points="460,145 520,110 520,195 460,160" fill="#fef08a" opacity="0.3" class="headlight-beam" />
          <circle cx="452" cy="148" r="9" fill="#fef08a" stroke="#cbd5e1" stroke-width="2" class="headlight" />
          <!-- Aerodynamic Body -->
          <path d="M65 155 C75 135 140 120 180 115 C215 80 285 80 335 110 C385 115 440 125 460 148 C465 160 440 168 400 168 C355 168 335 138 290 138 C230 138 200 168 110 168 Z" fill="url(#gen-${id})" stroke="${theme}" stroke-width="2" />
          <!-- Cabin Windows -->
          <path d="M210 115 C230 88 285 88 320 115 Z" fill="#bae6fd" opacity="0.35" stroke="#ffffff" stroke-width="1.5" />
          <!-- Wheels -->
          <g class="wheel-group">
            <circle cx="140" cy="170" r="35" fill="#18181b" stroke="#cbd5e1" stroke-width="5" />
            <circle cx="140" cy="170" r="12" fill="${theme}" />
          </g>
          <g class="wheel-group">
            <circle cx="395" cy="170" r="35" fill="#18181b" stroke="#cbd5e1" stroke-width="5" />
            <circle cx="395" cy="170" r="12" fill="${theme}" />
          </g>
          <!-- Ground Shadow -->
          <ellipse cx="260" cy="210" rx="200" ry="6" fill="#000000" opacity="0.5" />
        </svg>
      `;
  }
}
