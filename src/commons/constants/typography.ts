/**
 * Typography Tokens
 * Design Foundation - Typography System
 * 
 * Figma Source: Node ID 9094:31239
 * Last Updated: 2025-10-17
 */

/**
 * Font Family Configuration
 * - ko: 한글 폰트 (Pretendard)
 * - en: 영문 폰트 (추후 변경 가능)
 */
export const fontFamily = {
  ko: {
    base: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  en: {
    base: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    // 추후 영문 전용 폰트로 변경 가능
    // base: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
} as const;

/**
 * Font Weight Mapping
 */
export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
} as const;

/**
 * Typography Style Definition
 */
interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
}

/**
 * Device-specific Typography Configuration
 * - desktop: 데스크톱 환경 (기본값)
 * - mobile: 모바일 환경 (필요시 다른 값 설정 가능)
 */
interface ResponsiveTypography {
  desktop: TypographyStyle;
  mobile?: TypographyStyle; // optional: 지정하지 않으면 desktop 값 사용
}

/**
 * Headline Typography (제목용)
 */
export const headline = {
  h1: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '28px',
      lineHeight: '36px',
      fontWeight: fontWeight.bold,
      letterSpacing: '0',
    },
  },
  h2: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: fontWeight.bold,
      letterSpacing: '0',
    },
  },
  h3: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: fontWeight.bold,
      letterSpacing: '0',
    },
  },
  h4: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '18px',
      lineHeight: '24px',
      fontWeight: fontWeight.semiBold,
      letterSpacing: '0',
    },
  },
} as const;

/**
 * Body Typography (본문용)
 */
export const body = {
  b1: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '20px',
      lineHeight: '24px',
      fontWeight: fontWeight.medium,
      letterSpacing: '0',
    },
  },
  b2: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: fontWeight.medium,
      letterSpacing: '0',
    },
  },
  b3: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: fontWeight.medium,
      letterSpacing: '0',
    },
  },
  b4: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: fontWeight.regular,
      letterSpacing: '0',
    },
  },
  b5: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: fontWeight.regular,
      letterSpacing: '0',
    },
  },
  b6: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '12px',
      lineHeight: '20px',
      fontWeight: fontWeight.regular,
      letterSpacing: '0',
    },
  },
} as const;

/**
 * Title Typography (타이틀용)
 */
export const title = {
  t1: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: fontWeight.bold,
      letterSpacing: '0',
    },
  },
  t2: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: fontWeight.semiBold,
      letterSpacing: '0',
    },
  },
  t3: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: fontWeight.semiBold,
      letterSpacing: '0',
    },
  },
  t4: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: fontWeight.bold,
      letterSpacing: '0',
    },
  },
} as const;

/**
 * Caption Typography (캡션용)
 */
export const caption = {
  c1: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '11px',
      lineHeight: '12px',
      fontWeight: fontWeight.medium,
      letterSpacing: '0',
    },
  },
  c2: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '11px',
      lineHeight: '12px',
      fontWeight: fontWeight.regular,
      letterSpacing: '0',
    },
  },
  c3: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: fontWeight.light,
      letterSpacing: '0',
    },
  },
  c4: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '12px',
      lineHeight: '20px',
      fontWeight: fontWeight.medium,
      letterSpacing: '0',
    },
  },
  c5: {
    desktop: {
      fontFamily: fontFamily.ko.base,
      fontSize: '12px',
      lineHeight: '20px',
      fontWeight: fontWeight.regular,
      letterSpacing: '0',
    },
  },
} as const;

/**
 * All Typography Tokens
 */
export const typography = {
  headline,
  body,
  title,
  caption,
} as const;

/**
 * CSS Variable 이름 매핑
 * - CSS에서 var(--typo-headline-h1-font-size) 형태로 사용
 */
export const cssTypoVars = {
  headline: {
    h1: {
      fontSize: 'var(--typo-headline-h1-font-size)',
      lineHeight: 'var(--typo-headline-h1-line-height)',
      fontWeight: 'var(--typo-headline-h1-font-weight)',
      letterSpacing: 'var(--typo-headline-h1-letter-spacing)',
    },
    h2: {
      fontSize: 'var(--typo-headline-h2-font-size)',
      lineHeight: 'var(--typo-headline-h2-line-height)',
      fontWeight: 'var(--typo-headline-h2-font-weight)',
      letterSpacing: 'var(--typo-headline-h2-letter-spacing)',
    },
    h3: {
      fontSize: 'var(--typo-headline-h3-font-size)',
      lineHeight: 'var(--typo-headline-h3-line-height)',
      fontWeight: 'var(--typo-headline-h3-font-weight)',
      letterSpacing: 'var(--typo-headline-h3-letter-spacing)',
    },
    h4: {
      fontSize: 'var(--typo-headline-h4-font-size)',
      lineHeight: 'var(--typo-headline-h4-line-height)',
      fontWeight: 'var(--typo-headline-h4-font-weight)',
      letterSpacing: 'var(--typo-headline-h4-letter-spacing)',
    },
  },
  body: {
    b1: {
      fontSize: 'var(--typo-body-b1-font-size)',
      lineHeight: 'var(--typo-body-b1-line-height)',
      fontWeight: 'var(--typo-body-b1-font-weight)',
      letterSpacing: 'var(--typo-body-b1-letter-spacing)',
    },
    b2: {
      fontSize: 'var(--typo-body-b2-font-size)',
      lineHeight: 'var(--typo-body-b2-line-height)',
      fontWeight: 'var(--typo-body-b2-font-weight)',
      letterSpacing: 'var(--typo-body-b2-letter-spacing)',
    },
    b3: {
      fontSize: 'var(--typo-body-b3-font-size)',
      lineHeight: 'var(--typo-body-b3-line-height)',
      fontWeight: 'var(--typo-body-b3-font-weight)',
      letterSpacing: 'var(--typo-body-b3-letter-spacing)',
    },
    b4: {
      fontSize: 'var(--typo-body-b4-font-size)',
      lineHeight: 'var(--typo-body-b4-line-height)',
      fontWeight: 'var(--typo-body-b4-font-weight)',
      letterSpacing: 'var(--typo-body-b4-letter-spacing)',
    },
    b5: {
      fontSize: 'var(--typo-body-b5-font-size)',
      lineHeight: 'var(--typo-body-b5-line-height)',
      fontWeight: 'var(--typo-body-b5-font-weight)',
      letterSpacing: 'var(--typo-body-b5-letter-spacing)',
    },
    b6: {
      fontSize: 'var(--typo-body-b6-font-size)',
      lineHeight: 'var(--typo-body-b6-line-height)',
      fontWeight: 'var(--typo-body-b6-font-weight)',
      letterSpacing: 'var(--typo-body-b6-letter-spacing)',
    },
  },
  title: {
    t1: {
      fontSize: 'var(--typo-title-t1-font-size)',
      lineHeight: 'var(--typo-title-t1-line-height)',
      fontWeight: 'var(--typo-title-t1-font-weight)',
      letterSpacing: 'var(--typo-title-t1-letter-spacing)',
    },
    t2: {
      fontSize: 'var(--typo-title-t2-font-size)',
      lineHeight: 'var(--typo-title-t2-line-height)',
      fontWeight: 'var(--typo-title-t2-font-weight)',
      letterSpacing: 'var(--typo-title-t2-letter-spacing)',
    },
    t3: {
      fontSize: 'var(--typo-title-t3-font-size)',
      lineHeight: 'var(--typo-title-t3-line-height)',
      fontWeight: 'var(--typo-title-t3-font-weight)',
      letterSpacing: 'var(--typo-title-t3-letter-spacing)',
    },
    t4: {
      fontSize: 'var(--typo-title-t4-font-size)',
      lineHeight: 'var(--typo-title-t4-line-height)',
      fontWeight: 'var(--typo-title-t4-font-weight)',
      letterSpacing: 'var(--typo-title-t4-letter-spacing)',
    },
  },
  caption: {
    c1: {
      fontSize: 'var(--typo-caption-c1-font-size)',
      lineHeight: 'var(--typo-caption-c1-line-height)',
      fontWeight: 'var(--typo-caption-c1-font-weight)',
      letterSpacing: 'var(--typo-caption-c1-letter-spacing)',
    },
    c2: {
      fontSize: 'var(--typo-caption-c2-font-size)',
      lineHeight: 'var(--typo-caption-c2-line-height)',
      fontWeight: 'var(--typo-caption-c2-font-weight)',
      letterSpacing: 'var(--typo-caption-c2-letter-spacing)',
    },
    c3: {
      fontSize: 'var(--typo-caption-c3-font-size)',
      lineHeight: 'var(--typo-caption-c3-line-height)',
      fontWeight: 'var(--typo-caption-c3-font-weight)',
      letterSpacing: 'var(--typo-caption-c3-letter-spacing)',
    },
    c4: {
      fontSize: 'var(--typo-caption-c4-font-size)',
      lineHeight: 'var(--typo-caption-c4-line-height)',
      fontWeight: 'var(--typo-caption-c4-font-weight)',
      letterSpacing: 'var(--typo-caption-c4-letter-spacing)',
    },
    c5: {
      fontSize: 'var(--typo-caption-c5-font-size)',
      lineHeight: 'var(--typo-caption-c5-line-height)',
      fontWeight: 'var(--typo-caption-c5-font-weight)',
      letterSpacing: 'var(--typo-caption-c5-letter-spacing)',
    },
  },
} as const;

/**
 * Helper function: Typography 스타일을 가져오기
 * @example
 * const h1Style = getTypographyStyle('headline', 'h1', 'desktop');
 * // returns: { fontFamily: 'Pretendard...', fontSize: '28px', ... }
 */
export const getTypographyStyle = (
  category: keyof typeof typography,
  variant: string,
  device: 'desktop' | 'mobile' = 'desktop'
): TypographyStyle | undefined => {
  const categoryObj = typography[category] as Record<string, ResponsiveTypography>;
  const style = categoryObj[variant];
  
  if (!style) return undefined;
  
  // mobile이 있으면 mobile, 없으면 desktop 반환
  if (device === 'mobile' && style.mobile) {
    return style.mobile;
  }
  return style.desktop;
};

export type TypographyToken = typeof typography;

