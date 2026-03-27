import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../api/api';

const Settings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userApi.getProfile();
        setFormData({
          username: data.username || '',
          email: data.email || '',
          password: '',
        });
        setProfilePicturePreview(data.profile_picture || '');
      } catch (err) {
        setError('Gagal memuat data pengguna. Pastikan Anda sudah login.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === 'profile_picture' && type === 'file') {
      const file = files?.[0] ?? null;
      setProfilePictureFile(file);
      setProfilePicturePreview(file ? URL.createObjectURL(file) : '');
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const formPayload = new FormData();
      formPayload.append('username', formData.username);
      formPayload.append('email', formData.email);

      if (formData.password.trim()) {
        formPayload.append('password', formData.password);
      }

      if (profilePictureFile) {
        formPayload.append('profile_picture', profilePictureFile);
      }

      await userApi.updateProfile(formPayload);

      setSuccess('Profil berhasil diperbarui.');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      const msg = err?.data?.message || 'Gagal memperbarui profil. Coba lagi.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F8F5]">
        <div className="text-center rounded-2xl p-8 bg-white shadow-lg">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F8F5] p-4 md:p-10 font-sans">
      <div className="mx-auto w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Settings</h1>
        <p className="text-sm text-gray-600 mb-6">Edit profil kamu di sini. Simpan setelah selesai.</p>

        {error && <div className="mb-4 text-sm text-red-600 font-medium">{error}</div>}
        {success && <div className="mb-4 text-sm text-emerald-700 font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-gray-700 font-semibold">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-700 font-semibold">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="profile_picture" className="text-gray-700 font-semibold">Upload Profile Picture (opsional)</label>
            <input
              id="profile_picture"
              name="profile_picture"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            {profilePicturePreview ? (
              <img
                src={profilePicturePreview}
                alt="Preview profile"
                className="mt-2 h-24 w-24 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="mt-2 h-24 w-24 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
                Not uploaded
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-700 font-semibold">Password Baru (opsional)</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Biarkan kosong jika tidak ingin mengubah password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition active:scale-95 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-between">
          <Link
            to="/garden"
            className="text-sm text-blue-600 hover:underline"
          >
            Kembali ke Garden
          </Link>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-emerald-700 font-medium hover:underline"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
