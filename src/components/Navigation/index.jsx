import { useState, useEffect } from "react";

import classNames from "classnames";

import { Button } from "primereact/button";

import { useLayout } from "context/LayoutContext";
import { useNavegation } from "context/NavigationContext";

import PanelMenu from "./PanelMenu";

import "./styled.scss";

const Navigation = () => {
  const { setStatuShowMenu, FixedShowMenu } = useLayout();
  const { ExpandirMenu, setExpandirMenu } = useNavegation();

  const [isSticky, setIsSticky] = useState(false);

  const handleMouseEnter = () => {
    if (FixedShowMenu === false) {
      setExpandirMenu(true);
      setStatuShowMenu(true);
    }
  };

  const handleMouseLeave = () => {
    if (FixedShowMenu === false) {
      setExpandirMenu(false);
      setStatuShowMenu(false);
    }
  };

  const CloseMenu = () => {
    setExpandirMenu(false);
    setStatuShowMenu(false);
  };

  useEffect(() => {
    setExpandirMenu(FixedShowMenu);
    setStatuShowMenu(FixedShowMenu);
  }, [FixedShowMenu, setExpandirMenu]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsSticky(true);
      } else if (window.scrollY < 70) {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={classNames("layout-sidebar", { "not-show": !ExpandirMenu })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="d-flex flex-column h-100">
        <div
          className={classNames("layout-box-logo layout-cor", {
            "layout-logo-min": !ExpandirMenu,
            "layout-logo-max": ExpandirMenu
          })}
        >
          <button
            className="btn btn-close-menu"
            type="button"
            onClick={CloseMenu}
          >
            <i className="pi pi-times" style={{ fontSize: "1.5rem" }} />
          </button>
        </div>

        <div id="menu" className="layout-menu h-100">
          <PanelMenu />
        </div>
      </div>
      <div className="card m-3 not-shadow">
        <div className="d-flex flex-column align-items-start">
          <Button
            label="Ajuda & Suporte"
            text
            severity="secondary"
            icon="ak ak-headset"
            className="w-100"
          />
          <Button
            label="Perfil"
            text
            severity="secondary"
            icon="ak ak-gear-six"
            className="w-100"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
