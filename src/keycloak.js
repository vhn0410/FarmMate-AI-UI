// src/keycloak.js
import Keycloak from "keycloak-js";

const KEYCLOAK_API = import.meta.env.VITE_KEYCLOAK_API;
const REALM = import.meta.env.VITE_REALM;
const CLIENID = import.meta.env.VITE_CLIENT_ID;

const keycloak = new Keycloak({
    url: KEYCLOAK_API,
    realm: REALM,
    clientId: CLIENID,
});

// 🔥 Add event listeners for debugging
keycloak.onAuthSuccess = () => {
    console.log("🎉 Keycloak: Auth Success");
};

keycloak.onAuthError = (error) => {
    console.error("❌ Keycloak: Auth Error", error);
};

keycloak.onAuthRefreshSuccess = () => {
    console.log("🔄 Keycloak: Token Refreshed");
};

keycloak.onAuthRefreshError = () => {
    console.error("❌ Keycloak: Token Refresh Failed");
};

keycloak.onTokenExpired = () => {
    console.warn("⏰ Keycloak: Token Expired");
    keycloak.updateToken(30).catch(() => {
        console.error("❌ Failed to refresh expired token");
    });
};

export default keycloak;