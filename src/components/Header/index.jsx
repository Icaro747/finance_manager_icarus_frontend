import { useRef, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";

import NamesPeges from "constants/urlAndNamePages";

import LogoAvatar from "components/LogoAvatar";

import { useAuth } from "context/AuthContext";
import { useLayout } from "context/LayoutContext";

import LinksMenuUsuario from "./linksMenuUsuario";

import "./styled.scss";

const Header = () => {
  const location = useLocation();
  const auth = useAuth();
  const op = useRef(null);
  const navigate = useNavigate();
  const layout = useLayout();

  const NomePaginaAtual =
    NamesPeges.filter((x) => x.url.includes(location.pathname))[0]?.name ??
    "N/D";

  const [Nome, setNome] = useState("Nome");

  useEffect(() => {
    if (auth.isAuthenticated()) {
      setNome(auth.UserNome());
    }
  }, [auth]);

  return (
    <header className="header-container">
      <div className="header-box">
        <div className="box-btn-header">
          <Button
            onClick={() => layout.setStatuShowMenu((show) => !show)}
            icon="pi pi-bars"
            className="btn-header-menu"
          />
          <h1>{NomePaginaAtual}</h1>
        </div>
        <div className="header-item-right">
          <button
            type="button"
            className="button-none header-button-user"
            onClick={(e) => op.current.toggle(e)}
          >
            <div className="box-text-user">
              <span>Meu Perfil</span>
              <p>{Nome}</p>
            </div>
            <LogoAvatar name={Nome} usuarioId={auth.GetImagemPerfil()} />
          </button>
          <OverlayPanel ref={op}>
            <div className="d-flex flex-column">
              <div className="item-user-menu border-bottom">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <LogoAvatar name={Nome} usuarioId={auth.GetImagemPerfil()} />
                  <p className="m-0">{Nome}</p>
                </div>
                <Button
                  className="btn btn-user btn-sm"
                  label="Logoff"
                  icon="pi pi-sign-out"
                  onClick={() => {
                    auth.logout();
                    navigate("/");
                  }}
                />
              </div>
              {LinksMenuUsuario.map((grupo) => (
                <div key={grupo.id} className="item-user-menu border-bottom">
                  {grupo.titulo != null && (
                    <p className="m-0">{grupo.titulo}</p>
                  )}
                  {grupo.links.map((item) => (
                    <Link
                      key={item.to}
                      className="btn btn-user btn-sm"
                      to={item.to}
                    >
                      <i className={item.icon} /> {item.nome}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="item-user-menu">
                <Button
                  label="Suporte"
                  icon="pi pi-question-circle"
                  className="btn btn-user btn-sm"
                  onClick={() => {
                    layout.setStatuShowDialogHelp(true);
                    op.current.hide();
                  }}
                />
              </div>
            </div>
          </OverlayPanel>
        </div>
      </div>
    </header>
  );
};

export default Header;
