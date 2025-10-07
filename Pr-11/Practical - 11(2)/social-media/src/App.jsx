import React, { useState } from 'react';
import { useFirebase } from './context/firebase';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import PeoplePage from './pages/PeoplePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const firebase = useFirebase();
  const [activeView, setActiveView] = useState('chats'); // 'chats', 'people', 'profile'
  const [activeChat, setActiveChat] = useState(null);   // Manages the currently selected chat

  // This function is passed to Sidebar and PeoplePage to set the active chat
  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setActiveView('chats'); // Automatically switch to the chat view when a chat is selected
  };

  if (!firebase.isLoggedIn) {
    return <Auth />;
  }

  return (
    <div className="app">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onSelectChat={handleSelectChat} // Pass the function to the Sidebar
      />
      
      <main className="main">
        {activeView === 'chats' && <ChatWindow activeChat={activeChat} />}
        {activeView === 'people' && <PeoplePage onSelectChat={handleSelectChat} />}
        {activeView === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
}

export default App;