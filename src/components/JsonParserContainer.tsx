import { Alert, Box, Button, IconButton, InputAdornment, Stack, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import JsonGrid from './JsonGrid';
import type { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';

export type JsonParserContainerProps = {
  jsonString: string;
  onJsonChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  rows: any[];
  columns: GridColDef[];
  parsingMode: 'json' | 'log';
  onParsingModeChange: (mode: 'json' | 'log') => void;
};

export default function JsonParserContainer({
  jsonString,
  onJsonChange,
  error,
  rows,
  columns,
  parsingMode,
  onParsingModeChange,
}: JsonParserContainerProps) {
  const [isJsonPanelCollapsed, setIsJsonPanelCollapsed] = useState(false);

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', p: 1 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" component="h1" align="center">
          Data Parser
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, gap: 1 }}>
        <Box sx={{ 
          width: isJsonPanelCollapsed ? '40px' : '400px', 
          transition: 'width 0.3s ease',
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            {!isJsonPanelCollapsed && (
              <>
                <Typography variant="h6" sx={{ flex: 1 }}>Input</Typography>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Mode</InputLabel>
                  <Select
                    value={parsingMode}
                    label="Mode"
                    onChange={(e) => onParsingModeChange(e.target.value as 'json' | 'log')}
                  >
                    <MenuItem value="json">JSON</MenuItem>
                    <MenuItem value="log">Log</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            <IconButton 
              size="small" 
              onClick={() => setIsJsonPanelCollapsed(!isJsonPanelCollapsed)}
            >
              {isJsonPanelCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Box>

          {!isJsonPanelCollapsed && (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {error}
                </Alert>
              )}

              <TextField
                multiline
                value={jsonString}
                onChange={onJsonChange}
                placeholder={parsingMode === 'json' ? 'e.g. [{"id":1,"name":"Alice"}]' : 'Paste IIS log lines here...'}
                sx={{ 
                  flex: 1, 
                  '& .MuiInputBase-root': { height: '100%' }, 
                  '& .MuiInputBase-input': { height: '100% !important', overflow: 'auto' } 
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="secondary" />
                    </InputAdornment>
                  ),
                  endAdornment: jsonString && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => onJsonChange({ target: { value: '' } } as any)}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                <Button 
                  color="primary" 
                  size="small" 
                  onClick={() => {
                    let cleaned = jsonString
                      .replace(/&quot;/g, '"')
                      .replace(/&#39;/g, "'")
                      .replace(/\t/g, '')
                      .replace(/\n\s*/g, '')
                      .trim();
                    
                    // Fix unquoted property names
                    cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
                    
                    onJsonChange({ target: { value: cleaned } } as any);
                  }}
                >
                  Fix JSON
                </Button>
                <Button color="secondary" size="small" onClick={() => navigator.clipboard.writeText(jsonString)}>
                  Copy JSON
                </Button>
              </Stack>
            </>
          )}
        </Box>

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <JsonGrid rows={rows} columns={columns} />
        </Box>
      </Box>
    </Box>
  );
}