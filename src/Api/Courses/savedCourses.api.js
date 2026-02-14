import { API_BASE_URL } from "../../config/api.config";

class SavedCoursesAPI {
    static async getUserSavedCourses(token) {
        if (!token) throw new Error("Authentication token is required");

        const response = await fetch(`${API_BASE_URL}/saved-courses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        return await response.json();
    }

    static async checkIfCourseSaved(courseId, token) {
        if (!token) throw new Error("Authentication token is required");

        const response = await fetch(`${API_BASE_URL}/saved-courses/check/${courseId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        return await response.json();
    }

    static async saveCourse(courseId, token) {
        if (!token) throw new Error("Authentication token is required");

        const response = await fetch(`${API_BASE_URL}/saved-courses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ course_id: courseId })
        });
        return await response.json();
    }

    static async unsaveCourse(courseId, token) {
        if (!token) throw new Error("Authentication token is required");

        const response = await fetch(`${API_BASE_URL}/saved-courses/by-course/${courseId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        return await response.json();
    }
}

export default SavedCoursesAPI;
