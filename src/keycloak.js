import Keycloak from "keycloak-js";

// import Keycloak from "keycloak-js";
const KEYCLOAK_API = import.meta.env.VITE_KEYCLOAK_API;
const REALM = import.meta.env.VITE_REALM;
const CLIENID = import.meta.env.VITE_CLIENT_ID;

const keycloak = new Keycloak({
  url: KEYCLOAK_API,                // URL của Keycloak server
  realm: REALM,                          // Tên realm của bạn
  clientId: CLIENID,           // clientId ứng với ứng dụng
});

export default keycloak;
