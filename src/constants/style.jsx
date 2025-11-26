// ============ STYLES ============
export const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animate-slideIn {
    animation: slideIn 0.3s ease-out forwards;
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f9fafb;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

.markdown-content strong {
    font-weight: 600;
    color: inherit;
}

.markdown-content em {
    font-style: italic;
}

.markdown-content code {
    font-family: ui-monospace, monospace;
}

.markdown-content ul {
    padding-left: 0;
}

.markdown-content li {
    margin-left: 1.25rem;
}
`;

document.head.appendChild(style);