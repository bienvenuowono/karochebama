import React from 'react';
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';

interface Column {
  id: string;
  label: string;
  minWidth?: string;
  align?: 'left' | 'right' | 'center';
  format?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  loading?: boolean;
}

const DataTable = ({ columns, data = [], onEdit, onDelete, onView, loading }: DataTableProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Chargement des données...</p>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
        <div className="p-3 bg-slate-50 rounded-full text-slate-300">
          <MoreHorizontal size={32} />
        </div>
        <p className="mt-4 text-slate-500 font-medium">Aucune donnée trouvée.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              {columns.map((column) => (
                <th 
                  key={column.id}
                  className={`px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : ''}`}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-slate-50/50 transition-colors group">
                {columns.map((column) => (
                  <td key={column.id} className="px-6 py-4 text-sm text-slate-600">
                    {column.format ? column.format(row[column.id], row) : (row[column.id] || '-')}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onView && (
                        <button 
                          onClick={() => onView(row.id)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(row.id)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(row.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
