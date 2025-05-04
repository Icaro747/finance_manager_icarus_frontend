/* eslint-disable react/forbid-prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

import { useAuth } from "context/AuthContext";

import Api from "utils/Api";

const FormLogin = ({ IsLogin, toastRef, IsCadastre, IsRecuperaSenha }) => {
  const auth = useAuth();

  const Requicicao = new Api(auth.logout);
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");

  const [Loading, setLoading] = useState(false);

  const SubmitLogin = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const resposta = await Requicicao.Post({
        endpoint: "/Auth/login",
        data: {
          username: Email,
          password: Senha
        }
      });

      navigate("/app");
      auth.login(resposta);
    } catch (error) {
      if (error?.message === "Network Error") {
        toastRef.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro de conexão com o servidor",
          life: 5000
        });
      } else if (error?.response?.status === 401) {
        toastRef.current.show({
          severity: "error",
          summary: "Erro",
          detail: error.response.data,
          life: 5000
        });
      } else if (error?.response?.status === 400) {
        toastRef.current.show({
          severity: "warn",
          summary: "Opi",
          detail: error.response.data,
          life: 5000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={SubmitLogin}
      className={`form-login login ${!IsLogin ? "mais-50" : "zero"}`}
    >
      <h2>Login</h2>
      <div>
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <InputText
          id="email"
          name="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="senha" className="form-label">
          Senha
        </label>
        <Password
          id="senha"
          name="senha"
          feedback={false}
          toggleMask
          value={Senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>
      <div className="box-center-btn">
        <Button label="Entrar" type="submit" loading={Loading} />
        <Button
          label="Cadastre-se"
          type="button"
          className="btn btn-tela-mine"
          onClick={IsCadastre}
        />
        <Button
          label="Recuperação de senha"
          type="button"
          className="btn btn-tela-mine"
          onClick={IsRecuperaSenha}
        />
      </div>
    </form>
  );
};

FormLogin.propTypes = {
  IsLogin: PropTypes.bool.isRequired,
  toastRef: PropTypes.object.isRequired,
  IsCadastre: PropTypes.func.isRequired,
  IsRecuperaSenha: PropTypes.func.isRequired
};

export default FormLogin;
