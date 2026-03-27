import React, { useState, useRef } from 'react';
import { X, Upload, Check, Lock, ChevronRight, Camera } from 'lucide-react';
import { userApi } from '../../api/api';

const SettingsModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'
  const [loading, setLoading] = useState(false);
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile Upload
  const fileInputRef = useRef(null);

  if (!isOpen || !user) return null;

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await userApi.updatePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      alert("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setActiveTab('profile');
    } catch (err) {
      alert(err.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    setLoading(true);
    try {
      await userApi.updateAvatar(formData);
      alert("Profile picture updated!");
      if (onSuccess) onSuccess(); // To trigger re-fetch of user
    } catch (err) {
      alert(err.data?.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const hasAvatar = !!user.profile_picture;
  const avatarUrl = user.profile_picture 
    ? (user.profile_picture.startsWith('http') ? user.profile_picture : `http://127.0.0.1:8000/${user.profile_picture}`) 
    : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-2xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200 max-h-[95vh] md:min-h-[500px]">
        
        {/* Sidebar → Mobile: horizontal tab bar at top, Desktop: vertical sidebar */}
        <div className="md:w-1/3 bg-emerald-50/50 flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-emerald-100 p-3 md:p-6 gap-2">
          {/* Title only on desktop */}
          <div className="hidden md:block mb-6 mt-2">
            <h2 className="text-2xl font-black text-emerald-950">Settings</h2>
            <p className="text-emerald-800/80 text-sm font-medium">Manage your account</p>
          </div>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-between p-3 md:p-4 rounded-xl md:rounded-2xl font-bold transition-all ${
              activeTab === 'profile' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'text-emerald-800 hover:bg-emerald-100/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserIcon /> <span className="text-sm md:text-base">Profile</span>
            </div>
            <ChevronRight size={16} className="hidden md:block" />
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-between p-3 md:p-4 rounded-xl md:rounded-2xl font-bold transition-all ${
              activeTab === 'security' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'text-emerald-800 hover:bg-emerald-100/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock size={18} /> <span className="text-sm md:text-base">Security</span>
            </div>
            <ChevronRight size={16} className="hidden md:block" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 md:p-8 relative flex flex-col overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors z-10"
          >
            <X size={22} />
          </button>

          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl md:text-2xl font-black text-emerald-950 mb-5">Profile Details</h3>
              
              {/* Avatar Section */}
              <div className="flex items-center gap-4 mb-6 p-4 md:p-6 bg-emerald-50/50 rounded-2xl md:rounded-3xl border border-emerald-100">
                <div className="relative group shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-md" />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-3xl border-4 border-white shadow-md">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="absolute inset-0 bg-emerald-900/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Camera size={22} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-base mb-1">{hasAvatar ? 'Update Profile Picture' : 'Add Profile Picture'}</h4>
                  <p className="text-emerald-800/70 text-xs font-medium mb-3">JPG, PNG or GIF. Max 5MB.</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="px-4 py-2 bg-white border border-emerald-200 rounded-xl text-emerald-700 font-bold text-sm hover:bg-emerald-50 shadow-sm transition-all flex items-center gap-2"
                  >
                     <Upload size={14} /> {loading ? 'Uploading...' : 'Choose File'}
                  </button>
                </div>
              </div>

              {/* Immutable Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">Username</label>
                  <input 
                    type="text" 
                    value={user.username || ''}
                    disabled
                    className="w-full bg-slate-50 px-4 py-3 md:px-5 md:py-4 rounded-2xl border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={user.email || ''}
                    disabled
                    className="w-full bg-slate-50 px-4 py-3 md:px-5 md:py-4 rounded-2xl border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col">
              <h3 className="text-xl md:text-2xl font-black text-emerald-950 mb-5">Change Password</h3>
              
              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white px-4 py-3 md:px-5 md:py-4 rounded-2xl border border-emerald-100 focus:border-emerald-500 outline-none font-medium text-emerald-950"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    className="w-full bg-white px-4 py-3 md:px-5 md:py-4 rounded-2xl border border-emerald-100 focus:border-emerald-500 outline-none font-medium text-emerald-950"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    className="w-full bg-white px-4 py-3 md:px-5 md:py-4 rounded-2xl border border-emerald-100 focus:border-emerald-500 outline-none font-medium text-emerald-950"
                    required
                  />
                </div>

                <div className="pt-2">
                   <button 
                    type="submit" 
                    disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black text-base md:text-lg py-4 rounded-2xl shadow-xl transition-all"
                  >
                    {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Simple User Icon SVG for the sidebar
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default SettingsModal;
