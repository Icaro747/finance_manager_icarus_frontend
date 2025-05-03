import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "context/AuthContext";

const Error401 = () => {
  const auth = useAuth();

  return (
    <div className="vh-100 d-flex flex-column justify-content-center">
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <h1 className="display-4">401 - Não Autorizado</h1>
            <p className="lead">
              Você não tem permissão para acessar esta página.
            </p>
            <p>
              Entre em contato com o administrador do sistema para obter
              assistência.
            </p>
            {auth.isAuthenticated() ? (
              <Link to="/app" className="btn btn-primary mt-3">
                Voltar para a página inicial
              </Link>
            ) : (
              <Link to="/" className="btn btn-primary mt-3">
                Voltar para a página inicial
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Error401;
