import {
  Box,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { useState } from 'react';
import muiTheme from './styles/muiTheme';
import useJsonGrid from './hooks/useJsonGrid';
import JsonParserContainer from './components/JsonParserContainer';

function App() {
  const [parsingMode, setParsingMode] = useState<'json' | 'log'>('json');
  const { jsonString, handleJsonChange, columns, rows, error } = useJsonGrid('[]', parsingMode);

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
          parsingMode={parsingMode}
          onParsingModeChange={setParsingMode}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
