import { useCallback, useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';

function cleanJson(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\t/g, '')
    .replace(/\n\s*/g, '')
    .trim();
}

function parseIISLog(logText: string): any[] {
  // Split by actual line breaks and also handle cases where lines might be concatenated
  const lines = logText.trim().split(/\r?\n|(?=\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
  const logEntries = [];
  let rowId = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#') || line.length < 50) continue;
    
    // Split by spaces but be careful with query strings
    const parts = line.split(' ');
    if (parts.length >= 15) {
      logEntries.push({
        id: rowId++,
        date: parts[0] || '',
        time: parts[1] || '',
        service: parts[2] || '',
        server: parts[3] || '',
        clientIP: parts[4] || '',
        method: parts[5] || '',
        uri: parts[6] || '',
        query: parts[7] || '',
        port: parts[8] || '',
        username: parts[9] === '-' ? '' : parts[9],
        clientAgent: parts[10] || '',
        referer: parts[11] === '-' ? '' : parts[11],
        cookie: parts[12] === '-' ? '' : parts[12],
        host: parts[13] || '',
        status: parts[14] || '',
        substatus: parts[15] || '',
        win32Status: parts[16] || '',
        bytesReceived: parts[17] || '',
        bytesSent: parts[18] || '',
        timeTaken: parts[19] || '',
        rawLine: line
      });
    }
  }
  
  console.log('Parsed log entries:', logEntries.length);
  return logEntries;
}

function isPlainObject(value: any): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function flattenRecord(value: any, prefix = ''): Record<string, any> {
  const out: Record<string, any> = {};
  const makeKey = (k: string) => (prefix ? `${prefix}.${k}` : k);

  if (Array.isArray(value)) {
    if (value.every((v) => !isPlainObject(v) && !Array.isArray(v))) {
      out[prefix || 'value'] = value.join(', ');
      out[makeKey('count')] = value.length;
      return out;
    }
    value.forEach((item, idx) => {
      if (isPlainObject(item) || Array.isArray(item)) {
        Object.assign(out, flattenRecord(item, `${prefix}[${idx}]`));
      } else {
        out[`${prefix}[${idx}]`] = String(item);
      }
    });
    out[makeKey('count')] = value.length;
    return out;
  }

  if (isPlainObject(value)) {
    for (const [k, v] of Object.entries(value)) {
      if (isPlainObject(v) || Array.isArray(v)) {
        Object.assign(out, flattenRecord(v, makeKey(k)));
      } else {
        out[makeKey(k)] = v as any;
      }
    }
    return out;
  }

  out[prefix || 'value'] = String(value);
  return out;
}

export type UseJsonGrid = {
  jsonString: string;
  setJsonString: (v: string) => void;
  columns: GridColDef[];
  rows: any[];
  error: string | null;
  handleJsonChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function useJsonGrid(initialJson = '[]', parsingMode: 'json' | 'log' = 'json'): UseJsonGrid {
  const [jsonString, setJsonString] = useState(initialJson);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const parseJson = useCallback((json: string) => {
    try {
      if (!json || json.trim() === '') {
        setColumns([]);
        setRows([]);
        setError('Empty input. Paste JSON to visualize.');
        return;
      }

      const cleanedJson = cleanJson(json);
      const isLogFormat = cleanedJson.includes('W3SVC') || /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(cleanedJson);
      
      // Validate input matches selected mode
      if (parsingMode === 'json' && isLogFormat) {
        setColumns([]);
        setRows([]);
        setError('You must input JSON files. Switch to Log mode to parse log files.');
        return;
      }
      
      if (parsingMode === 'log' && !isLogFormat) {
        setColumns([]);
        setRows([]);
        setError('You must input log files. Switch to JSON mode to parse JSON data.');
        return;
      }
      
      // Check if it's IIS log format
      if (parsingMode === 'log' || isLogFormat) {
        const logEntries = parseIISLog(cleanedJson);
        if (logEntries.length > 0) {
          const colKeys = Object.keys(logEntries[0]).filter(key => key !== 'rawLine');
          const columnWidths: Record<string, number> = {
            date: 100,
            time: 100,
            method: 80,
            uri: 200,
            query: 800,
            clientIP: 120,
            status: 80,
            host: 180,
            timeTaken: 100,
            bytesSent: 100,
            bytesReceived: 120
          };
          
          const newColumns: GridColDef[] = colKeys.map((key) => ({ 
            field: key, 
            headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), 
            width: columnWidths[key] || 120,
            editable: false 
          }));
          
          setColumns(newColumns);
          setRows(logEntries);
          setError(null);
          return;
        }
      }
      
      let parsed: any = JSON.parse(cleanedJson);
      console.log('Cleaned JSON:', cleanedJson);
      console.log('Parsed JSON:', parsed, 'Type:', typeof parsed, 'IsArray:', Array.isArray(parsed));

      // Handle double-encoded JSON
      if (typeof parsed === 'string') {
        try {
          parsed = JSON.parse(parsed);
        } catch {
          // keep as string primitive
        }
      }

      // Array case
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          setColumns([]);
          setRows([]);
          setError('JSON array is empty.');
          return;
        }

        const flattenedRowsBase: any[] = [];
        let rowId = 0;
        const hasNestedArrays = parsed.some((item: any) => 
          Object.values(item).some(value => Array.isArray(value) && value.length > 0)
        );

        // Find nested array property names
        const nestedArrayNames = new Set<string>();
        parsed.forEach(item => {
          Object.entries(item).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              nestedArrayNames.add(key);
            }
          });
        });

        parsed.forEach((item: any, parentIndex: number) => {
          if (hasNestedArrays) {
            // Create parent row
            const parentData = { ...item };
            const countColumns: any = {};
            
            // Add count columns for each nested array
            nestedArrayNames.forEach(arrayName => {
              const count = item[arrayName] ? item[arrayName].length : 0;
              countColumns[`${arrayName}Count`] = count;
              delete parentData[arrayName];
            });
            
            const parentFlattened = flattenRecord(parentData);
            flattenedRowsBase.push({
              id: rowId++,
              level: 'Country',
              parentId: parentIndex + 1,
              itemType: 'Parent',
              ...countColumns,
              ...parentFlattened
            });

            // Create child rows for each nested array
            nestedArrayNames.forEach(arrayName => {
              if (item[arrayName] && Array.isArray(item[arrayName])) {
                item[arrayName].forEach((childItem: any, childIndex: number) => {
                  const childFlattened = flattenRecord(childItem);
                  flattenedRowsBase.push({
                    id: rowId++,
                    level: arrayName.charAt(0).toUpperCase() + arrayName.slice(1),
                    parentId: parentIndex + 1,
                    itemType: 'Child',
                    childIndex: childIndex + 1,
                    ...childFlattened
                  });
                });
              }
            });
          } else {
            // Simple flat structure
            const flattened = flattenRecord(item);
            flattenedRowsBase.push({
              id: rowId++,
              ...flattened
            });
          }
        });

        const groups = new Set(flattenedRowsBase.map((r) => r.__group));
        const useGroup = groups.size > 1;

        const flattenedRows = flattenedRowsBase.map(({ __group, ...rest }) => (
          useGroup ? { group: __group, ...rest } : { ...rest }
        ));

        const colKeys = Array.from(
          new Set(flattenedRows.flatMap((r) => Object.keys(r).filter((k) => k !== 'id')))
        );

        const newColumns: GridColDef[] = colKeys.map((key) => ({ field: key, headerName: key, width: 220, editable: false }));

        setColumns(newColumns);
        setRows(flattenedRows);
        setError(null);
        return;
      }

      // Object case - auto-wrap in array
      if (parsed && typeof parsed === 'object') {
        const base = flattenRecord(parsed);
        const row = { id: 0, ...base };
        const colKeys = Object.keys(base);
        const newColumns: GridColDef[] = colKeys.map((key) => ({ field: key, headerName: key, width: 220, editable: false }));
        setColumns(newColumns);
        setRows([row]);
        setError(null);
        console.log('Object processed:', { columns: newColumns, rows: [row] });
        return;
      }

      // Primitive case (number, string, boolean, null)
      setColumns([
        { field: 'value', headerName: 'value', width: 300, editable: false },
      ]);
      setRows([{ id: 0, value: String(parsed) }]);
      setError(null);
    } catch (e: any) {
      setColumns([]);
      setRows([]);
      setError(`Invalid JSON format: ${e.message}. Please check your input.`);
    }
  }, [parsingMode]);

  useEffect(() => {
    parseJson(jsonString);
  }, [parsingMode, parseJson]);

  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newJsonString = e.target.value;
    setJsonString(newJsonString);
    parseJson(newJsonString);
  }, [parseJson]);

  return { jsonString, setJsonString, columns, rows, error, handleJsonChange };
}

export default useJsonGrid;
