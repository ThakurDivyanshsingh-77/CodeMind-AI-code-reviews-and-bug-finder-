'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, Loader2, Bot, User, FolderCode, FileCode, MessageSquare } from 'lucide-react';
import api from '@/services/api';

interface Source {
  filePath: string;
  startLine: number;
  endLine: number;
}

interface Message {
  question: string;
  answer: string;
  sources?: Source[];
  createdAt?: string;
}

interface ChatPanelProps {
  reviewId?: string;
  projectId?: string;
}

type ChatMode = 'review' | 'rag';

const SUGGESTED_QUESTIONS = [
  'Where is the authentication logic?',
  'What does the User schema look like?',
  'Which files handle API routing?',
  'Where are environment variables used?',
];

export const ChatPanel = ({ reviewId, projectId }: ChatPanelProps) => {
  const [mode, setMode] = useState<ChatMode>(reviewId ? 'review' : 'rag');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchHistory = async () => {
    setFetching(true);
    setMessages([]);
    try {
      if (mode === 'review' && reviewId) {
        const response = await api.get(`/chat/${reviewId}`);
        if (response.data?.success) {
          setMessages(response.data.data);
        }
      }
      // RAG history is loaded from the same endpoint using projectId
      if (mode === 'rag' && projectId) {
        const response = await api.get(`/chat/${projectId}`);
        if (response.data?.success) {
          setMessages(response.data.data);
        }
      }
    } catch {
      // Silently ignore history errors on first load
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [mode, reviewId, projectId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent | null, overrideMessage?: string) => {
    e?.preventDefault();
    const userMessage = overrideMessage ?? input;
    if (!userMessage.trim() || loading) return;

    setInput('');
    setLoading(true);

    // Optimistic UI: append the user question immediately
    const optimisticMsg: Message = { question: userMessage, answer: '', sources: [] };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      if (mode === 'review' && reviewId) {
        const response = await api.post('/chat', { reviewId, message: userMessage });
        if (response.data?.success) {
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = response.data.data;
            return next;
          });
        }
      } else if (mode === 'rag' && projectId) {
        const response = await api.post('/chat/rag', { projectId, message: userMessage });
        if (response.data?.success) {
          const { reply, sources } = response.data.data;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { question: userMessage, answer: reply, sources };
            return next;
          });
        }
      }
    } catch (err: any) {
      const apiMsg: string = err?.response?.data?.message || err?.message || '';
      let displayError = '⚠️ Failed to get a response. Please try again.';
      if (apiMsg.includes('429') || apiMsg.toLowerCase().includes('quota') || apiMsg.toLowerCase().includes('rate limit')) {
        displayError = '⏳ AI quota limit reached. Please wait ~30 seconds and try again.';
      } else if (apiMsg.includes('404') || apiMsg.toLowerCase().includes('not found')) {
        displayError = '🗂️ Project files not found on server. Please re-upload the project.';
      } else if (apiMsg) {
        displayError = `⚠️ ${apiMsg.slice(0, 120)}`;
      }
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = {
          ...next[next.length - 1],
          answer: displayError
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const canSwitchRAG = !!projectId;
  const canSwitchReview = !!reviewId;

  return (
    <div className="flex flex-col h-full bg-paper-bg border border-ink-black sharp-corners overflow-hidden text-ink-black">

      {/* Panel Header + Mode Tabs */}
      <div className="p-3 bg-neutral-100 border-b border-ink-black flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bot size={13} strokeWidth={1.5} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">AI Assistant</span>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-1 p-1 border border-ink-black bg-paper-bg sharp-corners">
          <button
            onClick={() => canSwitchReview && setMode('review')}
            disabled={!canSwitchReview}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'review'
                ? 'bg-ink-black text-paper-bg'
                : 'text-neutral-500 hover:text-ink-black disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <MessageSquare size={9} />
            Review Q&amp;A
          </button>
          <button
            onClick={() => canSwitchRAG && setMode('rag')}
            disabled={!canSwitchRAG}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'rag'
                ? 'bg-ink-black text-paper-bg'
                : 'text-neutral-500 hover:text-ink-black disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <FolderCode size={9} />
            Chat with Code
          </button>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-paper-bg">
        {fetching ? (
          <div className="flex items-center justify-center h-full text-neutral-500 font-mono text-xs gap-2">
            <Loader2 className="animate-spin text-ink-black" size={12} strokeWidth={1.5} />
            Loading history...
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="flex flex-col gap-3">
              {/* User question bubble */}
              <div className="flex gap-2 items-start self-end max-w-[90%]">
                <div className="bg-neutral-100 border border-ink-black text-ink-black text-xs px-3.5 py-2.5 sharp-corners leading-relaxed font-mono break-words max-w-full">
                  {msg.question}
                </div>
                <div className="w-6 h-6 border border-ink-black bg-ink-black flex items-center justify-center flex-shrink-0 sharp-corners">
                  <User size={10} className="text-paper-bg" />
                </div>
              </div>

              {/* AI response bubble */}
              <div className="flex gap-2 items-start max-w-[90%]">
                <div className="w-6 h-6 border border-ink-black bg-neutral-200 flex items-center justify-center flex-shrink-0 sharp-corners">
                  <Bot size={10} className="text-ink-black" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="bg-paper-bg border border-ink-black text-ink-black text-xs px-3.5 py-2.5 sharp-corners leading-relaxed whitespace-pre-wrap break-words font-sans max-w-full">
                    {msg.answer || <span className="text-neutral-500 italic font-mono text-[10px]">Generating summary...</span>}
                  </div>

                  {/* Source citations for RAG mode */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-1">
                      <span className="text-[8px] text-neutral-500 font-mono font-bold uppercase tracking-wider self-center mr-0.5">Sources:</span>
                      {msg.sources.map((src, si) => (
                        <span
                          key={si}
                          title={`${src.filePath} lines ${src.startLine}–${src.endLine}`}
                          className="inline-flex items-center gap-1 text-[8px] font-mono bg-neutral-100 border border-ink-black/30 text-ink-black px-2 py-0.5 sharp-corners"
                        >
                          <FileCode size={8} strokeWidth={1.5} />
                          {src.filePath.split('/').pop()}:{src.startLine}–{src.endLine}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-550 text-center gap-3 p-4">
            {mode === 'rag' ? (
              <>
                <FolderCode size={24} className="text-ink-black" strokeWidth={1.5} />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink-black">Chat with your Codebase</span>
                <span className="text-[10px] font-mono leading-relaxed text-neutral-500">
                  Ask anything about the source code — I'll scan the files and cite references.
                </span>
                {/* Suggested prompts */}
                <div className="flex flex-col gap-1.5 w-full mt-2">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(null, q)}
                      className="text-left text-[9px] font-mono text-ink-black bg-paper-bg hover:bg-neutral-100 border border-ink-black px-3 py-2 sharp-corners transition-all cursor-pointer font-semibold"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <Terminal size={20} className="text-ink-black" strokeWidth={1.5} />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink-black">Review Q&amp;A</span>
                <span className="text-[10px] font-mono leading-relaxed text-neutral-500">Ask questions about detected codebase mistakes or request refactor solutions.</span>
              </>
            )}
          </div>
        )}

        {/* Loading typing indicator */}
        {loading && (
          <div className="flex gap-2.5 items-start max-w-[85%] animate-pulse">
            <div className="w-6 h-6 border border-ink-black bg-neutral-200 flex items-center justify-center flex-shrink-0 sharp-corners">
              <Bot size={10} className="text-ink-black" strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-2 bg-paper-bg border border-ink-black text-neutral-500 text-xs px-3.5 py-2.5 sharp-corners font-mono">
              <Loader2 className="animate-spin text-ink-black" size={10} strokeWidth={1.5} />
              <span>{mode === 'rag' ? 'Searching codebase...' : 'AI writing...'}</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="p-3 bg-neutral-100 border-t border-ink-black flex gap-2 items-end">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'rag' ? 'Ask about codebase...' : 'Ask about review...'}
          className="flex-1 bg-transparent border-b-2 border-ink-black px-3 py-2 text-xs font-mono text-ink-black focus:outline-none focus:bg-neutral-50 placeholder-neutral-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black transition-colors sharp-corners cursor-pointer disabled:opacity-50"
        >
          <Send size={12} strokeWidth={1.5} />
        </button>
      </form>
    </div>
  );
};
