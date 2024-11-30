import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/authContext';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext); // Get user and updateUser from context
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
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
    formData.append('email', profileData.email);
    if (profileData.profilePicture) {
      formData.append('profilePicture', profileData.profilePicture);
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
      // Update the user object in the context
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

  const handleRemoveProfilePicture = async () => {
    if (!user || !user._id) {
      console.error('User object or ID is missing');
      alert('Please log in to update your profile.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Auth header
        },
        body: JSON.stringify({ removeProfilePicture: true }), // Send the remove flag
      });

      if (!response.ok) {
        throw new Error('Failed to remove profile picture');
      }

      const responseData = await response.json();
      console.log('Response data from server:', responseData);
      if (responseData.user) {
        updateUser(responseData.user); // Update context
        alert('Profile picture removed successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('Failed to remove profile picture. Please try again.');
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
      <input
        type="email"
        value={profileData.email}
        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
        placeholder="Email"
      />
      {user?.profilePicture && (
        <div>
          <button onClick={handleRemoveProfilePicture}>Remove Profile Picture</button>
        </div>
      )}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Profile;

