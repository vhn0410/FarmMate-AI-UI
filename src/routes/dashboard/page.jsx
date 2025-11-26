import { useState } from 'react';
import { MessageArea } from '../../components/dashboard/MessageArea';
import { InputBar } from '../../components/dashboard/InputBar';


const DashboardPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            content: "Chào bạn! 👋 Tôi là trợ lý nông nghiệp thông minh của nền tảng. Bạn có thể hỏi tôi mọi thứ về **cây trồng**, **đất đai**, **môi trường** và **cảm biến**!",
            isUser: false,
            type: "message",
        },
    ]);

    const [currentMessage, setCurrentMessage] = useState("");
    const [checkpointId, setCheckpointId] = useState(null);

    // ============ STREAM HANDLER - Giữ nguyên logic của bạn ============
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentMessage.trim()) return;

        const newMessageId = messages.length ? Math.max(...messages.map((m) => m.id)) + 1 : 1;

        // User message
        setMessages((prev) => [
            ...prev,
            { id: newMessageId, content: currentMessage, isUser: true, type: "message" },
        ]);

        const userInput = currentMessage;
        setCurrentMessage("");

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
                query: userInput,
                user_id: "demo-user", // Thay bằng keycloak.tokenParsed?.sub
                stream: true,
            };

            if (checkpointId) body.thread_id = checkpointId;

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

                            if (json.type === "checkpoint") {
                                setCheckpointId(json.checkpoint_id);
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

    // ============ UI - Tích hợp vào Layout ============
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



