'use client';

import React, { useState } from 'react';
import { Database, BookOpen, Layers, Plus, X } from 'lucide-react';
import DocumentUploader from '@/components/admin/DocumentUploader';
import { Button } from '@/components/ui/Button';

export default function KnowledgeBasePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Knowledge Base</h1>
          <p className="text-gray-500 mt-1">Upload and manage documents for the AI assistant.</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold"
        >
          <Plus size={18} />
          Ingest New Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <Database size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Vector Database</h3>
            <p className="text-sm text-slate-500">ChromaDB Active</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Knowledge Base</h3>
            <p className="text-sm text-slate-500">Syllabus Indexing</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
            <Layers size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI Model</h3>
            <p className="text-sm text-slate-500">Ready for Queries</p>
          </div>
        </div>
      </div>

      {/* Document Library (without upload card — that's in the modal) */}
      <DocumentUploader hideUploadCard />

      {/* Ingest Popup Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Ingest New Document</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="p-6">
              <DocumentUploader onlyUploadCard onUploadSuccess={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
