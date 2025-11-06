import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6d28d9',
      light: '#8b5cf6',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4',
      light: '#67e8f9',
      dark: '#0e7490',
      contrastText: '#05202a',
    },
    background: {
      default: '#f7f7fb',
      paper: '#ffffff',
    },
    divider: 'rgba(17, 24, 39, 0.08)',
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    h4: {
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(60rem 30rem at 10% -10%, rgba(139, 92, 246, 0.12), transparent), radial-gradient(50rem 25rem at 110% 10%, rgba(6, 182, 212, 0.10), transparent)',
          backgroundRepeat: 'no-repeat',
        },
        '*::-webkit-scrollbar': {
          width: 10,
          height: 10,
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#c7c9d1',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: 'outlined',
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '28px',
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(17,24,39,0.08)',
          border: '1px solid rgba(17,24,39,0.06)'
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          boxShadow: 'none',
        },
      },
    },
  },
});

export default muiTheme;
