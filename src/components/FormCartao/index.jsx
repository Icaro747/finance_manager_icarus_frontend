import React from "react";

import PropTypes from "prop-types";

import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";

const FormCartao = ({ data, handleChange, disabled = false }) => (
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
      <label htmlFor="numero" className="form-label">
        Número do cartão
      </label>
      <InputMask
        id="numero"
        className="w-100"
        mask="9999"
        value={data.numero}
        onChange={(e) => handleChange("numero", e.target.value)}
        disabled={disabled}
      />
    </div>
  </>
);

FormCartao.propTypes = {
  data: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    numero: PropTypes.string
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default FormCartao;
