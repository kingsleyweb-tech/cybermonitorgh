import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Shield, Send, Trash2, AlertTriangle, Lock,
  Search, FileText, Bug, Cpu, Terminal, Loader2, User, Sparkles
} from 'lucide-react';
import { sendAIMessage, generateMessageId } from '../../services/aiChat';
import type { ChatMessage } from '../../services/aiChat';

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let key = 0;

  const inlineFormat = (line: string): React.ReactNode => {
    const parts = line.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i} className="font-black text-zinc-900 dark:text-white">{part.slice(2, -2)}</strong>;
      if (part.startsWith('__') && part.endsWith('__'))
        return <strong key={i} className="font-black text-zinc-900 dark:text-white">{part.slice(2, -2)}</strong>;
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (!line) { nodes.push(<br key={key++} />); continue; }

    if (/^[-*•]\s/.test(line)) {
      nodes.push(
        <div key={key++} className="flex items-start gap-2 my-1">
          <span className="text-blue-500 font-bold flex-shrink-0 mt-0.5">•</span>
          <span className="text-zinc-800 dark:text-zinc-200">{inlineFormat(line.replace(/^[-*•]\s/, ''))}</span>
        </div>
      );
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1];
      nodes.push(
        <div key={key++} className="flex items-start gap-2 my-1">
          <span className="text-blue-500 font-black flex-shrink-0 w-5 text-right">{num}.</span>
          <span className="text-zinc-800 dark:text-zinc-200">{inlineFormat(line.replace(/^\d+\.\s/, ''))}</span>
        </div>
      );
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      nodes.push(
        <p key={key++} className="font-black text-blue-600 dark:text-blue-400 mt-3 mb-1 text-sm sm:text-base">
          {inlineFormat(line.replace(/^#{1,3}\s/, ''))}
        </p>
      );
      continue;
    }
    nodes.push(<span key={key++} className="text-zinc-800 dark:text-zinc-200">{inlineFormat(line)}<br /></span>);
  }
  return nodes;
}

// Compact Quick Analysis Templates
const ANALYST_TEMPLATES = [
  { id: 'threat', label: 'Analyze Threat', icon: Shield, prompt: 'Perform a threat intelligence analysis on current ransomware and active phishing campaigns.' },
  { id: 'cve', label: 'Explain CVE', icon: Bug, prompt: 'Explain how to analyze and prioritize critical CVE vulnerabilities in server infrastructure.' },
  { id: 'ip', label: 'Investigate IP', icon: Search, prompt: 'What steps should I take to investigate a suspicious IP address connecting to my firewall?' },
  { id: 'malware', label: 'Analyze Malware', icon: Cpu, prompt: 'How can I safely analyze unknown executable payloads and memory injections?' },
  { id: 'summary', label: 'Summarize Article', icon: FileText, prompt: 'Summarize key threat intelligence takeaways and indicators of compromise.' },
  { id: 'assessment', label: 'Threat Assessment', icon: AlertTriangle, prompt: 'Provide a structured security threat assessment for mobile money and SIM swap risks.' },
  { id: 'recs', label: 'Recommendations', icon: Lock, prompt: 'What are the top 5 cybersecurity defense recommendations for corporate networks?' },
  { id: 'ioc', label: 'IOC Analysis', icon: Terminal, prompt: 'How do I extract and validate Indicators of Compromise (IOCs) from security logs?' },
];

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
      {/* Icon with white/neutral professional background */}
      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center border shadow-sm ${
        isUser
          ? 'bg-blue-600 text-white border-blue-700'
          : isError
          ? 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
      }`}>
        {isUser
          ? <User className="w-4 h-4" />
          : isError
          ? <AlertTriangle className="w-4 h-4" />
          : <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        }
      </div>

      <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 shadow-sm text-xs sm:text-sm leading-relaxed ${
        isUser
          ? 'bg-blue-600 text-white font-semibold rounded-br-sm'
          : isError
          ? 'bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-bl-sm font-medium'
          : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-bl-sm font-medium'
      }`}>
        {isUser
          ? <p className="whitespace-pre-wrap">{message.content}</p>
          : <div className="space-y-1">{renderMarkdown(message.content)}</div>
        }
        <p className={`text-[10px] font-bold mt-2 ${isUser ? 'text-blue-100 text-right' : 'text-zinc-400 dark:text-zinc-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm">
        <Shield className="w-4 h-4" />
      </div>
      <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 mr-1">Cyber Analyst Assistant is thinking</span>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface WelcomeScreenProps {
  onPromptSelect: (prompt: string) => void;
}

function WelcomeScreen({ onPromptSelect }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400 mb-4">
        <Shield className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">Cyber Intelligence Analyst Assistant</h2>
      <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-extrabold mb-1">Threat Analysis &amp; Advisory Engine</p>
      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-md mb-6 leading-relaxed font-medium">
        Query threat intelligence, analyze CVE vulnerabilities, review malicious IOCs, or request security mitigation recommendations.
      </p>

      {/* Compact Templates Panel */}
      <div className="w-full max-w-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm text-left">
        <p className="text-xs font-black uppercase text-zinc-400 mb-3 tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Analyst Quick Queries
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ANALYST_TEMPLATES.map(({ id, label, icon: Icon, prompt }) => (
            <button
              key={id}
              onClick={() => onPromptSelect(prompt)}
              className="flex items-center gap-2 bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-800 rounded-xl p-2.5 transition-all text-left group shadow-xs"
            >
              <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 transition-colors" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AIAssistantPage() {
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [inputValue, setInput]    = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [inputValue]);

  const handleSend = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id:        generateMessageId(),
      role:      'user',
      content:   text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg];
      const reply = await sendAIMessage(text, history);
      const assistantMsg: ChatMessage = {
        id:        generateMessageId(),
        role:      'assistant',
        content:   reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id:        generateMessageId(),
        role:      'assistant',
        content:   err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
        timestamp: new Date(),
        isError:   true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [inputValue, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInput('');
    textareaRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] max-h-[880px] bg-white dark:bg-black rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden transition-colors relative">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Neutral/white background icon */}
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-xs text-blue-600 dark:text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-base font-black text-zinc-900 dark:text-white tracking-tight">Cyber Analyst Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider">Active Threat Engine</p>
            </div>
          </div>
        </div>
        {!isEmpty && (
          <button
            onClick={handleClearChat}
            title="Clear conversation"
            className="flex items-center gap-1.5 text-xs font-black text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-zinc-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/40 rounded-xl px-3.5 py-2 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear chat</span>
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 scroll-smooth">
        {isEmpty
          ? <WelcomeScreen onPromptSelect={text => handleSend(text)} />
          : (
            <>
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )
        }
        {isEmpty && <div ref={messagesEndRef} />}
      </div>

      {/* Bottom Floating Template Bar (When in active conversation) */}
      {!isEmpty && (
        <div className="px-4 py-2 bg-zinc-50/80 dark:bg-zinc-950/80 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap shrink-0">Quick Queries:</span>
          {ANALYST_TEMPLATES.map(({ id, label, icon: Icon, prompt }) => (
            <button
              key={id}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shrink-0 shadow-xs"
            >
              <Icon className="w-3 h-3 text-zinc-400" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950 px-4 sm:px-6 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              id="ai-chat-input"
              value={inputValue}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about cybersecurity threats, CVEs, ransomware, IOCs, incident response…"
              rows={1}
              disabled={isLoading}
              className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-zinc-900 dark:text-white placeholder-zinc-400 resize-none outline-none transition-all disabled:opacity-50 leading-relaxed shadow-sm"
              style={{ minHeight: '48px', maxHeight: '140px' }}
            />
          </div>
          <button
            id="ai-chat-send-btn"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            title="Send message (Enter)"
            className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-all shadow-lg shadow-blue-600/30 active:scale-95"
          >
            {isLoading
              ? <Loader2 className="w-5 h-5 text-white animate-spin" />
              : <Send className="w-5 h-5 text-white" />
            }
          </button>
        </div>
        <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mt-2 text-center">
          Press <kbd className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-mono">Enter</kbd> to send · <kbd className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
