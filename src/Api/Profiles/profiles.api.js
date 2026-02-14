import { API_BASE_URL } from "../../config/api.config";

const BASE_URL = `${API_BASE_URL}/profiles`;

class ProfilesAPI {
    /**
     * Create a new user profile
     * @param {Object} profileData - Profile data to create
     */
    static async createProfile(profileData) {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create profile');
        return data;
    }

    /**
     * Get a single profile by ID
     * @param {string} id - User ID
     */
    static async getProfile(id) {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
        return data;
    }

    /**
     * Update a profile
     * @param {string} id - User ID
     * @param {Object} updateData - Fields to update
     */
    static async updateProfile(id, updateData) {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update profile');
        return data;
    }
}

export default ProfilesAPI;
