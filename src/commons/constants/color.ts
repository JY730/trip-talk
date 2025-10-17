/**
 * Color Tokens
 * Design Foundation - Color System
 * 
 * Figma Source: Node ID 9093:15856
 * Last Updated: 2025-10-17
 */

export const colors = {
  gray: {
    w: '#ffffff',
    50: '#f2f2f2',
    100: '#e4e4e4',
    200: '#d4d3d3',
    300: '#c7c7c7',
    400: '#ababab',
    500: '#919191',
    600: '#777777',
    700: '#5f5f5f',
    800: '#333333',
    900: '#1c1c1c',
    b: '#000000',
  },
  main: '#2974e5',
  red: '#f66a6a',
} as const;

export type ColorToken = typeof colors;

/**
 * CSS Variable 이름 매핑
 */
export const cssColorVars = {
  gray: {
    w: 'var(--color-gray-w)',
    50: 'var(--color-gray-50)',
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
    600: 'var(--color-gray-600)',
    700: 'var(--color-gray-700)',
    800: 'var(--color-gray-800)',
    900: 'var(--color-gray-900)',
    b: 'var(--color-gray-b)',
  },
  main: 'var(--color-main)',
  red: 'var(--color-red)',
} as const;

