import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingCartButton from '../../components/ui/FloatingCartButton';
import ChatHeader from './components/ChatHeader';
import ChatList from './components/ChatList';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';
import MessageSearch from './components/MessageSearch';
import TypingIndicator from './components/TypingIndicator';
import Icon from '../../components/AppIcon';


const ChatInterface = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Mock messages for the selected chat
  const mockMessages = [
    {
      id: 1,
      type: 'text',
      content: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(Date.now() - 3600000),
      isSent: false,
      status: 'read',
      senderName: 'أحمد محمد'
    },
    {
      id: 2,
      type: 'text',
      content: 'أهلاً وسهلاً! أريد الاستفسار عن المنتجات المتاحة',
      timestamp: new Date(Date.now() - 3500000),
      isSent: true,
      status: 'read'
    },
    {
      id: 3,
      type: 'product',
      product: {
        name: 'هاتف ذكي جديد',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop'
      },
      timestamp: new Date(Date.now() - 3400000),
      isSent: false,
      status: 'read',
      senderName: 'أحمد محمد'
    },
    {
      id: 4,
      type: 'text',
      content: 'هذا المنتج يبدو رائعاً! هل هو متاح للشحن؟',
      timestamp: new Date(Date.now() - 3300000),
      isSent: true,
      status: 'read'
    },
    {
      id: 5,
      type: 'voice',
      duration: 15,
      timestamp: new Date(Date.now() - 3200000),
      isSent: false,
      status: 'read',
      senderName: 'أحمد محمد'
    },
    {
      id: 6,
      type: 'location',
      content: 'الرياض، المملكة العربية السعودية',
      timestamp: new Date(Date.now() - 3100000),
      isSent: true,
      status: 'delivered'
    },
    {
      id: 7,
      type: 'text',
      content: 'شكراً لك! سأتواصل معك قريباً',
      timestamp: new Date(Date.now() - 300000),
      isSent: false,
      status: 'read',
      senderName: 'أحمد محمد',
      reactions: [{ emoji: '👍', count: 1 }]
    }
  ];

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowSearch(false);
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      ...message,
      id: messages?.length + 1
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate typing indicator and response
    if (!message?.type || message?.type === 'text') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response = {
          id: messages?.length + 2,
          type: 'text',
          content: 'شكراً لك على رسالتك! سأرد عليك قريباً.',
          timestamp: new Date(),
          isSent: false,
          status: 'sent',
          senderName: selectedChat?.name || 'المستخدم'
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleMessageReply = (message) => {
    setReplyingTo(message);
  };

  const handleMessageReact = (messageId, emoji) => {
    setMessages(prev => prev?.map(msg => {
      if (msg?.id === messageId) {
        const existingReaction = msg?.reactions?.find(r => r?.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg?.reactions?.filter(r => r?.emoji !== emoji)
          };
        } else {
          return {
            ...msg,
            reactions: [...(msg?.reactions || []), { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  const handleLongPress = (message) => {
    // Handle long press actions (reply, forward, delete, etc.)
    handleMessageReply(message);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleCallClick = () => {
    // Handle voice call
    console.log('Starting voice call...');
  };

  const handleVideoClick = () => {
    // Handle video call
    console.log('Starting video call...');
  };

  const handleMessageSelect = (message) => {
    // Scroll to selected message
    const messageElement = document.getElementById(`message-${message?.id}`);
    if (messageElement) {
      messageElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement?.classList?.add('bg-accent/20');
      setTimeout(() => {
        messageElement?.classList?.remove('bg-accent/20');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-header pb-bottom-nav md:pb-6 h-screen flex">
        {/* Desktop Sidebar - Chat List */}
        <div className="hidden md:block w-80 border-r border-border">
          <ChatList
            onChatSelect={handleChatSelect}
            selectedChatId={selectedChat?.id}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <ChatHeader
                contact={selectedChat}
                onSearchToggle={handleSearchToggle}
                onCallClick={handleCallClick}
                onVideoClick={handleVideoClick}
                onMenuClick={() => {}} // Add missing required prop
              />

              {/* Message Search */}
              <MessageSearch
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                messages={messages}
                onMessageSelect={handleMessageSelect}
              />

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {messages?.map((message) => (
                  <div key={message?.id} id={`message-${message?.id}`}>
                    <MessageBubble
                      message={message}
                      onReply={handleMessageReply}
                      onReact={handleMessageReact}
                      onLongPress={handleLongPress}
                    />
                  </div>
                ))}
                
                {/* Typing Indicator */}
                <TypingIndicator
                  isVisible={isTyping}
                  userName={selectedChat?.name}
                />
                
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Preview */}
              {replyingTo && (
                <div className="px-4 py-2 bg-muted/30 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-primary font-medium mb-1">
                        الرد على {replyingTo?.senderName || 'أنت'}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {replyingTo?.content}
                      </div>
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                onSendVoice={handleSendMessage}
                onSendSticker={handleSendMessage}
                onSendLocation={handleSendMessage}
                onAttachment={() => {}} // Add missing required prop
              />
            </>
          ) : (
            /* Welcome Screen */
            (<div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="MessageCircle" size={48} className="text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  مرحباً بك في BizChat
                </h2>
                <p className="text-muted-foreground font-body mb-6">
                  اختر محادثة من القائمة لبدء التواصل مع عملائك
                </p>
                <div className="md:hidden">
                  <ChatList
                    onChatSelect={handleChatSelect}
                    selectedChatId={selectedChat?.id}
                  />
                </div>
              </div>
            </div>)
          )}
        </div>
      </div>
      <BottomNavigation />
      <FloatingCartButton />
    </div>
  );
};

export default ChatInterface;