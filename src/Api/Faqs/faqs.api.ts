import { API_BASE_URL } from "../../config/api.config";

class FaqAPI {
    static async getActiveFaqs() {
        const response = await fetch(`${API_BASE_URL}/faqs/active`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data;
    }
}

export default FaqAPI;
