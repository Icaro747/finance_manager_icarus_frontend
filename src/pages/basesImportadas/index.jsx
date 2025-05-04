import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";

import { useAuth } from "context/AuthContext";
import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import MaskUtil from "utils/MaskUtil";

import ModalNewBase from "./modules/ModalNewBase";

const BasesImportadas = () => {
  const navigate = useNavigate();
  const Auth = useAuth();
  const Notify = useNotification();
  const Requisicao = new Api(Auth.logout, Notify);

  const [LayoutLista, setLayoutLista] = useState(false);

  const [Show, setShow] = useState(false);

  const Lista = [
    {
      id: 1,
      nome: "base 1",
      nome_arquivo: "doc",
      data_criacao: "2025-02-24T09:46:11.595992",
      status: 1,
      qtd_processo: 10,
      qtd_processo_erro: 2
    }
  ];

  const BtnsCard = (/* { data } */) => (
    <div className="d-flex flex-row">
      <Button
        icon="pi pi-download"
        text
        severity="secondary"
        className="btn-card"
      />
      <Button
        icon="ak ak-info-circle"
        text
        severity="secondary"
        className="btn-card"
      />
      <Button
        icon="pi pi-external-link"
        text
        severity="secondary"
        className="btn-card"
      />
    </div>
  );

  const GetStatus = (statu) => {
    if (statu === 1) return "Sucesso";
    if (statu === 2) return "Parcial";
    return "Falha";
  };

  return (
    <>
      <ModalNewBase Show={Show} setShow={setShow} />
      <section>
        <header className="d-flex flex-row flex-wrap justify-content-between gap-3">
          <div className="d-flex flex-row flex-wrap gap-2">
            <Button
              label="Nova base de dados"
              className="btn btn-quadro active"
              icon="ak ak-plus-circle"
              iconPos="right"
              onClick={() => setShow(true)}
            />
            <Button
              label="Voltar"
              className="btn btn-quadro"
              onClick={() => navigate(-1)}
            />
          </div>
          <div className="d-flex flex-row flex-wrap gap-2">
            <Button
              className={`btn-quadro ${!LayoutLista ? "active" : ""}`}
              label="Card"
              icon="ak ak-grid-four-fill"
              onClick={() => setLayoutLista(false)}
            />
            <Button
              className={`btn-quadro ${LayoutLista ? "active" : ""}`}
              label="Lista"
              icon="ak ak-rows-fill"
              onClick={() => setLayoutLista(true)}
            />
          </div>
        </header>
        <hr />
        <article className="card not-shadow p-3 mb-3 bg-cor-cinza-3">
          {Lista.length > 0 ? (
            <div className="row g-4">
              {Lista.map((item) => (
                <div
                  key={item.usuario_id}
                  className={!LayoutLista ? "col-md-6 col-xl-3" : "col-12"}
                >
                  <div className="card p-3">
                    <div
                      className={`d-flex flex-${!LayoutLista ? "column" : "row justify-content-between"} gap-3`}
                    >
                      <div className="d-flex flex-row flex-wrap justify-content-between gap-3">
                        <div className="d-flex flex-row align-items-center gap-3">
                          <div className="text-cor-2">
                            <p className="m-0 fs-5">
                              <b>{item.nome}</b>
                            </p>
                          </div>
                        </div>
                        {!LayoutLista && <BtnsCard data={item} />}
                      </div>
                      <div
                        className={`d-flex flex-${LayoutLista ? "column gap-1" : "row justify-content-between gap-3"}`}
                      >
                        <label className="fs-6 text-cor-1">Arquivo</label>
                        <p className="fs-6 m-0 text-cor-2">
                          {item.nome_arquivo}
                        </p>
                      </div>
                      <div
                        className={`d-flex flex-${LayoutLista ? "column gap-1" : "row justify-content-between gap-3"}`}
                      >
                        <label className="fs-6 text-cor-1">Importado em</label>
                        <p className="fs-6 m-0 text-cor-2">
                          {MaskUtil.applyDataMask(item.data_criacao)}
                        </p>
                      </div>
                      <div
                        className={`d-flex flex-${LayoutLista ? "column gap-1" : "row justify-content-between gap-3"}`}
                      >
                        <label className="fs-6 text-cor-1">Status</label>
                        <p className="fs-6 m-0 text-cor-2">
                          {GetStatus(item.status)}
                        </p>
                      </div>
                      <div
                        className={`d-flex flex-${LayoutLista ? "column gap-1" : "row justify-content-between gap-3"}`}
                      >
                        <label className="fs-6 text-cor-1">
                          Quantidade processo
                        </label>
                        <p className="fs-6 m-0 text-cor-2">
                          {item.qtd_processo}
                        </p>
                      </div>
                      <div
                        className={`d-flex flex-${LayoutLista ? "column gap-1" : "row justify-content-between gap-3"}`}
                      >
                        <label className="fs-6 text-cor-1">
                          Quantidade erros
                        </label>
                        <p className="fs-6 m-0 text-cor-2">
                          {item.qtd_processo_erro}
                        </p>
                      </div>
                      {!LayoutLista && <hr />}
                      <div className="d-flex align-items-center">
                        <Button
                          label="Ver detalhes"
                          severity="info"
                          className="w-100 btn-azul"
                        />
                      </div>
                      {LayoutLista && <BtnsCard data={item} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="m-0 fs-5 text-center">Nenhum usuario encontrado</p>
          )}
        </article>
      </section>
    </>
  );
};

export default BasesImportadas;
