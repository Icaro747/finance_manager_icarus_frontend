import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";

import { useLayout } from "context/LayoutContext";

import * as S from "./MainBoxStyled";

const MainBox = ({ children }) => {
  const layout = useLayout();
  const location = useLocation();

  const [IsHome, setIsHome] = useState(false);
  const [Img, setImg] = useState(null);
  const [Cor, setCor] = useState(null);

  useEffect(() => {
    if (location.pathname.toString() === "/app/home") {
      // setIsHome(true);
    } else setIsHome(false);
    if (
      location.pathname === "/app/quadro/visao-detalhes" ||
      location.pathname === "/app/quadro/visao-lista" ||
      location.pathname === "/app/quadro/visao-calendarios"
    ) {
      setCor(layout.Cor);
      setImg(layout.Img);
    } else {
      setCor(null);
      setImg(null);
      layout.setCor(null);
      layout.setImg(null);
    }
  }, [location, layout]);

  return (
    <S.Box $isHome={IsHome} $bgColor={Cor} $bgImg={Img} className="layout-cor">
      {children}
    </S.Box>
  );
};

MainBox.propTypes = {
  children: PropTypes.element.isRequired
};

export default MainBox;
