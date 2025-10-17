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
  blue: {
    50: '#eaf1fc',
    100: '#bdd4f7',
    200: '#9dbff3',
    300: '#70a2ee',
    400: '#5490ea',
    500: '#2974e5',
    600: '#256ad0',
    700: '#1d52a3',
    800: '#17407e',
    900: '#113160',
  },
  red: {
    50: '#fef0f0',
    100: '#fcd1d1',
    200: '#fbbaba',
    300: '#f99b9b',
    400: '#f88888',
    500: '#f66a6a',
    600: '#e06060',
    700: '#af4b4b',
    800: '#873a3a',
    900: '#672d2d',
  },
  main: '#2974e5',
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
  blue: {
    50: 'var(--color-blue-50)',
    100: 'var(--color-blue-100)',
    200: 'var(--color-blue-200)',
    300: 'var(--color-blue-300)',
    400: 'var(--color-blue-400)',
    500: 'var(--color-blue-500)',
    600: 'var(--color-blue-600)',
    700: 'var(--color-blue-700)',
    800: 'var(--color-blue-800)',
    900: 'var(--color-blue-900)',
  },
  red: {
    50: 'var(--color-red-50)',
    100: 'var(--color-red-100)',
    200: 'var(--color-red-200)',
    300: 'var(--color-red-300)',
    400: 'var(--color-red-400)',
    500: 'var(--color-red-500)',
    600: 'var(--color-red-600)',
    700: 'var(--color-red-700)',
    800: 'var(--color-red-800)',
    900: 'var(--color-red-900)',
  },
  main: 'var(--color-main)',
} as const;

