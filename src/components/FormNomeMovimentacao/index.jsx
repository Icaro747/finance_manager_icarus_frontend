import { useState, useEffect } from "react";

import PropTypes from "prop-types";

import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";

import { useAuth } from "context/AuthContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";

const FormNomeMovimentacao = ({ data, handleChange, disabled = false }) => {
  const Auth = useAuth();
  const Notify = useNotification();
  const Requisicao = new Api(Auth.logout, Notify);

  const [CategoriaSugestoes, setCategoriaSugestoes] = useState([]);
  const [SugestoesFiltradas, setSugestoesFiltradas] = useState([]);

  const GetListaCategoria = async () => {
    try {
      const resposta = await Requisicao.Get({
        endpoint: "/Categoria/My",
        config: Auth.GetHeaders()
      });
      setCategoriaSugestoes(resposta);
    } catch (error) {
      console.error(error);
    }
  };

  // Inicialização e efeitos
  useEffect(() => {
    const Init = async () => {
      await GetListaCategoria();
    };
    Init();
  }, []);

  const FiltrarCategorias = (event) => {
    const query = event.query.toLowerCase();
    const filtradas = CategoriaSugestoes.filter((categoria) =>
      categoria.label.toLowerCase().includes(query)
    );
    setSugestoesFiltradas(filtradas);
  };

  return (
    <>
      <div className="col-12">
        <label htmlFor="nome" className="form-label">
          Nome
        </label>
        <InputText
          id="nome"
          className="w-100"
          value={data.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="col-12">
        <label htmlFor="busca-categoria" className="form-label">
          Categoria
        </label>
        <AutoComplete
          id="busca-categoria"
          className="form-control"
          suggestions={SugestoesFiltradas}
          completeMethod={FiltrarCategorias}
          value={data.categoria}
          field="label"
          onChange={(e) => {
            handleChange("categoria", e.value);
          }}
          disabled={disabled}
        />
      </div>
    </>
  );
};

FormNomeMovimentacao.propTypes = {
  data: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    categoria: PropTypes.string
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default FormNomeMovimentacao;
