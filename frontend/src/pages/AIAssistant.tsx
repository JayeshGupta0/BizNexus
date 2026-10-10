import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plus, Trash2, Database, FileText, Lightbulb, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AccessDenied from './AccessDenied';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  type?: 'database' | 'document' | 'insight';
  followUps?: string[];
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
}

const SAMPLE_RESPONSES: Record<string, { content: string; sources?: string[]; type: 'database' | 'document' | 'insight'; followUps: string[] }> = {
  default: {
    content: "I can help you analyse your business data. Try asking about sales performance, lead conversion, inventory levels, customer insights, or financial metrics.",
    type: 'insight',
    followUps: ["What were our top-selling products last month?", "Which leads have the highest conversion probability?", "Show me overdue invoices"],
  },
};

const MOCK_RESPONSES: Array<{ keywords: string[]; response: typeof SAMPLE_RESPONSES[string] }> = [
  {
    keywords: ['top-selling', 'best product', 'selling products', 'top products'],
    response: {
      content: "**Top-selling products last month:**\n\n1. **Enterprise CRM Suite** — 84 units sold, ₹40.3L revenue\n2. **AI Assistant Pro** — 38 units sold, ₹22.8L revenue\n3. **Business Analytics Pro** — 62 units sold, ₹22.3L revenue\n4. **Cloud ERP Package** — 29 units sold, ₹24.4L revenue\n5. **Inventory Management Module** — 45 units sold, ₹10.8L revenue\n\nEnterprise CRM Suite continues to be the highest-volume product. AI Assistant Pro has the fastest growth rate (+42% MoM).",
      sources: ['Sales database', 'Product analytics — Sep 2025'],
      type: 'database',
      followUps: ["Which products are low on stock?", "Show me revenue by category", "Which customer buys the most CRM Suite?"],
    },
  },
  {
    keywords: ['lead', 'conversion probability', 'highest probability', 'best leads'],
    response: {
      content: "**Leads with highest conversion probability:**\n\n1. **Nova Distributor** — 75% probability, ₹12L potential · Stage: Negotiation\n   → Pricing discussion underway. Decision expected within 10 days.\n\n2. **Acme Retail Prospect** — 65% probability, ₹4.8L potential · Stage: Proposal\n   → Quotation viewed. Follow up on revised pricing.\n\n3. **ABC Wholesale** — 50% probability, ₹8.4L potential · Stage: Qualified\n   → Demo scheduled. Competitor evaluation ongoing.\n\n**AI Recommendation:** Prioritise Nova Distributor — high engagement, final negotiation stage, high potential value.",
      sources: ['CRM database', 'Lead scoring model'],
      type: 'database',
      followUps: ["Schedule follow-up for Nova Distributor", "What's the total pipeline value?", "Which leads came from social media?"],
    },
  },
  {
    keywords: ['overdue', 'outstanding', 'unpaid', 'receivable'],
    response: {
      content: "**Customers with overdue payments:**\n\n1. **Vertex Solutions** — INV-2047, ₹2.67L, 18 days overdue ⚠️\n2. **Orbit Technologies** — INV-2044, ₹47,778, 24 days overdue ⚠️\n3. **Greenfield Co.** — INV-2043, ₹40,000, 54 days overdue 🚨\n\n**Total overdue: ₹3.77L**\n\nGreenfield Co. is the most critical — 54 days overdue with a history of irregular payments. Recommend immediate escalation for Vertex Solutions as well (highest amount).",
      sources: ['Finance database', 'Invoice records — Sep 2025'],
      type: 'database',
      followUps: ["Draft a payment reminder for Vertex Solutions", "What's our total receivables?", "Show cash flow forecast"],
    },
  },
  {
    keywords: ['social campaign', 'marketing', 'instagram', 'linkedin', 'facebook'],
    response: {
      content: "**Social campaign lead performance:**\n\n📊 **LinkedIn — Enterprise B2B Campaign**\n→ 64 leads · 28 qualified · 6 converted · ROI: 7.2× · Avg deal: ₹4.8L\n\n📱 **Instagram — Wholesale Partner Campaign**\n→ 126 leads · 48 qualified · 12 converted · ROI: 3.9× · Avg deal: ₹1.2L\n\n👥 **Facebook — Distributor Outreach**\n→ 98 leads · 28 qualified · 6 converted · ROI: 2.8× · Avg deal: ₹1.8L\n\n**Insight:** LinkedIn generates fewer but higher-quality leads. For maximising revenue, increasing LinkedIn budget by 20% could improve overall ROI significantly.",
      sources: ['Marketing analytics', 'Campaign database', 'CRM leads — Q3 2025'],
      type: 'insight',
      followUps: ["Which campaign has the best ROI?", "How many leads came from Instagram this month?", "Create a new LinkedIn campaign"],
    },
  },
  {
    keywords: ['low stock', 'inventory', 'reorder', 'stock level'],
    response: {
      content: "**Products below or near reorder level:**\n\n🔴 **Inventory Management Module (BNX-INV-003)**\n→ 0 units in stock · Reorder level: 10\n→ PO-0482 confirmed — expected delivery Sep 15\n\n🟡 **Business Analytics Pro (BNX-ANA-002)**\n→ 8 units remaining · Reorder level: 15\n→ At current rate (4 units/day), stock runs out in ~2 days\n→ **Recommend: Create PO immediately**\n\nAll other products are above reorder levels.",
      sources: ['Inventory database', 'Product catalogue'],
      type: 'database',
      followUps: ["Create a purchase order for Business Analytics Pro", "Who supplies Business Analytics Pro?", "What's our total inventory value?"],
    },
  },
  {
    keywords: ['revenue growth', 'revenue', 'growth', 'quarter', 'monthly'],
    response: {
      content: "**Revenue performance summary:**\n\n📈 **This month (Sep 2025):** ₹31.2L (+18.4% MoM)\n📈 **Last month (Aug 2025):** ₹28.4L\n📈 **Q3 2025 total:** ₹86.4L\n📈 **Q2 2025 total:** ₹74.2L → Q3 growth: +16.4%\n\n**Key drivers:**\n• Enterprise accounts (Acme Corporation, NovaTech) driving 42% of revenue\n• New distributor deals contributing 28%\n• AI Assistant Pro fastest-growing product (+42% MoM)\n\n**Forecast:** If current trend continues, Q4 revenue projected at ₹98-104L.",
      sources: ['Finance database', 'Q3 Sales Report.pdf', 'Revenue analytics'],
      type: 'database',
      followUps: ["What are our top revenue customers?", "Show expenses vs revenue", "Which product category drives the most revenue?"],
    },
  },
  {
    keywords: ['report', 'summarise', 'summarize', 'document', 'supplier'],
    response: {
      content: "**Summary: Q2 Sales Report 2025.pdf**\n\n*Source: Document indexed on 2025-07-05*\n\n**Key findings from Q2 2025:**\n\n• Total Q2 revenue: ₹74.2L (+21% YoY)\n• Enterprise segment grew 34% — NovaTech and Acme Corporation lead\n• CRM Suite remains top product (42% of revenue)\n• Lead conversion improved to 14.2% (was 11.8% Q1)\n• Maharashtra and Karnataka account for 61% of revenue\n• 3 new enterprise accounts onboarded\n\n*This summary was generated from the indexed document content using RAG retrieval.*",
      sources: ['Q2 Sales Report 2025.pdf', 'Revenue database'],
      type: 'document',
      followUps: ["Compare Q2 to Q3 performance", "What were the top products in Q2?", "Show me the H1 Finance Summary"],
    },
  },
];

function findResponse(query: string) {
  const lower = query.toLowerCase();
  for (const { keywords, response } of MOCK_RESPONSES) {
    if (keywords.some(k => lower.includes(k))) return response;
  }
  return SAMPLE_RESPONSES.default;
}

const SUGGESTED_QUESTIONS = [
  "What were our top-selling products last month?",
  "Which leads have the highest conversion probability?",
  "Which customers have overdue payments?",
  "Which social campaign generated the most qualified leads?",
  "Show me low-stock products.",
  "What was our revenue growth this quarter?",
  "Summarise the latest supplier report.",
];

const TYPE_CONFIG = {
  database: { icon: Database, label: 'Business Data', color: '#2563eb', bg: '#eff6ff' },
  document: { icon: FileText, label: 'Document Source', color: '#7c3aed', bg: '#f5f3ff' },
  insight: { icon: Lightbulb, label: 'AI Insight', color: '#f59e0b', bg: '#fffbeb' },
};

const CONVERSATIONS: Conversation[] = [
  { id: 'c1', title: 'Revenue & Sales Analysis', lastMessage: 'Revenue increased 18.4% this month...', time: '10 min ago' },
  { id: 'c2', title: 'Lead Prioritisation', lastMessage: 'Nova Distributor has 75% conversion...', time: '2 hours ago' },
  { id: 'c3', title: 'Inventory Status', lastMessage: 'Business Analytics Pro is below...', time: '1 day ago' },
];

export default function AIAssistant() {
  const { hasModule } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm **BizNexuz AI** — your intelligent business assistant. I can answer questions about your sales, leads, customers, inventory, finance, and documents.\n\nTry asking me anything about your business data.",
      type: 'insight',
      followUps: SUGGESTED_QUESTIONS.slice(0, 3),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeConv, setActiveConv] = useState('c0');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!hasModule('ai-assistant')) return <AccessDenied />;

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 600));
    const response = findResponse(text);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      sources: response.sources,
      type: response.type,
      followUps: response.followUps,
      timestamp: new Date(),
    };
    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-slate-800 mt-2 mb-1">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('→ ')) {
        return <p key={i} className="text-xs text-slate-500 ml-4 mt-0.5">{line.slice(2)}</p>;
      }
      if (line.match(/^\d+\. /)) {
        return <p key={i} className="text-sm text-slate-700 mt-1.5">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('📊') || line.startsWith('📱') || line.startsWith('👥') || line.startsWith('📈') || line.startsWith('🔴') || line.startsWith('🟡')) {
        return <p key={i} className="text-sm font-medium text-slate-800 mt-2">{line}</p>;
      }
      if (line.startsWith('•')) {
        return <p key={i} className="text-sm text-slate-600 mt-0.5 ml-3">{line}</p>;
      }
      if (line.startsWith('*This')) {
        return <p key={i} className="text-xs text-slate-400 italic mt-2">{line.replace(/\*/g, '')}</p>;
      }
      if (!line.trim()) return <div key={i} className="h-1" />;
      return <p key={i} className="text-sm text-slate-700">{line.replace(/\*\*/g, '')}</p>;
    });
  };

  return (
    <div className="h-[calc(100vh-56px)] flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => { setMessages([{ id: '0', role: 'assistant', content: "Hello! I'm **BizNexuz AI**. How can I help you today?", type: 'insight', followUps: SUGGESTED_QUESTIONS.slice(0, 3), timestamp: new Date() }]); setActiveConv('c0'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm font-medium"
            style={{ background: '#2563eb' }}
          >
            <Plus size={15} /> New Conversation
          </button>
        </div>
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 px-2 mb-2">RECENT</div>
          {CONVERSATIONS.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-colors ${activeConv === conv.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <div className="text-sm font-medium text-slate-800 truncate">{conv.title}</div>
              <div className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage}</div>
              <div className="text-xs text-slate-300 mt-0.5">{conv.time}</div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50">
            <Sparkles size={14} style={{ color: '#7c3aed' }} />
            <div>
              <div className="text-xs font-semibold" style={{ color: '#7c3aed' }}>RAG-powered</div>
              <div className="text-xs text-slate-500">Business data + Documents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#7c3aed' }}>
            <Bot size={18} />
          </div>
          <div>
            <div className="font-semibold text-slate-900">BizNexuz AI</div>
            <div className="text-xs text-slate-400">Ask questions about your business data and documents</div>
          </div>
          <button onClick={() => setMessages([])} className="ml-auto p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Clear conversation">
            <Trash2 size={15} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white mt-0.5" style={{ background: '#7c3aed' }}>
                  <Sparkles size={14} />
                </div>
              )}
              <div className={`max-w-2xl ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                {msg.role === 'user' ? (
                  <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
                    {msg.type && (
                      <div className="flex items-center gap-1.5 mb-2">
                        {(() => {
                          const cfg = TYPE_CONFIG[msg.type];
                          const Icon = cfg.icon;
                          return <><div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: cfg.bg, color: cfg.color }}><Icon size={10} /> {cfg.label}</div></>;
                        })()}
                      </div>
                    )}
                    <div className="space-y-0.5">{renderContent(msg.content)}</div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="text-xs font-medium text-slate-400 mb-1.5">Sources</div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map(src => (
                            <span key={src} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                              <FileText size={10} /> {src}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {msg.followUps && msg.followUps.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="text-xs font-medium text-slate-400 mb-2">Suggested follow-ups</div>
                        <div className="space-y-1">
                          {msg.followUps.map(q => (
                            <button key={q} onClick={() => sendMessage(q)} className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-slate-600">
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ background: '#7c3aed' }}>
                <Sparkles size={14} />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-slate-300 typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 ml-1">Analysing your data...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions (when empty) */}
        {messages.length <= 1 && (
          <div className="px-6 pb-3">
            <div className="text-xs font-medium text-slate-400 mb-2">Try asking:</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 4).map(q => (
                <button key={q} onClick={() => sendMessage(q)} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-slate-600">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white">
          <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your business data..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2.5 rounded-xl text-white transition-opacity disabled:opacity-40 flex items-center gap-2 font-medium text-sm"
              style={{ background: '#7c3aed' }}
            >
              <Send size={15} />
            </button>
          </form>
          <div className="text-xs text-slate-400 text-center mt-2">
            BizNexuz AI · Powered by RAG — Business data + indexed documents
          </div>
        </div>
      </div>
    </div>
  );
}
