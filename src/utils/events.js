// Custom events để đồng bộ giữa các components
export const THREAD_EVENTS = {
    CREATED: 'thread:created',
    DELETED: 'thread:deleted',
    UPDATED: 'thread:updated'
};

// Dispatch event khi có thay đổi thread
export const emitThreadEvent = (eventType, data) => {
    window.dispatchEvent(new CustomEvent(eventType, { detail: data }));
};

// Listen to thread events
export const onThreadEvent = (eventType, callback) => {
    window.addEventListener(eventType, callback);
    
    // Return cleanup function
    return () => window.removeEventListener(eventType, callback);
};