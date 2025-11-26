// src/services/threadApi.js

const API_BASE = "http://127.0.0.1:8000";

export const threadApi = {
    /**
     * Tạo thread mới
     */
    async createThread(userId, title = "Cuộc hội thoại mới") {
        const response = await fetch(`${API_BASE}/threads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, title })
        });
        
        if (!response.ok) throw new Error("Failed to create thread");
        return response.json();
    },

    /**
     * Lấy danh sách threads của user
     */
    async getUserThreads(userId) {
        const response = await fetch(`${API_BASE}/threads?user_id=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch threads");
        return response.json();
    },

    /**
     * Lấy chi tiết 1 thread
     */
    async getThread(threadId, userId) {
        const response = await fetch(`${API_BASE}/threads/${threadId}?user_id=${userId}`);
        if (!response.ok) throw new Error("Thread not found");
        return response.json();
    },

    /**
     * Lấy tin nhắn của thread
     */
    async getThreadMessages(threadId, userId) {
        const response = await fetch(`${API_BASE}/threads/${threadId}/messages?user_id=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        return response.json();
    },

    /**
     * Cập nhật thread (đổi title)
     */
    async updateThread(threadId, userId, updates) {
        const response = await fetch(`${API_BASE}/threads/${threadId}?user_id=${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) throw new Error("Failed to update thread");
        return response.json();
    },

    /**
     * Xóa thread
     */
    async deleteThread(threadId, userId) {
        const response = await fetch(`${API_BASE}/threads/${threadId}?user_id=${userId}`, {
            method: "DELETE"
        });
        
        if (!response.ok) throw new Error("Failed to delete thread");
        return response.json();
    }
};