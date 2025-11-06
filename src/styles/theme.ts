// src/styles/theme.ts
// Central theme configuration for colors, spacing, typography, and breakpoints.
// Import this module wherever you need consistent design tokens.

export type Theme = {
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  spacing: (factor: number) => string;
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
    weight: {
      regular: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
};

export const theme: Theme = {
  colors: {
    primary: '#1976d2',
    primaryHover: '#1565c0',
    secondary: '#9c27b0',
    background: '#0b1020',
    surface: '#111827',
    text: '#e5e7eb',
    textMuted: '#9ca3af',
    border: '#1f2937',
    success: '#2e7d32',
    warning: '#ed6c02',
    danger: '#d32f2f',
    info: '#0288d1',
  },
  spacing: (factor: number) => `${factor * 0.25}rem`,
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  typography: {
    fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, \"Apple Color Emoji\", \"Segoe UI Emoji\"`,
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.7',
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export default theme;
