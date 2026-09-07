import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Clock,
  ShieldCheck,
  Check,
  Copy,
  Truck,
  Package,
  Bot,
  User,
  RefreshCw,
  Search,
  CheckCircle,
  Database,
} from 'lucide-react';
import { lookupOrderInFirestore } from '../services/firebaseService';
import { Order } from '../types';

// Official Contact Channels
const WHATSAPP_NUMBER = '639764421242';
const FACEBOOK_PAGE_URL = 'https://www.facebook.com/profile.php?id=61593179006229';
const TELEGRAM_URL = 'https://t.me/+639764421242';
const VIBER_URL = 'viber://chat?number=%2B639764421242';
const SUPPORT_EMAIL = 'tappyofficialstore@gmail.com';
const SUPPORT_PHONE = '0976 442 1242';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  orderCard?: {
    orderId: string;
    stage: string;
    stageDescription: string;
    customerName: string;
    destination: string;
    courier: string;
    trackingNumber?: string;
    estimatedDelivery: string;
    total: number;
    businessName?: string;
    itemsSummary?: string;
    isFirestoreLive?: boolean;
    trackingUrl?: string;
  };
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-welcome',
  sender: 'bot',
  text: `Hello! 👋 I'm your TAPPY Support Assistant. I can answer questions about shipping, delivery rates, NFC hardware setup, or track your live order stage.

Try asking me:
• "Where is my order TR-123456?"
• "What are the shipping rates and delivery times?"
• "How does the NFC tap work?"
• "Which couriers do you use?"`,
  timestamp: 'Just now',
};

const SUGGESTION_CHIPS = [
  '📦 Where is my order?',
  '🚚 Shipping times & rates',
  '📱 How does NFC work?',
  '💳 Payment options',
  '📞 Speak to a live agent',
];

interface SupportFloatingActionButtonProps {
  onOpenTrackingPage?: (orderId: string) => void;
}

export function SupportFloatingActionButton({ onOpenTrackingPage }: SupportFloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'channels'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat when new message appears
  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeTab]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openWhatsApp = (msg?: string) => {
    const textToSend = msg || 'Hi TAPPY! I have an inquiry regarding NFC Google Review hardware.';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openFacebook = () => {
    window.open(FACEBOOK_PAGE_URL, '_blank', 'noopener,noreferrer');
  };

  const openTelegram = () => {
    window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');
  };

  const openViber = () => {
    window.open(VIBER_URL, '_blank', 'noopener,noreferrer');
  };

  const copyEmailAddress = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Chatbot Question Answering Engine
  const processQuery = async (queryText: string) => {
    const userText = queryText.trim();
    if (!userText) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    const lower = userText.toLowerCase();

    // 1. Check if user provided an Order ID or is asking "Where is my order?" / "What is my order status?"
    const explicitTrMatch = userText.match(/TR[- ]?\d{5,8}/i);
    const numMatch = userText.match(/\b\d{6}\b/) || userText.match(/#(\d{5,8})/);
    const orderKeywordMatch = userText.match(/order\s*#?([A-Z0-9-]+)/i);

    let extractedId: string | null = null;
    if (explicitTrMatch) {
      extractedId = explicitTrMatch[0].replace(/\s+/g, '-').toUpperCase();
    } else if (numMatch) {
      extractedId = numMatch[1] ? numMatch[1] : numMatch[0];
    } else if (orderKeywordMatch && orderKeywordMatch[1] && orderKeywordMatch[1].length >= 4) {
      extractedId = orderKeywordMatch[1].toUpperCase();
    }

    const isAskingAboutOrder =
      extractedId !== null ||
      lower.includes('where is my order') ||
      lower.includes('what is my order status') ||
      lower.includes('order status') ||
      lower.includes('where is my package') ||
      lower.includes('track my order') ||
      lower.includes('track order') ||
      lower.includes('check my order') ||
      lower.includes('check order status') ||
      lower.includes('track') ||
      lower.includes('order location');

    if (isAskingAboutOrder) {
      if (extractedId) {
        let normalizedQueryId = extractedId.replace(/^#/, '').trim();
        if (!normalizedQueryId.startsWith('TR-') && /^\d+$/.test(normalizedQueryId)) {
          normalizedQueryId = `TR-${normalizedQueryId}`;
        }

        try {
          // Query Firestore 'orders' collection via lookup tool
          const lookupResult = await lookupOrderInFirestore(normalizedQueryId);
          setIsTyping(false);

          if (lookupResult.found && lookupResult.order) {
            const ord = lookupResult.order;
            const itemsSummaryText = ord.items && ord.items.length > 0
              ? ord.items.map((it) => `${it.quantity}x ${it.productName}${it.businessName ? ` (${it.businessName})` : ''}`).join(', ')
              : undefined;

            const botReply: ChatMessage = {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: `🔎 **Order #${ord.orderId} Verified in Firestore!**\nHere is your real-time fulfillment and tracking status queried directly from our database:`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              orderCard: {
                orderId: ord.orderId,
                stage: ord.stageTitle,
                stageDescription: ord.stageDescription,
                customerName: ord.customerName,
                destination: ord.destination,
                courier: ord.courier,
                trackingNumber: ord.trackingNumber,
                estimatedDelivery: ord.estimatedDelivery,
                total: ord.total,
                businessName: ord.businessName,
                itemsSummary: itemsSummaryText,
                isFirestoreLive: true,
                trackingUrl: ord.trackingUrl,
              },
              actions: [
                ...(onOpenTrackingPage
                  ? [
                      {
                        label: 'Open Full Order Tracking Page →',
                        action: () => onOpenTrackingPage(ord.orderId),
                      },
                    ]
                  : []),
                {
                  label: 'Connect with WhatsApp Support',
                  action: () => openWhatsApp(`Hi TAPPY! I am checking status on my Order #${ord.orderId}`),
                },
              ],
            };
            setMessages((prev) => [...prev, botReply]);
            return;
          }

          // Fallback: check local storage history
          const stored = localStorage.getItem('tapreviewnfc_order_history');
          let localMatch: Order | undefined;
          if (stored) {
            const localList: Order[] = JSON.parse(stored);
            localMatch = localList.find((o) => o.id.toUpperCase() === normalizedQueryId.toUpperCase());
          }

          if (localMatch) {
            const botReply: ChatMessage = {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: `Found local session record for Order #${localMatch.id}. (Status: ${localMatch.status})`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              orderCard: {
                orderId: localMatch.id,
                stage: localMatch.status || 'Processing',
                stageDescription: 'Hardware is being prepared for encoding.',
                customerName: localMatch.customerInfo?.fullName || 'Valued Customer',
                destination: `${localMatch.customerInfo?.city || 'Philippines'}`,
                courier: localMatch.courier || 'J&T Express Philippines',
                estimatedDelivery: localMatch.estimatedDelivery || '2–4 Business Days',
                total: localMatch.total || 0,
                isFirestoreLive: false,
              },
              actions: onOpenTrackingPage
                ? [
                    {
                      label: 'Open Full Order Tracking Page →',
                      action: () => onOpenTrackingPage(localMatch!.id),
                    },
                  ]
                : undefined,
            };
            setMessages((prev) => [...prev, botReply]);
            return;
          }

          // Not found
          const botReply: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `I queried our Firestore 'orders' collection for **#${normalizedQueryId}**, but no matching order document was found.
            
Please verify the 6-digit Order ID from your confirmation email or SMS notification. If you placed the order just moments ago, feel free to try again or reach out to our team!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions: [
              {
                label: 'Contact Live Team via WhatsApp',
                action: () => openWhatsApp(`Hi TAPPY! Could you assist me in locating Order #${normalizedQueryId}?`),
              },
            ],
          };
          setMessages((prev) => [...prev, botReply]);
          return;
        } catch (err) {
          console.error('Lookup tool query error:', err);
          setIsTyping(false);
        }
      } else {
        // Asked "Where is my order?" or "What is my order status?" without providing an ID
        setIsTyping(false);

        // Check if user has orders saved in local storage
        let recentOrders: Order[] = [];
        try {
          const stored = localStorage.getItem('tapreviewnfc_order_history');
          if (stored) {
            recentOrders = JSON.parse(stored);
          }
        } catch {
          // ignore
        }

        if (recentOrders.length > 0) {
          const latest = recentOrders[0];
          const botReply: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `I can look up your real-time order status directly from our Firestore database!
            
I found a recent order saved on this device: **#${latest.id}** (${latest.customerInfo?.fullName || 'Customer'}, ₱${latest.total.toLocaleString()}).
            
Click below to query its live status, or type any Order ID (e.g. "TR-104928"):`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions: [
              {
                label: `🔎 Check Status for #${latest.id} in Firestore`,
                action: () => processQuery(`Where is my order ${latest.id}`),
              },
              ...(onOpenTrackingPage
                ? [
                    {
                      label: `View Order #${latest.id} Details →`,
                      action: () => onOpenTrackingPage(latest.id),
                    },
                  ]
                : []),
            ],
          };
          setMessages((prev) => [...prev, botReply]);
          return;
        }

        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I can query our Firestore database in real time for your order status!
          
Please enter your **6-digit Order ID** (for example: **TR-104928** or **104928**).
          
You can find your Order ID in:
1. Your order confirmation email (sent to you & admin jaesthetic.info@gmail.com)
2. The automated SMS sent to your mobile phone
3. Your browser's "Track Order" or "Orders" link at the top of the store.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botReply]);
        return;
      }
    }

    // 2. Shipping & Delivery Queries
    if (
      lower.includes('shipping') ||
      lower.includes('deliver') ||
      lower.includes('courier') ||
      lower.includes('rate') ||
      lower.includes('how long') ||
      lower.includes('manila') ||
      lower.includes('province') ||
      lower.includes('j&t') ||
      lower.includes('lbc') ||
      lower.includes('fee')
    ) {
      setTimeout(() => {
        setIsTyping(false);
        const reply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `🚚 **TAPPY Shipping & Delivery Information:**

• **Metro Manila:** 1–3 business days (Flat rate ₱120; same-day Grab/Lalamove pickup available upon request).
• **Luzon Provinces:** 2–4 business days (Flat rate ₱180).
• **Visayas & Mindanao:** 3–6 business days (Flat rate ₱180).
• **Free Shipping:** Automatically applied on all orders ₱2,500 and above!
• **Official Courier:** J&T Express Philippines with real-time door-to-door tracking waybills.
• **Automated SMS:** Whenever an order ships, an SMS confirmation with tracking details is automatically sent to your phone.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, reply]);
      }, 500);
      return;
    }

    // 3. NFC Hardware & How it works
    if (
      lower.includes('how does') ||
      lower.includes('how it work') ||
      lower.includes('nfc') ||
      lower.includes('tap') ||
      lower.includes('app') ||
      lower.includes('subscription') ||
      lower.includes('qr')
    ) {
      setTimeout(() => {
        setIsTyping(false);
        const reply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📱 **How TAPPY NFC Hardware Works:**

1. **Pre-Programmed Ready to Use:** We pre-program your specific Google Review link into the internal NTAG213 microchip before shipping. Zero setup required on your end!
2. **Instant Contactless Tap:** Customers hold their phone (iPhone iOS 13+ or any NFC-enabled Android) within 2–4 cm. The 5-star Google review form opens automatically.
3. **QR Code Fallback:** Each unit also features a high-density printed QR code for older devices.
4. **No App & No Monthly Fees:** Operates permanently without any monthly subscription or app download.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, reply]);
      }, 500);
      return;
    }

    // 4. Payment Methods
    if (
      lower.includes('payment') ||
      lower.includes('gcash') ||
      lower.includes('maya') ||
      lower.includes('bank') ||
      lower.includes('card') ||
      lower.includes('pay')
    ) {
      setTimeout(() => {
        setIsTyping(false);
        const reply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `💳 **Accepted Payment Options:**

• **GCash Express Send:** 09764421242 (TAPPY OFFICIAL STORE)
• **Maya Transfer:** 09764421242 (TAPPY OFFICIAL STORE)
• **GoTyme Bank / InstaPay:** Account #016846634686
• **Debit / Credit Card:** Visa & Mastercard via secure checkout

All payments are verified automatically, and instant receipt confirmations are dispatched via email and SMS!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, reply]);
      }, 500);
      return;
    }

    // 5. Human agent / Contact request
    if (
      lower.includes('human') ||
      lower.includes('agent') ||
      lower.includes('call') ||
      lower.includes('speak') ||
      lower.includes('contact') ||
      lower.includes('phone')
    ) {
      setTimeout(() => {
        setIsTyping(false);
        const reply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📞 **Connect With Our Live Support Team:**

Our team in Metro Manila is available daily (9:00 AM – 9:00 PM PHT):
• **WhatsApp:** 0976 442 1242
• **Viber / Telegram:** 0976 442 1242
• **Email:** tappyofficialstore@gmail.com
• **Facebook:** TAPPY Official Page

Tap any button below to connect instantly:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: [
            {
              label: '💬 Chat on WhatsApp',
              action: () => openWhatsApp(),
            },
            {
              label: '📱 Chat on Viber',
              action: () => openViber(),
            },
          ],
        };
        setMessages((prev) => [...prev, reply]);
      }, 400);
      return;
    }

    // 6. General Fallback
    setTimeout(() => {
      setIsTyping(false);
      const reply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Thanks for your question! I can assist you with:
• **Order Tracking:** Enter your Order ID (e.g. TR-123456)
• **Shipping Info:** Ask about delivery timelines or rates
• **NFC Features:** Ask how Google Review tapping works
• **Live Agent:** Connect directly with our team on WhatsApp or Viber.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: 'Speak to a human representative on WhatsApp',
            action: () => openWhatsApp(`Hi TAPPY! I have a question: ${userText}`),
          },
        ],
      };
      setMessages((prev) => [...prev, reply]);
    }, 500);
  };

  const handleChipClick = (chipText: string) => {
    const clean = chipText.replace(/^[^\w]+/, '').trim();
    processQuery(clean);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isTyping) return;
    processQuery(inputQuery);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end print:hidden"
    >
      {/* Floating Card Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[calc(100vw-3rem)] sm:w-[410px] mb-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 text-white flex flex-col h-[560px] max-h-[82vh]"
          >
            {/* Popover Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-sm font-extrabold text-white">
                      TAPPY Assistant
                    </h3>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </div>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Orders & Shipping Support
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                  aria-label="Close support dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs (Chatbot vs Channels) */}
            <div className="flex items-center bg-slate-950/80 p-1 border-b border-slate-800 shrink-0 text-xs font-mono">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Support Chatbot</span>
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'channels'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Direct Messengers</span>
              </button>
            </div>

            {/* TAB 1: Chatbot View */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0 bg-slate-950/50">
                {/* Scrollable Message History */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-sky-500 text-slate-950 font-medium rounded-br-xs shadow-md'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-xs shadow-md space-y-2'
                        }`}
                      >
                        <div className="whitespace-pre-line text-xs">{msg.text}</div>

                        {/* If bot returned an Order Card */}
                        {msg.orderCard && (
                          <div className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-sky-500/40 space-y-2 font-mono text-[11px] text-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                              <span className="font-bold text-sky-400 flex items-center gap-1">
                                <Package className="w-3.5 h-3.5 text-sky-400" />
                                Order #{msg.orderCard.orderId}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                <Database className="w-2.5 h-2.5 text-emerald-400" />
                                Firestore Sync
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              <div>
                                <span className="text-slate-400">Current Stage:</span>{' '}
                                <strong className="text-white bg-slate-800/80 px-1.5 py-0.5 rounded text-[10px]">
                                  {msg.orderCard.stage}
                                </strong>
                              </div>
                              <div className="text-[10px] text-sky-300 bg-sky-950/30 p-1.5 rounded border border-sky-800/30 leading-snug">
                                {msg.orderCard.stageDescription}
                              </div>
                              {msg.orderCard.businessName && (
                                <div className="text-slate-400">
                                  Business: <strong className="text-slate-200">{msg.orderCard.businessName}</strong>
                                </div>
                              )}
                              {msg.orderCard.itemsSummary && (
                                <div className="text-slate-400">
                                  Items: <span className="text-slate-300">{msg.orderCard.itemsSummary}</span>
                                </div>
                              )}
                              <div className="pt-0.5 text-slate-400">
                                Recipient: <strong className="text-slate-200">{msg.orderCard.customerName}</strong> ({msg.orderCard.destination})
                              </div>
                              <div className="text-slate-400">
                                Courier: <strong className="text-slate-200">{msg.orderCard.courier}</strong>
                                {msg.orderCard.trackingNumber && (
                                  <span className="text-sky-400 ml-1">({msg.orderCard.trackingNumber})</span>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                                <span>Est. Delivery: <strong className="text-white">{msg.orderCard.estimatedDelivery}</strong></span>
                                {msg.orderCard.total > 0 && (
                                  <span className="text-sky-300 font-bold">₱{msg.orderCard.total.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action buttons inside bot bubble */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="pt-2 flex flex-col gap-1.5">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => {
                                  act.action();
                                  setIsOpen(false);
                                }}
                                className="w-full text-left py-1.5 px-2.5 rounded-lg bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/40 text-[11px] font-mono font-bold transition-colors cursor-pointer flex items-center justify-between"
                              >
                                <span>{act.label}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.3s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestion Chips */}
                <div className="p-2 border-t border-slate-800/80 bg-slate-950/90 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
                  {SUGGESTION_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-[11px] font-mono text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat Input Field */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    placeholder="Ask about orders, shipping, or enter TR-XXXXXX..."
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isTyping}
                    className="p-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 rounded-xl transition-all cursor-pointer font-bold shrink-0 active:scale-95"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: Direct Messengers & Contact Channels */}
            {activeTab === 'channels' && (
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
                    Choose Your Preferred Channel
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {/* WhatsApp */}
                    <button
                      onClick={() => openWhatsApp()}
                      className="p-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/50 hover:border-[#25D366] rounded-2xl transition-all flex items-center gap-2.5 group cursor-pointer active:scale-95 text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#25D366] text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
                        <MessageCircle className="w-4 h-4 fill-slate-950" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#25D366] block truncate">
                          WhatsApp
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          09764421242
                        </span>
                      </div>
                    </button>

                    {/* Facebook Page */}
                    <button
                      onClick={() => openFacebook()}
                      className="p-3 bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/50 hover:border-[#1877F2] rounded-2xl transition-all flex items-center gap-2.5 group cursor-pointer active:scale-95 text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#1877F2] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                        <Send className="w-4 h-4 fill-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#1877F2] block truncate">
                          Facebook
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          Official Page
                        </span>
                      </div>
                    </button>

                    {/* Telegram */}
                    <button
                      onClick={() => openTelegram()}
                      className="p-3 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/50 hover:border-[#229ED9] rounded-2xl transition-all flex items-center gap-2.5 group cursor-pointer active:scale-95 text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#229ED9] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                        <Send className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#229ED9] block truncate">
                          Telegram
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          09764421242
                        </span>
                      </div>
                    </button>

                    {/* Viber */}
                    <button
                      onClick={() => openViber()}
                      className="p-3 bg-[#7360F2]/15 hover:bg-[#7360F2]/25 border border-[#7360F2]/50 hover:border-[#7360F2] rounded-2xl transition-all flex items-center gap-2.5 group cursor-pointer active:scale-95 text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#7360F2] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#7360F2] block truncate">
                          Viber
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          09764421242
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Direct Contacts */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Phone className="w-3 h-3 text-sky-400" />
                      Direct Mobile / Hotline:
                    </span>
                    <a
                      href={`tel:${WHATSAPP_NUMBER}`}
                      className="font-bold text-white hover:text-sky-400 transition-colors"
                    >
                      {SUPPORT_PHONE}
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-slate-300 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Mail className="w-3 h-3 text-sky-400" />
                      Email:
                    </span>
                    <button
                      onClick={copyEmailAddress}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-sky-400 transition-colors cursor-pointer"
                    >
                      <span>{copiedEmail ? 'Copied!' : SUPPORT_EMAIL}</span>
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                    </button>
                  </div>
                </div>

                {/* Service Hours */}
                <div className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl flex items-center gap-2.5 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Support Hours: Monday to Sunday, 9:00 AM – 9:00 PM PHT. Average reply: &lt;5 mins.</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Launcher Button */}
      <motion.button
        id="tappy-support-fab"
        onClick={() => {
          setIsOpen(!isOpen);
          setUnreadCount(0);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-4 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-indigo-400 text-slate-950 shadow-xl shadow-sky-500/25 border border-white/20 flex items-center justify-center cursor-pointer group"
        aria-label="Open support and order assistance"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950" />
        </span>

        {isOpen ? (
          <X className="w-6 h-6 text-slate-950 transition-transform duration-200" />
        ) : (
          <MessageCircle className="w-6 h-6 text-slate-950 fill-slate-950 transition-transform duration-200 group-hover:rotate-12" />
        )}
      </motion.button>
    </div>
  );
}
