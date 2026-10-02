import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Sparkles, Check, CheckCheck, Clock, 
  Paperclip, Calendar, ShieldCheck, ChevronRight,
  Search, ExternalLink, Download, FileText
} from 'lucide-react';
import { db } from '../services/databaseService';
import { realtimeChat } from '../services/realtimeChatService';
import { Conversation, ChatMessage } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVendor?: {
    vendorId: string;
    vendorType: 'hall' | 'caterer' | 'photographer' | 'decor';
    vendorName: string;
    vendorSubtitle: string;
    vendorAvatar: string;
    vendorContactName?: string;
    vendorRole?: string;
  } | null;
  onBookVendor?: (vendorId: string, vendorType: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  initialVendor,
  onBookVendor
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [socketStatus, setSocketStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount / open
  useEffect(() => {
    if (isOpen) {
      const convs = db.getConversations();
      setConversations(convs);

      if (initialVendor) {
        const active = db.getOrCreateConversation(initialVendor);
        setActiveConvId(active.id);
        db.markConversationAsRead(active.id);
      } else if (convs.length > 0 && !activeConvId) {
        setActiveConvId(convs[0].id);
        db.markConversationAsRead(convs[0].id);
      }
    }
  }, [isOpen, initialVendor]);

  // Subscribe to real-time events & DB updates
  useEffect(() => {
    const unsubMessages = realtimeChat.subscribeMessages((_msg: ChatMessage) => {
      const updated = db.getConversations();
      setConversations(updated);
      if (activeConvId) {
        db.markConversationAsRead(activeConvId);
      }
    });

    const unsubStatus = realtimeChat.subscribeStatus((status) => {
      setSocketStatus(status);
    });

    const handleDbUpdate = () => {
      setConversations(db.getConversations());
    };
    window.addEventListener('elysian_db_update', handleDbUpdate);

    return () => {
      unsubMessages();
      unsubStatus();
      window.removeEventListener('elysian_db_update', handleDbUpdate);
    };
  }, [activeConvId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, activeConvId, isOpen]);

  if (!isOpen) return null;

  const currentConversation = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSelectConversation = (convId: string) => {
    setActiveConvId(convId);
    db.markConversationAsRead(convId);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeConvId) return;

    const text = inputMessage.trim();
    setInputMessage('');
    await realtimeChat.sendUserMessage(activeConvId, text);
  };

  const handleSendPrompt = async (promptText: string) => {
    if (!activeConvId) return;
    await realtimeChat.sendUserMessage(activeConvId, promptText);
  };

  const filteredConversations = conversations.filter(c => 
    c.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vendorContactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-hidden animate-in fade-in duration-200">
      <div 
        id="chat-modal-container"
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#E5E0D5] overflow-hidden flex flex-col md:flex-row h-[90vh] max-h-[780px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT SIDEBAR: Active Conversations & Vendor Directory */}
        <div className="w-full md:w-80 bg-[#F9F7F2] border-r border-[#E5E0D5] flex flex-col shrink-0">
          
          {/* Header */}
          <div className="p-4 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-black/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#C5A059] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
                  Live Vendor Relay
                </span>
                <h3 className="font-serif text-sm font-bold text-white">
                  Messages & Enquiries
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className={`w-2.5 h-2.5 rounded-full ${socketStatus === 'connected' ? 'bg-[#246A42] animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[10px] text-stone-300 font-mono">Live</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-3 border-b border-[#E5E0D5]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendor threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E5E0D5] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#888888] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E5E0D5]">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#888888]">
                No matching conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isActive ? 'bg-white border-l-4 border-[#C5A059]' : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.vendorAvatar}
                        alt={conv.vendorName}
                        className="w-10 h-10 rounded-xl object-cover border border-[#E5E0D5]"
                        referrerPolicy="no-referrer"
                      />
                      {conv.vendorOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#246A42] border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-[#1A1A1A] truncate block">
                          {conv.vendorName}
                        </strong>
                        <span className="text-[10px] text-[#888888] shrink-0 font-mono">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <span className="text-[10px] text-[#8C6A24] font-medium block truncate">
                        {conv.vendorContactName} ({conv.vendorRole})
                      </span>

                      <p className="text-[11px] text-[#666666] truncate mt-0.5">
                        {conv.vendorTyping ? (
                          <span className="text-[#246A42] font-semibold animate-pulse">Typing reply...</span>
                        ) : (
                          conv.lastMessage
                        )}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 bg-[#8C2424] text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Escrow Guarantee Footnote */}
          <div className="p-3 bg-white border-t border-[#E5E0D5] flex items-center gap-2 text-[10px] text-[#246A42]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>All quotes delivered through chat are guaranteed under Elysian Escrow protection.</span>
          </div>
        </div>

        {/* RIGHT SIDE: Current Conversation Message Stream */}
        {currentConversation ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            
            {/* Conversation Active Header */}
            <div className="p-4 bg-white border-b border-[#E5E0D5] flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={currentConversation.vendorAvatar}
                    alt={currentConversation.vendorName}
                    className="w-10 h-10 rounded-xl object-cover border border-[#E5E0D5]"
                    referrerPolicy="no-referrer"
                  />
                  {currentConversation.vendorOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#246A42] border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#1A1A1A] truncate">
                      {currentConversation.vendorName}
                    </h4>
                    <span className="text-[10px] font-semibold text-[#246A42] bg-[#246A42]/10 px-2 py-0.5 rounded-md hidden sm:inline-block">
                      Verified Vendor
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] truncate">
                    {currentConversation.vendorContactName} • {currentConversation.vendorRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onBookVendor && (
                  <button
                    onClick={() => {
                      onClose();
                      onBookVendor(currentConversation.vendorId, currentConversation.vendorType);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="hidden sm:inline">Reserve Date</span>
                  </button>
                )}

                <button
                  id="close-chat-modal-btn"
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#888888] hover:text-[#1A1A1A] hover:bg-[#F9F7F2] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FDFCFA]">
              
              {/* Date Notice */}
              <div className="text-center my-2">
                <span className="text-[10px] text-[#888888] bg-[#F9F7F2] px-3 py-1 rounded-full border border-[#E5E0D5]">
                  Encrypted Vendor Concierge Channel
                </span>
              </div>

              {currentConversation.messages.map((msg) => {
                const isUser = msg.senderId === 'user';
                const isSystem = msg.senderId === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#C5A059]/40 text-xs space-y-2 max-w-lg mx-auto">
                      <div className="flex items-center gap-2 text-[#8C6A24] font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>{msg.text}</span>
                      </div>
                      {msg.attachment && (
                        <div className="p-2.5 bg-white rounded-lg border border-[#C5A059]/30 text-xs">
                          <strong className="text-[#1A1A1A] block">{msg.attachment.title}</strong>
                          <p className="text-[11px] text-[#666666]">{msg.attachment.description}</p>
                          {msg.attachment.price && (
                            <span className="text-xs font-mono font-bold text-[#246A42] block mt-1">
                              Guaranteed Amount: ${msg.attachment.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <img
                        src={currentConversation.vendorAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-lg object-cover mb-1 shrink-0 border border-[#E5E0D5]"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    <div className={`max-w-md sm:max-w-lg space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                          isUser
                            ? 'bg-[#1A1A1A] text-white rounded-br-xs'
                            : 'bg-white text-[#1A1A1A] border border-[#E5E0D5] rounded-bl-xs'
                        }`}
                      >
                        <p>{msg.text}</p>

                        {/* Rich Attachment Card */}
                        {msg.attachment && (
                          <div className={`mt-2.5 p-3 rounded-xl border text-xs ${
                            isUser ? 'bg-white/10 border-white/20 text-white' : 'bg-[#F9F7F2] border-[#E5E0D5] text-[#1A1A1A]'
                          }`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <FileText className={`w-4 h-4 ${isUser ? 'text-[#C5A059]' : 'text-[#8C6A24]'}`} />
                                <strong className="font-semibold block">{msg.attachment.title}</strong>
                              </div>
                              <button className="p-1 text-[#888888] hover:text-[#1A1A1A] cursor-pointer">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {msg.attachment.description && (
                              <p className={`text-[11px] mt-1 ${isUser ? 'text-stone-300' : 'text-[#666666]'}`}>
                                {msg.attachment.description}
                              </p>
                            )}
                            {msg.attachment.price && (
                              <div className="mt-2 pt-2 border-t border-black/10 flex items-center justify-between">
                                <span className="text-[11px]">Quotation Rate:</span>
                                <span className="font-mono font-bold text-[#246A42]">${msg.attachment.price.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className={`flex items-center gap-1.5 text-[10px] text-[#888888] px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.timestamp}</span>
                        {isUser && (
                          <span>
                            {msg.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-[#888888]" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Vendor Typing Indicator */}
              {currentConversation.vendorTyping && (
                <div className="flex items-center gap-2 text-xs text-[#666666] bg-white border border-[#E5E0D5] p-2.5 rounded-xl w-fit animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
                  <span>{currentConversation.vendorContactName} is typing a response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Inquiry Suggestion Chips */}
            <div className="p-2.5 bg-[#F9F7F2] border-t border-[#E5E0D5] overflow-x-auto flex items-center gap-2 scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-[#888888] whitespace-nowrap pl-1">
                Quick Prompts:
              </span>
              {[
                `Is our wedding date available for booking?`,
                `Could you share your itemized pricing brochure?`,
                `Can we schedule a private tasting / walkthrough?`,
                `What are your deposit and cancellation terms?`,
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(prompt)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-[#F7F3EB] border border-[#E5E0D5] hover:border-[#C5A059] text-[11px] text-[#1A1A1A] whitespace-nowrap transition-all cursor-pointer shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Bottom Message Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-[#E5E0D5] flex items-center gap-2">
              <input
                type="text"
                id="chat-message-input"
                placeholder={`Message ${currentConversation.vendorContactName}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#888888] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />

              <button
                type="submit"
                id="send-chat-message-btn"
                disabled={!inputMessage.trim()}
                className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputMessage.trim()
                    ? 'bg-[#1A1A1A] hover:bg-black text-[#C5A059] shadow-sm'
                    : 'bg-[#E5E0D5] text-[#888888] cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-[#888888]">
            Select a vendor conversation from the left to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};
