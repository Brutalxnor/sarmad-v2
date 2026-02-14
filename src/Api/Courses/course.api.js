const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class CourseAPI {
    static async getAllCourses() {
        const response = await fetch(`${BASE_URL}/courses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    }

    static async getCourseById(id) {
        const response = await fetch(`${BASE_URL}/courses/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    }

    static async getLessonById(id) {
        const response = await fetch(`${BASE_URL}/courses/lessons/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    }
}

export default CourseAPI;
