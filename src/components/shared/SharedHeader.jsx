import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, User, Settings } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";

/**
 * Component Header chung cho tất cả layouts
 */
const SharedHeader = ({ title = "Dashboard" }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Đóng dropdown khi click ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileOpen]);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="bg-gray-100 ml-2 outline-none text-sm w-32"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Settings */}
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                </button>

                {/* User Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden md:inline">Profile</span>
                    </button>

                    <UserProfileDropdown
                        isOpen={isProfileOpen}
                        onClose={() => setIsProfileOpen(false)}
                    />
                </div>
            </div>
        </header>
    );
};

export default SharedHeader;
