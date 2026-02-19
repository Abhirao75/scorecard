import { BarChart3 } from 'lucide-react';
import { ExportImportMenu } from './ExportImportMenu';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Scorecard</span>
        </div>
        <ExportImportMenu />
      </div>
    </header>
  );
}
