/// <reference types="vite/client" />
class ContentAPI {
    static BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/content`;

    static async getArticles() {
        const response = await fetch(`${this.BASE_URL}/articles`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    }

    static async getVideos() {
        const response = await fetch(`${this.BASE_URL}/videos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    }

    static async getContentById(id: string) {
        const response = await fetch(`${this.BASE_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    }

    // Keeping a method for 'all' similar to the existing behavior or just re-exporting it
    // But since the user wants specific routes for filters, I will use them.
    // For 'all', we might still use the old one from ArticleAPI or add it here if needed.
}

export default ContentAPI;
