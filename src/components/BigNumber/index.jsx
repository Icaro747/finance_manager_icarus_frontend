import React from "react";

import PropTypes from "prop-types";

import "./stylede.scss";

const validTypeValores = ["numerico", "monetario"];

// Função utilitária para calcular o width da porcentagem
function getPorcentagemWidth(porcentagem) {
  if (porcentagem < 0) return "0%";
  if (porcentagem > 100) return "100%";
  return `${porcentagem}%`;
}

const BigNumber = ({ data, isCard }) => (
  <div
    className={`big-number ${isCard ? "" : "not-card"}`}
    style={{ backgroundColor: data.cores.background }}
  >
    <div className="box-1">
      <div
        className="box-icon"
        style={{
          backgroundColor: data.cores.background_icone,
          color: data.cores.icone
        }}
      >
        <i className={data.icone} />
      </div>
      <div className="box-text">
        <h2>{data.valor}</h2>
        <h3>{data.nome}</h3>
      </div>
    </div>
    <div className="box-2">
      <div className="box-porcentagem">
        <div
          className="porcentagem"
          style={{
            width: getPorcentagemWidth(data.porcentagem),
            backgroundColor: data.cores.background_icone
          }}
        />
      </div>
      {data.mensagem ? (
        <p>{data.mensagem}</p>
      ) : (
        <p>{data.porcentagem}% por cento concluído.</p>
      )}
    </div>
  </div>
);

BigNumber.propTypes = {
  data: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    valor: PropTypes.number.isRequired,
    typeValor: PropTypes.oneOf(validTypeValores),
    porcentagem: PropTypes.number.isRequired,
    icone: PropTypes.string.isRequired,
    mensagem: PropTypes.string,
    cores: PropTypes.shape({
      icone: PropTypes.string.isRequired,
      background: PropTypes.string.isRequired,
      background_icone: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  isCard: PropTypes.bool
};

BigNumber.defaultProps = {
  isCard: false
};

export default BigNumber;
