import { API_BASE_URL } from "../../config/api.config";

const BASE_URL = `${API_BASE_URL}/consultations`;

class ConsultationsAPI {
    /**
     * Get all consultation types (services)
     */
    static async getTypes() {
        try {
            const response = await fetch(`${BASE_URL}/types`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch types');
            return data;
        } catch (error) {
            console.error('Error fetching consultation types:', error);
            throw error;
        }
    }

    /**
     * Get available slots
     * @param {string} specialistId - Optional specialist ID filter
     */
    static async getAvailableSlots(specialistId = '') {
        try {
            const url = specialistId ? `${BASE_URL}/slots?specialist_id=${specialistId}` : `${BASE_URL}/slots`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch slots');
            return data;
        } catch (error) {
            console.error('Error fetching slots:', error);
            throw error;
        }
    }

    /**
     * Book a consultation
     * @param {Object} bookingData - Booking details
     * @param {string} token - User auth token
     */
    static async bookConsultation(bookingData, token) {
        try {
            const response = await fetch(`${BASE_URL}/book`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to book consultation');
            return data;
        } catch (error) {
            console.error('Error booking consultation:', error);
            throw error;
        }
    }

    /**
     * Get my bookings
     * @param {string} userId - User ID
     * @param {string} token - User auth token
     */
    static async getMyBookings(userId, token) {
        try {
            const response = await fetch(`${BASE_URL}/my-bookings/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch bookings');
            return data;
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            throw error;
        }
    }

    /**
     * Create consultation by phone (Guest flow)
     * @param {Object} data - { phone, name, type_id, scheduled_at, notes }
     */
    static async createByPhone(data) {
        try {
            const response = await fetch(`${BASE_URL}/by-phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to create consultation');
            return result;
        } catch (error) {
            console.error('Error creating consultation by phone:', error);
            throw error;
        }
    }
}

export default ConsultationsAPI;
