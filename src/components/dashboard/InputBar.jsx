import { ArrowUp, Mic, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

export const InputBar = ({ currentMessage, setCurrentMessage, onSubmit }) => {
    const textareaRef = useRef(null);

    // Auto resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }, [currentMessage]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <div className="w-full px-4 py-3">
            <div className="max-w-3xl mx-auto">
                <div className="
                    flex items-center w-full
                    rounded-full border border-gray-300
                    bg-white shadow-sm px-4 py-2
                ">
                    
                    {/* Left Icon (+) */}
                    <button
                        className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"
                    >
                        <Plus size={20} />
                    </button>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                        className="
                            flex-1 bg-transparent resize-none
                            text-gray-800 placeholder-gray-400
                            px-3 py-2 outline-none
                        "
                        rows={1}
                    />

                    {/* Mic Icon */}
                    <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition mr-2">
                        <Mic size={20} />
                    </button>

                    {/* Send Button */}
                    <button
                        onClick={onSubmit}
                        disabled={!currentMessage.trim()}
                        className="
                            flex items-center justify-center
                            w-10 h-10 rounded-full
                            bg-blue-800 text-white
                            disabled:bg-gray-300 disabled:text-gray-500
                            disabled:cursor-not-allowed
                            transition duration-200
                        "
                    >
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};