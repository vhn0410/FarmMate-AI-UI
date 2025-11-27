// src/contexts/KeycloakProvider.jsx
import React, { useEffect, useState, createContext, useContext } from "react";
import keycloak from "../keycloak";

const KeycloakContext = createContext(null);

const CLIENT_ACCESS_3000_ROLE = import.meta.env.VITE_CLIENT_ACCESS_3000_ROLE;

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasAccess, setHasAccess] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        let mounted = true;

        const initKeycloak = async () => {
            try {
                console.log("🔑 Initializing Keycloak...");
                
                // 🔥 FIX: Check if we're in OAuth callback
                const urlParams = new URLSearchParams(window.location.search);
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                
                const hasCode = urlParams.has('code') || hashParams.has('code');
                const hasState = urlParams.has('state') || hashParams.has('state');
                
                console.log("📍 Current URL:", window.location.href);
                console.log("🔍 Has OAuth params:", { hasCode, hasState });

                // 🔥 CRITICAL: Different init strategy based on URL
                let initConfig;
                
                if (hasCode && hasState) {
                    // We're in OAuth callback - don't trigger new login
                    console.log("✅ OAuth callback detected - processing...");
                    initConfig = {
                        onLoad: 'check-sso', // 🔥 Don't force login
                        checkLoginIframe: false,
                        enableLogging: true, // 🔥 Enable debug logs
                    };
                } else {
                    // Normal page load
                    console.log("🚪 Normal page load - checking auth...");
                    initConfig = {
                        onLoad: 'login-required',
                        checkLoginIframe: false,
                        enableLogging: true,
                    };
                }

                const authenticated = await keycloak.init(initConfig);

                console.log("🔐 Keycloak authenticated:", authenticated);

                if (!mounted) return;

                setIsAuthenticated(authenticated);

                if (authenticated) {
                    console.log("✅ User authenticated");
                    console.log("👤 User roles:", keycloak.tokenParsed?.realm_access?.roles);
                    
                    const roles = keycloak.tokenParsed?.realm_access?.roles || [];
                    const allowed = roles.includes(CLIENT_ACCESS_3000_ROLE);
                    
                    console.log("🔑 Required role:", CLIENT_ACCESS_3000_ROLE);
                    console.log("✅ Has access:", allowed);
                    
                    if (!allowed) {
                        console.error("❌ User lacks required role");
                        keycloak.logout({
                            redirectUri: `${window.location.origin}/login?error=no-access`,
                        });
                    } else {
                        setHasAccess(true);
                        
                        // 🔥 Clean up URL after successful OAuth
                        if (hasCode && hasState) {
                            console.log("🧹 Cleaning up OAuth params from URL");
                            window.history.replaceState(
                                {},
                                document.title,
                                window.location.pathname
                            );
                        }
                    }
                } else {
                    console.log("❌ User not authenticated");
                    setHasAccess(false);
                }
            } catch (err) {
                console.error("❌ Keycloak init error:", err);
                if (mounted) {
                    setHasAccess(false);
                }
            } finally {
                if (mounted) {
                    console.log("✅ Keycloak initialization complete");
                    setIsInitializing(false);
                }
            }
        };

        initKeycloak();

        return () => {
            mounted = false;
        };
    }, []); // Empty dependency - only run once

    if (isInitializing) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang xác thực...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || hasAccess === null || hasAccess === false) {
        // Don't render anything - Keycloak will handle redirect
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
                </div>
            </div>
        );
    }

    return (
        <KeycloakContext.Provider value={keycloak}>
            {children}
        </KeycloakContext.Provider>
    );
};