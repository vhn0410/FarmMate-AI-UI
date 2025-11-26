import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PremiumTypingAnimation = () => (
    <div className="flex items-center">
        <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-gray-400/70 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400/70 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-gray-400/70 rounded-full animate-pulse delay-300"></div>
        </div>
    </div>
);

const SearchStages = ({ searchInfo }) => {
    if (!searchInfo || !searchInfo.stages.length) return null;

    return (
        <div className="mb-2 mt-1 pl-4">
            <div className="flex flex-col space-y-3 text-sm text-gray-700">

                {searchInfo.stages.includes("searching") && (
                    <div>
                        <span className="font-medium text-gray-900">🔍 Searching the web</span>
                        <div className="mt-1">
                            <div className="text-xs bg-gray-100 border px-3 py-1 rounded">
                                {searchInfo.query}
                            </div>
                        </div>
                    </div>
                )}

                {searchInfo.stages.includes("reading") && (
                    <div>
                        <span className="font-medium text-gray-900">📖 Reading</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {searchInfo.urls?.map((u, i) => (
                                <div key={i} className="text-xs bg-gray-100 border px-3 py-1 rounded max-w-[200px] truncate">
                                    {u}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {searchInfo.stages.includes("writing") && (
                    <div>
                        <span className="font-medium text-gray-900">✏️ Writing answer...</span>
                    </div>
                )}

                {searchInfo.stages.includes("error") && (
                    <div className="text-red-500 text-xs">
                        ❌ {searchInfo.error}
                    </div>
                )}
            </div>
        </div>
    );
};

const MessageArea = ({ messages }) => {
    return (
        <div className="flex-grow overflow-y-auto bg-[#FAFAF7] border-b border-gray-200" style={{ minHeight: 0 }}>
            <div className="max-w-3xl mx-auto p-6 space-y-6">

                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                        <div className="flex flex-col max-w-[75%]">

                            {!message.isUser && message.searchInfo && <SearchStages searchInfo={message.searchInfo} />}

                            <div className={`rounded-xl py-3 px-4 shadow-sm ${
                                message.isUser
                                    ? "bg-blue-600 text-white rounded-br-none shadow-md"
                                    : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none"
                            }`}>

                                {message.isLoading ? (
                                    <PremiumTypingAnimation />
                                ) : (
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default MessageArea;
