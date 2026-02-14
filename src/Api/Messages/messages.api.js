import { API_BASE_URL } from "../../config/api.config";

const BASE_URL = `${API_BASE_URL}/messages`;

class MessagesAPI {
    /**
     * Send a message to admin
     * @param {Object} messageData - Message data
     * @param {string} token - User authentication token
     * @returns {Promise} - Promise with created message
     */
    static async sendMessage(messageData, token) {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to send message');
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
}

export default MessagesAPI;
