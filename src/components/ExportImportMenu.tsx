import { useState, useRef } from 'react';
import { Download, Upload, ChevronDown, FileJson, FileText, Trash2 } from 'lucide-react';
import { useFeatureStore } from '../store/useFeatureStore';
import { exportToCSV, exportToJSON } from '../utils/export';
import { importFromCSV, importFromJSON } from '../utils/import';

export function ExportImportMenu() {
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importType, setImportType] = useState<'csv' | 'json'>('json');
  const { features, replaceFeatures, clearAll } = useFeatureStore();

  function handleExportCSV() { exportToCSV(features); setOpen(false); }
  function handleExportJSON() { exportToJSON(features); setOpen(false); }

  function handleImportClick(type: 'csv' | 'json') {
    setImportType(type);
    setOpen(false);
    fileRef.current!.accept = type === 'csv' ? '.csv' : '.json';
    fileRef.current!.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target!.result as string;
        const imported = importType === 'json' ? importFromJSON(text) : importFromCSV(text);
        if (!window.confirm(`This will replace your ${features.length} existing feature(s) with ${imported.length} imported feature(s). Continue?`)) return;
        replaceFeatures(imported);
      } catch (err) {
        alert(`Import failed: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleClear() {
    if (confirmClear) { clearAll(); setConfirmClear(false); setOpen(false); }
    else setConfirmClear(true);
  }

  return (
    <div className="relative">
      <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
      <button
        onClick={() => { setOpen(o => !o); setConfirmClear(false); }}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <span>Import / Export</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setConfirmClear(false); }} />
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden">
            <div className="p-1">
              <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Export</p>
              <button onClick={handleExportCSV} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors text-left">
                <FileText className="w-4 h-4" /> Export as CSV
              </button>
              <button onClick={handleExportJSON} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors text-left">
                <Download className="w-4 h-4" /> Backup as JSON
              </button>
            </div>
            <div className="border-t border-gray-100 p-1">
              <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Import</p>
              <button onClick={() => handleImportClick('csv')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors text-left">
                <Upload className="w-4 h-4" /> Import CSV
              </button>
              <button onClick={() => handleImportClick('json')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors text-left">
                <FileJson className="w-4 h-4" /> Restore from JSON
              </button>
            </div>
            <div className="border-t border-gray-100 p-1">
              <button onClick={handleClear} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
                <Trash2 className="w-4 h-4" />
                {confirmClear ? 'Click again to confirm' : 'Clear all data'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
