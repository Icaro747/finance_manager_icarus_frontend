import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => (
  <div className="vh-100 d-flex flex-column justify-content-center">
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h1 className="display-4">404</h1>
          <h2 className="fs-1">Página não encontrada</h2>
          <Link to="/app" className="btn btn-primary mt-3">
            Ir para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Error404;
