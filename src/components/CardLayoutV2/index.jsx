/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from "react";

import classNames from "classnames";
import PropTypes from "prop-types";

import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";

import "./style.scss";

// BtnsCard component
const BtnsCard = ({
  onEditar,
  onExcluir,
  notShowExcluir = false,
  onFlip = () => {},
  showFlipButton
}) => (
  <div className="d-flex flex-row justify-content-between">
    {showFlipButton && (
      <Button
        icon="pi pi-eye"
        text
        severity="secondary"
        className="btn-card btn-flip"
        onClick={onFlip}
      />
    )}
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
const RenderInfoBack = ({ infoBack }) => {
  if (infoBack.length === 0) return null;

  return (
    <div className="d-flex flex-column gap-2">
      {infoBack.map(({ label, valor }) => (
        <div
          key={label + valor}
          className="info-back d-flex gap-1 flex-row justify-content-between"
        >
          <label className="m-0">{label}</label>
          <p>{valor}</p>
        </div>
      ))}
    </div>
  );
};

// Componente para renderizar parâmetros normais
const RenderInfoFrente = ({ infoFrente, infoFrenteClass }) => {
  if (infoFrente.length === 0) return null;

  return (
    <div
      className={classNames(
        "card-parametros d-flex flex-column gap-2",
        infoFrenteClass
      )}
    >
      {infoFrente.map(({ label, valor, className }) => (
        <div
          key={label + valor}
          className={classNames(
            `item-parametro d-flex flex-row justify-content-between gap-3 ${className ? ` ${className}` : ""}`
          )}
        >
          <label className={className}>{label}</label>
          <p className={className}>{valor}</p>
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
  addBtn = null
}) => (
  <footer className="d-flex align-items-center gap-3">
    <button type="button" className="btn btn-azul w-100" onClick={onDetalhes}>
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
  </footer>
);

// Componente para renderizar o cabeçalho e botões
const RenderHeader = ({
  avatar,
  onEditar,
  onExcluir,
  notShowExcluir,
  onFlip,
  showFlipButton,
  papel,
  titulo,
  subtitulo
}) => (
  <header className="header-card d-flex flex-row gap-3">
    <div className="d-flex align-items-center">{avatar}</div>
    <div className="d-flex flex-column w-100">
      <div className="d-flex justify-content-between align-items-center">
        <small className="papel">{papel}</small>
        <BtnsCard
          onEditar={onEditar}
          onExcluir={onExcluir}
          notShowExcluir={notShowExcluir}
          onFlip={onFlip}
          showFlipButton={showFlipButton}
        />
      </div>
      <div className="d-flex flex-column align-items-start">
        <h3 className="titulo">{titulo}</h3>
        <p className="subtitulo m-0">{subtitulo}</p>
      </div>
    </div>
  </header>
);

// Card component
const Card = ({
  borderColor = null,
  infoFrenteClass = null,
  infoFrente = [],
  infoBack = [],
  addBtn,
  onEditar = () => {},
  notShowExcluir = false,
  onExcluir = () => {},
  onDetalhes = () => {},
  labelDetalhes = "Ver detalhes",
  iconDetalhes = null,
  iconPosDetalhes = "left",
  enableFlip = false,
  minHeight = "340px",
  papel = "papel",
  titulo = "titulo",
  subtitulo = "subtitulo",
  avatar = <div />
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (enableFlip && infoBack.length > 0) {
      setIsFlipped(!isFlipped);
    }
  };

  const showFlipButton = enableFlip && infoBack.length > 0;

  return (
    <section className="col-md-6 col-lg-4 col-xl-3 col-xxl-20">
      <div
        className={classNames("card-flip-container", {
          flipped: isFlipped
        })}
        style={{ minHeight }}
      >
        <div className="card-flip-inner">
          {/* Frente do Card */}
          <article
            className={classNames("card-flip-front", {
              "border-top": borderColor,
              [borderColor]: borderColor
            })}
          >
            <div>
              <RenderHeader
                avatar={avatar}
                onEditar={onEditar}
                onExcluir={onExcluir}
                notShowExcluir={notShowExcluir}
                onFlip={handleFlip}
                isFlipped={isFlipped}
                showFlipButton={showFlipButton}
                papel={papel}
                titulo={titulo}
                subtitulo={subtitulo}
              />
              {infoFrente.length > 0 && (
                <section>
                  <hr />
                  <div className="flex-grow-1">
                    <RenderInfoFrente
                      infoFrente={infoFrente}
                      infoFrenteClass={infoFrenteClass}
                    />
                  </div>
                </section>
              )}
            </div>
            <div>
              <hr />
              <RenderDetalhesButton
                onDetalhes={onDetalhes}
                labelDetalhes={labelDetalhes}
                iconDetalhes={iconDetalhes}
                iconPosDetalhes={iconPosDetalhes}
                addBtn={addBtn}
              />
            </div>
          </article>

          {/* Verso do Card */}
          {showFlipButton && (
            <article className="card-flip-back">
              <div className="d-flex flex-column h-100">
                <RenderHeader
                  avatar={avatar}
                  onEditar={onEditar}
                  onExcluir={onExcluir}
                  notShowExcluir={notShowExcluir}
                  onFlip={handleFlip}
                  isFlipped={isFlipped}
                  showFlipButton={showFlipButton}
                  papel={papel}
                  titulo={titulo}
                  subtitulo={subtitulo}
                />
                {infoBack.length > 0 && (
                  <>
                    <hr style={{ color: "#fff" }} />
                    <div className="flex-grow-1">
                      <RenderInfoBack infoBack={infoBack} />
                    </div>
                  </>
                )}
                <hr style={{ color: "#fff" }} />
                <RenderDetalhesButton
                  onDetalhes={onDetalhes}
                  labelDetalhes={labelDetalhes}
                  iconDetalhes={iconDetalhes}
                  iconPosDetalhes={iconPosDetalhes}
                  addBtn={addBtn}
                />
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

// BoxCards component
const BoxCards = ({
  className = "",
  mensagemVazia = "Nenhum encontrado",
  itens,
  itemsPorPagina = 5,
  mostrarPaginacao = true,
  mostrarTotalItens = true,
  mostrarSeletorItens = true,
  opcoesItensPorPagina = [5, 10, 15, 20],
  paginaAtual = 1,
  onMudancaPagina = undefined,
  onMudancaItensPorPagina = undefined,
  renderItem,
  getEntityId,
  layoutLista = false
}) => {
  const [paginaInterna, setPaginaInterna] = useState(paginaAtual);
  const [itensPorPaginaInterna, setItensPorPaginaInterna] =
    useState(itemsPorPagina);

  // Calcula o total de páginas
  const totalPaginas = Math.ceil(itens.length / itensPorPaginaInterna);

  // Calcula os índices para slicing dos itens
  const indiceInicio = (paginaInterna - 1) * itensPorPaginaInterna;
  const indiceFim = indiceInicio + itensPorPaginaInterna;

  // Atualiza página interna quando prop externa muda
  useEffect(() => {
    setPaginaInterna(paginaAtual);
  }, [paginaAtual]);

  // Atualiza itens por página quando prop externa muda
  useEffect(() => {
    setItensPorPaginaInterna(itemsPorPagina);
  }, [itemsPorPagina]);

  // Aplica paginação nos itens
  const itensPaginados = itens.slice(indiceInicio, indiceFim);

  // Função para mudar página
  const HandleMudancaPagina = (novaPagina) => {
    setPaginaInterna(novaPagina);
    if (onMudancaPagina) {
      onMudancaPagina(novaPagina);
    }
  };

  // Função para mudar itens por página
  const HandleMudancaItensPorPagina = (novosItens) => {
    setItensPorPaginaInterna(novosItens);
    setPaginaInterna(1); // Reset para primeira página
    if (onMudancaItensPorPagina) {
      onMudancaItensPorPagina(novosItens);
    }
    if (onMudancaPagina) {
      onMudancaPagina(1);
    }
  };

  // Gera array de páginas para navegação
  const GerarPaginas = () => {
    const paginas = [];
    const maxPaginasVisiveis = 5;

    if (totalPaginas <= maxPaginasVisiveis) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      let inicio = Math.max(1, paginaInterna - 2);
      let fim = Math.min(totalPaginas, paginaInterna + 2);

      if (paginaInterna <= 3) {
        fim = maxPaginasVisiveis;
      }

      if (paginaInterna >= totalPaginas - 2) {
        inicio = totalPaginas - maxPaginasVisiveis + 1;
      }

      for (let i = inicio; i <= fim; i++) {
        paginas.push(i);
      }
    }

    return paginas;
  };

  const ReorganizarLista = (lista) => {
    try {
      return lista.map((item) => {
        const novosCampos = item.infoFrente?.reduce((acc, cur) => {
          acc[cur.label] = cur.valor;
          return acc;
        }, {});

        // Retorna um novo objeto combinando os campos originais com os novos campos
        const { infoFrente, ...resto } = item;
        return { ...resto, ...novosCampos };
      });
    } catch (error) {
      console.error(`Erro Reorganizar Lista: ${error}`);
      return [];
    }
  };

  const ObterLabelsUnicos = (lista) => {
    try {
      const labelsSet = new Set();

      lista.forEach((item) => {
        item.infoFrente?.forEach((param) => {
          labelsSet.add(param.label);
        });
      });

      return Array.from(labelsSet);
    } catch (error) {
      console.error(`Erro busca cabesario: ${error}`);
      return [];
    }
  };

  // Se não há itens, mostra mensagem vazia
  if (!itens || itens.length === 0) {
    return <p className="m-0 fs-5 text-center">{mensagemVazia}</p>;
  }

  return layoutLista ? (
    <div className="card p-2">
      <DataTable
        value={ReorganizarLista(itensPaginados.map((x) => renderItem(x)))}
        stripedRows
        ows={10}
        rowsPerPageOptions={[10, 25, 50]}
        rowClassName={(rowData) =>
          rowData.borderColor ? rowData.borderColor : ""
        }
      >
        <Column
          body={(rowData) => (
            <div className="d-flex flex-row gap-3">
              <div className="d-flex align-items-center">{rowData.avatar}</div>
              <div className="d-flex flex-column align-items-start">
                <h3 className="titulo mb-1 fs-5">{rowData.titulo}</h3>
                <p className="subtitulo fs-6 m-0">{rowData.subtitulo}</p>
              </div>
            </div>
          )}
        />
        {ObterLabelsUnicos(itens.map((y) => renderItem(y))).map((x) => (
          <Column key={x} field={x} header={x} />
        ))}
        <Column
          header="Ação"
          body={(rowData) => (
            <BtnsCard
              onEditar={rowData.onEditar}
              onExcluir={rowData.onExcluir}
              notShowExcluir={rowData.notShowExcluir}
              showFlipButton={false}
            />
          )}
        />
      </DataTable>
    </div>
  ) : (
    <div>
      {/* Informações sobre paginação - Topo */}
      {(mostrarTotalItens || mostrarSeletorItens) && (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          {mostrarTotalItens && (
            <div className="text-muted">
              Mostrando {indiceInicio + 1} a {Math.min(indiceFim, itens.length)}{" "}
              de {itens.length} itens
            </div>
          )}

          {mostrarSeletorItens && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted">Itens por página:</span>
              <Dropdown
                value={itensPorPaginaInterna}
                options={opcoesItensPorPagina.map((opcao) => ({
                  label: opcao.toString(),
                  value: opcao
                }))}
                onChange={(e) => HandleMudancaItensPorPagina(e.value)}
                className="p-dropdown-sm"
                style={{ minWidth: "80px" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Conteúdo dos cards */}
      <div className={`row g-4 ${className}`}>
        {itensPaginados.map((este) => (
          <Card key={getEntityId(este)} {...renderItem(este)} />
        ))}
      </div>

      {/* Controles de paginação - Base */}
      {mostrarPaginacao && totalPaginas > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4 flex-wrap gap-2">
          {/* Botão Primeira Página */}
          <Button
            icon="pi pi-angle-double-left"
            className="p-button-sm p-button-outlined"
            disabled={paginaInterna === 1}
            onClick={() => HandleMudancaPagina(1)}
            tooltip="Primeira página"
          />

          {/* Botão Página Anterior */}
          <Button
            icon="pi pi-angle-left"
            className="p-button-sm p-button-outlined"
            disabled={paginaInterna === 1}
            onClick={() => HandleMudancaPagina(paginaInterna - 1)}
            tooltip="Página anterior"
          />

          {/* Números das páginas */}
          <div className="d-flex gap-1">
            {GerarPaginas().map((numeroPagina) => (
              <Button
                key={numeroPagina}
                label={numeroPagina.toString()}
                className={classNames("p-button-sm", {
                  "p-button-primary": numeroPagina === paginaInterna,
                  "p-button-outlined": numeroPagina !== paginaInterna
                })}
                onClick={() => HandleMudancaPagina(numeroPagina)}
              />
            ))}
          </div>

          {/* Botão Próxima Página */}
          <Button
            icon="pi pi-angle-right"
            className="p-button-sm p-button-outlined"
            disabled={paginaInterna === totalPaginas}
            onClick={() => HandleMudancaPagina(paginaInterna + 1)}
            tooltip="Próxima página"
          />

          {/* Botão Última Página */}
          <Button
            icon="pi pi-angle-double-right"
            className="p-button-sm p-button-outlined"
            disabled={paginaInterna === totalPaginas}
            onClick={() => HandleMudancaPagina(totalPaginas)}
            tooltip="Última página"
          />
        </div>
      )}
    </div>
  );
};

// BtnsLayout component
const BtnsLayout = ({ setLayoutLista, LayoutLista }) => (
  <div className="d-flex flex-row flex-wrap gap-2">
    <ButtonGroup>
      <Button
        className={classNames("btn-azul", { active: !LayoutLista })}
        label="Card"
        icon="ak ak-grid-four-fill"
        onClick={() => setLayoutLista(false)}
      />
      <Button
        className={classNames("btn-azul", { active: LayoutLista })}
        label="Lista"
        icon="ak ak-rows-fill"
        onClick={() => setLayoutLista(true)}
      />
    </ButtonGroup>
  </div>
);

const LabelValorProp = PropTypes.shape({
  label: PropTypes.string,
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
});

RenderInfoBack.propTypes = {
  infoBack: PropTypes.arrayOf(LabelValorProp)
};

RenderInfoFrente.propTypes = {
  infoFrente: PropTypes.arrayOf(LabelValorProp),
  infoFrenteClass: PropTypes.string
};

RenderDetalhesButton.propTypes = {
  onDetalhes: PropTypes.func.isRequired,
  labelDetalhes: PropTypes.string.isRequired,
  iconDetalhes: PropTypes.string,
  iconPosDetalhes: PropTypes.string.isRequired,
  addBtn: PropTypes.node
};

RenderHeader.propTypes = {
  avatar: PropTypes.node,
  onEditar: PropTypes.func,
  onExcluir: PropTypes.func,
  notShowExcluir: PropTypes.bool,
  onFlip: PropTypes.func,
  showFlipButton: PropTypes.bool,
  papel: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  subtitulo: PropTypes.string.isRequired
};

Card.propTypes = {
  infoBack: PropTypes.arrayOf(LabelValorProp),
  infoFrenteClass: PropTypes.string,
  infoFrente: PropTypes.arrayOf(LabelValorProp),
  addBtn: PropTypes.node,
  onEditar: PropTypes.func,
  onExcluir: PropTypes.func,
  notShowExcluir: PropTypes.bool,
  onDetalhes: PropTypes.func,
  labelDetalhes: PropTypes.string,
  iconDetalhes: PropTypes.string,
  iconPosDetalhes: PropTypes.string,
  borderColor: PropTypes.string,
  enableFlip: PropTypes.bool,
  minHeight: PropTypes.string,
  papel: PropTypes.string,
  titulo: PropTypes.string,
  subtitulo: PropTypes.string,
  avatar: PropTypes.node
};

BoxCards.propTypes = {
  className: PropTypes.string,
  mensagemVazia: PropTypes.string,
  itens: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemsPorPagina: PropTypes.number,
  mostrarPaginacao: PropTypes.bool,
  mostrarTotalItens: PropTypes.bool,
  mostrarSeletorItens: PropTypes.bool,
  opcoesItensPorPagina: PropTypes.arrayOf(PropTypes.number),
  paginaAtual: PropTypes.number,
  onMudancaPagina: PropTypes.func,
  onMudancaItensPorPagina: PropTypes.func,
  renderItem: PropTypes.func.isRequired,
  getEntityId: PropTypes.func.isRequired,
  layoutLista: PropTypes.bool
};

BtnsCard.propTypes = {
  onEditar: PropTypes.func.isRequired,
  onExcluir: PropTypes.func.isRequired,
  notShowExcluir: PropTypes.bool,
  onFlip: PropTypes.func,
  showFlipButton: PropTypes.bool
};

BtnsLayout.propTypes = {
  setLayoutLista: PropTypes.func.isRequired,
  LayoutLista: PropTypes.bool.isRequired
};

export { Card, BoxCards, BtnsLayout };
