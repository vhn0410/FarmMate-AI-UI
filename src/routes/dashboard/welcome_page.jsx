import { useState } from "react";
import { InputBar } from "../../components/dashboard/InputBar";

// Tự động đổi greeting theo thời gian
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const WelcomePage = () => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [checkpointId, setCheckpointId] = useState(null);

    const username = "Nguyen Hoang Vu"; // bạn có thể lấy từ API auth

    const handleSubmit = async () => {
        console.log("Submit message:", currentMessage);
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
                />
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-400 mt-4">
                Your messages are processed securely.
            </p>
        </div>
    );
};

export default WelcomePage;
