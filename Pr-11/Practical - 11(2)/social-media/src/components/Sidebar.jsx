import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebase';
import { collection, onSnapshot, orderBy, query, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const Sidebar = ({ onSelectChat, activeView, setActiveView }) => {
    const firebase = useFirebase();
    const [recentChats, setRecentChats] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!firebase.user) return;
        
        const ucRef = collection(firebase.firestore, 'userChats', firebase.user.uid, 'items');
        const q = query(ucRef, orderBy('updatedAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecentChats(chats);
        });

        return () => unsubscribe();
    }, [firebase.user, firebase.firestore]);

    useEffect(() => {
        const performSearch = async () => {
            if (searchTerm.trim() === '') {
                setSearchResults([]);
                return;
            }

            const usersRef = collection(firebase.firestore, 'users');
            const q = query(usersRef);
            const querySnapshot = await getDocs(q);

            const results = querySnapshot.docs
                .map(doc => doc.data())
                .filter(user => 
                    user.uid !== firebase.user.uid &&
                    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            
            setSearchResults(results);
        };

        const debounceTimeout = setTimeout(performSearch, 300);
        return () => clearTimeout(debounceTimeout);

    }, [searchTerm, firebase.user, firebase.firestore]);

    const startChatWith = async (otherUser) => {
        const me = firebase.user;
        const chatId = me.uid < otherUser.uid ? `${me.uid}_${otherUser.uid}` : `${otherUser.uid}_${me.uid}`;
        
        const chatRef = doc(firebase.firestore, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
            await setDoc(chatRef, { 
                chatId, 
                participants: [me.uid, otherUser.uid], 
                createdAt: serverTimestamp(), 
                updatedAt: serverTimestamp(), 
                lastMessage: '' 
            });
        }

        const myUserChatRef = doc(firebase.firestore, 'userChats', me.uid, 'items', chatId);
        await setDoc(myUserChatRef, {
            chatId,
            otherUid: otherUser.uid,
            otherName: otherUser.name,
            otherPhoto: otherUser.photoURL,
            lastMessage: '',
            updatedAt: serverTimestamp()
        }, { merge: true });

        const otherUserChatRef = doc(firebase.firestore, 'userChats', otherUser.uid, 'items', chatId);
        await setDoc(otherUserChatRef, {
            chatId,
            otherUid: me.uid,
            otherName: me.displayName,
            otherPhoto: me.photoURL,
            lastMessage: '',
            updatedAt: serverTimestamp()
        }, { merge: true });

        onSelectChat({ chatId, otherUser });
        setSearchTerm('');
    };

    const timeAgo = (date) => {
        if (!date) return ''; 
        const d = date?.toDate ? date.toDate() : new Date();
        const diffInSeconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
        const seconds = Math.max(0, diffInSeconds);
    
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    };

    return (
        <aside className="sidebar">
            <div className="logo"><span className="dot"></span><span>Chatter</span></div>
            <div className="card user-card">
                <img src={firebase.user.photoURL} alt="me" />
                <div>
                    <div style={{ fontWeight: 600 }}>{firebase.user.displayName}</div>
                    <div className="muted">{firebase.user.email}</div>
                </div>
            </div>
            
            <div className="card search">
                <input 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="nav card">
                <div 
                    className={`item ${activeView === 'chats' ? 'active' : ''}`}
                    onClick={() => setActiveView('chats')}
                >
                    💬 Chats
                </div>
                <div 
                    className={`item ${activeView === 'people' ? 'active' : ''}`}
                    onClick={() => setActiveView('people')}
                >
                    👥 People
                </div>
                <div 
                    className={`item ${activeView === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveView('profile')}
                >
                    🙍 Profile
                </div>
                <div 
                    className="item" 
                    onClick={firebase.logoutUser} 
                    style={{color: 'var(--danger)'}}
                >
                    🚪 Logout
                </div>
            </div>
            
            <div className="card" style={{ padding: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="muted" style={{ padding: '8px 8px 0' }}>
                    {searchTerm.trim() ? 'Search Results' : 'Recent Chats'}
                </div>
                <div className="chats">
                    {searchTerm.trim() ? (
                        searchResults.map(user => (
                            <div key={user.uid} className="chat-row" onClick={() => startChatWith(user)}>
                                <img src={user.photoURL} alt="pfp" />
                                <div>
                                    <div className="name">{user.name}</div>
                                    <div className="last">{user.email}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        recentChats.map(chat => (
                            <div 
                                key={chat.id} 
                                className="chat-row" 
                                onClick={() => onSelectChat({ chatId: chat.chatId, otherUser: { uid: chat.otherUid, name: chat.otherName, photo: chat.otherPhoto } })}
                            >
                                <img src={chat.otherPhoto} alt="pfp" />
                                <div>
                                    <div className="name">{chat.otherName}</div>
                                    <div className="last">{chat.lastMessage || 'Say hi 👋'}</div>
                                </div>
                                <div className="muted">{timeAgo(chat.updatedAt)}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;