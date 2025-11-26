import React, { useEffect } from "react";
import { useKeycloak } from "../contexts/KeycloakProvider";

const Logout = () => {
  const keycloak = useKeycloak();

  useEffect(() => {
    keycloak.logout({ redirectUri: window.location.origin });
  }, [keycloak]);

  // return <p>Đang đăng xuất...</p>;
};

export default Logout;
  