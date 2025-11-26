import { useEffect, useState, useRef } from 'react';
import { MessageArea } from '../../components/dashboard/MessageArea';
import { InputBar } from '../../components/dashboard/InputBar';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useKeycloak } from "../../contexts/KeycloakProvider";
import { threadApi } from '../../services/threadAPI';

const DashboardPage = () => {
    const { id: threadId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const keycloak = useKeycloak();
    const userId = keycloak.tokenParsed?.sub || "demo-user";

    const [messages, setMessages] = useState([
        {
            id: 1,
            content: "Chào bạn! 👋 Tôi là trợ lý nông nghiệp thông minh của nền tảng. Bạn có thể hỏi tôi mọi thứ về **cây trồng**, **đất đai**, **môi trường** và **cảm biến**!",
            isUser: false,
            type: "message",
        },
    ]);

    const [currentMessage, setCurrentMessage] = useState("");
    const [loadingThread, setLoadingThread] = useState(true);
    const initialMessageProcessed = useRef(false); // 🔥 Tránh gọi 2 lần
    
    // ============ LOAD THREAD MESSAGES ============
    useEffect(() => {
        if (!threadId) {
            setLoadingThread(false);
            return;
        }

        loadThreadMessages();
    }, [threadId, userId]);

    const loadThreadMessages = async () => {
        try {
            setLoadingThread(true);
            const { messages: threadMessages } = await threadApi.getThreadMessages(threadId, userId);

            if (threadMessages.length === 0) {
                // Thread mới, giữ welcome message
                setMessages([
                    {
                        id: 1,
                        content: "Chào bạn! 👋 Tôi là trợ lý nông nghiệp thông minh. Hãy đặt câu hỏi của bạn!",
                        isUser: false,
                        type: "message",
                    },
                ]);
            } else {
                // Convert thread messages to UI format
                const formattedMessages = threadMessages.flatMap((msg, idx) => [
                    {
                        id: idx * 2 + 1,
                        content: msg.query,
                        isUser: true,
                        type: "message",
                    },
                    {
                        id: idx * 2 + 2,
                        content: msg.response,
                        isUser: false,
                        type: "message",
                    }
                ]);

                setMessages([
                    {
                        id: 0,
                        content: "Chào bạn! 👋 Đây là cuộc hội thoại đã lưu.",
                        isUser: false,
                        type: "message",
                    },
                    ...formattedMessages
                ]);
            }
        } catch (error) {
            console.error("Failed to load thread messages:", error);
            alert("Không thể tải tin nhắn!");
            navigate("/chat/new");
        } finally {
            setLoadingThread(false);
        }
    };

    // ============ 🔥 XỬ LÝ MESSAGE TỪ WELCOME PAGE ============
    useEffect(() => {
        // Kiểm tra xem có message được truyền từ WelcomePage không
        const initialMessage = location.state?.initialMessage;
        
        if (initialMessage && !initialMessageProcessed.current && !loadingThread && threadId) {
            initialMessageProcessed.current = true;
            
            // Gọi hàm submit với message từ WelcomePage
            submitMessage(initialMessage);
            
            // Clear state để tránh gọi lại khi navigate back
            window.history.replaceState({}, document.title);
        }
    }, [location.state, loadingThread, threadId]);

    // ============ TÁCH LOGIC SUBMIT THÀNH HÀM RIÊNG ============
    const submitMessage = async (messageText) => {
        if (!messageText.trim()) return;

        // Kiểm tra có thread_id chưa
        if (!threadId) {
            alert("Vui lòng tạo cuộc hội thoại mới!");
            navigate("/chat/new");
            return;
        }

        const newMessageId = messages.length ? Math.max(...messages.map((m) => m.id)) + 1 : 1;

        // User message
        setMessages((prev) => [
            ...prev,
            { id: newMessageId, content: messageText, isUser: true, type: "message" },
        ]);

        // AI loading message
        const aiResponseId = newMessageId + 1;
        setMessages((prev) => [
            ...prev,
            {
                id: aiResponseId,
                content: "",
                isUser: false,
                type: "message",
                isLoading: true,
                searchInfo: { stages: [], query: "", urls: [] },
            },
        ]);

        try {
            const body = {
                query: messageText,
                user_id: userId,
                thread_id: threadId,
                stream: true,
            };

            const response = await fetch("http://127.0.0.1:8000/chat/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Network error");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let buffer = "";
            let streamedContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let boundary = buffer.indexOf("\n\n");
                while (boundary !== -1) {
                    const raw = buffer.slice(0, boundary);
                    buffer = buffer.slice(boundary + 2);

                    const dataLine = raw.split("\n").find((l) => l.startsWith("data:"));
                    if (dataLine) {
                        try {
                            const json = JSON.parse(dataLine.replace(/^data:\s*/, ""));

                            if (json.type === "content") {
                                streamedContent += json.content;
                                setMessages((prev) =>
                                    prev.map((m) =>
                                        m.id === aiResponseId
                                            ? { ...m, content: streamedContent, isLoading: false }
                                            : m
                                    )
                                );
                            }
                        } catch (err) {
                            console.warn("JSON parse error", err);
                        }
                    }

                    boundary = buffer.indexOf("\n\n");
                }
            }
        } catch (error) {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === aiResponseId
                        ? {
                            ...m,
                            content: "Đã xảy ra lỗi khi kết nối tới máy chủ!",
                            isLoading: false,
                        }
                        : m
                )
            );
        }
    };

    // ============ HANDLE SUBMIT TỪ INPUT BAR ============
    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitMessage(currentMessage);
        setCurrentMessage(""); // Clear input sau khi submit
    };

    // ============ UI ============
    if (loadingThread) {
        return (
            <div className="flex flex-col h-full items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tải cuộc hội thoại...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full rounded-xl shadow-sm overflow-hidden ">
            <MessageArea messages={messages} />
            <InputBar
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default DashboardPage;