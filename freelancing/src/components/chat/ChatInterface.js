import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
import api from '../../api/axiosInstance';
import Card from '../ui/Card';
import '../../styles/dashboard.css';

export default function ChatInterface({ currentUserRole }) {
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    
    const messagesEndRef = useRef(null);

    // Fetch conversations list
    useEffect(() => {
        fetchConversations();
        // Polling for new conversations/updates
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    // Fetch messages when a conversation is selected
    useEffect(() => {
        if (activeConv) {
            fetchMessages();
            // Faster polling for active chat
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [activeConv]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/messages/conversations');
            if (res.data.success) {
                setConversations(res.data.conversations);
                setLoading(false);
            }
        } catch (err) {
            console.error("Failed to fetch conversations", err);
        }
    };

    const fetchMessages = async () => {
        if (!activeConv) return;
        try {
            const res = await api.get(`/messages/${activeConv.projectId}/${activeConv.otherUserId}`);
            if (res.data.success) {
                setMessages(res.data.messages);
            }
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConv) return;

        try {
            const res = await api.post('/messages/send', {
                receiverId: activeConv.otherUserId,
                projectId: activeConv.projectId,
                content: newMessage.trim()
            });
            
            if (res.data.success) {
                setMessages([...messages, res.data.message]);
                setNewMessage('');
                fetchConversations(); // Update latest message in sidebar
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="dashboard-content-inner" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div className="dashboard-header" style={{ marginBottom: '16px' }}>
                <h1 style={{ fontSize: '24px', margin: 0 }}>Messages</h1>
            </div>

            <Card padding="none" style={{ flex: 1, display: 'flex', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                {/* Conversations Sidebar */}
                <div style={{ width: '320px', borderRight: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)' }}>Recent Conversations</h3>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                        ) : conversations.length === 0 ? (
                            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <MessageSquare size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                                <p style={{ fontSize: '14px' }}>No messages yet.</p>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div 
                                    key={`${conv.projectId}_${conv.otherUserId}`}
                                    onClick={() => setActiveConv(conv)}
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        background: activeConv?.otherUserId === conv.otherUserId && activeConv?.projectId === conv.projectId ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                                        transition: 'background 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <strong style={{ color: 'var(--text-primary)' }}>{conv.otherUserName}</strong>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                            {new Date(conv.latestMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '4px' }}>{conv.projectTitle}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {conv.latestMessage}
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary)', color: '#000', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
                    {!activeConv ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <MessageSquare size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                            <p>Select a conversation to start chatting</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{activeConv.otherUserName}</h3>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--primary)' }}>Project: {activeConv.projectTitle}</p>
                            </div>

                            {/* Messages List */}
                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {messages.map((msg, idx) => {
                                    const isMine = msg.sender._id !== activeConv.otherUserId;
                                    return (
                                        <div key={msg._id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                                            <div 
                                                style={{ 
                                                    maxWidth: '70%', 
                                                    padding: '12px 16px', 
                                                    borderRadius: '16px',
                                                    borderBottomRightRadius: isMine ? '4px' : '16px',
                                                    borderBottomLeftRadius: !isMine ? '4px' : '16px',
                                                    background: isMine ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                                                    color: isMine ? '#0B0E14' : 'var(--text-primary)',
                                                    fontWeight: isMine ? '500' : '400',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                {msg.content}
                                            </div>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-main)' }}>
                                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..." 
                                        style={{ 
                                            flex: 1, 
                                            padding: '12px 16px', 
                                            borderRadius: '24px', 
                                            border: '1px solid var(--border-color)', 
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            outline: 'none'
                                        }} 
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        style={{ 
                                            background: 'var(--primary)', 
                                            color: '#0B0E14', 
                                            border: 'none', 
                                            borderRadius: '50%', 
                                            width: '44px', 
                                            height: '44px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                                            opacity: newMessage.trim() ? 1 : 0.5
                                        }}
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
