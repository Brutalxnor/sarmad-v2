import { API_BASE_URL } from "../../config/api.config";

class TestimonialsAPI {
    static async getActiveTestimonials() {
        const response = await fetch(`${API_BASE_URL}/testimonials/active`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data;
    }
}

export default TestimonialsAPI;
