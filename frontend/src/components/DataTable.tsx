import { type ReactNode } from 'react';

export interface Column<T> {
  key?: string;
  label?: string;
  header?: string;
  render?: (item: T, index?: number) => ReactNode;
  accessor?: string | ((row: T, index?: number) => ReactNode);
  className?: string;
  width?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

export default function DataTable<T extends { id: number }>({ columns, data, loading, emptyMessage = 'Tidak ada data' }: Props<T>) {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <span className="ml-3 text-sm text-slate-400">Memuat data...</span>
        </div>
      </div>
    );
  }

  const getColKey = (col: Column<T>, index: number) =>
    col.key ?? (typeof col.accessor === 'string' ? col.accessor : `col-${index}`);

  const getHeader = (col: Column<T>) => col.label ?? col.header ?? '';

  const renderCell = (col: Column<T>, item: T, index: number): ReactNode => {
    if (col.render) return col.render(item, index);
    if (typeof col.accessor === 'function') return col.accessor(item, index);
    const colKey = col.key ?? (typeof col.accessor === 'string' ? col.accessor : undefined);
    if (colKey) return String((item as Record<string, unknown>)[colKey] ?? '-');
    return '-';
  };

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              {columns.map((col, i) => (
                <th key={getColKey(col, i)} className={`px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${col.className || ''}`} style={col.width ? { width: col.width } : undefined}>
                  {getHeader(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                  {columns.map((col, i) => (
                    <td key={getColKey(col, i)} className={`px-5 py-3.5 text-sm text-slate-300 ${col.className || ''}`} style={col.width ? { width: col.width } : undefined}>
                      {renderCell(col, item, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
