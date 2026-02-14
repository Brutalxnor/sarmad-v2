const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class TopicsAPI {
    static async getActiveTopics() {
        const response = await fetch(`${BASE_URL}/topics/active`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    }
}

export default TopicsAPI;
