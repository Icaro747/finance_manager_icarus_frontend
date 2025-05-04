import React from "react";

import PropTypes from "prop-types";

import "./stylede.scss";
import MaskUtil from "utils/MaskUtil";

const validTypeValores = ["numerico", "monetario"];

const BigNumber = ({ data, isCard }) => {
  const ShowValor = (thisValor) => {
    if (data.typeValor === validTypeValores[0]) {
      return MaskUtil.applyNumero(thisValor);
    }
    if (data.typeValor === validTypeValores[1]) {
      return MaskUtil.applyMonetaryMask(thisValor);
    }
    return thisValor;
  };

  return (
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
          <h2>{ShowValor(data.valor)}</h2>
          <h3>{data.nome}</h3>
        </div>
      </div>
      <div className="box-2">
        <div className="box-porcentagem">
          <div
            className="porcentagem"
            style={{
              width: `${data.porcentagem}%`,
              backgroundColor: data.cores.background_icone
            }}
          />
        </div>
        <p>{data.porcentagem}% por cento concluído.</p>
      </div>
    </div>
  );
};

BigNumber.propTypes = {
  data: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    valor: PropTypes.number.isRequired,
    typeValor: PropTypes.oneOf(validTypeValores),
    porcentagem: PropTypes.number.isRequired,
    icone: PropTypes.string.isRequired,
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
