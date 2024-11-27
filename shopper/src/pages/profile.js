import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    profilePicture: null,
  });

  const handleFileChange = (e) => {
    setProfileData({ ...profileData, profilePicture: e.target.files[0] });
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', profileData.name);
    if (profileData.profilePicture) {
      formData.append('profilePicture', profileData.profilePicture);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      updateUser(response.data.user); // Update context
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
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
