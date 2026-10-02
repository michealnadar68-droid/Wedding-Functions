import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, X, ChevronRight } from 'lucide-react';
import { db } from '../services/databaseService';
import { realtimeChat } from '../services/realtimeChatService';
import { ChatMessage, Conversation } from '../types';

interface FloatingChatWidgetProps {
  onOpenChat: () => void;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ onOpenChat }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [latestNotification, setLatestNotification] = useState<{
    vendorName: string;
    text: string;
    avatar: string;
  } | null>(null);

  const updateCounts = () => {
    setUnreadCount(db.getTotalUnreadCount());
  };

  useEffect(() => {
    updateCounts();

    const unsub = realtimeChat.subscribeMessages((msg: ChatMessage) => {
      updateCounts();
      if (msg.senderId === 'vendor') {
        const convs = db.getConversations();
        const conv = convs.find(c => c.id === msg.conversationId);
        if (conv) {
          setLatestNotification({
            vendorName: conv.vendorName,
            text: msg.text,
            avatar: conv.vendorAvatar,
          });

          // Auto-hide popup after 5.5s
          setTimeout(() => {
            setLatestNotification(null);
          }, 5500);
        }
      }
    });

    const handleDbUpdate = () => {
      updateCounts();
    };
    window.addEventListener('elysian_db_update', handleDbUpdate);

    return () => {
      unsub();
      window.removeEventListener('elysian_db_update', handleDbUpdate);
    };
  }, []);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Real-time Popup Toast for Incoming Vendor Messages */}
      {latestNotification && (
        <div 
          onClick={onOpenChat}
          className="pointer-events-auto p-3.5 sm:p-4 bg-white rounded-2xl border-2 border-[#C5A059] shadow-2xl max-w-[85vw] sm:max-w-sm flex items-start gap-3 cursor-pointer animate-in slide-in-from-bottom-5 duration-300 group hover:shadow-xl"
        >
          <img
            src={latestNotification.avatar}
            alt={latestNotification.vendorName}
            className="w-10 h-10 rounded-xl object-cover border border-[#E5E0D5] shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C6A24] uppercase tracking-wider">
                New Vendor Message
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLatestNotification(null);
                }}
                className="text-[#888888] hover:text-[#1A1A1A] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <strong className="text-xs font-bold text-[#1A1A1A] block truncate mt-0.5">
              {latestNotification.vendorName}
            </strong>
            <p className="text-xs text-[#666666] line-clamp-2 mt-0.5">
              {latestNotification.text}
            </p>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-chat-launcher-btn"
        onClick={onOpenChat}
        className="pointer-events-auto relative p-3.5 sm:px-5 sm:py-3.5 bg-[#1A1A1A] hover:bg-black text-[#C5A059] rounded-full shadow-2xl border-2 border-[#C5A059]/40 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer group"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-[#C5A059]" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#8C2424] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </div>

        <span className="text-xs font-bold text-white hidden sm:inline-block">
          Vendor Chat Relay
        </span>

        {unreadCount > 0 && (
          <span className="text-[10px] font-bold bg-[#C5A059] text-[#1A1A1A] px-2 py-0.5 rounded-full hidden sm:inline-block">
            {unreadCount} new
          </span>
        )}
      </button>
    </div>
  );
};
