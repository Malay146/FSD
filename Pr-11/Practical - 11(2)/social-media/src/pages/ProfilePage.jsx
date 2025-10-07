import React, { useState } from 'react';
import { useFirebase } from '../context/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ProfilePage = () => {
    const firebase = useFirebase();
    const [newName, setNewName] = useState(firebase.user.displayName);
    const [loading, setLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Update Firebase Auth profile
            await firebase.updateUserProfileInfo(firebase.user, { displayName: newName });

            // 2. Update user document in Firestore
            const userDocRef = doc(firebase.firestore, 'users', firebase.user.uid);
            await updateDoc(userDocRef, { name: newName });
            
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile: ", error);
            alert('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <div className="topbar">
                <div className="title">
                    <strong>My Profile</strong>
                </div>
            </div>
            <div className="card" style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <img src={firebase.user.photoURL} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                    <div>
                        <h2 style={{ margin: 0 }}>{firebase.user.displayName}</h2>
                        <p className="muted" style={{ margin: 0 }}>{firebase.user.email}</p>
                    </div>
                </div>

                <form onSubmit={handleProfileUpdate}>
                    <div className="group">
                        <label>Update Display Name</label>
                        <input 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter new name"
                        />
                    </div>
                    <div className="group">
                        <button type="submit" className="btn primary full" disabled={loading}>
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;