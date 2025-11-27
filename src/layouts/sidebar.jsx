// src/layouts/sidebar.jsx
import { forwardRef, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import { Plus } from "lucide-react";
import logoCTU from "@/assets/CTU_logo.png";
import PropTypes from "prop-types";
import { useKeycloak } from "../contexts/KeycloakProvider";
import { threadApi } from "../services/threadAPI";
import { THREAD_EVENTS, onThreadEvent } from "../utils/events";
import { formatThreadTime } from "../utils/threadHelpers";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const keycloak = useKeycloak();
    const navigate = useNavigate();
    const { id: currentThreadId } = useParams();
    const userId = keycloak.tokenParsed?.sub || "demo-user";
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // 🔥 Add ref to prevent multiple simultaneous loads
    const isLoadingRef = useRef(false);

    // Load threads khi component mount
    useEffect(() => {
        // 🔥 Prevent multiple calls
        if (isLoadingRef.current) return;
        
        loadThreads();
    }, [userId]); // 🔥 Only depend on userId


    // // Load threads khi component mount
    // useEffect(() => {
    //     loadThreads();
    // }, [userId]);

    useEffect(() => {
        // Khi có thread mới được tạo
        const unsubscribeCreated = onThreadEvent(THREAD_EVENTS.CREATED, (event) => {
            const newThread = event.detail;
            setThreads(prev => {
                if (prev.some(t => t.thread_id === newThread.thread_id)) {
                    return prev;
                }
                return [newThread, ...prev];
            });
        });

        // Khi thread bị xóa
        const unsubscribeDeleted = onThreadEvent(THREAD_EVENTS.DELETED, (event) => {
            const { threadId } = event.detail;
            setThreads(prev => prev.filter(t => t.thread_id !== threadId));
        });

        return () => {
            unsubscribeCreated();
            unsubscribeDeleted();
        };
    }, []);

    const loadThreads = async () => {
        // 🔥 Prevent concurrent calls
        if (isLoadingRef.current) {
            console.log("⚠️ Already loading threads, skipping...");
            return;
        }

        try {
            isLoadingRef.current = true;
            setLoading(true);
            setError(null);
            
            await keycloak.updateToken(30);
            
            const data = await threadApi.getUserThreads(userId);
            setThreads(data);
        } catch (err) {
            console.error("Failed to load threads:", err);
            
            if (err.response?.status === 401) {
                console.log("Token expired, redirecting to login...");
                keycloak.login();
                return;
            }
            
            setError("Không thể tải danh sách cuộc hội thoại");
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    };

    // Xóa thread
    const handleDeleteThread = async (threadId, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!window.confirm("Xóa cuộc hội thoại này?")) return;

        try {
            // 🔥 Ensure token is valid
            await keycloak.updateToken(30);
            
            await threadApi.deleteThread(threadId, userId);
            
            // 🔥 EMIT EVENT để các components khác cập nhật
            emitThreadEvent(THREAD_EVENTS.DELETED, { threadId });
            
            setThreads(prev => prev.filter(t => t.thread_id !== threadId));
            
            if (threadId === currentThreadId) {
                navigate("/chat/new");
            }
        } catch (err) {
            console.error("Failed to delete thread:", err);
            
            if (err.response?.status === 401) {
                keycloak.login();
                return;
            }
            
            alert("Không thể xóa cuộc hội thoại!");
        }
    };

    const handleLogout = () => {
        const agree = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
        if (!agree) return;
        navigate("/logout");
    };

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[260px] flex-col border-r bg-white dark:bg-slate-900 dark:border-slate-700 transition-all",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[260px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0"
            )}
        >
            {/* Logo */}
            <NavLink to="/">
                <div className="flex items-center gap-3 px-4 py-4">
                    <img
                        src={logoCTU}
                        className={cn(
                            "transition-all",
                            collapsed ? "w-10 h-10" : "w-14 h-14"
                        )}
                    />
                    {!collapsed && (
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                            CAN THO UNIVERSITY
                        </p>
                    )}
                </div>
            </NavLink>

            {/* New chat button */}
            <div className="px-3 pt-5">
                <NavLink
                    to="/chat/new"
                    className={cn(
                        "flex items-center gap-2 py-2 rounded-lg w-full hover:bg-slate-100 dark:hover:bg-slate-800 transition",
                        collapsed && "justify-center"
                    )}
                >
                    <Plus size={18} />
                    {!collapsed && <span className="text-sm font-semibold text-slate-900">Cuộc trò chuyện mới</span>}
                </NavLink>
            </div>

            {/* Divider */}
            <div className="my-3 mx-3 border-b dark:border-slate-700"></div>
            {!collapsed && <p className="my-3 mx-3 text-sm font-normal text-slate-900">Gần đây</p>}

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                {loading && (
                    <div className="text-center py-4 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                )}

                {error && (
                    <div className="text-center py-4 px-2">
                        <p className="text-red-500 text-sm mb-2">{!collapsed && error}</p>
                        {!collapsed && (
                            <button
                                onClick={loadThreads}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Thử lại
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && threads.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm px-2">
                        {!collapsed && "Chưa có cuộc hội thoại nào"}
                    </div>
                )}

                {!collapsed && !loading && !error && threads.map((thread) => (
                    <Link
                        key={thread.thread_id}
                        to={`/chat/${thread.thread_id}`}
                        className={cn(
                            "block mb-2 p-3 rounded-lg transition-all group relative",
                            "hover:bg-gray-100 dark:hover:bg-slate-800",
                            currentThreadId === thread.thread_id
                                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
                                : "border-l-4 border-transparent"
                        )}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate text-sm">
                                    {thread.title}
                                </h3>
                                {thread.created_at && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formatThreadTime(thread.created_at)}
                                    </p>
                                )}
                            </div>
                            
                            {/* Delete Button */}
                            <button
                                onClick={(e) => handleDeleteThread(thread.thread_id, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded ml-2"
                                title="Xóa"
                            >
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </Link>
                ))}
            </div>

            {/* User Info */}
            <div className="border-t border-gray-200 dark:border-slate-800 p-3">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {keycloak.tokenParsed?.preferred_username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                {keycloak.tokenParsed?.preferred_username || "User"}
                            </p>
                            <button
                                onClick={handleLogout}
                                className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer">
                        {keycloak.tokenParsed?.preferred_username?.[0]?.toUpperCase() || "U"}
                    </div>
                )}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool
};