import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";

import { useAuth } from "context/AuthContext";

import Error401 from "./Error401";

const PrivateRoute = ({ element: Element }) => {
  const auth = useAuth();

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const thisAuthenticated = await auth.isAuthenticated();
      if (thisAuthenticated && auth.GetAccessLevel() != null)
        setIsAuthenticated(thisAuthenticated);
      else setIsAuthenticated(false);
    };
    checkAuthentication();
  }, [auth]);

  if (isAuthenticated === null) {
    // Aguarde a conclusão da verificação de autenticação
    return null;
  }

  return isAuthenticated ? <Element /> : <Error401 />;
};

PrivateRoute.propTypes = {
  element: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired
};

export default PrivateRoute;
