import { Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { useState, useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export type JsonGridProps = {
  rows: any[];
  columns: any[];
};

export default function JsonGrid({ rows, columns }: JsonGridProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(new Set());
  
  const hasGrouping = useMemo(() => {
    return rows && rows.length > 0 && rows.some(row => row.parentId !== undefined);
  }, [rows]);
  
  const filteredRows = useMemo(() => {
    if (!rows || rows.length === 0 || !hasGrouping) return rows || [];
    
    return rows.filter(row => {
      if (row.level === 'Country') return true;
      return !collapsedGroups.has(row.parentId);
    });
  }, [rows, collapsedGroups, hasGrouping]);
  
  const columnDefs = useMemo(() => {
    if (!columns || columns.length === 0) return [];
    
    const cols = columns.map(col => {
      if (col.field === 'level' && hasGrouping) {
        return {
          field: col.field,
          headerName: 'Type',
          width: 100,
          cellRenderer: (params: any) => {
            if (params.data?.level === 'Country') {
              const isCollapsed = collapsedGroups.has(params.data.parentId);
              return `${isCollapsed ? '\u25b6' : '\u25bc'} ${params.value}`;
            }
            return `  \u2514 ${params.value}`;
          }
        };
      }
      return {
        field: col.field,
        headerName: col.headerName || col.field,
        width: 150,
        flex: 1
      };
    });
    return cols.filter(col => col.field !== 'parentId');
  }, [columns, hasGrouping, collapsedGroups]);
  
  if (!rows || rows.length === 0) {
    return <Box sx={{ p: 2 }}>No data to display</Box>;
  }
  
  const handleRowClick = (params: any) => {
    if (params.data?.level === 'Country') {
      const parentId = params.data.parentId;
      setCollapsedGroups(prev => {
        const newSet = new Set(prev);
        if (newSet.has(parentId)) {
          newSet.delete(parentId);
        } else {
          newSet.add(parentId);
        }
        return newSet;
      });
    }
  };
  


  return (
    <Box sx={{ height: '100%', width: '100%' }} className="ag-theme-alpine">
      <AgGridReact
        rowData={filteredRows}
        columnDefs={columnDefs}
        onRowClicked={handleRowClick}
        animateRows={true}
        rowSelection="multiple"
        pagination={true}
        paginationPageSize={25}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          flex: 1,
        }}
        getRowStyle={(params) => {
          if (params.data && params.data.level === 'Country') {
            return { 
              backgroundColor: '#e3f2fd',
              cursor: 'pointer',
              fontWeight: 'bold'
            };
          }
          if (params.data && params.data.level === 'State') {
            return { 
              backgroundColor: '#f9f9f9',
              paddingLeft: '20px'
            };
          }
          return null;
        }}
      />
    </Box>
  );
}
