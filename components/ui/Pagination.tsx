'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  total?: number;
}

export default function Pagination({ page, totalPages, onPageChange, pageSize, onPageSizeChange, total }: PaginationProps) {
  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const btnStyle = (active = false, disabled = false) => ({
    width: '30px', height: '30px', borderRadius: '6px', border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: active ? 'var(--gradient)' : 'transparent',
    color: active ? '#fff' : disabled ? 'var(--muted)' : 'var(--text)',
    fontSize: '13px', fontWeight: active ? '600' : '400',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: disabled ? 0.4 : 1,
    transition: 'background 0.15s',
  });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', borderTop: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onPageSizeChange && (
          <>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Show</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '6px', color: 'var(--text)', fontSize: '13px',
                padding: '4px 8px', cursor: 'pointer',
              }}
            >
              {[10, 20, 50].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </>
        )}
        {total !== undefined && (
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
            {((page - 1) * (pageSize || 10)) + 1}–{Math.min(page * (pageSize || 10), total)} of {total}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button onClick={() => onPageChange(1)} disabled={page === 1} style={btnStyle(false, page === 1) as React.CSSProperties}>
          <ChevronsLeft size={14} />
        </button>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} style={btnStyle(false, page === 1) as React.CSSProperties}>
          <ChevronLeft size={14} />
        </button>
        {getPages().map((p, i) => (
          p === '...'
            ? <span key={i} style={{ color: 'var(--muted)', fontSize: '13px', padding: '0 4px' }}>...</span>
            : <button key={i} onClick={() => onPageChange(p as number)} style={btnStyle(p === page) as React.CSSProperties}>{p}</button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} style={btnStyle(false, page === totalPages) as React.CSSProperties}>
          <ChevronRight size={14} />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} style={btnStyle(false, page === totalPages) as React.CSSProperties}>
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
