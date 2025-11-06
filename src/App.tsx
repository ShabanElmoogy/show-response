import {
  Box,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import muiTheme from './styles/muiTheme';
import useJsonGrid from './hooks/useJsonGrid';
import JsonParserContainer from './components/JsonParserContainer';

function App() {
  const { jsonString, handleJsonChange, columns, rows, error } = useJsonGrid('');

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <JsonParserContainer
          jsonString={jsonString}
          onJsonChange={handleJsonChange}
          error={error}
          rows={rows}
          columns={columns}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
