import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebase';
import { collection, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const PeoplePage = ({ onSelectChat }) => {
    const firebase = useFirebase();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const usersRef = collection(firebase.firestore, 'users');
            const querySnapshot = await getDocs(usersRef);
            const allUsers = querySnapshot.docs
                .map(doc => doc.data())
                .filter(user => user.uid !== firebase.user.uid);
            setUsers(allUsers);
            setLoading(false);
        };
        fetchUsers();
    }, [firebase.user, firebase.firestore]);

    const startChatWith = async (otherUser) => {
        const me = firebase.user;
        const chatId = me.uid < otherUser.uid ? `${me.uid}_${otherUser.uid}` : `${otherUser.uid}_${me.uid}`;
        
        const chatRef = doc(firebase.firestore, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
            await setDoc(chatRef, { 
                chatId, participants: [me.uid, otherUser.uid], createdAt: serverTimestamp(), 
                updatedAt: serverTimestamp(), lastMessage: '' 
            });
        }

        const myUserChatRef = doc(firebase.firestore, 'userChats', me.uid, 'items', chatId);
        await setDoc(myUserChatRef, {
            chatId, otherUid: otherUser.uid, otherName: otherUser.name, otherPhoto: otherUser.photoURL,
            lastMessage: '', updatedAt: serverTimestamp()
        }, { merge: true });

        const otherUserChatRef = doc(firebase.firestore, 'userChats', otherUser.uid, 'items', chatId);
        await setDoc(otherUserChatRef, {
            chatId, otherUid: me.uid, otherName: me.displayName, otherPhoto: me.photoURL,
            lastMessage: '', updatedAt: serverTimestamp()
        }, { merge: true });

        // This correctly calls the function passed down from App.jsx
        onSelectChat({ chatId, otherUser });
    };

    return (
        <React.Fragment>
            <div className="topbar">
                <div className="title"><strong>People</strong></div>
            </div>
            <div className="content" style={{ display: 'block', overflowY: 'auto', padding: '16px' }}>
                {loading && <p>Loading users...</p>}
                {!loading && users.map(user => (
                    <div key={user.uid} className="chat-row">
                        <img src={user.photoURL} alt="pfp" />
                        <div>
                            <div className="name">{user.name}</div>
                            <div className="last">{user.email}</div>
                        </div>
                        <button className="btn" onClick={() => startChatWith(user)}>Chat</button>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
};

export default PeoplePage;