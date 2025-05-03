/* eslint-disable react/forbid-prop-types */
import { useState } from "react";

import PropTypes from "prop-types";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

import Api from "utils/Api";

const FormTrocaSenha = ({
  IsLogin,
  setIsLogin,
  setRecupecaoSenha,
  toastRef,
  ShowLogin,
  EtapaTrocarSenha,
  setEtapaTrocarSenha
}) => {
  const Requicicao = new Api();

  const [Loading, setLoading] = useState(false);

  const [Codigo, setCodigo] = useState("");

  const TrocarSenha1 = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(event.target);
      await Requicicao.Post({
        endpoint: "/Auth/RecuperacaoSenha",
        data: { email: formData.get("email") }
      });
      setEtapaTrocarSenha(1);
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 404) {
        toastRef.current.show({
          severity: "info",
          summary: "Informações",
          detail: error.response.data
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const TrocarSenha2 = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(event.target);
      const codigo = formData.get("codigo");
      await Requicicao.Get({
        endpoint: "/Auth/RecuperacaoSenha",
        params: { codigo }
      });
      setCodigo(codigo);
      setEtapaTrocarSenha(2);
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 404) {
        toastRef.current.show({
          severity: "info",
          summary: "Informações",
          detail: error.response.data
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const TrocarSenha3 = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(event.target);
      const data = {
        senha: formData.get("senha"),
        confirmeSenha: formData.get("confirme-senha")
      };
      if (data.senha === data.confirmeSenha) {
        await Requicicao.Put({
          endpoint: "/Auth/RecuperacaoSenha",
          data: { Senha: data.senha, codigo_recuperacao: Codigo }
        });
        setIsLogin(true);
        setCodigo("");
        setTimeout(() => {
          setEtapaTrocarSenha(0);
          setRecupecaoSenha(false);
        }, 1000);
      } else {
        toastRef.current.show({
          severity: "info",
          summary: "Informações",
          detail: "As senhas não são iguais",
          life: 5000
        });
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        toastRef.current.show({
          severity: "info",
          summary: "Informações",
          detail: error.response.data
        });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        if (EtapaTrocarSenha === 0) {
          TrocarSenha1(e);
        } else if (EtapaTrocarSenha === 1) {
          TrocarSenha2(e);
        } else if (EtapaTrocarSenha === 2) {
          TrocarSenha3(e);
        }
      }}
      className={`form-login recuperecao ${IsLogin ? "menos-50" : "zero"}`}
    >
      <h2>Recuperação de Senha</h2>
      {EtapaTrocarSenha === 0 && (
        <>
          <p>Confirme o e-mail abaixo para recuperar sua senha.</p>
          <div>
            <div className="mb-3">
              <label htmlFor="email-trocar-senha" className="form-label">
                Email
              </label>
              <InputText id="email-trocar-senha" name="email" />
            </div>
          </div>
        </>
      )}
      {EtapaTrocarSenha === 1 && (
        <>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            recusandae totam laborum omnis sint non saepe molestias ut? Fuga
            voluptatum eos odit sunt consectetur rerum fugiat qui amet ut autem.
          </p>
          <div>
            <div className="mb-3">
              <label htmlFor="codigo" className="form-label">
                Codigo
              </label>
              <InputText id="codigo" name="codigo" />
            </div>
          </div>
        </>
      )}
      {EtapaTrocarSenha === 2 && (
        <>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
            quas necessitatibus id doloribus dicta deserunt corrupti aliquam
            tenetur voluptas! Tempora natus similique ratione explicabo error
            officiis ab consequatur architecto ea.
          </p>
          <div>
            <div className="mb-3">
              <label htmlFor="nova-senha" className="form-label">
                Senha
              </label>
              <Password
                id="nova-senha"
                name="senha"
                feedback={false}
                toggleMask
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nova-confirme-senha" className="form-label">
                Confirme a senha
              </label>
              <Password
                id="nova-confirme-senha"
                name="confirme-senha"
                feedback={false}
                toggleMask
              />
            </div>
          </div>
        </>
      )}
      <div className="box-center-btn">
        <Button label="Recuperar" loading={Loading} />
        <Button
          id="voltar-login-recupera"
          label="Voltar"
          type="button"
          className="btn btn-tela-mine"
          onClick={ShowLogin}
        />
      </div>
    </form>
  );
};

FormTrocaSenha.propTypes = {
  IsLogin: PropTypes.bool.isRequired,
  setIsLogin: PropTypes.func.isRequired,
  setRecupecaoSenha: PropTypes.func.isRequired,
  toastRef: PropTypes.object.isRequired,
  ShowLogin: PropTypes.func.isRequired,
  EtapaTrocarSenha: PropTypes.number.isRequired,
  setEtapaTrocarSenha: PropTypes.func.isRequired
};

export default FormTrocaSenha;
