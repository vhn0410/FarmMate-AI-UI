import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import { Plus } from "lucide-react";
import logoCTU from "@/assets/CTU_logo.png";
import PropTypes from "prop-types";
import { threads } from "../constants";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
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
            <p className="my-3 mx-3 text-sm font-normal text-slate-900">Gần đây</p>
            {/* Thread list */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {threads.map((t) => (
                    <NavLink
                        key={t.id}
                        to={t.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                                "hover:bg-[#E5F4FB]",
                                isActive
                                    ? "bg-[#E5F4FB] font-medium"
                                    : "text-slate-700 ",
                                collapsed && "justify-center"
                            )
                        }
                    >
                        {/* <span className="inline-block w-2 h-2 rounded-full bg-slate-400"></span> */}

                        {!collapsed && (
                            <span className="truncate max-w-[170px]">
                                {t.title}
                            </span>
                        )}
                    </NavLink>
                ))}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool
};
