/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable react/forbid-prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

import { useAuth } from "context/AuthContext";

import Api from "utils/Api";

const FormCadastro = ({ IsLogin, toastRef }) => {
  const Requicicao = new Api();
  const navigate = useNavigate();
  const auth = useAuth();
  const [Loading, setLoading] = useState(false);

  const [Etapa, setEtapa] = useState(1);

  const [Nome, setNome] = useState("");
  const [Email, setEmail] = useState("");
  const [IsNextStepEnabled, setIsNextStepEnabled] = useState(false);
  const [Senha, setSenha] = useState("");
  const [ConfirmeSenha, setConfirmeSenha] = useState("");

  /**
   * Valida os dados do formulário de cadastro.
   *
   * @param {Object} data - Os dados do formulário a serem validados.
   * @param {string} data.nome - O nome do usuário.
   * @param {string} data.email - O e-mail do usuário.
   * @param {string} data.senha - A senha do usuário.
   * @returns {Object} - Objeto contendo o resultado da validação.
   * @returns {boolean} retorno.valor - Indica se a validação foi bem-sucedida.
   * @returns {string} retorno.message - Mensagem descritiva do resultado da validação.
   *
   * @example
   * const data = {
   *   nome: "João",
   *   email: "joao@example.com",
   *   senha: "senha123",
   * };
   * const resultado = ValidaFormulario(data);
   * console.log(resultado.valor); // true
   * console.log(resultado.message); // "formulário válido"
   */
  const ValidaFormulario = (data) => {
    try {
      const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
      };

      // Verificar se o email é válido
      if (!validateEmail(data.email)) {
        return { valor: false, message: "Por favor, insira um e-mail válido." };
      }

      // Verificar se as senhas são compatíveis
      if (data.senha !== data.confirmeSenha) {
        return { valor: false, message: "As senhas não são compatíveis." };
      }

      return { valor: true, message: "formulário válido" };
    } catch (error) {
      console.error(error);
      return { valor: false, message: "ERRO" };
    }
  };

  const SubmitCadastro = async (event) => {
    event.preventDefault();
    if (Etapa === 2)
      try {
        setLoading(true);
        const formData = new FormData(event.target);
        const data = {
          nome: formData.get("nome"),
          email: formData.get("email"),
          celular: formData.get("celular"),
          senha: formData.get("senha"),
          confirmeSenha: formData.get("confirmesenha")
        };

        const resultado = ValidaFormulario(data);

        if (resultado.valor === true) {
          const resposta = await Requicicao.Post({
            endpoint: "/Auth/login",
            data: {
              username: data.nome,
              email: data.email,
              password: data.senha
            }
          });
          navigate("/app");
          auth.login(resposta);
        } else {
          toastRef.current.show({
            severity: "error",
            summary: "error",
            detail: resultado.message,
            life: 5000
          });
        }
      } catch (error) {
        console.error(error);
        if (error.response?.data != null) {
          toastRef.current.show({
            severity: "error",
            summary: "error",
            detail: error.response.data,
            life: 5000
          });
        }
      } finally {
        setLoading(false);
      }
    else setEtapa((e) => e + 1);
  };

  const ItemShow = (pocicao) => {
    if (Etapa === pocicao) return "show";
    if (Etapa >= pocicao + 1) return "fim-cadstro";
    return "";
  };

  const ShowBtn = (pocicao) => {
    if (Etapa > 1 && Etapa !== pocicao) return "show";
    if (Etapa === pocicao) return "fim-cadstro";
    return "";
  };

  const ValidaProcimaEtapa = (pociaco) => {
    if (pociaco === 2) {
      if (Senha === "" || ConfirmeSenha === "") return true;
    }
    return false;
  };

  useEffect(() => {
    let valor = false;

    if (Nome === "") {
      valor = true;
    }
    if (Email === "") {
      valor = true;
    }

    setIsNextStepEnabled(valor);
  }, [Nome, Email]);

  return (
    <form
      onSubmit={SubmitCadastro}
      className={`form-login cadastro ${IsLogin ? "menos-50" : "zero"}`}
    >
      <h2>Criar uma conta</h2>
      <div className="box-etapas">
        <div className={`etapa-1 ${Etapa === 1 ? "show" : ""}`}>
          <div>
            <label htmlFor="nome" className="form-label">
              Nome*
            </label>
            <IconField left>
              <InputIcon className="pi pi-user" />
              <InputText
                id="nome"
                name="nome"
                value={Nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </IconField>
          </div>
          <div>
            <label htmlFor="email-cadastro" className="form-label">
              Email*
            </label>
            <IconField left>
              <InputIcon className="pi pi-envelope" />
              <InputText
                id="email-cadastro"
                name="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </IconField>
          </div>
        </div>
        <div className={`etapa-2 ${ItemShow(2)}`}>
          <div>
            <label htmlFor="senha" className="form-label">
              Senha*
            </label>
            <Password
              id="senha"
              name="senha"
              toggleMask
              promptLabel="Escolha uma senha"
              weakLabel="Muito simples"
              mediumLabel="Complexidade média"
              strongLabel="Senha complexa"
              onChange={(e) => setSenha(e.target.value)}
              value={Senha}
            />
          </div>
          <div>
            <label htmlFor="confirmesenha" className="form-label">
              Confirme à Senha*
            </label>
            <Password
              id="confirmesenha"
              name="confirmesenha"
              toggleMask
              promptLabel="Escolha uma senha"
              weakLabel="Muito simples"
              mediumLabel="Complexidade média"
              strongLabel="Senha complexa"
              onChange={(e) => setConfirmeSenha(e.target.value)}
              value={ConfirmeSenha}
            />
          </div>
        </div>
      </div>
      <div className="boxs-btns">
        <div className="box-btn">
          <Button
            id="procima-etapa"
            label="Continunar"
            type="button"
            className={Etapa === 4 ? "not-show" : ""}
            onClick={() => setEtapa((e) => e + 1)}
            disabled={IsNextStepEnabled || Etapa === 4}
          />
        </div>
        <div className={`box-btns ${ShowBtn(4)}`}>
          <Button
            id="voltar-etapa"
            label="Voltar"
            type="button"
            className="btn"
            onClick={() => setEtapa((e) => e - 1)}
          />
          <Button
            id="cadastar"
            label="Cadastro"
            type="submit"
            className="submit"
            loading={Loading}
            disabled={ValidaProcimaEtapa(Etapa)}
          />
        </div>
      </div>
    </form>
  );
};

FormCadastro.propTypes = {
  IsLogin: PropTypes.bool.isRequired,
  toastRef: PropTypes.object.isRequired
};

export default FormCadastro;
