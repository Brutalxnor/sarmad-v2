import { API_BASE_URL } from "../../config/api.config";

class ArticleAPI {
    static async GetAllArticles() {
        const response = await fetch(`${API_BASE_URL}/content/get-all-articles`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data;
    }

    static async SaveContent(contentId: string, token: string, notes?: string, category?: string, isFavorite?: boolean) {
        const response = await fetch(`${API_BASE_URL}/saved-content`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                content_id: contentId,
                notes,
                category,
                is_favorite: isFavorite,
            }),
        });

        const data = await response.json();
        return data;
    }

    static async UnsaveContent(contentId: string, token: string) {
        const response = await fetch(`${API_BASE_URL}/saved-content/by-content/${contentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return data;
    }

    static async CheckIfSaved(contentId: string, token: string) {
        const response = await fetch(`${API_BASE_URL}/saved-content/check/${contentId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return data;
    }

    static async GetSavedContent(token: string) {
        const response = await fetch(`${API_BASE_URL}/saved-content`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return data;
    }
}

export default ArticleAPI;