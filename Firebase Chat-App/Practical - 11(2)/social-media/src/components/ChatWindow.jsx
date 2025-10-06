import React, { useEffect, useState, useRef } from 'react';
import { useFirebase } from '../context/firebase';
import { collection, onSnapshot, orderBy, query, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

const ChatWindow = ({ activeChat }) => {
    const firebase = useFirebase();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null); // Ref to scroll to bottom

    // Effect to scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!activeChat) {
            setMessages([]);
            return;
        };

        const msgsRef = collection(firebase.firestore, 'chats', activeChat.chatId, 'messages');
        const q = query(msgsRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [activeChat, firebase.firestore]);

    const handleSendMessage = async () => {
        const text = messageInput.trim();
        if (!text || !activeChat) return;

        setMessageInput('');
        const msgsRef = collection(firebase.firestore, 'chats', activeChat.chatId, 'messages');
        await addDoc(msgsRef, {
            text,
            senderId: firebase.user.uid,
            createdAt: serverTimestamp(),
        });
        
        const chatRef = doc(firebase.firestore, 'chats', activeChat.chatId);
        await updateDoc(chatRef, { lastMessage: text, updatedAt: serverTimestamp() });
        
        const myUserChatRef = doc(firebase.firestore, 'userChats', firebase.user.uid, 'items', activeChat.chatId);
        await updateDoc(myUserChatRef, { lastMessage: text, updatedAt: serverTimestamp() });

        const otherUserChatRef = doc(firebase.firestore, 'userChats', activeChat.otherUser.uid, 'items', activeChat.chatId);
        await updateDoc(otherUserChatRef, { lastMessage: text, updatedAt: serverTimestamp() });
    };

    // --- RENDER LOGIC ---
    // The main layout is now always the same. We just change the content inside.
    return (
        <main className="main">
            <div className="topbar">
                <div className="title">
                    <div>
                        <strong>{activeChat ? activeChat.otherUser.name : 'Welcome'}</strong>
                        <div className="muted" style={{ fontSize: '.9rem' }}>
                            {activeChat ? 'Select a conversation or find people to start chatting.' : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="messages">
                    {/* Show messages if a chat is active, otherwise show the empty state */}
                    {activeChat ? (
                        messages.map(msg => (
                            <div key={msg.id} className={`bubble ${msg.senderId === firebase.user.uid ? 'me' : 'you'}`}>
                                {msg.text}
                            </div>
                        ))
                    ) : (
                        <div className="empty"><div className="pill">No chat selected</div></div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="composer">
                    <textarea 
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Type a message…"
                        // The composer is now always visible, but disabled if no chat is active
                        disabled={!activeChat}
                    />
                    <button 
                        onClick={handleSendMessage} 
                        className="btn primary"
                        disabled={!activeChat}
                    >
                        Send
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ChatWindow;