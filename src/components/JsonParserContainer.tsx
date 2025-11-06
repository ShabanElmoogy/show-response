import { Alert, Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import JsonGrid from './JsonGrid';
import type { GridColDef } from '@mui/x-data-grid';

export type JsonParserContainerProps = {
  jsonString: string;
  onJsonChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  rows: any[];
  columns: GridColDef[];
};

export default function JsonParserContainer({
  jsonString,
  onJsonChange,
  error,
  rows,
  columns,
}: JsonParserContainerProps) {
  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', p: 1 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" component="h1" align="center">
          JSON Response Parser
        </Typography>
      </Box>

      <TextField
        label="JSON Input"
        multiline
        rows={4}
        value={jsonString}
        onChange={onJsonChange}
        placeholder='e.g. [{"id":1,"name":"Alice"}]'
        sx={{ mb: 1 }}
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

      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <JsonGrid rows={rows} columns={columns} />
      </Box>

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
    </Box>
  );
}
