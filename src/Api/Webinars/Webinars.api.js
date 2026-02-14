const BASE_URL = import.meta.env.VITE_API_BASE_URL;
class WebinarsAPI {
    static BASE_URL = `${BASE_URL}/webinars`;

    static async GetAllWebinars() {
        const response = await fetch(`${this.BASE_URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch webinars");
        }

        const data = await response.json();
        return data;
    }

    static async GetWebinarById(id) {
        if (!id) {
            throw new Error("id is required");
        }

        const response = await fetch(`${this.BASE_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch webinar details");
        }

        const data = await response.json();
        return data;
    }

}

export default WebinarsAPI;
