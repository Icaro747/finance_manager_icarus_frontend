import { Link } from "react-router-dom";

const PrimeiroAcesso = () => (
  <div className="d-flex flex-column align-items-center">
    <div className="card p-3">
      <h1 className="mt-5 mb-5 text-center">Bem-vindo</h1>

      <Link to="/app/minha-bases/cadastro" className="btn btn-primary mt-3">
        Comece sua jornada de dados
      </Link>
    </div>
  </div>
);

export default PrimeiroAcesso;
