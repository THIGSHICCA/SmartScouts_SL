'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  UploadCloud, FileText, X, CheckCircle2, AlertCircle, Loader2,
  Trash2, Eye, Calendar, Tag, Pencil, Filter, BookOpen, Plus,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  'General Reference':     'bg-slate-100 text-slate-700 border-slate-200',
  'Junior Scout Syllabus': 'bg-blue-100 text-blue-700 border-blue-200',
  'Senior Scout Syllabus': 'bg-purple-100 text-purple-700 border-purple-200',
  'Proficiency Badges':    'bg-green-100 text-green-700 border-green-200',
  'Membership Badges':     'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Leader Training':       'bg-orange-100 text-orange-700 border-orange-200',
  'Activity Guidelines':   'bg-pink-100 text-pink-700 border-pink-200',
};

interface Document { id: number; filename: string; file_path: string; uploaded_at: string; category: string; description: string; }
interface Category { id: number; name: string; is_default: boolean; }

const API = 'http://localhost:5000/api';

export default function DocumentUploader({
  hideUploadCard = false,
  onlyUploadCard = false,
  onUploadSuccess,
}: {
  hideUploadCard?: boolean;
  onlyUploadCard?: boolean;
  onUploadSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('General Reference');
  const [customCategory, setCustomCategory] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [editDoc, setEditDoc] = useState<Document | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editCustomCategory, setEditCustomCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tkn = () => sessionStorage.getItem('token');
  const hdr = () => ({ Authorization: `Bearer ${tkn()}` });

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/ai/categories`, { headers: hdr() });
      if (res.ok) setCategories(await res.json());
    } catch {}
  };

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch(`${API}/ai/documents`, { headers: hdr() });
      if (res.ok) setDocuments(await res.json());
    } catch {} finally { setLoadingDocs(false); }
  };

  useEffect(() => { fetchCategories(); fetchDocuments(); }, []);

  const createCategoryIfNotExists = async (catName: string) => {
    const existing = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (existing) return existing.name;
    try {
      const r = await fetch(`${API}/ai/categories`, {
        method: 'POST', headers: { ...hdr(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName }),
      });
      if (r.ok) {
        await fetchCategories();
        const data = await r.json();
        return data.category.name;
      }
    } catch {}
    return catName;
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('uploading');
    setUploadMessage('Uploading and indexing...');
    
    let finalCategory = uploadCategory;
    if (uploadCategory === '__NEW__') {
      if (!customCategory.trim()) {
        setUploadStatus('error');
        setUploadMessage('Please enter a new category name.');
        return;
      }
      finalCategory = await createCategoryIfNotExists(customCategory.trim());
    }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', finalCategory);
    fd.append('description', uploadDescription);
    
    try {
      const res = await fetch(`${API}/ai/syllabus/upload`, { method: 'POST', headers: hdr(), body: fd });
      const data = await res.json();
      if (res.ok) { 
        setUploadStatus('success'); 
        setUploadMessage(data.message); 
        setFile(null); 
        setUploadDescription(''); 
        setUploadCategory('General Reference');
        setCustomCategory('');
        fetchDocuments();
        if (onUploadSuccess) onUploadSuccess();
      }
      else { setUploadStatus('error'); setUploadMessage(data.message); }
    } catch { setUploadStatus('error'); setUploadMessage('Network error.'); }
  };

  const handleView = async (id: number) => {
    try {
      const res = await fetch(`${API}/ai/documents/${id}/view`, { headers: hdr() });
      if (!res.ok) throw 0;
      window.open(window.URL.createObjectURL(await res.blob()), '_blank');
    } catch { alert('Could not open file.'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this document and its knowledge base chunks?')) return;
    setDeletingId(id);
    try { const r = await fetch(`${API}/ai/documents/${id}`, { method: 'DELETE', headers: hdr() }); if (r.ok) fetchDocuments(); }
    catch {} finally { setDeletingId(null); }
  };

  const handleSaveEdit = async () => {
    if (!editDoc) return;
    setEditSaving(true); setEditError('');
    
    let finalCategory = editCategory;
    if (editCategory === '__NEW__') {
      if (!editCustomCategory.trim()) {
        setEditError('Please enter a new category name.');
        setEditSaving(false);
        return;
      }
      finalCategory = await createCategoryIfNotExists(editCustomCategory.trim());
    }

    try {
      const r = await fetch(`${API}/ai/documents/${editDoc.id}`, {
        method: 'PUT', headers: { ...hdr(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: finalCategory, description: editDescription }),
      });
      if (r.ok) { setEditDoc(null); fetchDocuments(); } else setEditError((await r.json()).message);
    } catch { setEditError('Network error.'); } finally { setEditSaving(false); }
  };

  const catNames = categories.map(c => c.name);
  const filterOptions = ['All', ...Array.from(new Set(documents.map(d => d.category).filter(Boolean)))];
  const filteredDocs = activeFilter === 'All' ? documents : documents.filter(d => d.category === activeFilter);
  const catColor = (c: string) => CATEGORY_COLORS[c] ?? 'bg-indigo-100 text-indigo-700 border-indigo-200';

  const UploadForm = () => (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center transition-all ${uploadStatus === 'uploading' ? 'bg-slate-50 border-slate-300' : 'hover:bg-blue-50/40 border-slate-300 hover:border-blue-400 cursor-pointer'}`}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); if (e.dataTransfer.files?.[0]) { setFile(e.dataTransfer.files[0]); setUploadStatus('idle'); } }}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.txt" onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setUploadStatus('idle'); } }} />
        {!file ? (
          <>
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3"><UploadCloud size={28} /></div>
            <p className="font-semibold text-slate-700 mb-1">Drag &amp; drop PDF or TXT here</p>
            <p className="text-sm text-slate-400 mb-4">or click to browse</p>
          </>
        ) : (
          <div className="w-full max-w-sm bg-white p-3 rounded-xl border shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><FileText size={18} /></div>
              <div className="truncate text-left">
                <p className="font-bold text-slate-800 text-sm truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size/1024/1024).toFixed(2)} MB</p>
              </div>
            </div>
            {uploadStatus !== 'uploading' && <button onClick={e => { e.stopPropagation(); setFile(null); }} className="text-slate-300 hover:text-red-400 p-1"><X size={18} /></button>}
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5"><Tag size={14} /> Category <span className="text-red-400">*</span></label>
          <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm mb-2">
            {catNames.map(c => <option key={c}>{c}</option>)}
            <option value="__NEW__" className="text-blue-600 font-semibold">+ Add New Category...</option>
          </select>
          {uploadCategory === '__NEW__' && (
            <input type="text" value={customCategory} onChange={e => setCustomCategory(e.target.value)} placeholder="Type new category name" autoFocus
              className="w-full border border-blue-300 rounded-xl px-3 py-2 text-sm text-slate-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5"><BookOpen size={14} /> Description <span className="text-slate-400 font-normal">(optional)</span></label>
          <input type="text" value={uploadDescription} onChange={e => setUploadDescription(e.target.value)} placeholder="e.g. SLSA 2022 Junior Badge Requirements"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
        </div>
      </div>
      {uploadStatus === 'success' && <div className="mt-5 p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 border border-green-100"><CheckCircle2 size={18} /><span className="font-semibold text-sm">{uploadMessage}</span></div>}
      {uploadStatus === 'error' && <div className="mt-5 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100"><AlertCircle size={18} /><span className="font-semibold text-sm">{uploadMessage}</span></div>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setFile(null); setUploadStatus('idle'); setUploadMessage(''); setUploadDescription(''); setUploadCategory('General Reference'); setCustomCategory(''); }} disabled={uploadStatus === 'uploading'}>Clear</Button>
        <Button onClick={handleUpload} disabled={!file || uploadStatus === 'uploading'} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[130px] rounded-xl">
          {uploadStatus === 'uploading' ? <><Loader2 size={16} className="animate-spin mr-2" />Indexing...</> : 'Upload & Index'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Upload Card (full page mode) */}
      {!hideUploadCard && !onlyUploadCard && (
        <Card className="p-8 border border-slate-100 shadow-lg bg-white rounded-2xl">
          <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2"><UploadCloud size={20} className="text-blue-500" /> Upload New Document</h2>
          <UploadForm />
        </Card>
      )}

      {/* Upload-only (for modal usage) */}
      {onlyUploadCard && <UploadForm />}

      {/* Document Library */}
      {!onlyUploadCard && (
        <Card className="p-8 border border-slate-100 shadow-lg bg-white rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Filter size={18} className="text-blue-500" /> Knowledge Documents</h3>
              <p className="text-slate-400 text-sm mt-0.5">Indexed files serving RAG queries</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchDocuments} disabled={loadingDocs}>{loadingDocs ? <Loader2 size={14} className="animate-spin" /> : 'Refresh'}</Button>
          </div>
          {documents.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {filterOptions.map(opt => (
                <button key={opt} onClick={() => setActiveFilter(opt)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${activeFilter === opt ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}>
                  {opt}{opt !== 'All' && <span className="ml-1.5 opacity-70">({documents.filter(d => d.category === opt).length})</span>}
                </button>
              ))}
            </div>
          )}
          {loadingDocs && documents.length === 0 ? (
            <div className="py-14 flex flex-col items-center text-slate-300"><Loader2 size={36} className="animate-spin text-blue-400 mb-2" /><p className="text-sm">Loading...</p></div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-14 border border-dashed rounded-xl flex flex-col items-center text-slate-300 bg-slate-50/40">
              <FileText size={36} className="mb-2" /><p className="font-semibold text-slate-400">{documents.length === 0 ? 'No documents yet' : 'No documents in this category'}</p>
            </div>
          ) : (
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50"><tr>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Document</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Category</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase hidden md:table-cell">Uploaded</th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                </tr></thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {filteredDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4"><div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><FileText size={17} /></div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate max-w-[200px] md:max-w-xs" title={doc.filename}>{doc.filename}</p>
                          {doc.description && <p className="text-xs text-slate-400 truncate max-w-[200px] md:max-w-xs">{doc.description}</p>}
                        </div>
                      </div></td>
                      <td className="px-5 py-4 whitespace-nowrap"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${catColor(doc.category)}`}><Tag size={10} /> {doc.category}</span></td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400 hidden md:table-cell"><div className="flex items-center gap-1.5"><Calendar size={13} />{new Date(doc.uploaded_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div></td>
                      <td className="px-5 py-4 whitespace-nowrap text-right"><div className="flex justify-end gap-1">
                        <button onClick={() => handleView(doc.id)} className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="View"><Eye size={16} /></button>
                        <button onClick={() => { setEditDoc(doc); setEditCategory(doc.category || 'General Reference'); setEditCustomCategory(''); setEditDescription(doc.description || ''); setEditError(''); }} className="p-2 rounded-lg text-slate-400 hover:bg-yellow-50 hover:text-yellow-600 transition-colors" title="Edit"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(doc.id)} disabled={deletingId === doc.id} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50" title="Delete">
                          {deletingId === doc.id ? <Loader2 size={16} className="animate-spin text-red-500" /> : <Trash2 size={16} />}
                        </button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Edit Modal */}
      {editDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setEditDoc(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Pencil size={18} className="text-yellow-500" /> Edit Document</h3>
                <p className="text-sm text-slate-400 mt-0.5 truncate max-w-xs">{editDoc.filename}</p>
              </div>
              <button onClick={() => setEditDoc(null)} className="text-slate-300 hover:text-slate-600 p-1"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5"><Tag size={14} className="inline mr-1" />Category</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm mb-2">
                  {catNames.map(c => <option key={c}>{c}</option>)}
                  <option value="__NEW__" className="text-blue-600 font-semibold">+ Add New Category...</option>
                </select>
                {editCategory === '__NEW__' && (
                  <input type="text" value={editCustomCategory} onChange={e => setEditCustomCategory(e.target.value)} placeholder="Type new category name" autoFocus
                    className="w-full border border-blue-300 rounded-xl px-3 py-2 text-sm text-slate-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5"><BookOpen size={14} className="inline mr-1" />Description</label>
                <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3} placeholder="Short description..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm resize-none" />
              </div>
              {editError && <div className="p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm border border-red-100"><AlertCircle size={16} /> {editError}</div>}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditDoc(null)} disabled={editSaving}>Cancel</Button>
              <Button onClick={handleSaveEdit} disabled={editSaving} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px] rounded-xl">
                {editSaving ? <><Loader2 size={15} className="animate-spin mr-2" />Saving...</> : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
