import React, { useEffect } from "react";
import { useKeycloak } from "../contexts/KeycloakProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const keycloak = useKeycloak();
    const navigate = useNavigate();
    useEffect(() => {
        if (!keycloak.authenticated) {
            keycloak.login();
        } else {
            navigate("/");
        }
    }, [keycloak]);

    // return <p>Đang đăng nhập...</p>;
};

export default Login;
