import { useState, useRef } from "react";

import { Toast } from "primereact/toast";

import FormCadastro from "./modules/FormCadastro";
import FormLogin from "./modules/FormLogin";
import FormTrocaSenha from "./modules/FormTrocaSenha";

import "./styled-login.scss";
import "assets/styles/Form.css";

const Login = () => {
  const toastRef = useRef(null);

  const [IsLogin, setIsLogin] = useState(true);
  const [RecupecaoSenha, setRecupecaoSenha] = useState(false);

  const [EtapaTrocarSenha, setEtapaTrocarSenha] = useState(0);

  const ShowCadastre = () => {
    setRecupecaoSenha(false);
    setTimeout(() => {
      setIsLogin((e) => !e);
    }, 10);
  };

  const ShowRecuperaSenha = () => {
    setRecupecaoSenha(true);
    setEtapaTrocarSenha(0);
    setTimeout(() => {
      setIsLogin((e) => !e);
    }, 10);
  };

  const ShowLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="login-box-main">
      <Toast ref={toastRef} />
      <div className="card p-3">
        <div className="row g-5">
          <div
            className={`col-6 overflow-hidden ${!IsLogin ? "menos-100" : "zero"}`}
          >
            <div className="box-form">
              <FormLogin
                IsLogin={IsLogin}
                toastRef={toastRef}
                IsCadastre={ShowCadastre}
                IsRecuperaSenha={ShowRecuperaSenha}
              />
            </div>
          </div>
          <div
            className={`col-6 overflow-hidden ${!IsLogin ? "menos-100" : "zero"}`}
          >
            {RecupecaoSenha ? (
              <div className="box-form">
                <FormTrocaSenha
                  IsLogin={IsLogin}
                  setIsLogin={setIsLogin}
                  setRecupecaoSenha={setRecupecaoSenha}
                  toastRef={toastRef}
                  ShowLogin={ShowLogin}
                  EtapaTrocarSenha={EtapaTrocarSenha}
                  setEtapaTrocarSenha={setEtapaTrocarSenha}
                />
              </div>
            ) : (
              <div className="box-form">
                <FormCadastro
                  IsLogin={IsLogin}
                  toastRef={toastRef}
                  RecupecaoSenha={RecupecaoSenha}
                  ShowLogin={ShowLogin}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`overlay-container${IsLogin ? " " : " position-2"}`}
          style={
            !IsLogin
              ? { transform: `translateX(-100%)` }
              : { transform: `translateX(0%)` }
          }
        >
          <div
            className="overlay"
            style={IsLogin ? { transform: `translateX(-50%)` } : {}}
          >
            <div
              className="overlay-1"
              style={!IsLogin ? {} : { transform: `translateX(-100px)` }}
            >
              <div className="p-3 box-info">
                <button
                  className="btn btn-login"
                  type="button"
                  onClick={() => setIsLogin((e) => !e)}
                >
                  <span>Voltar</span>
                </button>
              </div>
            </div>
            <div
              className="overlay-2"
              style={IsLogin ? {} : { transform: `translateX(100px)` }}
            >
              <div className="p-3 box-info">
                <h2>Bem-vindo a</h2>
                <br />
                <h1 className="fs-1">Finance Manager Icarus</h1>
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-5">
                  <div className="d-flex flex-column justify-content-center">
                    <p className="text-center fs-6">
                      Ainda não possui cadastro?
                    </p>
                    <button
                      className="btn btn-login"
                      type="button"
                      onClick={ShowCadastre}
                    >
                      <span>Solicite uma demo</span>
                    </button>
                  </div>
                  <div className="d-flex flex-column justify-content-center">
                    <p className="text-center fs-6">Esqueceu sua senha?</p>
                    <button
                      className="btn btn-login"
                      type="button"
                      onClick={ShowRecuperaSenha}
                    >
                      <span>Recuperação de senha</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
