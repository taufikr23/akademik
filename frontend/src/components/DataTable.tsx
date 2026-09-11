import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
}

export default function DataTable<T extends { id?: number | string }>({
  columns,
  data,
  loading,
  emptyMessage = 'Tidak ada data',
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
}: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // Reset to first page when data count changes (e.g. on search or filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Adjust page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const displayedData = pagination ? data.slice(startIndex, endIndex) : data;

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

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
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              {columns.map((col, i) => (
                <th
                  key={getColKey(col, i)}
                  className={`px-3 sm:px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap ${col.className || ''}`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {getHeader(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 sm:px-5 py-12 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayedData.map((item, index) => {
                const actualIndex = pagination ? startIndex + index : index;
                return (
                  <tr key={item.id ?? actualIndex} className="hover:bg-slate-700/30 transition-colors">
                    {columns.map((col, i) => (
                      <td
                        key={getColKey(col, i)}
                        className={`px-3 sm:px-5 py-3 text-sm text-slate-300 whitespace-nowrap ${col.className || ''}`}
                        style={col.width ? { width: col.width } : undefined}
                      >
                        {renderCell(col, item, actualIndex)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && data.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-700 bg-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span>
              Menampilkan <span className="font-semibold text-slate-200">{startIndex + 1}</span>–<span className="font-semibold text-slate-200">{endIndex}</span> dari{' '}
              <span className="font-semibold text-slate-200">{data.length}</span> data
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">Per halaman:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-primary-500"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-800 text-slate-200">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                title="Halaman Pertama"
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                title="Halaman Sebelumnya"
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {pageNumbers.map((page, idx) =>
                  typeof page === 'number' ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary-600 text-white font-semibold shadow-sm'
                          : 'border border-slate-700 text-slate-300 hover:bg-slate-700/60 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-slate-500 text-xs">
                      ...
                    </span>
                  )
                )}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                title="Halaman Berikutnya"
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                title="Halaman Terakhir"
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
