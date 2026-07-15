'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileCode, AlertTriangle, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import api from '@/services/api';

interface Bug {
  filePath: string;
  line: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact?: string;
  fixSuggestion: string;
  targetCode?: string;
  fixedCode?: string;
}

interface CodeReviewPanelProps {
  projectId: string;
  bugs: Bug[];
  suggestions: string[];
  files: Array<{ path: string; content: string }>;
}

export const CodeReviewPanel = ({ projectId, bugs, suggestions, files }: CodeReviewPanelProps) => {
  const [localFiles, setLocalFiles] = useState(files);

  // Sync files from props if changed
  useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  const isPathMatch = (bugPath: string, filePath: string) => {
    if (!bugPath || !filePath) return false;
    const bp = bugPath.replace(/\\/g, '/').toLowerCase();
    const fp = filePath.replace(/\\/g, '/').toLowerCase();
    if (bp === fp || fp.endsWith('/' + bp) || bp.endsWith('/' + fp)) {
      return true;
    }
    const getBasename = (p: string) => p.split('/').pop() || '';
    return getBasename(bp) === getBasename(fp);
  };

  const firstFileWithBugs = localFiles.find(file => 
    bugs.some(b => isPathMatch(b.filePath, file.path))
  ) || localFiles[0] || null;

  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(firstFileWithBugs?.path || null);
  const [applyingFixIdx, setApplyingFixIdx] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeFile = localFiles.find(f => f.path === selectedFilePath) || null;

  // Filter bugs matching currently selected file path
  const fileBugs = selectedFilePath 
    ? bugs.filter(b => isPathMatch(b.filePath, selectedFilePath))
    : [];

  const getFileBugCount = (filePath: string) => {
    return bugs.filter(b => isPathMatch(b.filePath, filePath)).length;
  };

  const severityColors = {
    low: 'bg-neutral-100 border-ink-black/20 text-ink-black',
    medium: 'bg-neutral-100 border-ink-black/50 text-ink-black',
    high: 'bg-editorial-red/5 border-editorial-red/30 text-ink-black',
    critical: 'bg-editorial-red/10 border-editorial-red text-ink-black'
  };

  const getLanguageFromExtension = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (ext === 'js' || ext === 'jsx') return 'javascript';
    if (ext === 'ts' || ext === 'tsx') return 'typescript';
    if (ext === 'py') return 'python';
    if (ext === 'java') return 'java';
    if (ext === 'cpp' || ext === 'h') return 'cpp';
    if (ext === 'go') return 'go';
    if (ext === 'cs') return 'csharp';
    if (ext === 'rs') return 'rust';
    if (ext === 'css') return 'css';
    if (ext === 'html') return 'html';
    return 'plaintext';
  };

  const extractFixedCode = (suggestion: string) => {
    const match = suggestion.match(/```[a-zA-Z]*\n([\s\S]*?)\n```/);
    return match ? match[1] : null;
  };

  const handleApplyFix = async (bug: Bug, index: number) => {
    const fixedCode = bug.fixedCode || extractFixedCode(bug.fixSuggestion);
    if (!fixedCode || !activeFile) return;

    setApplyingFixIdx(index);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let updatedContent = '';

      // If targetCode matches exactly within file, replace it (safer, handles offset line numbers)
      if (bug.targetCode && activeFile.content.includes(bug.targetCode)) {
        updatedContent = activeFile.content.replace(bug.targetCode, fixedCode);
      } else {
        // Fallback to line replacement (handles Windows CRLF / Linux LF line endings safely)
        const isCrlf = activeFile.content.includes('\r\n');
        const lines = activeFile.content.split(isCrlf ? '\r\n' : '\n');
        const lineIndex = Math.max(0, bug.line - 1);
        lines[lineIndex] = fixedCode;
        updatedContent = lines.join(isCrlf ? '\r\n' : '\n');
      }

      // Call API to write to physical file
      const response = await api.put(`/projects/${projectId}/files`, {
        filePath: activeFile.path,
        content: updatedContent
      });

      if (response.data?.success) {
        // Update local state instantly so Monaco Editor updates values
        setLocalFiles(prev => prev.map(f => 
          f.path === activeFile.path ? { ...f, content: updatedContent } : f
        ));
        setSuccessMsg(`Successfully applied fix for line ${bug.line}!`);
      } else {
        throw new Error(response.data?.message || 'Failed to apply fix');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to apply one-click fix');
    } finally {
      setApplyingFixIdx(null);
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-4 gap-6 h-full w-full min-h-0 text-ink-black">
      {/* File Explorer sidebar */}
      <div className="col-span-1 md:h-full max-h-48 md:max-h-none h-auto bg-paper-bg border border-ink-black p-4 flex flex-col gap-4 overflow-hidden sharp-corners flex-shrink-0">
        <h3 className="text-xs text-neutral-550 font-mono font-bold uppercase tracking-widest border-b border-ink-black pb-2 flex-shrink-0">Workspace Files</h3>
        <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
          {localFiles.map((file) => {
            const bugCount = getFileBugCount(file.path);
            const isSelected = selectedFilePath === file.path;
            return (
              <button
                key={file.path}
                onClick={() => {
                  setSelectedFilePath(file.path);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex items-center justify-between gap-2 px-3 py-2 text-xs font-mono font-bold text-left truncate transition-colors sharp-corners border ${
                  isSelected
                    ? 'bg-ink-black text-paper-bg border-ink-black'
                    : 'text-ink-black bg-transparent border-transparent hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileCode size={14} className={bugCount > 0 ? 'text-editorial-red' : 'text-ink-black'} strokeWidth={1.5} />
                  <span className="truncate">{file.path}</span>
                </div>
                {bugCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-editorial-red text-paper-bg sharp-corners flex-shrink-0">
                    {bugCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor & Annotations Panel */}
      <div className="col-span-3 md:grid md:grid-rows-[1.2fr_1fr] gap-6 md:h-full md:min-h-0 flex flex-col h-auto min-h-0">
        {/* Editor Workspace */}
        <div className="md:h-full h-[350px] bg-paper-bg border border-ink-black overflow-hidden relative sharp-corners flex-shrink-0">
          {activeFile ? (
            <Editor
              height="100%"
              theme="vs"
              language={getLanguageFromExtension(activeFile.path)}
              value={activeFile.content}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500 font-mono text-xs">
              Select a file to inspect annotations
            </div>
          )}
        </div>

        {/* Annotations Cards panel */}
        <div className="md:h-full h-[300px] bg-paper-bg border border-ink-black p-4 flex flex-col overflow-hidden sharp-corners">
          <div className="flex justify-between items-center border-b border-ink-black pb-2 gap-2 flex-wrap flex-shrink-0">
            <h3 className="text-xs text-ink-black font-mono font-bold uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={13} strokeWidth={1.5} />
              Detected Code Issues ({fileBugs.length})
            </h3>
            
            {/* Status alerts */}
            {successMsg && (
              <span className="text-[10px] text-ink-black font-bold font-mono uppercase bg-neutral-100 border border-ink-black px-2 py-0.5 sharp-corners">
                {successMsg}
              </span>
            )}
            {errorMsg && (
              <span className="text-[10px] text-editorial-red font-bold font-mono uppercase bg-editorial-red/5 border border-editorial-red px-2 py-0.5 sharp-corners">
                {errorMsg}
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0 mt-3 flex flex-col gap-3">
            {fileBugs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {fileBugs.map((bug, i) => {
                  const fixedCode = bug.fixedCode || extractFixedCode(bug.fixSuggestion);
                  return (
                    <div 
                      key={i} 
                      className={`p-4 border flex flex-col gap-3 sharp-corners ${severityColors[bug.severity]}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
                            Severity: {bug.severity}
                          </span>
                          <span className="text-[11px] font-mono font-extrabold text-ink-black">Line {bug.line}</span>
                        </div>

                        {fixedCode && (
                          <button
                            onClick={() => handleApplyFix(bug, i)}
                            disabled={applyingFixIdx !== null}
                            className="flex items-center gap-1.5 bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black font-mono text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 sharp-corners transition-all duration-200 cursor-pointer disabled:bg-neutral-300 disabled:text-neutral-500"
                          >
                            {applyingFixIdx === i ? (
                              <>
                                <Loader2 className="animate-spin" size={10} strokeWidth={1.5} />
                                Applying...
                              </>
                            ) : (
                              <>
                                <Sparkles size={10} strokeWidth={1.5} />
                                Apply Fix
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      
                      <p className="text-xs leading-relaxed text-ink-black font-sans font-medium">{bug.description}</p>
                      
                      {bug.impact && (
                        <div className="border border-dashed border-editorial-red/50 bg-editorial-red/5 p-3 text-[10px] font-mono text-ink-black mt-1 sharp-corners">
                          <span className="text-editorial-red font-bold uppercase tracking-widest block mb-1">
                            ⚠️ Exploitation Consequence (CIA Triad):
                          </span>
                          <span className="italic leading-relaxed font-semibold">{bug.impact}</span>
                        </div>
                      )}
                      
                      {bug.fixSuggestion && (
                        <div className="bg-neutral-100 border border-ink-black/30 p-3 text-[10px] font-mono text-ink-black mt-1 whitespace-pre-wrap max-h-40 overflow-y-auto sharp-corners">
                          {bug.fixSuggestion}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1 text-neutral-500 font-mono text-xs gap-2 py-6">
                <CheckCircle size={14} className="text-ink-black" strokeWidth={1.5} />
                No issues detected in this module.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
