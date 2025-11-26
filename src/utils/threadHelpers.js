/**
 * Tạo title cho thread từ message đầu tiên
 * @param {string} message - Message gốc
 * @param {number} maxLength - Độ dài tối đa (mặc định 50)
 * @returns {string} - Title đã được format
 */
export const generateThreadTitle = (message, maxLength = 50) => {
    if (!message || !message.trim()) {
        return "Cuộc hội thoại mới";
    }

    // Loại bỏ khoảng trắng thừa
    const cleaned = message.trim().replace(/\s+/g, ' ');
    
    // Cắt ngắn nếu quá dài
    if (cleaned.length <= maxLength) {
        return cleaned;
    }
    
    // Cắt tại khoảng trắng gần nhất để tránh cắt giữa từ
    const truncated = cleaned.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.7) {
        // Nếu có khoảng trắng gần cuối, cắt tại đó
        return cleaned.substring(0, lastSpace) + "...";
    }
    
    // Không thì cắt thẳng và thêm ...
    return truncated + "...";
};

/**
 * Format thời gian hiển thị
 */
export const formatThreadTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút`;
    if (hours < 24) return `${hours} giờ`;
    if (days < 7) return `${days} ngày`;
    
    return date.toLocaleDateString("vi-VN");
};