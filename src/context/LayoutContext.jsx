import { createContext, useState, useMemo, useContext, useEffect } from "react";

import PropTypes from "prop-types";

// Criando o contexto
const LayoutContext = createContext();

// Criando o provedor de contexto
export const LayoutProvider = ({ children }) => {
  const [FixedShowMenu, setFixedShowMenu] = useState(false);
  const [StatuShowMenu, setStatuShowMenu] = useState(false);
  const [statuShowDialogHelp, setStatuShowDialogHelp] = useState(false);

  const [Cor, setCor] = useState(null);
  const [Img, setImg] = useState(null);

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("dark-theme");
    return savedTheme === "true"; // Converte a string para boolean
  });

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.documentElement.classList.toggle("dark-theme", newTheme);
    localStorage.setItem("dark-theme", newTheme); // Salva o estado no localStorage
  };

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark-theme");
    }
  }, [isDarkTheme]);

  const value = useMemo(
    () => ({
      StatuShowMenu,
      setStatuShowMenu,
      FixedShowMenu,
      setFixedShowMenu,
      statuShowDialogHelp,
      setStatuShowDialogHelp,
      Cor,
      setCor,
      Img,
      setImg,
      isDarkTheme,
      toggleTheme
    }),
    [FixedShowMenu, StatuShowMenu, statuShowDialogHelp, Cor, Img, isDarkTheme]
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
