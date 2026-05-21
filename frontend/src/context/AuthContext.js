'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('devhire_token');
      if (storedToken) {
        try {
          setToken(storedToken);
          // Set user using /api/auth/me
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            logoutUser();
          }
        } catch (error) {
          console.error('Failed to load user session', error);
          logoutUser();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: userToken, user: userData } = response.data;
        localStorage.setItem('devhire_token', userToken);
        setToken(userToken);
        setUser(userData);
        
        // Redirect based on role
        if (userData.role === 'developer') {
          router.push('/dashboard/developer');
        } else {
          router.push('/dashboard/company');
        }
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        const { token: userToken, user: registeredUser } = response.data;
        localStorage.setItem('devhire_token', userToken);
        setToken(userToken);
        setUser(registeredUser);

        if (registeredUser.role === 'developer') {
          router.push('/dashboard/developer');
        } else {
          router.push('/dashboard/company');
        }
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('devhire_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (profileFields) => {
    try {
      setLoading(true);
      // Wait, let's see how developers update their profile.
      // We can create a PUT /api/auth/me or edit using standard endpoints.
      // Actually, since register takes skills/bio/resume, we can add a profile update logic in backend if we want, or do a general update.
      // Wait, let's write a simple PUT profile update endpoint in backend later if needed, or let's create a dedicated one in our backend controllers.
      // Let's check: do we have a PUT /api/auth/me or update developer profile endpoint in backend?
      // In backend, User model has fields: skills, resumeUrl, bio.
      // Let's double check if we defined a PUT /api/auth/me or similar in authRoutes.
      // In the implementation plan, we have 'Developer profile edits (managing skills, bio, resume link)'.
      // Let's add a PUT /api/auth/profile or PUT /api/auth/me in backend authController to handle profile updates.
      // Let's write that, it's very easy and complete!
      // In backend authController, let's add `updateProfile` and map it in routes.
      // Let's write it in this context too:
      const response = await api.put('/auth/profile', profileFields);
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile.',
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
