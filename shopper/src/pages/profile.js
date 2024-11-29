import React, { useContext, useState,useEffect } from 'react';
import { AuthContext } from '../context/authContext';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext); // Get user and updateUser from context
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    profilePicture: null,
  });

  const handleFileChange = (e) => {
    setProfileData({ ...profileData, profilePicture: e.target.files[0] });
  };
 
  useEffect(() => {
    console.log("AuthContext user after update:", user);
  }, [user]); // Log whenever `user` changes
  

  const handleSave = async () => {
    if (!user || !user._id) {
      console.error('User object or ID is missing');
      alert('Please log in to update your profile.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', profileData.name);
    if (profileData.profilePicture) {
      formData.append('profilePicture', profileData.profilePicture);
    }
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value); // Debugging the FormData
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Only include auth header
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      const responseData = await response.json();
      console.log('Response data from server:', responseData);
      // Update only the user object in the context
      if (responseData.user) {
        updateUser(responseData.user); // Use the `user` field of the response
        localStorage.setItem('user', JSON.stringify(responseData.user)); // Sync localStorage
        alert('Profile updated successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  
  

  return (
    <div>
      <h2>Profile</h2>
      <input
        type="text"
        value={profileData.name}
        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
        placeholder="Name"
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Profile;
