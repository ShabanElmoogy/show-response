import { useCallback, useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

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

export function useJsonGrid(initialJson = '[]'): UseJsonGrid {
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

        const flattenedRowsBase = [];
        let rowId = 0;
        const hasNestedArrays = parsed.some((item: any) => 
          Object.values(item).some(value => Array.isArray(value) && value.length > 0)
        );

        parsed.forEach((item: any, parentIndex: number) => {
          if (hasNestedArrays) {
            // Create parent row
            const parentData = { ...item };
            const statesCount = item.states ? item.states.length : 0;
            delete parentData.states;
            
            const parentFlattened = flattenRecord(parentData);
            flattenedRowsBase.push({
              id: rowId++,
              level: 'Country',
              parentId: parentIndex + 1,
              itemType: 'Parent',
              statesCount: statesCount,
              ...parentFlattened
            });

            // Create child rows for states
            if (item.states && Array.isArray(item.states)) {
              item.states.forEach((state: any, stateIndex: number) => {
                const stateFlattened = flattenRecord(state);
                flattenedRowsBase.push({
                  id: rowId++,
                  level: 'State',
                  parentId: parentIndex + 1,
                  itemType: 'Child',
                  stateIndex: stateIndex + 1,
                  ...stateFlattened
                });
              });
            }
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
  }, []);

  useEffect(() => {
    parseJson(jsonString);
  }, []);

  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newJsonString = e.target.value;
    setJsonString(newJsonString);
    parseJson(newJsonString);
  }, [parseJson]);

  return { jsonString, setJsonString, columns, rows, error, handleJsonChange };
}

export default useJsonGrid;
