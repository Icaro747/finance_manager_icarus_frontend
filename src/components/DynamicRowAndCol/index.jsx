/* eslint-disable no-nested-ternary */

import { useRef, useState, useEffect, useCallback } from "react";

import PropTypes from "prop-types";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { OverlayPanel } from "primereact/overlaypanel";

import "./styled.scss";

const Row = ({ children }) => (
  <section id="imprecao" className="row g-3">
    {children}
  </section>
);

Row.propTypes = {
  children: PropTypes.node.isRequired
};

const Col = ({
  children,
  index,
  isEditar,
  onChange,
  title,
  descricao,
  isCard,
  itemsCenter,
  size,
  sizeSm,
  sizeMd,
  sizeLg,
  sizeXl
}) => {
  const op = useRef(null);
  const [MaisOpcoes, setMaisOpcoes] = useState(false);
  const [ShowModal, setShowModal] = useState(false);
  const [newValues, setNewValues] = useState({});

  const [Previ, setPrevi] = useState(false);

  const handleChange = (name, value) => {
    setNewValues((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    setShowModal(false);
    onChange({ index, data: newValues });
  };

  const GetSize = () => {
    let valor = "";
    if (size) {
      valor += `col-${size} `;
    }
    if (sizeSm) {
      valor += `col-sm-${sizeSm} `;
    }
    if (sizeMd) {
      valor += `col-md-${sizeMd} `;
    }
    if (sizeLg) {
      valor += `col-lg-${sizeLg} `;
    }
    if (sizeXl) {
      valor += `col-xl-${sizeXl}`;
    }
    return valor;
  };

  useEffect(() => {
    if (sizeSm != null || sizeMd != null || sizeLg != null || sizeXl != null) {
      setMaisOpcoes(true);
    }
  }, [sizeSm, sizeMd, sizeLg, sizeXl]);

  useEffect(() => {
    setNewValues({
      index,
      size,
      sizeSm,
      sizeMd,
      sizeLg,
      sizeXl
    });
  }, [ShowModal, size, sizeSm, sizeMd, sizeLg, sizeXl]);

  useEffect(() => {
    if (MaisOpcoes === false) {
      handleChange("sizeSm", null);
      handleChange("sizeMd", null);
      handleChange("sizeLg", null);
      handleChange("sizeXl", null);
    }
  }, [MaisOpcoes]);

  return (
    <article className={GetSize()}>
      <div className={`${isCard ? "card p-3 " : ""}h-100`}>
        {(descricao || isEditar || title) && (
          <div className="w-100 d-flex justify-content-between align-items-center mb-3">
            {descricao ? (
              <>
                <Button
                  rounded
                  text
                  raised
                  aria-label="Filter"
                  size="large"
                  icon="pi pi-info-circle"
                  onClick={(e) => op.current.toggle(e)}
                />
                <OverlayPanel ref={op}>
                  <p className="p-3 m-0" style={{ maxWidth: "500px" }}>
                    {descricao}
                  </p>
                </OverlayPanel>
              </>
            ) : (
              <div />
            )}
            {title && <h3 className="m-0 text-center w-100">{title}</h3>}
            {isEditar && (
              <>
                <Button
                  rounded
                  outlined
                  severity="info"
                  aria-label="Bookmark"
                  icon="pi pi-arrows-alt"
                  onClick={() => setShowModal(true)}
                />
                <Dialog
                  header="Editar posicao"
                  visible={ShowModal}
                  onHide={() => setShowModal(false)}
                  style={{ minWidth: "50%", maxWidth: "100%", width: "600px" }}
                >
                  <div className="row m-0 g-3">
                    <div className="col-12 col-md-6">
                      <div className="d-flex flex-column">
                        <label className="fs-6 mb-2">Posição</label>
                        <InputNumber
                          value={newValues.index}
                          onChange={(e) => handleChange("index", e.value)}
                          min={1}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="d-flex flex-column">
                        <label className="fs-6 mb-2">
                          Ocupar quantos espaços na tela
                        </label>
                        <InputNumber
                          value={size !== null ? size / 3 : size}
                          onValueChange={(e) =>
                            handleChange(
                              "size",
                              e.value !== null ? e.value * 3 : e.value
                            )
                          }
                          min={1}
                          max={4}
                          disabled={MaisOpcoes}
                        />
                      </div>
                    </div>
                    {MaisOpcoes && (
                      <>
                        <div className="col-12 col-md-6">
                          <div className="d-flex flex-column">
                            <label className="fs-6 mb-2">
                              espaço em telas pequenas
                            </label>
                            <InputNumber
                              value={sizeSm !== null ? sizeSm / 3 : sizeSm}
                              onValueChange={(e) =>
                                handleChange(
                                  "sizeSm",
                                  e.value !== null ? e.value * 3 : e.value
                                )
                              }
                              min={1}
                              max={4}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="d-flex flex-column">
                            <label className="fs-6 mb-2">
                              espaço em telas médias
                            </label>
                            <InputNumber
                              value={sizeMd !== null ? sizeMd / 3 : sizeMd}
                              onValueChange={(e) =>
                                handleChange(
                                  "sizeMd",
                                  e.value !== null ? e.value * 3 : e.value
                                )
                              }
                              min={1}
                              max={4}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="d-flex flex-column">
                            <label className="fs-6 mb-2">
                              espaço em telas grandes
                            </label>
                            <InputNumber
                              value={sizeLg !== null ? sizeLg / 3 : sizeLg}
                              onValueChange={(e) =>
                                handleChange(
                                  "sizeLg",
                                  e.value !== null ? e.value * 3 : e.value
                                )
                              }
                              min={1}
                              max={4}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="d-flex flex-column">
                            <label className="fs-6 mb-2">
                              espaço em telas extra grandes
                            </label>
                            <InputNumber
                              value={sizeXl !== null ? sizeXl / 3 : sizeXl}
                              onValueChange={(e) =>
                                handleChange(
                                  "sizeXl",
                                  e.value !== null ? e.value * 3 : e.value
                                )
                              }
                              min={1}
                              max={4}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="col-12">
                      <div className="d-flex justify-content-center">
                        <Button
                          label={
                            MaisOpcoes ? "Opções simples" : "Opções avançadas"
                          }
                          className="btn"
                          onClick={() => setMaisOpcoes((e) => !e)}
                        />
                      </div>
                    </div>
                    <PreVisualizaCao
                      Previ={Previ}
                      newValues={newValues}
                      MaisOpcoes={MaisOpcoes}
                    />
                    <div className="col-12">
                      <div className="d-flex justify-content-end align-items-center gap-3">
                        <label htmlFor="privi">Pré visualização</label>
                        <InputSwitch
                          inputId="privi"
                          checked={Previ}
                          onChange={(e) => setPrevi(e.value)}
                        />
                        <Button label="Atulizar" onClick={handleUpdate} />
                      </div>
                    </div>
                  </div>
                </Dialog>
              </>
            )}
          </div>
        )}
        <div
          className={`${itemsCenter ? "d-flex justify-content-center align-items-center " : ""}dynamic-col`}
        >
          {children}
        </div>
      </div>
    </article>
  );
};

const sizePropTypes = PropTypes.oneOf(
  Array.from({ length: 12 }, (_, i) => i + 1)
);

Col.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]).isRequired,
  index: PropTypes.number,
  isEditar: PropTypes.bool,
  onChange: PropTypes.func,
  title: PropTypes.string,
  descricao: PropTypes.string,
  isCard: PropTypes.bool,
  itemsCenter: PropTypes.bool,
  size: sizePropTypes,
  sizeSm: sizePropTypes,
  sizeMd: sizePropTypes,
  sizeLg: sizePropTypes,
  sizeXl: sizePropTypes
};

Col.defaultProps = {
  index: 0,
  isEditar: false,
  onChange: () => {},
  descricao: null,
  isCard: false,
  itemsCenter: false,
  size: null,
  sizeSm: null,
  sizeMd: null,
  sizeLg: null,
  sizeXl: null
};

const PreVisualizaCao = ({ Previ, newValues, MaisOpcoes }) => {
  const GetSize = (valor) => (100 / 12) * valor;

  const CardsFaltado = useCallback(
    ({ numero }) => (
      <>
        <div
          className={`subi-card ${numero >= 12}`}
          style={{ width: numero < 12 ? `25%` : "0%" }}
        >
          <div className={`card no-context text-nowrap ${numero >= 12}`}>
            card
          </div>
        </div>
        <div
          className={`subi-card ${numero > 6}`}
          style={{ width: numero <= 6 ? `25%` : "0%" }}
        >
          <div className={`card no-context text-nowrap ${numero > 6}`}>
            card
          </div>
        </div>
        <div
          className={`subi-card ${numero > 3}`}
          style={{ width: numero === 3 ? `25%` : "0%" }}
        >
          <div className={`card no-context text-nowrap ${numero > 3}`}>
            card
          </div>
        </div>
      </>
    ),
    []
  );

  return Previ ? (
    !MaisOpcoes ? (
      <div className="card card-privi p-3">
        {newValues.size !== null && (
          <>
            <p>Espato em tela</p>
            <div className="box-itens-card g-3">
              <div
                className="subi-card"
                style={{
                  width: `${GetSize(newValues.size)}%`,
                  paddingRight: newValues.size === 12 ? "0" : "1rem"
                }}
              >
                <div className="card">Card</div>
              </div>
              <CardsFaltado numero={newValues.size} />
            </div>
          </>
        )}
      </div>
    ) : (
      (newValues.sizeSm != null ||
        newValues.sizeMd != null ||
        newValues.sizeLg != null ||
        newValues.sizeXl != null) && (
        <div className="card card-privi p-3 d-flex flex-column gap-3">
          {newValues.sizeSm != null && (
            <div>
              <p className="m-1">Espato em tela pequenas</p>
              <div className="box-itens-card g-3">
                <div
                  className="subi-card"
                  style={{
                    width: `${GetSize(newValues.sizeSm)}%`,
                    paddingRight: newValues.sizeSm === 12 ? "0" : "1rem"
                  }}
                >
                  <div className="card">Card</div>
                </div>
                <CardsFaltado numero={newValues.sizeSm} />
              </div>
            </div>
          )}
          {newValues.sizeMd != null && (
            <div>
              <p className="m-1">Espato em tela médias</p>
              <div className="box-itens-card g-3">
                <div
                  className="subi-card"
                  style={{
                    width: `${GetSize(newValues.sizeMd)}%`,
                    paddingRight: newValues.sizeMd === 12 ? "0" : "1rem"
                  }}
                >
                  <div className="card">Card</div>
                </div>
                <CardsFaltado numero={newValues.sizeMd} />
              </div>
            </div>
          )}
          {newValues.sizeLg != null && (
            <div>
              <p className="m-1">Espato em tela grandes</p>
              <div className="box-itens-card g-3">
                <div
                  className="subi-card"
                  style={{
                    width: `${GetSize(newValues.sizeLg)}%`,
                    paddingRight: newValues.sizeLg === 12 ? "0" : "1rem"
                  }}
                >
                  <div className="card">Card</div>
                </div>
                <CardsFaltado numero={newValues.sizeLg} />
              </div>
            </div>
          )}
          {newValues.sizeXl != null && (
            <div>
              <p className="m-1">Espato em tela extra grandes</p>
              <div className="box-itens-card g-3">
                <div
                  className="subi-card"
                  style={{
                    width: `${GetSize(newValues.sizeXl)}%`,
                    paddingRight: newValues.sizeXl === 12 ? "0" : "1rem"
                  }}
                >
                  <div className="card">Card</div>
                </div>
                <CardsFaltado numero={newValues.sizeXl} />
              </div>
            </div>
          )}
        </div>
      )
    )
  ) : null;
};

PreVisualizaCao.propTypes = {
  Previ: PropTypes.bool.isRequired,
  newValues: PropTypes.shape({
    size: PropTypes.number,
    sizeSm: PropTypes.number,
    sizeMd: PropTypes.number,
    sizeLg: PropTypes.number,
    sizeXl: PropTypes.number
  }).isRequired,
  MaisOpcoes: PropTypes.bool.isRequired
};

export { Row, Col };
