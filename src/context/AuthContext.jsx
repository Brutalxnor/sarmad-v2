import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { API_BASE_URL } from '../config/api.config';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const createProfile = async (authUser) => {
            // Init with defaults
            const profileData = {
                id: authUser.id,
                name: authUser.user_metadata?.full_name || "New User",
                role: "RegisteredUser",
                mobile: authUser.phone || null,
                email: authUser.email || null
            };

            try {
                const response = await fetch(`${API_BASE_URL}/profiles`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profileData)
                });

                if (response.ok) {
                    const result = await response.json();
                    setProfile(result.data);
                    localStorage.setItem('user_id', authUser.id);
                } else {
                    console.error('Failed to create profile');
                }
            } catch (err) {
                console.error('Error creating profile:', err);
            }
        };

        const syncUserProfile = async (authUser) => {
            try {
                // 1. Try to get profile from backend
                const response = await fetch(`${API_BASE_URL}/profiles/${authUser.id}`, {
                    method: 'GET'
                });

                if (response.ok) {
                    const result = await response.json();
                    let profileData = result.data;

                    // Proactively match contact info if missing
                    const updateData = {};
                    if (authUser.phone && !profileData.mobile) updateData.mobile = authUser.phone;
                    if (authUser.email && !profileData.email) updateData.email = authUser.email;

                    if (Object.keys(updateData).length > 0) {
                        try {
                            const updateResponse = await fetch(`${API_BASE_URL}/profiles/${authUser.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updateData)
                            });
                            if (updateResponse.ok) {
                                const updateResult = await updateResponse.json();
                                profileData = updateResult.data;
                            }
                        } catch (updateErr) {
                            console.error('Failed to update profile contact info during sync:', updateErr);
                        }
                    }

                    setProfile(profileData);
                    localStorage.setItem('user_id', authUser.id);
                } else if (response.status === 404) {
                    // Profile doesn't exist, create it
                    console.log('Profile not found, creating...');
                    await createProfile(authUser);
                } else {
                    console.error('Failed to fetch profile:', response.statusText);
                }
            } catch (err) {
                console.error('Error syncing profile:', err);
            }
        };

        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await syncUserProfile(session.user);
            }
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await syncUserProfile(session.user);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithPhone = async (phone) => {
        const { data, error } = await supabase.auth.signInWithOtp({
            phone: phone,
        });
        return { data, error };
    };

    const verifyPhoneOtp = async (phone, token) => {
        const { data, error } = await supabase.auth.verifyOtp({
            phone: phone,
            token: token,
            type: 'sms',
        });
        return { data, error };
    };

    const loginWithEmail = async (email) => {
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
        });
        return { data, error };
    };

    const verifyEmailOtp = async (email, token) => {
        const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: 'email',
        });
        return { data, error };
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error logging out:', error);
        localStorage.removeItem('user_id');
        setSession(null);
        setUser(null);
        setProfile(null);
    };

    const requireAuth = (callback) => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }
        callback();
    };

    const value = {
        session,
        user,
        profile,
        setProfile,
        loading,
        loginWithPhone,
        verifyPhoneOtp,
        loginWithEmail,
        verifyEmailOtp,
        logout,
        requireAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
