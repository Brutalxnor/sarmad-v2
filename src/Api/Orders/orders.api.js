import { API_BASE_URL } from "../../config/api.config";

const BASE_URL = `${API_BASE_URL}/orders`;

class OrdersAPI {
    /**
     * Get all orders for the current user
     * @param {string} token - User authentication token
     * @returns {Promise} - Promise with user's orders
     */
    static async getUserOrders(token) {
        try {
            const response = await fetch(`${BASE_URL}/my-orders`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
            return data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    }

    /**
     * Get a specific order by ID
     * @param {string} orderId - Order ID
     * @param {string} token - User authentication token
     * @returns {Promise} - Promise with order details
     */
    static async getOrderById(orderId, token) {
        try {
            const response = await fetch(`${BASE_URL}/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch order');
            return data;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    }

    /**
     * Create a new order
     * @param {Object} orderData - Order data
     * @param {string} token - User authentication token
     * @returns {Promise} - Promise with created order
     */
    static async createOrder(orderData, token) {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create order');
            return data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
}

export default OrdersAPI;
