// ============ MESSAGE AREA (Component riêng để export) ============

// ============ MARKDOWN PARSER ============
const SimpleMarkdown = ({ children }) => {
    if (!children) return null;
    
    const parseMarkdown = (text) => {
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
        text = text.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
        text = text.replace(/\n/g, '<br/>');
        return text;
    };

    const processText = (text) => {
        const lines = text.split('\n');
        let html = '';
        let inList = false;

        lines.forEach((line) => {
            if (line.startsWith('### ')) {
                html += `<h3 class="text-lg font-bold mt-3 mb-2">${parseMarkdown(line.substring(4))}</h3>`;
            } else if (line.startsWith('## ')) {
                html += `<h2 class="text-xl font-bold mt-4 mb-2">${parseMarkdown(line.substring(3))}</h2>`;
            } else if (line.startsWith('# ')) {
                html += `<h1 class="text-2xl font-bold mt-4 mb-2">${parseMarkdown(line.substring(2))}</h1>`;
            } else if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
                if (!inList) {
                    html += '<ul class="list-disc list-inside my-2 space-y-1">';
                    inList = true;
                }
                html += `<li>${parseMarkdown(line.trim().substring(2))}</li>`;
            } else if (line.trim()) {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                html += `<p class="my-2">${parseMarkdown(line)}</p>`;
            } else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
            }
        });

        if (inList) html += '</ul>';
        return html;
    };

    return (
        <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: processText(children) }}
        />
    );
};

// ============ TYPING ANIMATION ============
const PremiumTypingAnimation = () => (
    <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        {/* <span className="text-sm text-gray-500 animate-pulse">Đang suy nghĩ...</span> */}
    </div>
);

// ============ SEARCH STAGES ============
const SearchStages = ({ searchInfo }) => {
    if (!searchInfo || !searchInfo.stages.length) return null;

    return (
        <div className="mb-3 space-y-2">
            {searchInfo.stages.includes("searching") && (
                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fadeIn">
                    <Search className="w-4 h-4 text-blue-600 mt-0.5 animate-pulse" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-900">Đang tìm kiếm</p>
                        <p className="text-xs text-blue-700 mt-1 bg-white px-2 py-1 rounded border border-blue-100">
                            {searchInfo.query}
                        </p>
                    </div>
                </div>
            )}

            {searchInfo.stages.includes("reading") && (
                <div className="flex items-start space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg animate-fadeIn">
                    <BookOpen className="w-4 h-4 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-purple-900">Đang đọc nguồn</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {searchInfo.urls?.map((u, i) => (
                                <div key={i} className="text-xs bg-white text-purple-700 px-2 py-1 rounded border border-purple-100 max-w-[180px] truncate">
                                    {u}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {searchInfo.stages.includes("writing") && (
                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                    <Edit3 className="w-4 h-4 text-green-600 mt-0.5 animate-pulse" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900">Đang viết câu trả lời</p>
                    </div>
                </div>
            )}

            {searchInfo.stages.includes("error") && (
                <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900">Lỗi</p>
                        <p className="text-xs text-red-700 mt-1">{searchInfo.error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};


export const MessageArea = ({ messages }) => {
    return (
            //     <div className="w-full px-4 py-3">
            // <div className="max-w-3xl mx-auto"></div>
        <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ minHeight: 0 }}>
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {messages.map((message, index) => (
                    <div 
                        key={message.id} 
                        className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-slideIn`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className={`flex flex-col ${message.isUser ? 'max-w-[80%]' : 'max-w-[100%]'}`}>
                            
                            {!message.isUser && message.searchInfo && (
                                <SearchStages searchInfo={message.searchInfo} />
                            )}

                            <div className={`relative group ${
                                message.isUser
                                    ? "bg-white text-gray-800 rounded-2xl rounded-br-md shadow-lg hover:shadow-xl transition-all duration-300"
                                    : "text-gray-800  rounded-2xl rounded-bl-md shadow-sm hover:shadow-md transition-all duration-300"
                            } px-5 py-3.5`}>
                                
                                {message.isLoading ? (
                                    <PremiumTypingAnimation />
                                ) : (
                                    // <div className={`text-sm leading-relaxed ${message.isUser ? 'text-white' : 'text-gray-800'}`}>
                                    <div className={`text-lg leading-relaxed text-gray-800`}>
                                        <SimpleMarkdown>{message.content}</SimpleMarkdown>
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