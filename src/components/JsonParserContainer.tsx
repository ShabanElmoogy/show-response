import { Alert, Box, Button, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
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
};

export default function JsonParserContainer({
  jsonString,
  onJsonChange,
  error,
  rows,
  columns,
}: JsonParserContainerProps) {
  const [isJsonPanelCollapsed, setIsJsonPanelCollapsed] = useState(false);

  const exampleOptions: { label: string; value: string }[] = [
    {
      label: 'Array of objects',
      value: JSON.stringify([
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 }
      ]),
    },
    {
      label: 'Nested arrays in objects',
      value: JSON.stringify([
        {
          country: 'USA',
          cities: [
            { name: 'New York', population: 8419000 },
            { name: 'Los Angeles', population: 3980000 }
          ],
          codes: ['US', 'USA']
        },
        {
          country: 'Canada',
          cities: [
            { name: 'Toronto', population: 2732000 },
            { name: 'Vancouver', population: 675200 }
          ],
          codes: ['CA', 'CAN']
        }
      ]),
    },
    {
      label: 'Array of invoice objects',
      value: JSON.stringify([
        {
          TransID: Math.floor(Math.random() * 100000),
          BranchID: Math.floor(Math.random() * 10) + 1,
          SalesRepID: Math.floor(Math.random() * 10) + 1,
          InvDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00',
          InvAmount: Math.round((Math.random() * 1000 + 10) * 100) / 100,
          InvNote: '',
          SysInvID: Math.floor(Math.random() * 100000) + 100000,
          CustName: 'Random Customer ' + Math.floor(Math.random() * 100),
          SalesRepName: 'Random Rep ' + Math.floor(Math.random() * 100)
        },
        {
          TransID: Math.floor(Math.random() * 100000),
          BranchID: Math.floor(Math.random() * 10) + 1,
          SalesRepID: Math.floor(Math.random() * 10) + 1,
          InvDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00',
          InvAmount: Math.round((Math.random() * 1000 + 10) * 100) / 100,
          InvNote: '',
          SysInvID: Math.floor(Math.random() * 100000) + 100000,
          CustName: 'Random Customer ' + Math.floor(Math.random() * 100),
          SalesRepName: 'Random Rep ' + Math.floor(Math.random() * 100)
        },
        {
          TransID: Math.floor(Math.random() * 100000),
          BranchID: Math.floor(Math.random() * 10) + 1,
          SalesRepID: Math.floor(Math.random() * 10) + 1,
          InvDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00',
          InvAmount: Math.round((Math.random() * 1000 + 10) * 100) / 100,
          InvNote: '',
          SysInvID: Math.floor(Math.random() * 100000) + 100000,
          CustName: 'Random Customer ' + Math.floor(Math.random() * 100),
          SalesRepName: 'Random Rep ' + Math.floor(Math.random() * 100)
        },
        {
          TransID: Math.floor(Math.random() * 100000),
          BranchID: Math.floor(Math.random() * 10) + 1,
          SalesRepID: Math.floor(Math.random() * 10) + 1,
          InvDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00',
          InvAmount: Math.round((Math.random() * 1000 + 10) * 100) / 100,
          InvNote: '',
          SysInvID: Math.floor(Math.random() * 100000) + 100000,
          CustName: 'Random Customer ' + Math.floor(Math.random() * 100),
          SalesRepName: 'Random Rep ' + Math.floor(Math.random() * 100)
        }
      ]),
    },
    {
      label: 'Primitive (string)',
      value: JSON.stringify('Hello world'),
    },
    {
      label: 'Primitive (number)',
      value: JSON.stringify(12345),
    },
    {
      label: 'Malformed example',
      value: '[{id:1, name:"NoQuotes"}]',
    },
  ];

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', p: 1 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" component="h1" align="center">
          JSON Response Parser
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, gap: 1 }}>
        <Box sx={{ 
          width: isJsonPanelCollapsed ? '40px' : '400px', 
          transition: 'width 0.3s ease',
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {!isJsonPanelCollapsed && (
              <>
                <Typography variant="h6" sx={{ flex: 1 }}>JSON Input</Typography>
                <Select
                  size="small"
                  displayEmpty
                  value=""
                  renderValue={() => 'Examples'}
                  onChange={(e) => {
                    const selected = exampleOptions.find(o => o.value === e.target.value);
                    if (selected) {
                      onJsonChange({ target: { value: selected.value } } as any);
                    }
                  }}
                  sx={{ minWidth: 180 }}
                >
                  {exampleOptions.map(opt => (
                    <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
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
                placeholder='e.g. [{"id":1,"name":"Alice"}]'
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
