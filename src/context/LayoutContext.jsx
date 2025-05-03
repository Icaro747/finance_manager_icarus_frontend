import React, { createContext, useState, useMemo, useContext } from "react";

import PropTypes from "prop-types";

// Criando o contexto
const LayoutContext = createContext();

// Criando o provedor de contexto
export const LayoutProvider = ({ children }) => {
  const [statuShowMenu, setStatuShowMenu] = useState(false);
  const [statuShowDialogHelp, setStatuShowDialogHelp] = useState(false);
  const [Cor, setCor] = useState(null);
  const [Img, setImg] = useState(null);

  const value = useMemo(
    () => ({
      statuShowMenu,
      setStatuShowMenu,
      statuShowDialogHelp,
      setStatuShowDialogHelp,
      Cor,
      setCor,
      Img,
      setImg
    }),
    [statuShowMenu, statuShowDialogHelp, Cor, Img]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

LayoutProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout deve ser utilizado dentro de um LayoutProvider");
  }
  return context;
};
