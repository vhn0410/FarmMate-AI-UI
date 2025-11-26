import { useState } from "react"

const InputBar = ({ currentMessage, setCurrentMessage, onSubmit }) => {
    const [showSuggestions, setShowSuggestions] = useState(true);

    // Các câu hỏi mẫu
    const sampleQuestions = [
        // "Thời tiết hôm nay như th`ế nào?",
        "Hãy kiểm tra tình trạng dinh dưỡng trên đất của tôi!",
        "Thế nào là đất khỏe",
        "Các giai đoạn sinh trưởng của cây lúa",
        // "Kiểm tra đất có bị nhiễm mặn không?",
        // "hướng dẫn bón phân cho cây lúa",
        "Độ ẩm đất hiện tại là bao nhiêu?",
        "Cuối giai đoạn sinh trưởng sinh dưỡng và Đẻ nhánh tối đa, thường là bao nhiêu tuần sau cấy",

    ];

    const handleChange = (e) => {
        setCurrentMessage(e.target.value);
    };

    const handleSuggestionClick = (question) => {
        setCurrentMessage(question);
        setShowSuggestions(false);
    };

    const handleSubmitWithHide = (e) => {
        setShowSuggestions(false);
        onSubmit(e);
    };

    return (
        <div className="bg-white">
            {/* Sample Questions Tags */}
            {showSuggestions && currentMessage === "" && (
                <div className="px-4 pb-3 pt-2">
                    <div className="flex flex-wrap gap-2">
                        {sampleQuestions.map((question, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSuggestionClick(question)}
                                // className="px-4 py-2 bg-gradient-to-r from-teal-50 to-blue-50 hover:from-teal-100 hover:to-blue-100 text-gray-700 text-sm rounded-full border border-teal-200 hover:border-teal-300 transition-all duration-200 hover:shadow-md"
                                className="px-4 py-2 bg-gradient-to-r 
                                            from-[#E0EBF6] to-[#C2D8EF] 
                                            hover:from-[#D0E1F3] hover:to-[#B4CCE8] 
                                            text-[#003F7D] text-sm rounded-full 
                                            border border-[#A9C8E4] hover:border-[#8FB6DB] 
                                            transition-all duration-200 hover:shadow-md"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmitWithHide} className="p-4">
                <div className="flex items-center bg-[#F9F9F5] rounded-full p-3 shadow-md border border-gray-200">
                    <button
                        type="button"
                        className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={currentMessage}
                        onChange={handleChange}
                        onFocus={() => setShowSuggestions(true)}
                        className="flex-grow px-4 py-2 bg-transparent focus:outline-none text-gray-700"
                    />
                    <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                    </button>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-[#0054A6] to-[#0072CE] 
    hover:from-[#0061BF] hover:to-[#0080E5] 
    rounded-full p-3 ml-2 shadow-md 
    transition-all duration-200 group"                    >
                        <svg className="w-6 h-6 text-white transform rotate-45 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InputBar;