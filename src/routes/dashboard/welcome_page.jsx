// src/routes/dashboard/welcome_page.jsx
import { useState } from "react";
import { InputBar } from "../../components/dashboard/InputBar";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "../../contexts/KeycloakProvider";
import { threadApi } from "../../services/threadAPI";
import { THREAD_EVENTS, emitThreadEvent } from "../../utils/events";
import { generateThreadTitle } from "../../utils/threadHelpers"; 

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
    const [isCreating, setIsCreating] = useState(false);
    
    const username = keycloak.tokenParsed?.preferred_username || "User";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentMessage.trim() || isCreating) return;

        try {
            setIsCreating(true);
            
            // 🔥 Ensure token is valid before creating thread
            await keycloak.updateToken(30);
            
            const threadTitle = generateThreadTitle(currentMessage, 50);
            
            // Tạo thread mới
            const newThread = await threadApi.createThread(userId, threadTitle);
            
            // EMIT EVENT để Sidebar cập nhật
            emitThreadEvent(THREAD_EVENTS.CREATED, newThread);
            
            // Chuyển trang và truyền message
            navigate(`/chat/${newThread.thread_id}`, { 
                state: { initialMessage: currentMessage },
                replace: true 
            });
            
            setCurrentMessage("");
        } catch (error) {
            console.error("Failed to create thread:", error);
            
            // 🔥 Handle 401 - redirect to login
            if (error.response?.status === 401) {
                console.log("Token expired, redirecting to login...");
                keycloak.login();
                return;
            }
            
            alert("Không thể tạo cuộc hội thoại mới! Vui lòng thử lại.");
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

            {/* Input Bar */}
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