import { useState } from 'react';
import { Upload, Search, FileText, Download, Trash2, Sparkles, CheckCircle, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/ui/StatusBadge';
import AccessDenied from './AccessDenied';
import { type Document } from '../data/mockData';

type DocCategory = 'All' | 'Invoice' | 'Quotation' | 'Purchase Order' | 'Contract' | 'Report' | 'Business Document';

const CATEGORY_ICONS: Record<string, string> = {
  Invoice: '🧾', Quotation: '📝', 'Purchase Order': '📦', Contract: '📑', Report: '📊', 'Business Document': '📁',
};

type ProcessingStage = 'uploading' | 'extracting' | 'chunking' | 'embedding' | 'indexing' | 'done' | null;

const STAGE_LABELS: Record<string, string> = {
  uploading: 'Uploading document...',
  extracting: 'Extracting text...',
  chunking: 'Chunking content...',
  embedding: 'Generating embeddings...',
  indexing: 'Indexing to vector database...',
  done: 'Document indexed successfully.',
};

export default function Documents() {
  const { hasModule, hasPermission, documents, addDocument } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DocCategory>('All');
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(null);
  const [newDocName, setNewDocName] = useState('');

  if (!hasModule('documents')) return <AccessDenied />;

  const filtered = documents.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || d.category === category;
    return matchSearch && matchCat;
  });

  const simulateUpload = async (docName: string) => {
    const stages: ProcessingStage[] = ['uploading', 'extracting', 'chunking', 'embedding', 'indexing', 'done'];
    for (const stage of stages) {
      setProcessingStage(stage);
      await new Promise(r => setTimeout(r, stage === 'done' ? 1200 : 600));
    }
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: docName,
      category: 'Business Document',
      size: '2.1 MB',
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Administrator',
      status: 'Indexed',
      chunksCount: 16,
    };
    addDocument(newDoc);
    setTimeout(() => setProcessingStage(null), 1500);
  };

  const handleUpload = () => {
    const name = `Enterprise_Doc_${Date.now().toString().slice(-4)}.pdf`;
    setNewDocName(name);
    simulateUpload(name);
  };

  const categories: DocCategory[] = ['All', 'Invoice', 'Quotation', 'Purchase Order', 'Contract', 'Report', 'Business Document'];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Documents</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage and process business documents with AI-powered indexing.</p>
        </div>
        <button onClick={handleUpload} disabled={processingStage !== null} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: '#2563eb' }}>
          <Upload size={15} /> Upload Document
        </button>
      </div>

      {/* RAG Processing indicator */}
      {processingStage && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            {processingStage === 'done' ? <CheckCircle size={18} className="text-green-500" /> : <Loader size={18} className="text-blue-500 animate-spin" />}
            <div className="font-semibold text-slate-800 text-sm">{STAGE_LABELS[processingStage]}</div>
          </div>
          {processingStage !== 'done' && (
            <>
              <div className="flex gap-2 mb-2">
                {['uploading', 'extracting', 'chunking', 'embedding', 'indexing'].map((s, i) => {
                  const stages = ['uploading', 'extracting', 'chunking', 'embedding', 'indexing'];
                  const currentIdx = stages.indexOf(processingStage);
                  const stageIdx = i;
                  return (
                    <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: stageIdx <= currentIdx ? '#2563eb' : '#e2e8f0' }} />
                  );
                })}
              </div>
              <div className="text-xs text-slate-400">Processing: {newDocName}</div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {['Upload', 'Extract', 'Chunk', 'Embed', 'Index'].map((label, i) => {
                  const stages = ['uploading', 'extracting', 'chunking', 'embedding', 'indexing'];
                  const currentIdx = stages.indexOf(processingStage);
                  const done = i < currentIdx;
                  const active = i === currentIdx;
                  return (
                    <div key={label} className={`text-center py-2 px-1 rounded-lg text-xs ${done ? 'bg-green-100 text-green-700' : active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
                      {done ? '✓' : active ? '⏳' : '○'} {label}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {processingStage === 'done' && (
            <div className="text-sm text-green-700">
              <span className="font-medium">{newDocName}</span> has been indexed successfully and is now available for AI retrieval.
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value as DocCategory)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText size={36} className="mx-auto mb-2 text-slate-300" />
          <h3 className="font-semibold text-slate-700 text-sm">No Documents Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {documents.length === 0 ? 'No enterprise documents uploaded yet. Click "Upload Document" above to index contracts, SOPs, or specifications.' : 'No documents match your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(doc => (
          <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                {CATEGORY_ICONS[doc.category] ?? '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 text-sm truncate">{doc.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{doc.category}</span>
                  <span className="text-xs text-slate-400">{doc.size}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{doc.uploadedDate} · {doc.uploadedBy}</div>
              </div>
              <StatusBadge status={doc.status} />
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-1.5 text-xs text-slate-600 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <Download size={12} /> Download
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg transition-colors hover:bg-purple-50" style={{ color: '#7c3aed' }}>
                <Sparkles size={12} /> Process with AI
              </button>
              {hasPermission('documents', 'delete') && (
                <button className="flex items-center justify-center text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* RAG / Document Intelligence Visual Architecture Pipeline */}
      <div className="bg-white rounded-xl border border-purple-200 p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">RAG & Document Intelligence Pipeline Architecture</h3>
              <p className="text-xs text-slate-500">Visual representation of the enterprise document indexing & retrieval flow</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
            AI Architecture (Specification)
          </span>
        </div>

        {/* Interactive Visual Flow */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 items-center">
          {[
            { step: '1. Ingestion', name: 'PDF Document', tech: 'Source File', icon: '📄', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { step: '2. Parser', name: 'PyPDF', tech: 'Document Loader', icon: '⚙️', color: 'bg-slate-50 text-slate-700 border-slate-200' },
            { step: '3. Extraction', name: 'Text Extraction', tech: 'Cleaned Chunks', icon: '📝', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { step: '4. Orchestration', name: 'LangChain', tech: 'Prompt & Split', icon: '🦜', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { step: '5. Vector DB', name: 'ChromaDB', tech: 'Embeddings Index', icon: '🗄️', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
            { step: '6. Semantic Query', name: 'AI Retrieval', tech: 'Top-k Vector Match', icon: '🔍', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
            { step: '7. Synthesis', name: 'ChatGPT', tech: 'LLM Reasoning', icon: '🤖', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { step: '8. Insight', name: 'Business Answer', tech: 'Answer + Citations', icon: '💡', color: 'bg-green-50 text-green-700 border-green-200' },
          ].map((item, idx, arr) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className={`flex-1 p-2.5 rounded-xl border ${item.color} text-center transition-all hover:scale-105`}>
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-[10px] font-medium opacity-75">{item.step}</div>
                <div className="text-xs font-bold truncate">{item.name}</div>
                <div className="text-[9px] mt-0.5 opacity-80 truncate">{item.tech}</div>
              </div>
              {idx < arr.length - 1 && (
                <span className="hidden lg:inline text-slate-300 font-bold text-xs">→</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Uploaded documents are vectorized into ChromaDB and queried using LangChain embeddings to supply factual enterprise answers.</span>
          <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">RAG Ready</span>
        </div>
      </div>
    </div>
  );
}
