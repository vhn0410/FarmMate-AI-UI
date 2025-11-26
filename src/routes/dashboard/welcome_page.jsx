import { useState } from "react";
import { InputBar } from "../../components/dashboard/InputBar";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "../../contexts/KeycloakProvider";
import { threadApi } from "../../services/threadAPI";
import { THREAD_EVENTS, emitThreadEvent } from "../../utils/events";
import { generateThreadTitle } from "../../utils/threadHelpers"; 

// Tự động đổi greeting theo thời gian
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const WelcomePage = () => {
    const navigate = useNavigate();
    const keycloak = useKeycloak();
    const userId = keycloak.tokenParsed?.sub || "demo-user";
    const [currentMessage, setCurrentMessage] = useState("");
    const [isCreating, setIsCreating] = useState(false); // 🔥 Loading state
    
    const username = keycloak.tokenParsed?.preferred_username || "User";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentMessage.trim() || isCreating) return;

        try {
            setIsCreating(true);
            
            // 🔥 Tạo title thông minh từ message đầu tiên
            const threadTitle = generateThreadTitle(currentMessage, 50);
            
            // 1. Tạo thread mới với title từ message
            const newThread = await threadApi.createThread(userId, threadTitle);
            
            // 2. 🔥 EMIT EVENT để Sidebar cập nhật
            emitThreadEvent(THREAD_EVENTS.CREATED, newThread);
            
            // 3. Chuyển trang VÀ truyền message qua state
            navigate(`/chat/${newThread.thread_id}`, { 
                state: { initialMessage: currentMessage },
                replace: true 
            });
            
            setCurrentMessage(""); // Clear input
        } catch (error) {
            console.error("Failed to create thread:", error);
            alert("Không thể tạo cuộc hội thoại mới!");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full px-4">
            {/* Greeting */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-semibold mb-2">
                    {getGreeting()}, <span className="text-gray-800">{username}</span>
                </h1>

                <p className="text-gray-600 text-base">
                    How can I assist you today?
                </p>
            </div>

            {/* Input Bar fixed at center như ChatGPT */}
            <div className="w-full max-w-3xl">
                <InputBar
                    currentMessage={currentMessage}
                    setCurrentMessage={setCurrentMessage}
                    onSubmit={handleSubmit}
                    disabled={isCreating}
                />
                
                {/* Loading indicator */}
                {isCreating && (
                    <div className="text-center mt-2 text-sm text-gray-500">
                        Đang tạo cuộc hội thoại mới...
                    </div>
                )}
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-400 mt-4">
                Your messages are processed securely.
            </p>
        </div>
    );
};

export default WelcomePage;