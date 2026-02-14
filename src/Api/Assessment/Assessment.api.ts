/// <reference types="vite/client" />
import { API_BASE_URL } from "../../config/api.config";

class AssessmentAPI {
    static async CreateAssessment(answers: string[], score: number, symptoms: string) {
        if (!Array.isArray(answers)) {
            throw new Error("answers must be an array");
        }

        const response = await fetch(`${API_BASE_URL}/assessment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('user_id') || "",
                answers: [...answers],
                score: score,
                symptoms: symptoms
            })
        });

        const data = await response.json();
        return data;
    }

    static async GetAssessmentById(id: string) {
        if (!id) {
            throw new Error("id is required");
        }

        const response = await fetch(`${API_BASE_URL}/assessment/get-assessment/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data;
    }

    static async GetUserAssessments(userId: string) {
        if (!userId) {
            throw new Error("userId is required");
        }

        const response = await fetch(`${API_BASE_URL}/assessment/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data;
    }
}


export default AssessmentAPI;