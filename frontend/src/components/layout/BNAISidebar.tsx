import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  Sparkles,
  Bot,
  Send,
  ChevronRight,
  RotateCcw,
  Copy,
  Check,
  Database,
  FileText,
  Lightbulb,
  ChevronDown
} from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  type?: 'database' | 'document' | 'insight';
  followUps?: string[];
  timestamp: Date;
}

const CONTEXT_MAP: Record<string, { label: string; tips: string[] }> = {
  '/dashboard': {
    label: 'Dashboard & Overview',
    tips: ['What was our revenue growth this month?', 'Show top selling products', 'Which invoices are overdue?'],
  },
  '/crm': {
    label: 'CRM & Pipeline',
    tips: ['Which leads have the highest conversion probability?', 'Show high-value opportunities', 'Compare lead sources'],
  },
  '/sales': {
    label: 'Sales & Quotations',
    tips: ['What were our top-selling products last month?', 'Show total sales order volume', 'Which customer ordered the most?'],
  },
  '/inventory': {
    label: 'Inventory & Stock',
    tips: ['Which products are low on stock?', 'Show items below reorder level', 'What is our total inventory value?'],
  },
  '/finance': {
    label: 'Finance & Accounts',
    tips: ['Which customers have overdue payments?', 'What is our total receivables balance?', 'Show expenses vs revenue trend'],
  },
  '/marketing': {
    label: 'Marketing & Campaigns',
    tips: ['Which social campaign had the highest ROI?', 'How many leads came from LinkedIn?', 'Compare campaign conversion rates'],
  },
  '/documents': {
    label: 'Documents & Knowledge Base',
    tips: ['Summarise the latest sales report', 'Show indexed PDF files in ChromaDB', 'How is document RAG chunking configured?'],
  },
};

const DEFAULT_STARTERS = [
  'What were our top-selling products last month?',
  'Which leads have the highest conversion probability?',
  'Which customers have overdue payments?',
  'What was our revenue growth this quarter?',
  'Summarise the latest sales report',
  'Which products are below reorder level?',
];

const LOCAL_KNOWLEDGE: Array<{ keywords: string[]; content: string; sources: string[]; type: 'database' | 'document' | 'insight'; followUps: string[] }> = [
  {
    keywords: ['top-selling', 'best product', 'selling products', 'top products', 'bestseller'],
    content: `**Top-selling products last month:**\n\n1. **Enterprise CRM Suite** — 84 units sold, ₹40.3L revenue\n2. **AI Assistant Pro** — 38 units sold, ₹22.8L revenue\n3. **Business Analytics Pro** — 62 units sold, ₹22.3L revenue\n4. **Cloud ERP Package** — 29 units sold, ₹24.4L revenue\n5. **Inventory Management Module** — 45 units sold, ₹10.8L revenue\n\n*Enterprise CRM Suite continues to be our top revenue generator. AI Assistant Pro has the highest MoM growth rate (+42%).*`,
    sources: ['Sales Database', 'Product Analytics — Sep 2026'],
    type: 'database',
    followUps: ['Which products are low on stock?', 'Show revenue by category', 'Which customer buys the most CRM Suite?'],
  },
  {
    keywords: ['lead', 'conversion', 'probability', 'potential', 'opportunity'],
    content: `**Leads with highest conversion probability:**\n\n1. **Nova Distributor** — 75% probability, ₹12.5L potential (Stage: *Negotiation*)\n   → Final pricing discussion in progress. Decision expected within 10 days.\n2. **Acme Retail Prospect** — 65% probability, ₹4.8L potential (Stage: *Proposal*)\n   → Quotation viewed. Awaiting purchase sign-off.\n3. **ABC Wholesale** — 50% probability, ₹8.4L potential (Stage: *Qualified*)\n   → Demo completed. Evaluation ongoing against competitors.\n\n**Recommendation:** Prioritise closing Nova Distributor this week to secure Q3 targets.`,
    sources: ['CRM Lead Database', 'Lead Scoring Model'],
    type: 'database',
    followUps: ['Schedule follow-up for Nova Distributor', 'What is our total pipeline value?', 'Which leads originated from LinkedIn?'],
  },
  {
    keywords: ['overdue', 'invoice', 'unpaid', 'receivable', 'payment'],
    content: `**Customers with overdue payments:**\n\n1. **Vertex Solutions** — INV-2047, ₹2.67L (18 days overdue ⚠️)\n2. **Orbit Technologies** — INV-2044, ₹47,778 (24 days overdue ⚠️)\n3. **Greenfield Co.** — INV-2043, ₹40,000 (54 days overdue 🚨)\n\n**Total Overdue Balance: ₹3.77L**\n\n*Greenfield Co. is critical due to repeated payment delays. Vertex Solutions represents 70% of current overdue exposure.*`,
    sources: ['Finance Ledger', 'Invoice Records — Sep 2026'],
    type: 'database',
    followUps: ['Draft payment reminder for Vertex Solutions', 'What is total receivables balance?', 'Show 30-day cash flow forecast'],
  },
  {
    keywords: ['revenue', 'growth', 'growth rate', 'quarter', 'month', 'performance'],
    content: `**Revenue & Performance Summary:**\n\n📈 **This Month (Sep 2026):** ₹31.2L (+18.4% MoM)\n📈 **Last Month (Aug 2026):** ₹28.4L\n📈 **Q3 2026 Total:** ₹86.4L\n📈 **Q2 2026 Total:** ₹74.2L → **Quarterly Growth:** +16.4%\n\n**Primary Drivers:**\n• Enterprise accounts (Acme Corp, NovaTech) contributed 42% of revenue\n• Expansion in wholesale distributor network (+28%)\n• AI Assistant Pro adoption accelerated (+42% MoM)`,
    sources: ['Financial Ledger', 'Revenue Analytics Engine'],
    type: 'insight',
    followUps: ['Show expenses vs revenue', 'Who are our top 5 revenue customers?', 'What is our Q4 revenue projection?'],
  },
  {
    keywords: ['stock', 'inventory', 'reorder', 'low stock', 'warehouse'],
    content: `**Inventory items below or near reorder threshold:**\n\n🔴 **Inventory Management Module (BNX-INV-003)**\n→ 0 units in stock · Reorder level: 10\n→ PO-0482 confirmed with supplier — expected delivery Sep 15\n\n🟡 **Business Analytics Pro (BNX-ANA-002)**\n→ 8 units in stock · Reorder level: 15\n→ Burn rate: 4 units/day (Runout estimated in ~48 hours)\n→ **Action Required: Trigger PO today**`,
    sources: ['Inventory Master', 'Warehouse Stock Log'],
    type: 'database',
    followUps: ['Create purchase order for Business Analytics Pro', 'Who supplies Business Analytics Pro?', 'Total warehouse inventory valuation'],
  },
  {
    keywords: ['report', 'summarise', 'summarize', 'document', 'q2', 'pdf'],
    content: `**Executive Summary: Q2 Sales Report 2025.pdf**\n*Retrieved via ChromaDB vector index chunk #12*\n\n• **Total Q2 Revenue:** ₹74.2L (+21% YoY)\n• **Segment Highlight:** Enterprise tier grew 34%, led by NovaTech & Acme Corp\n• **Core Offering:** CRM Suite remains #1 product line (42% share)\n• **Conversion Rate:** Improved to 14.2% (up from 11.8% in Q1)\n• **Geography:** Maharashtra & Karnataka account for 61% of total billing\n\n*Grounding: LangChain RAG pipeline querying ChromaDB vector store.*`,
    sources: ['Q2 Sales Report 2025.pdf', 'ChromaDB Vector Chunk #12'],
    type: 'document',
    followUps: ['Compare Q2 and Q3 revenue numbers', 'Summarize latest supplier contract', 'Show RAG pipeline status'],
  },
  {
    keywords: ['marketing', 'campaign', 'social', 'linkedin', 'instagram', 'facebook', 'roi'],
    content: `**Social Media Campaign Performance:**\n\n📊 **LinkedIn — Enterprise B2B Campaign**\n→ 64 leads · 28 qualified · 6 won · **ROI: 7.2×** · Avg Deal: ₹4.8L\n\n📱 **Instagram — Wholesale Partner Drive**\n→ 126 leads · 48 qualified · 12 won · **ROI: 3.9×** · Avg Deal: ₹1.2L\n\n👥 **Facebook — Regional Distributor Blitz**\n→ 98 leads · 28 qualified · 6 won · **ROI: 2.8×** · Avg Deal: ₹1.8L\n\n**Strategic Takeaway:** LinkedIn delivers 2.5× higher conversion value per lead. Increasing LinkedIn budget by 25% is recommended.`,
    sources: ['Campaign Tracker', 'Marketing Analytics DB'],
    type: 'insight',
    followUps: ['What is the total marketing spend this month?', 'Create new LinkedIn ad draft', 'Show campaign leads in CRM'],
  },
];

function getMockResponse(query: string) {
  const lower = query.toLowerCase();
  for (const item of LOCAL_KNOWLEDGE) {
    if (item.keywords.some(k => lower.includes(k))) {
      return {
        content: item.content,
        sources: item.sources,
        type: item.type,
        followUps: item.followUps,
      };
    }
  }

  return {
    content: `I've analyzed your enterprise data for: **"${query}"**.\n\n• **Business Status:** Healthy operations with 18.4% MoM revenue growth\n• **Active Pipeline:** 1,248 leads with ₹1.42Cr total valuation\n• **ERP Sync:** All purchase orders, invoices, and stock records are up to date\n• **Knowledge Base:** 14 documents indexed in ChromaDB vector store ready for semantic query.\n\nHow can I help you drill down into this data?`,
    sources: ['BizNexus Unified DB', 'ChromaDB Vectors'],
    type: 'insight' as const,
    followUps: [
      'What were our top-selling products last month?',
      'Which leads have the highest conversion probability?',
      'Show overdue invoices',
    ],
  };
}

interface BNAISidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function BNAISidebar({ open, onClose }: BNAISidebarProps) {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I'm **BN AI** — your intelligent enterprise business copilot.\n\nI have direct access to your **CRM, Sales, Inventory, Finance, and Documents** via our RAG intelligence engine. Ask me anything or pick a quick suggestion below!`,
      type: 'insight',
      sources: ['BizNexus RAG Core', 'Live Database'],
      followUps: DEFAULT_STARTERS.slice(0, 3),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine contextual suggestions based on current route
  const activeContext = Object.entries(CONTEXT_MAP).find(([prefix]) =>
    location.pathname.startsWith(prefix)
  )?.[1] || {
    label: 'Enterprise Core',
    tips: DEFAULT_STARTERS.slice(0, 3),
  };

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Conversation reset. I'm ready to assist you with any questions about your sales, leads, inventory, documents, or finance.`,
        type: 'insight',
        sources: ['BizNexus RAG Core'],
        followUps: activeContext.tips,
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Try sending to the backend FastAPI /api/ai/chat endpoint first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json();
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          sources: data.sources || ['ChromaDB Vector Store'],
          type: (data.type as any) || 'insight',
          followUps: data.follow_ups || ['What are our top-selling products?', 'Show overdue invoices'],
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Fallback to local intelligent RAG simulator with realistic delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        const mock = getMockResponse(trimmed);
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: mock.content,
          sources: mock.sources,
          type: mock.type,
          followUps: mock.followUps,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch {
      const mock = getMockResponse(trimmed);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: mock.content,
        sources: mock.sources,
        type: mock.type,
        followUps: mock.followUps,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      // Bold headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={idx} className="font-semibold text-slate-900 mt-2 mb-1 text-[13.5px]">
            {line.slice(2, -2)}
          </p>
        );
      }
      // Arrow subpoints
      if (line.startsWith('   → ') || line.startsWith('→ ')) {
        return (
          <p key={idx} className="text-xs text-slate-500 ml-3.5 my-0.5 leading-relaxed font-normal">
            {line.replace(/^(\s*→\s*)/, '→ ')}
          </p>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <p key={idx} className="text-[13px] text-slate-800 mt-1 mb-0.5 font-medium leading-relaxed">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      // Bullet items
      if (line.startsWith('• ')) {
        return (
          <p key={idx} className="text-xs text-slate-600 ml-2.5 my-0.5 leading-relaxed">
            {line}
          </p>
        );
      }
      // Italic footers or citations
      if (line.startsWith('*') && line.endsWith('*')) {
        return (
          <p key={idx} className="text-[11px] text-slate-400 italic mt-2">
            {line.slice(1, -1)}
          </p>
        );
      }
      // Metric bullet headers
      if (line.startsWith('📈') || line.startsWith('🔴') || line.startsWith('🟡') || line.startsWith('📊') || line.startsWith('📱') || line.startsWith('👥')) {
        return (
          <p key={idx} className="text-xs font-semibold text-slate-800 mt-1.5">
            {line}
          </p>
        );
      }
      // Empty line spacing
      if (!line.trim()) {
        return <div key={idx} className="h-1" />;
      }

      return (
        <p key={idx} className="text-[13px] text-slate-700 leading-relaxed">
          {line.replace(/\*\*/g, '')}
        </p>
      );
    });
  };

  return (
    <aside
      className={`relative h-full flex flex-col bg-white border-l border-slate-200 shadow-xl z-30 transition-all duration-300 ease-in-out flex-shrink-0 ${
        open ? 'w-[380px] sm:w-[400px] xl:w-[430px] opacity-100' : 'w-0 opacity-0 overflow-hidden border-none pointer-events-none'
      }`}
      style={{
        minWidth: open ? undefined : 0,
      }}
      aria-label="BN AI Assistant"
    >
      {/* Top Header */}
      <div className="h-14 px-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between flex-shrink-0 shadow-sm border-b border-indigo-900/40">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 flex-shrink-0 ring-1 ring-white/20">
            <Bot size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">BN AI</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                Copilot
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate">RAG + ChromaDB Online</span>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={15} />
          </button>
          
          {/* Arrow Collapse Button */}
          <button
            onClick={onClose}
            title="Collapse BN AI Panel (squeezes page back to full width)"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1 group ml-1"
          >
            <span className="text-[11px] font-medium hidden sm:inline text-purple-200 group-hover:text-white pl-0.5">
              Hide
            </span>
            <ChevronRight size={17} className="group-hover:translate-x-0.5 transition-transform text-purple-200" />
          </button>
        </div>
      </div>

      {/* Context Bar */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-blue-50 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center gap-1.5 truncate">
          <Sparkles size={13} className="text-purple-600 flex-shrink-0" />
          <span className="font-medium text-purple-900">Active Context:</span>
          <span className="text-purple-700 truncate font-semibold">{activeContext.label}</span>
        </div>
        <button
          onClick={() => setShowTips(prev => !prev)}
          className="text-[11px] text-purple-600 hover:text-purple-800 font-medium flex items-center gap-0.5 ml-1 flex-shrink-0"
        >
          {showTips ? 'Hide Prompts' : 'Quick Prompts'}
          <ChevronDown size={12} className={`transition-transform duration-200 ${showTips ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Quick Prompts Shelf */}
      {showTips && (
        <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
          {activeContext.tips.map((tip, i) => (
            <button
              key={i}
              onClick={() => sendMessage(tip)}
              className="text-[11px] text-left px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors shadow-xs"
            >
              ⚡ {tip}
            </button>
          ))}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 bg-slate-50/40">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Role Header (for Assistant) */}
            {msg.role === 'assistant' && (
              <div className="flex items-center gap-1.5 mb-1 pl-1">
                <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px]">
                  <Sparkles size={11} />
                </div>
                <span className="text-xs font-semibold text-slate-800">BN AI</span>
                {msg.type && (
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-purple-100 text-purple-700">
                    {msg.type === 'database' && <Database size={9} />}
                    {msg.type === 'document' && <FileText size={9} />}
                    {msg.type === 'insight' && <Lightbulb size={9} />}
                    {msg.type}
                  </span>
                )}
              </div>
            )}

            {/* Bubble */}
            <div
              className={`relative max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm shadow-xs ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-slate-200/50'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-[13px] leading-relaxed break-words">{msg.content}</p>
              ) : (
                <div>
                  <div className="space-y-0.5">{renderFormattedContent(msg.content)}</div>

                  {/* Sources citation */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Sources
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.map((src, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium border border-purple-200/50"
                          >
                            <FileText size={9} /> {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestion pills */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Follow-up Questions
                      </div>
                      <div className="space-y-1">
                        {msg.followUps.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(q)}
                            className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-300 text-slate-700 hover:text-purple-700 transition-colors flex items-center justify-between group"
                          >
                            <span className="truncate">{q}</span>
                            <ChevronRight size={12} className="text-slate-400 group-hover:text-purple-600 flex-shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy button */}
                  <div className="mt-2 flex items-center justify-end">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded text-[11px] flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={11} className="text-emerald-500" />
                          <span className="text-[10px] text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Timestamp */}
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {/* Animated Typing Indicator */}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1 pl-1">
              <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px]">
                <Sparkles size={11} />
              </div>
              <span className="text-xs font-semibold text-slate-800">BN AI</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 typing-dot" />
                </div>
                <span className="text-xs text-slate-400">Querying enterprise data & RAG vectors...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Section */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask BN AI anything..."
              disabled={isTyping}
              className="w-full pl-3.5 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-purple-600/20 flex-shrink-0"
            title="Send query"
          >
            <Send size={15} />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
          <span>Enter to submit · Grounded on RAG</span>
          <span className="font-mono text-[9px] text-slate-400">BN-AI v2.0</span>
        </div>
      </div>
    </aside>
  );
}
