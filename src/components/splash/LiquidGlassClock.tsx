import { useId } from "react";

interface LiquidGlassClockProps {
  hours: string;
  minutes: string;
}

/**
 * True 3D Apple Liquid Glass stretched clock:
 * - Sturdy stretched rounded-geometric numerals (Barlow Condensed 600)
 * - Optically warped & magnified wallpaper refraction inside the glyphs (feDisplacementMap)
 * - Real 3D curved-bevel wet specular lighting computed from the glyph's own SourceAlpha height-map
 *   (feSpecularLighting + dual distant lights + subtle chromatic dispersion)
 * - Zero white outline border, zero opaque white fill, zero CSS blur.
 */
export function LiquidGlassClock({ hours, minutes }: LiquidGlassClockProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `lg-clip-${uid}`;
  const refractId = `lg-refract-${uid}`;
  const glass3dId = `lg-3d-${uid}`;
  const shadowId = `lg-shadow-${uid}`;
  const tintGradId = `lg-tint-${uid}`;

  const fontFamily = '"Barlow Condensed", "SF Pro Display", ui-sans-serif, system-ui, sans-serif';

  const renderGlyphs = (
    textProps: React.SVGProps<SVGTextElement>,
    dotProps: React.SVGProps<SVGCircleElement>
  ) => (
    <g transform="translate(290, 444) scale(1.04, 1.88)">
      {/* Hours */}
      <text
        x="-18"
        y="0"
        textAnchor="end"
        fontFamily={fontFamily}
        fontWeight="700"
        fontSize="238"
        letterSpacing="-3"
        style={{ fontVariantNumeric: "tabular-nums" }}
        {...textProps}
      >
        {hours}
      </text>

      {/* Perfectly round colon dots (counter-scaled against vertical stretch) */}
      <g transform="scale(0.96, 0.532)">
        <circle cx="0" cy="-232" r="11.5" {...dotProps} />
        <circle cx="0" cy="-124" r="11.5" {...dotProps} />
      </g>

      {/* Minutes */}
      <text
        x="18"
        y="0"
        textAnchor="start"
        fontFamily={fontFamily}
        fontWeight="700"
        fontSize="238"
        letterSpacing="-3"
        style={{ fontVariantNumeric: "tabular-nums" }}
        {...textProps}
      >
        {minutes}
      </text>
    </g>
  );

  return (
    <div
      className="relative select-none pointer-events-none flex items-center justify-center"
      aria-label={`${hours}:${minutes}`}
    >
      <svg
        viewBox="0 0 580 480"
        className="h-[38vh] sm:h-[43vh] md:h-[48vh] max-h-[490px] w-auto max-w-[94vw] overflow-visible"
        role="img"
        aria-hidden="true"
      >
        <defs>
          {/* Exact glyph mask */}
          <clipPath id={clipId}>
            {renderGlyphs({}, {})}
          </clipPath>

          {/* 1. Optical Lens Refraction of the mountain/mist wallpaper through curved crystal */}
          <filter id={refractId} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.007 0.014"
              numOctaves="2"
              seed="5"
              result="lensNoise"
            />
            {/* Optical bend */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="lensNoise"
              scale="38"
              xChannelSelector="R"
              yChannelSelector="G"
              result="warped"
            />
            {/* Subtle chromatic RGB dispersion on bright refracted clouds */}
            <feOffset in="warped" dx="2.2" dy="-1.2" result="rShift" />
            <feColorMatrix
              in="rShift"
              type="matrix"
              values="1.25 0 0 0 0.03  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="rChan"
            />
            <feColorMatrix
              in="warped"
              type="matrix"
              values="0 0 0 0 0  0 1.25 0 0 0.03  0 0 0 0 0  0 0 0 1 0"
              result="gChan"
            />
            <feOffset in="warped" dx="-2.2" dy="1.2" result="bShift" />
            <feColorMatrix
              in="bShift"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1.32 0 0.05  0 0 0 1 0"
              result="bChan"
            />
            <feBlend in="rChan" in2="gChan" mode="screen" result="rg" />
            <feBlend in="rg" in2="bChan" mode="screen" result="dispersed" />
          </filter>

          {/* 2. True 3D Sculpted Liquid Glass Bevel & Wet Specular Lighting (computed from SourceAlpha height-map!) */}
          <filter id={glass3dId} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            {/* Build smooth 3D curved pillow height-map from the glyph alpha */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="6.5" result="heightMap" />

            {/* Primary sharp wet specular highlight (top-left light source) */}
            <feSpecularLighting
              in="heightMap"
              surfaceScale="9"
              specularConstant="1.9"
              specularExponent="32"
              lightingColor="#ffffff"
              result="specPrimary"
            >
              <feDistantLight azimuth="228" elevation="44" />
            </feSpecularLighting>
            <feComposite in="specPrimary" in2="SourceAlpha" operator="in" result="specPrimaryClipped" />

            {/* Secondary opposing Fresnel bounce reflection (bottom-right, subtle cool-silver tint) */}
            <feSpecularLighting
              in="heightMap"
              surfaceScale="8"
              specularConstant="1.35"
              specularExponent="24"
              lightingColor="#d8eeff"
              result="specBounce"
            >
              <feDistantLight azimuth="48" elevation="34" />
            </feSpecularLighting>
            <feComposite in="specBounce" in2="SourceAlpha" operator="in" result="specBounceClipped" />

            {/* Subtle top-edge caustic rim (sharp wet crest) */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="tightBevel" />
            <feSpecularLighting
              in="tightBevel"
              surfaceScale="6"
              specularConstant="1.4"
              specularExponent="48"
              lightingColor="#ffffff"
              result="specCrest"
            >
              <feDistantLight azimuth="245" elevation="52" />
            </feSpecularLighting>
            <feComposite in="specCrest" in2="SourceAlpha" operator="in" result="specCrestClipped" />

            {/* Combine all 3D liquid glass specular reflections */}
            <feBlend in="specPrimaryClipped" in2="specBounceClipped" mode="screen" result="specPair" />
            <feBlend in="specPair" in2="specCrestClipped" mode="screen" result="allSpec" />
          </filter>

          {/* Soft floating glass shadow */}
          <filter id={shadowId} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000000" floodOpacity="0.45" />
          </filter>

          {/* Ultra-subtle glass optical density gradient (keeps center crystal clear!) */}
          <linearGradient id={tintGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="68%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.14" />
          </linearGradient>
        </defs>

        {/* Layer 1: Floating depth shadow */}
        <g filter={`url(#${shadowId})`} opacity="0.75">
          {renderGlyphs({ fill: "rgba(0,0,0,0.4)" }, { fill: "rgba(0,0,0,0.4)" })}
        </g>

        {/* Layer 2: Magnified, optically refracted & chromatically dispersed wallpaper inside glyphs */}
        <g clipPath={`url(#${clipId})`}>
          <image
            href="/wallpaper.jpg"
            x="-120"
            y="-120"
            width="820"
            height="680"
            preserveAspectRatio="xMidYMid slice"
            filter={`url(#${refractId})`}
          />
          {/* Minimal optical density tint so crystal center stays clear & refracted */}
          <rect x="0" y="0" width="580" height="480" fill={`url(#${tintGradId})`} />
        </g>

        {/* Layer 3: Real 3D curved-bevel wet specular lighting (zero border, zero flat white!) */}
        <g filter={`url(#${glass3dId})`} style={{ mixBlendMode: "screen" }}>
          {renderGlyphs({ fill: "#000000" }, { fill: "#000000" })}
        </g>
      </svg>
    </div>
  );
}
