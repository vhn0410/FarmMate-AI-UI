// src/services/threadAPI.jsx
import apiClient from './api-client';

export const threadApi = {
    /**
     * Tạo thread mới
     */
    async createThread(userId, title = "Cuộc hội thoại mới") {
        const response = await apiClient.post('/threads', {
            user_id: userId,
            title
        });
        return response.data;
    },

    /**
     * Lấy danh sách threads của user
     */
    async getUserThreads(userId) {
        const response = await apiClient.get('/threads', {
            params: { user_id: userId }
        });
        return response.data;
    },

    /**
     * Lấy chi tiết 1 thread
     */
    async getThread(threadId, userId) {
        const response = await apiClient.get(`/threads/${threadId}`, {
            params: { user_id: userId }
        });
        return response.data;
    },

    /**
     * Lấy tin nhắn của thread
     */
    async getThreadMessages(threadId, userId) {
        const response = await apiClient.get(`/threads/${threadId}/messages`, {
            params: { user_id: userId }
        });
        return response.data;
    },

    /**
     * Cập nhật thread (đổi title)
     */
    async updateThread(threadId, userId, updates) {
        const response = await apiClient.patch(`/threads/${threadId}`, updates, {
            params: { user_id: userId }
        });
        return response.data;
    },

    /**
     * Xóa thread
     */
    async deleteThread(threadId, userId) {
        const response = await apiClient.delete(`/threads/${threadId}`, {
            params: { user_id: userId }
        });
        return response.data;
    }
};