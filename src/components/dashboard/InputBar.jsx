import { ArrowUp, Mic, Plus, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export const InputBar = ({ 
    currentMessage, 
    setCurrentMessage, 
    onSubmit,
    isLoading = false,  // 🔥 NEW: Loading state
    disabled = false     // 🔥 NEW: Disabled state
}) => {
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
        // 🔥 Prevent submit if loading or disabled
        if (e.key === "Enter" && !e.shiftKey && !isLoading && !disabled) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    const handleSubmit = (e) => {
        // 🔥 Prevent submit if loading or disabled
        if (isLoading || disabled) {
            e.preventDefault();
            return;
        }
        onSubmit(e);
    };

    return (
        <div className="w-full px-4 py-3">
            <div className="max-w-3xl mx-auto">
                <div className="
                    flex items-center w-full
                    rounded-full border border-gray-300
                    bg-white shadow-sm px-4 py-2
                    transition-all duration-200
                ">
                    
                    {/* Left Icon (+) */}
                    <button
                        disabled={isLoading || disabled}
                        className={`
                            text-gray-500 hover:bg-gray-100 p-2 rounded-full transition
                            ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <Plus size={20} />
                    </button>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isLoading ? "Đang xử lý..." : "Nhập tin nhắn..."}
                        disabled={isLoading || disabled}
                        className={`
                            flex-1 bg-transparent resize-none
                            text-gray-800 placeholder-gray-400
                            px-3 py-2 outline-none
                            ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        rows={1}
                    />

                    {/* Mic Icon */}
                    <button 
                        disabled={isLoading || disabled}
                        className={`
                            text-gray-500 hover:bg-gray-100 p-2 rounded-full transition mr-2
                            ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <Mic size={20} />
                    </button>

                    {/* Send Button with Loading State */}
                    <button
                        onClick={handleSubmit}
                        disabled={!currentMessage.trim() || isLoading || disabled}
                        className={`
                            flex items-center justify-center
                            w-10 h-10 rounded-full
                            ${isLoading 
                                ? 'bg-gray-400 cursor-wait' 
                                : 'bg-blue-800 hover:bg-blue-900'
                            }
                            text-white
                            disabled:bg-gray-300 disabled:text-gray-500
                            disabled:cursor-not-allowed
                            transition duration-200
                        `}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <ArrowUp size={20} />
                        )}
                    </button>
                </div>

                {/* 🔥 Loading Indicator Text
                {isLoading && (
                    <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                        <Loader2 size={14} className="animate-spin mr-2" />
                        <span>Trợ lý đang suy nghĩ...</span>
                    </div>
                )} */}
            </div>
        </div>
    );
};