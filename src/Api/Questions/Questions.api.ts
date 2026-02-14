/// <reference types="vite/client" />
class QuestionAPI {
    static async GetAllQuestions() {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/questions/actual`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    }
}

export default QuestionAPI;