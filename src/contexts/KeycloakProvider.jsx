import React, { useEffect, useState, createContext, useContext } from "react";
import keycloak from "../keycloak";

const KeycloakContext = createContext(null);

const CLIENT_ACCESS_3000_ROLE = import.meta.env.VITE_CLIENT_ACCESS_3000_ROLE;


export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasAccess, setHasAccess] = useState(null); // null: chưa xác định

    useEffect(() => {
        keycloak
            .init({ onLoad: "login-required", checkLoginIframe: false})
            .then((authenticated) => {
                setIsAuthenticated(authenticated);

                if (authenticated) {
                    const roles = keycloak.tokenParsed?.realm_access?.roles || [];
                    const allowed = roles.includes(CLIENT_ACCESS_3000_ROLE);
                    if (!allowed) {
                         keycloak.logout({
                          redirectUri: `${window.location.origin}/login?error=no-access`,
                        });
                    } else {
                        setHasAccess(true);
                    }
                } else {
                    setHasAccess(false);
                }
            })
            .catch((err) => {
                console.error("Keycloak init error", err);
                setHasAccess(false);
            });
    }, []);

    if (!isAuthenticated || hasAccess === null) {
        return <p>Đang xác thực...</p>;
    }

    return (
        <KeycloakContext.Provider value={keycloak}>
            {children}
        </KeycloakContext.Provider>
    );
};
