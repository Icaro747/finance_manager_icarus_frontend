import { createContext, useContext, useState, useEffect, useMemo } from "react";

import PropTypes from "prop-types";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // const router = useRouter();
  const [user, setUser] = useState(null); // Pode conter os detalhes do usuário logado

  // Verifica se o usuário está autenticado (por exemplo, verifica o token)
  const isAuthenticated = () => !!user?.token; // Verifica se o token existe
  const GetAccessUser = () => user.accessUser;
  const GetAccessLevel = () => Number(user?.accessLevel);
  const UserNome = () => user.nome;
  const GetImagemPerfil = () => user?.imagemPerfil;

  // Função para fazer login (pode chamar sua API de login aqui)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("nome", userData.nome);
    localStorage.setItem("accessUser", userData.accessUser);
    localStorage.setItem("accessLevel", userData.accessLevel);
    localStorage.setItem(
      "imagemPerfil",
      userData.imagemPerfil === null ? false : userData.imagemPerfil
    );
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("accessUser");
    localStorage.removeItem("accessLevel");
    localStorage.removeItem("imagemPerfil");
    setUser(null);
  };

  const GetHeaders = (contentType) => ({
    headers: {
      Authorization: `Bearer ${user?.token}`,
      "Content-Type": contentType != null ? contentType : "application/json"
    }
  });

  const RotaRestrida = () => {
    try {
      const currentPath = window.location.pathname;
      if (currentPath.includes("/app")) {
        logout();
      }
    } catch (error) {
      console.error("RotasRestritas:", error);
    }
  };

  useEffect(() => {
    const VerificarAutenticacao = async () => {
      try {
        if (!isAuthenticated()) {
          const token = localStorage.getItem("token");

          if (token) {
            const nome = localStorage.getItem("nome");
            const accessUser = localStorage.getItem("accessUser");
            const accessLevel = localStorage.getItem("accessLevel");
            const imagemPerfil = localStorage.getItem("imagemPerfil");

            const data = {
              nome,
              token,
              accessUser,
              accessLevel,
              imagemPerfil:
                imagemPerfil !== "false" ? Number(imagemPerfil) : null
            };

            setUser(data);
          } else {
            RotaRestrida();
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    VerificarAutenticacao();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      GetHeaders,
      UserNome,
      GetAccessUser,
      GetAccessLevel,
      GetImagemPerfil
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired
};
