/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable react/forbid-prop-types */
import { useState, useEffect, useCallback } from "react";

import PropTypes from "prop-types";

import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";

import Api from "utils/Api";
import MaskUtil from "utils/MaskUtil";

const FormCadastro = ({ IsLogin, RecupecaoSenha, toastRef, ShowLogin }) => {
  const Requicicao = new Api();

  const [Visible, setVisible] = useState(false);

  const [Ingredients, setIngredients] = useState([]);

  const [OptsTipoEmpresas, setOptsTipoEmpresas] = useState([]);
  const [SelectedTipoEmpresas, setSelectedTipoEmpresas] = useState();

  const [OptsTiposPessouas, setOptsTiposPessouas] = useState([]);
  const [SelectedTiposPessouas, setSelectedTiposPessouas] = useState(null);

  const [Documento, setDocumento] = useState("");

  const [Loading, setLoading] = useState(false);

  const [DataTermosPoliticas, setDataTermosPoliticas] = useState({});

  const [TipoModal, setTipoModal] = useState("");
  const [TitoloModal, setTitoloModal] = useState("");
  const [MessageModal, setMessageModal] = useState("");

  const [Etapa, setEtapa] = useState(1);

  const [Nome, setNome] = useState("");
  const [Email, setEmail] = useState("");
  const [Celular, setCelular] = useState("");
  const [NomeEmpreas, setNomeEmpreas] = useState("");
  const [IsNextStepEnabled, setIsNextStepEnabled] = useState(false);
  const [Senha, setSenha] = useState("");
  const [ConfirmeSenha, setConfirmeSenha] = useState("");

  const ShowModalConcorda = (tipo) => {
    try {
      if (tipo === "termos-condicoes" || tipo === "politica-privacidade") {
        if (tipo === "termos-condicoes") {
          setTitoloModal("Termos de Condições");
          setMessageModal(DataTermosPoliticas.termos_uso);
        } else if (tipo === "politica-privacidade") {
          setTitoloModal("Política de Privacidade");
          setMessageModal(DataTermosPoliticas.politica_privacidade);
        }
        setVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const OnIngredientsChange = (e) => {
    try {
      const thisIngredients = [...Ingredients];

      if (e.checked) thisIngredients.push(e.value);
      else if (thisIngredients.includes(TipoModal)) {
        thisIngredients.splice(thisIngredients.indexOf(e.value), 1);
      }

      setIngredients(thisIngredients);
    } catch (error) {
      console.error(error);
    }
  };

  const OnChangeTcOrPp = (e) => {
    setTipoModal(e.value);
    if (e.checked === false) {
      OnIngredientsChange(e);
    } else {
      ShowModalConcorda(e.value);
    }
  };

  const ArraysAreEqual = (list, item1, item2) =>
    list.includes(item1) && list.includes(item2);

  /**
   * Valida os dados do formulário de cadastro.
   *
   * @param {Object} data - Os dados do formulário a serem validados.
   * @param {string} data.nome - O nome do usuário.
   * @param {string} data.email - O e-mail do usuário.
   * @param {string} data.identificador - O CNPJ do usuário.
   * @param {string} data.senha - A senha do usuário.
   * @param {string} data.confirmeSenha - A confirmação da senha do usuário.
   * @param {boolean} data.politicaPrivacidade - Indica se a política de privacidade foi aceita.
   * @param {boolean} data.termosCondicoes - Indica se os termos e condições foram aceitos.
   *
   * @returns {Object} - Objeto contendo o resultado da validação.
   * @returns {boolean} retorno.valor - Indica se a validação foi bem-sucedida.
   * @returns {string} retorno.message - Mensagem descritiva do resultado da validação.
   *
   * @example
   * const data = {
   *   nome: "João",
   *   email: "joao@example.com",
   *   senha: "senha123",
   *   confirmeSenha: "senha123",
   *   politicaPrivacidade: true,
   *   termosCondicoes: true
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

      // Verificar se os termos e condições foram aceitos
      if (!data.politicaPrivacidade || !data.termosCondicoes) {
        return {
          valor: false,
          message:
            "Você deve aceitar a política de privacidade e os termos e condições."
        };
      }

      return { valor: true, message: "formulário válido" };
    } catch (error) {
      console.error(error);
      return { valor: false, message: "ERRO" };
    }
  };

  const SubmitCadastro = async (event) => {
    event.preventDefault();
    if (Etapa === 3)
      try {
        setLoading(true);
        const formData = new FormData(event.target);
        const data = {
          nome: formData.get("nome"),
          email: formData.get("email"),
          celular: formData.get("celular"),
          nomeEmpresa: formData.get("nomeEmpresa"),
          documento: formData.get("documento"),
          senha: formData.get("senha"),
          confirmeSenha: formData.get("confirmesenha"),
          politicaPrivacidade: Ingredients.includes("politica-privacidade"),
          termosCondicoes: Ingredients.includes("termos-condicoes"),
          feedback: formData.get("feedback")
        };

        const resultado = ValidaFormulario(data);

        if (resultado.valor === true) {
          await Requicicao.Post({
            endpoint: "/Auth/register",
            data: {
              username: data.nome,
              email: data.email,
              celular: data.celular,
              tipoPessoua: SelectedTiposPessouas,
              nomeEmpresa: data.nomeEmpresa,
              documentoIdentificacao: data.documento,
              password: data.senha,
              tipoSegmentoEmpresa: SelectedTipoEmpresas.value,
              politica_privacidade: data.politicaPrivacidade,
              termos_uso: data.termosCondicoes,
              feedback: data.feedback
            }
          });
          setEtapa((e) => e + 1);
          // navigate("/app");
          // auth.login(resposta);
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

  const GetTiposEmpresas = async () => {
    try {
      const resposta = await Requicicao.Get({
        endpoint: "/Auth/tipo-segmento-empresa"
      });
      setOptsTipoEmpresas(
        resposta.map((item) => ({
          label: item.tipoSegmentoEmpresa,
          value: item.valorEnemEquivalente
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const GetTiposPessouas = async () => {
    try {
      const resposta = await Requicicao.Get({
        endpoint: "/Auth/tipo-pessoua"
      });
      setOptsTiposPessouas(
        resposta.map((item) => ({
          label: item.tipoPessouaNome,
          value: item.tipoPessouaValor
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const GetTermosPolitica = async () => {
    try {
      setLoading(true);
      const data = await Requicicao.Get({
        endpoint: "/ConfiguracoesSistema/TermosPolitica"
      });
      setDataTermosPoliticas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      if (
        !ArraysAreEqual(
          Ingredients,
          "politica-privacidade",
          "termos-condicoes"
        ) ||
        Documento === "" ||
        Senha === "" ||
        ConfirmeSenha === "" ||
        SelectedTipoEmpresas == null
      )
        return true;
    }
    return false;
  };

  useEffect(() => {
    const ValidaStatsCadastro = () => {
      if (IsLogin === false && RecupecaoSenha === false) return true;
      return false;
    };

    const Go = async () => {
      if (ValidaStatsCadastro()) {
        await GetTiposEmpresas();
        await GetTiposPessouas();
        await GetTermosPolitica();
      }
    };

    Go();
  }, [IsLogin]);

  const FooterContent = useCallback(
    () => (
      <div>
        <Button
          type="button"
          label="Não"
          icon="pi pi-times"
          className="p-button-text"
          onClick={() => {
            OnIngredientsChange({ checked: false, value: TipoModal });
            setVisible(false);
          }}
        />
        <Button
          type="button"
          label="Sim"
          icon="pi pi-check"
          onClick={() => {
            OnIngredientsChange({ checked: true, value: TipoModal });
            setVisible(false);
          }}
        />
      </div>
    ),
    [TipoModal]
  );

  useEffect(() => {
    let valor = false;

    if (Nome === "") {
      valor = true;
    }
    if (Email === "") {
      valor = true;
    }
    if (Celular === "") {
      valor = true;
    }
    if (SelectedTiposPessouas === null) {
      valor = true;
    } else if (SelectedTiposPessouas === 1 && NomeEmpreas === "") {
      valor = true;
    }

    setIsNextStepEnabled(valor);
  }, [Nome, Email, Celular, SelectedTiposPessouas, NomeEmpreas]);

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
          <div>
            <label htmlFor="celular" className="form-label">
              Celular
            </label>
            <IconField left>
              <InputIcon className="pi pi-phone" />
              <InputMask
                id="celular"
                name="celular"
                mask="(99) 99999-9999"
                value={Celular}
                onChange={(e) => setCelular(e.target.value)}
              />
            </IconField>
          </div>
          <div>
            <label htmlFor="tiposPessoua" className="form-label">
              Tipos Pessoua
            </label>
            <Dropdown
              id="tiposPessoua"
              name="tiposPessoua"
              className="w-100"
              placeholder="Selecione um tipo de pessoa"
              options={OptsTiposPessouas}
              value={SelectedTiposPessouas}
              onChange={(e) => setSelectedTiposPessouas(e.value)}
            />
          </div>
          {SelectedTiposPessouas === 1 && (
            <div>
              <label htmlFor="nomeEmpresa" className="form-label">
                Nome Empresa*
              </label>
              <IconField left>
                <InputIcon className="pi pi-building" />
                <InputText
                  id="nomeEmpresa"
                  name="nomeEmpresa"
                  value={NomeEmpreas}
                  onChange={(e) => setNomeEmpreas(e.target.value)}
                />
              </IconField>
            </div>
          )}
        </div>
        <div className={`etapa-2 ${ItemShow(2)}`}>
          <div>
            <label htmlFor="documento" className="form-label">
              {SelectedTiposPessouas === 1 ? "CNPJ" : "CPF"}*
            </label>
            <IconField left>
              <InputIcon className="pi pi-id-card" />
              <InputText
                id="documento"
                name="documento"
                value={Documento}
                onChange={(e) => {
                  setDocumento(MaskUtil.applyCpfCnpjMask(e.target.value));
                }}
              />
            </IconField>
          </div>
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
          <div>
            <label htmlFor="tipoEmpresas" className="form-label">
              Tipo da Empresas*
            </label>
            <Dropdown
              id="tipoEmpresas"
              name="tipoEmpresas"
              className="w-100"
              placeholder="Selecione um tipo de empresa"
              options={OptsTipoEmpresas}
              value={SelectedTipoEmpresas}
              onChange={(e) => setSelectedTipoEmpresas(e.value)}
            />
          </div>
          <div className="mb-3">
            <Dialog
              header={TitoloModal}
              visible={Visible}
              style={{ width: "50vw" }}
              onHide={() => setVisible(false)}
              footer={FooterContent()}
            >
              <p>{MessageModal}</p>
            </Dialog>
            <p className="fs-6">Você concorda com?</p>
            <div className="d-flex flex-row gap-3">
              <div className="d-flex align-items-center">
                <Checkbox
                  inputId="politica-privacidade"
                  name="politica-privacidade"
                  value="politica-privacidade"
                  onChange={OnChangeTcOrPp}
                  checked={Ingredients.includes("politica-privacidade")}
                />
                <label htmlFor="politica-privacidade" className="ms-2">
                  Política de Privacidade
                </label>
              </div>
              <div className="d-flex align-items-center">
                <Checkbox
                  inputId="termos-condicoes"
                  name="termos-condicoes"
                  value="termos-condicoes"
                  onChange={OnChangeTcOrPp}
                  checked={Ingredients.includes("termos-condicoes")}
                />
                <label htmlFor="termos-condicoes" className="ms-2">
                  Termos de Condições
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className={`etapa-3 ${ItemShow(3)}`}>
          <div>
            <label htmlFor="feedback" className="form-label">
              Descreva sua dúvida ou necessidade para que equipe possas ajudar
              melhor.
            </label>
            <InputTextarea id="feedback" name="feedback" rows={8} />
          </div>
        </div>
        <div className={`etapa-4 ${ItemShow(4)}`}>
          <div className="">
            <p className="fs-5 text-center">
              Obrigado por entrar em contato conosco!
              <br />
              <br />
              Estamos felizes em poder ajudá-lo.
              <br />
              <br />
              Sue cadastro será analisada por nossa equipe, e retornaremos em
              breve.
            </p>
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
            // disabled={Etapa >= 3}
          />
          <Button
            id="cadastar"
            label={Etapa < 3 ? "Continunar" : "Cadastro"}
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
  RecupecaoSenha: PropTypes.bool.isRequired,
  toastRef: PropTypes.object.isRequired,
  ShowLogin: PropTypes.func.isRequired
};

export default FormCadastro;
