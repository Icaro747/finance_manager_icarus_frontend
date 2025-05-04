import React from "react";

import classNames from "classnames";
import PropTypes from "prop-types";

import { Button } from "primereact/button";

// Função auxiliar para obter estilo de largura
const GetStyleWidth = (percent) => {
  if (percent != null)
    return {
      flexBasis: `${percent}%`,
      width: `${percent}%`,
      minWidth: "min-content"
    };
  return {
    flex: "1"
  };
};

// BtnsCard component
const BtnsCard = ({ onEditar, onExcluir, notShowExcluir = false }) => (
  <div className="d-flex flex-row">
    <Button
      icon="ak ak-edit"
      text
      severity="secondary"
      className="btn-card"
      onClick={onEditar}
    />
    {!notShowExcluir && (
      <Button
        icon="ak ak-trash"
        text
        severity="secondary"
        className="btn-card"
        onClick={onExcluir}
      />
    )}
  </div>
);

// Componente para renderizar parâmetros dentro de uma caixa
const RenderParametrosInsideBox = ({
  parametrosInsideBox,
  LayoutLista,
  parametrosInsideBoxWidth
}) => {
  if (parametrosInsideBox.length === 0) return null;

  return (
    <div
      className="fs-6 card p-3 pt-2 pb-2 d-flex flex-column gap-2 not-shadow bg-cor-cinza-2"
      style={LayoutLista ? GetStyleWidth(parametrosInsideBoxWidth) : {}}
    >
      {parametrosInsideBox.map(({ label, valor }) => (
        <div
          key={label + valor}
          className="d-flex justify-content-between gap-1"
        >
          <p className="m-0 text-lignt">{label}</p>
          <b className="text-end">{valor}</b>
        </div>
      ))}
    </div>
  );
};

// Componente para renderizar parâmetros normais
const RenderParametros = ({
  parametros,
  parametrosClass,
  LayoutLista,
  parametrosWidth
}) => {
  if (parametros.length === 0) return null;

  return (
    <div
      className={classNames(parametrosClass, {
        "d-flex flex-md-row flex-column gap-3": LayoutLista
      })}
      style={LayoutLista ? GetStyleWidth(parametrosWidth) : {}}
    >
      {parametros.map(({ label, valor }) => (
        <div
          key={label + valor}
          className={classNames(
            "d-flex",
            {
              "flex-column gap-1": LayoutLista
            },
            {
              "flex-row justify-content-between gap-3": !LayoutLista
            }
          )}
        >
          <label className="fs-6 text-cor-1">{label}</label>
          <p className="fs-6 m-0 text-cor-2">{valor}</p>
        </div>
      ))}
    </div>
  );
};

// Componente para renderizar o botão de detalhes
const RenderDetalhesButton = ({
  onDetalhes,
  labelDetalhes,
  iconDetalhes,
  iconPosDetalhes,
  LayoutLista,
  detalhesWidth,
  addBtn
}) => (
  <div
    className="d-flex align-items-center gap-3"
    style={LayoutLista ? GetStyleWidth(detalhesWidth) : {}}
  >
    <button
      type="button"
      className="btn btn-info w-100 btn-azul"
      onClick={onDetalhes}
    >
      {iconPosDetalhes === "left" && iconDetalhes && (
        <i className={`me-2 ${iconDetalhes}`} />
      )}
      <span className="text-truncate" style={{ flex: 1 }}>
        {labelDetalhes}
      </span>
      {iconPosDetalhes === "right" && iconDetalhes && (
        <i className={`ms-2 ${iconDetalhes}`} />
      )}
    </button>
    {addBtn != null && addBtn}
  </div>
);

// Componente para renderizar o cabeçalho e botões
const RenderHeader = ({
  HeaderComponent,
  LayoutLista,
  headerWidth,
  onEditar,
  onExcluir,
  notShowExcluir
}) => (
  <div style={LayoutLista ? GetStyleWidth(headerWidth) : {}}>
    <div className="d-flex flex-row flex-wrap justify-content-between gap-3">
      {HeaderComponent}
      {!LayoutLista && (
        <BtnsCard
          onEditar={onEditar}
          onExcluir={onExcluir}
          notShowExcluir={notShowExcluir}
        />
      )}
    </div>
  </div>
);

// Card component
const Card = ({
  borderColor = null,
  parametrosClass = null,
  parametros = [],
  parametrosInsideBox = [],
  LayoutLista,
  HeaderComponent = <div />,
  addBtn,
  onEditar = () => {},
  notShowExcluir = false,
  onExcluir = () => {},
  onDetalhes = () => {},
  labelDetalhes = "Ver detalhes",
  iconDetalhes = null,
  iconPosDetalhes = "left",
  headerWidth = null,
  btnsCardWidth = null,
  parametrosInsideBoxWidth = null,
  parametrosWidth = null,
  detalhesWidth = null
}) => (
  <div className={!LayoutLista ? "col-md-12 col-lg-6 col-xl-4" : "col-12"}>
    <div
      className={classNames("card p-3", {
        "border-top": !LayoutLista && borderColor,
        "border-left": LayoutLista && borderColor,
        [borderColor]: borderColor
      })}
    >
      <div
        className={classNames(
          "d-flex gap-3",
          {
            "flex-column": !LayoutLista
          },
          {
            "flex-md-row flex-column flex-wrap justify-content-between":
              LayoutLista
          }
        )}
      >
        <RenderHeader
          HeaderComponent={HeaderComponent}
          LayoutLista={LayoutLista}
          headerWidth={headerWidth}
          onEditar={onEditar}
          onExcluir={onExcluir}
          notShowExcluir={notShowExcluir}
        />

        <RenderParametrosInsideBox
          parametrosInsideBox={parametrosInsideBox}
          LayoutLista={LayoutLista}
          parametrosInsideBoxWidth={parametrosInsideBoxWidth}
        />

        <RenderParametros
          parametros={parametros}
          parametrosClass={parametrosClass}
          LayoutLista={LayoutLista}
          parametrosWidth={parametrosWidth}
        />

        {!LayoutLista && <hr className="m-0" />}

        <RenderDetalhesButton
          onDetalhes={onDetalhes}
          labelDetalhes={labelDetalhes}
          iconDetalhes={iconDetalhes}
          iconPosDetalhes={iconPosDetalhes}
          LayoutLista={LayoutLista}
          detalhesWidth={detalhesWidth}
          addBtn={addBtn}
        />

        {LayoutLista && (
          <div
            className="d-flex flex-row-reverse"
            style={GetStyleWidth(btnsCardWidth)}
          >
            <BtnsCard
              onEditar={onEditar}
              onExcluir={onExcluir}
              notShowExcluir={notShowExcluir}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

// BoxCards component
const BoxCards = ({
  className = "",
  mensagemVazia = "Nenhum encontrado",
  children,
  itens
}) => {
  if (itens <= 0) {
    return <p className="m-0 fs-5 text-center">{mensagemVazia}</p>;
  }

  return <div className={`row g-4 ${className}`}>{children}</div>;
};

// BtnsLayout component
const BtnsLayout = ({ setLayoutLista, LayoutLista }) => (
  <div className="d-flex flex-row flex-wrap gap-2">
    <Button
      className={classNames("btn-quadro", { active: !LayoutLista })}
      label="Card"
      icon="ak ak-grid-four-fill"
      onClick={() => setLayoutLista(false)}
    />
    <Button
      className={classNames("btn-quadro", { active: LayoutLista })}
      label="Lista"
      icon="ak ak-rows-fill"
      onClick={() => setLayoutLista(true)}
    />
  </div>
);

RenderParametrosInsideBox.propTypes = {
  parametrosInsideBox: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  LayoutLista: PropTypes.bool,
  parametrosInsideBoxWidth: PropTypes.number
};

RenderParametros.propTypes = {
  parametros: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  parametrosClass: PropTypes.string,
  LayoutLista: PropTypes.bool,
  parametrosWidth: PropTypes.number
};

RenderDetalhesButton.propTypes = {
  onDetalhes: PropTypes.func,
  labelDetalhes: PropTypes.string,
  iconDetalhes: PropTypes.string,
  iconPosDetalhes: PropTypes.string,
  LayoutLista: PropTypes.bool,
  detalhesWidth: PropTypes.number,
  addBtn: PropTypes.node
};

RenderHeader.propTypes = {
  HeaderComponent: PropTypes.node,
  LayoutLista: PropTypes.bool,
  headerWidth: PropTypes.number,
  onEditar: PropTypes.func,
  onExcluir: PropTypes.func,
  notShowExcluir: PropTypes.bool
};

Card.propTypes = {
  parametrosInsideBox: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  parametrosClass: PropTypes.string,
  parametros: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  LayoutLista: PropTypes.bool,
  HeaderComponent: PropTypes.node,
  addBtn: PropTypes.node,
  onEditar: PropTypes.func,
  onExcluir: PropTypes.func,
  notShowExcluir: PropTypes.bool,
  onDetalhes: PropTypes.func,
  labelDetalhes: PropTypes.string,
  iconDetalhes: PropTypes.string,
  iconPosDetalhes: PropTypes.string,
  borderColor: PropTypes.string,
  headerWidth: PropTypes.number,
  btnsCardWidth: PropTypes.number,
  parametrosInsideBoxWidth: PropTypes.number,
  parametrosWidth: PropTypes.number,
  detalhesWidth: PropTypes.number
};

BoxCards.propTypes = {
  className: PropTypes.string,
  mensagemVazia: PropTypes.string,
  children: PropTypes.node.isRequired,
  itens: PropTypes.number
};

BtnsCard.propTypes = {
  onEditar: PropTypes.func.isRequired,
  onExcluir: PropTypes.func.isRequired,
  notShowExcluir: PropTypes.bool
};

BtnsLayout.propTypes = {
  setLayoutLista: PropTypes.func.isRequired,
  LayoutLista: PropTypes.bool.isRequired
};

export { Card, BoxCards, BtnsLayout };
