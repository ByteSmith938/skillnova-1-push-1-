import { useState, useCallback } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { updateProfile, uploadAvatar, removeAvatar } from '../services/profileService';

/**
 * Convenience hook that wraps profile mutations and keeps AuthContext in sync.
 */
const useProfile = () => {
  const { profile, setProfile, refreshProfile } = useAuth();
  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState(null);
  const [success, setSuccess] = useState(null);

  const clearMessages = () => { setError(null); setSuccess(null); };

  const saveProfile = useCallback(async (data) => {
    clearMessages();
    setSaving(true);
    try {
      const updated = await updateProfile(data);
      setProfile(updated);
      localStorage.setItem('skillnova_profile', JSON.stringify(updated));
      setSuccess('Profile updated successfully');
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [setProfile]);

  const changeAvatar = useCallback(async (file) => {
    clearMessages();
    setSaving(true);
    try {
      const { avatarUrl } = await uploadAvatar(file);
      const updated = { ...profile, avatarUrl };
      setProfile(updated);
      localStorage.setItem('skillnova_profile', JSON.stringify(updated));
      setSuccess('Avatar updated');
      return avatarUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [profile, setProfile]);

  const deleteAvatar = useCallback(async () => {
    clearMessages();
    setSaving(true);
    try {
      await removeAvatar();
      const updated = { ...profile, avatarUrl: '' };
      setProfile(updated);
      localStorage.setItem('skillnova_profile', JSON.stringify(updated));
      setSuccess('Avatar removed');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [profile, setProfile]);

  return {
    profile,
    saving,
    error,
    success,
    saveProfile,
    changeAvatar,
    deleteAvatar,
    refreshProfile,
    clearMessages,
  };
};

export default useProfile;
