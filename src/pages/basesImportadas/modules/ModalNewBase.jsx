/* eslint-disable no-plusplus */
import { useState, useEffect } from "react";

import Papa from "papaparse";
import PropTypes from "prop-types";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Sidebar } from "primereact/sidebar";

import ProgressStep from "components/ProgressStep";

import { useAuth } from "context/AuthContext";
import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import MaskUtil from "utils/MaskUtil";

import "./styled.scss";

const ModalNewBase = ({ Show, setShow }) => {
  const Notify = useNotification();
  const Auth = useAuth();
  const Requisicao = new Api(Auth.logout, Notify);
  const { setLoading } = useLoading();

  const requiredFields = ["Data", "Lançamento", "Tipo", "Valor"];

  const [Step, setStep] = useState(0);
  const [jsonData, setJsonData] = useState([]);
  const [PorcentagemConclusao, setPorcentagemConclusao] = useState(0);
  const [SuccessCount, setSuccessCount] = useState(0);
  const [ErrorCount, setErrorCount] = useState(0);
  const [FailedItems, setFailedItems] = useState([]);

  const [Tipo, setTipo] = useState(null);
  const [OptCartao, setOptCartao] = useState([]);
  const [OptBanco, setOptBanco] = useState([]);
  const [Link, setLink] = useState(null);

  // Função para formatar a data do padrão brasileiro para o americano
  const FormatDate = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  // Função para transformar o valor em número
  const FormatValue = (value) =>
    Number(value.replace("R$", "").replace(".", "").replace(",", "."));

  const HandleFileUpload = (event) => {
    const file = event.files[0];

    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const { data } = result;

          // Verificar se todos os campos obrigatórios estão presentes
          const hasRequiredFields = requiredFields.every((field) =>
            Object.keys(data[0]).includes(field)
          );

          if (!hasRequiredFields) {
            Notify({
              type: "aviso",
              message: `O arquivo CSV deve conter os seguintes campos: ${requiredFields.join(", ")}`
            });
            return;
          }

          // Converter para o formato JSON desejado
          const formattedData = data.map((row, i) => ({
            index: i,
            data: FormatDate(row.Data), // Formatar a data
            valor: FormatValue(row.Valor), // Transformar o valor em número
            nomeMovimentacao: row["Lançamento"],
            tipoMovimentacao: row.Tipo
          }));

          setJsonData(formattedData);
          Notify({
            type: "sucesso",
            message: "Arquivo processado com sucesso!"
          });
          setStep((e) => e + 1);
        },
        error: (error) => {
          console.error("Erro ao processar o arquivo:", error);
          Notify({
            type: "erro",
            message: "Erro ao processar o arquivo. Verifique o formato."
          });
        }
      });
    } else {
      Notify({
        type: "aviso",
        message: "Por favor, envie um arquivo no formato .csv."
      });
    }
  };

  const SendRequests = async () => {
    let success = 0;
    let errors = 0;
    const failed = [];

    /* eslint-disable no-await-in-loop */
    for (const item of jsonData) {
      try {
        const response = await Requisicao.Post({
          endpoint: "/Movimentacao",
          data: {
            data: item.data,
            valor: item.valor,
            descricao: item.nomeMovimentacao,
            entrada: false,
            cartao_Id: Tipo === "Cartão" ? Link : null,
            banco_Id: Tipo === "Conta corrente" ? Link : null,
            nomeMovimentacao: item.nomeMovimentacao,
            tipoMovimentacao: item.tipoMovimentacao
          },
          config: Auth.GetHeaders()
        });

        if (response) {
          success++;
        } else {
          errors++;
          failed.push(item);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        errors++;
        failed.push(item);
      }

      // Atualizar a porcentagem de conclusão
      setPorcentagemConclusao(((success + errors) / jsonData.length) * 100);
    }
    /* eslint-enable no-await-in-loop */

    setSuccessCount(success);
    setErrorCount(errors);
    setFailedItems(failed);
    setStep(3); // Avançar para o próximo passo
  };

  useEffect(() => {
    const Go = async () => {
      try {
        setLoading(true);
        const responsesCartao = await Requisicao.Get({
          endpoint: "/Cartao/My",
          config: Auth.GetHeaders()
        });
        setOptCartao(responsesCartao);
        const responsesBanco = await Requisicao.Get({
          endpoint: "/Banco/My",
          config: Auth.GetHeaders()
        });
        setOptBanco(responsesBanco);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (Auth.isAuthenticated()) Go();
  }, [Auth]);

  useEffect(() => {
    if (Step === 2) {
      SendRequests();
    }
  }, [Step]);

  return (
    <Sidebar
      header="Importanda base"
      position="right"
      visible={Show}
      onHide={() => setShow(false)}
      style={{ minWidth: "70vw" }}
    >
      <div className="h-100 d-flex flex-column justify-content-between">
        <div>
          <hr />
          <div className="p-5">
            <ProgressStep
              steps={[
                { name: "Informações", icon: "ak ak-database", min: false },
                { name: "Validação", icon: "ak ak-check-circle", min: false },
                { name: null, icon: "ak ak-spinner-gap", min: true },
                { name: "Resultados", icon: "ak ak-doc-inclined", min: false }
              ]}
              activeStep={Step}
            />
          </div>
          {Step === 0 && (
            <div className="card p-3">
              <form className="row g-3">
                <div className="col-6">
                  <div className="d-flex flex-column gap-2">
                    <label>Tipo</label>
                    <Dropdown
                      className="w-100"
                      options={["Conta corrente", "Cartão"]}
                      value={Tipo}
                      onChange={(e) => setTipo(e.value)}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column gap-2">
                    <label>{Tipo ?? "..."}</label>
                    <Dropdown
                      className="w-100"
                      options={Tipo === "Conta corrente" ? OptBanco : OptCartao}
                      value={Link}
                      onChange={(e) => setLink(e.value)}
                      optionLabel="label"
                      optionValue="value"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex flex-column gap-2">
                    <label htmlFor="">Upload do arquivo</label>
                    <FileUpload
                      mode="basic"
                      name="demo[]"
                      accept=".csv"
                      maxFileSize={1000000}
                      auto
                      customUpload
                      uploadHandler={HandleFileUpload}
                      chooseLabel="Selecione ou arraste aqui"
                      chooseOptions={{
                        icon: "ak ak-cloud-arrow-up ak-cor-cinza-4",
                        className: "w-100 btn btn-file"
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
          {Step === 1 && (
            <>
              <p className="fs-4">
                <b>Validamos sua base de dados</b>
              </p>
              <DataTable value={jsonData} stripedRows paginator rows={10}>
                <Column field="nomeMovimentacao" header="Nome" />
                <Column field="tipoMovimentacao" header="Tipo" />
                <Column
                  field="valor"
                  header="Valor"
                  body={(rowData) => MaskUtil.applyMonetaryMask(rowData.valor)}
                />
                <Column
                  field="data"
                  header="Data"
                  body={(rowData) => MaskUtil.applyDataMask(rowData.data)}
                />
                <Column
                  header="Ação"
                  body={(rowData) => (
                    <Button
                      icon="ak ak-trash"
                      text
                      severity="secondary"
                      className="btn-card"
                      onClick={() =>
                        setJsonData((lista) =>
                          lista.filter((x) => x.index !== rowData.index)
                        )
                      }
                    />
                  )}
                />
              </DataTable>
            </>
          )}
          {Step === 2 && (
            <div
              className="card p-3 pt-5 pb-5"
              style={{ maxWidth: "50%", margin: "auto" }}
            >
              <i className="ak ak-file-magnifying-glass ak-cor-cinza-4 fs-3" />
              <ProgressBar value={PorcentagemConclusao} className="mt-3 mb-4" />
              <p className="text-center mb-2 fs-5">
                Estamos validando as informações
              </p>
              <p className="text-center m-0 fs-6">
                Esse processo pode levar de <b>2 a 3min</b>
              </p>
            </div>
          )}
          {Step === 3 && (
            <div className="pt-5 pb-5">
              <div className="card p-3">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="d-flex flex-column gap-2">
                      <label>
                        Total de itens é esse processado com sucesso
                      </label>
                      <ul className="list-group">
                        <li className="list-group-item">
                          <div className="d-flex flex-row align-items-center gap-3">
                            <i className="ak ak-check-circle ak-cor-verde" />
                            <p className="m-0">{SuccessCount}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex flex-column gap-2">
                      <label>Total de itens de falha ao processar</label>
                      <ul className="list-group">
                        <li className="list-group-item">
                          <div className="d-flex flex-row align-items-center gap-3">
                            <i className="ak ak-times-circle ak-cor-vermelho" />
                            <p className="m-0">{ErrorCount}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex flex-column gap-2">
                      <label>Lista de erros</label>
                      <ul className="list-group">
                        {FailedItems.map((item) => (
                          <li className="list-group-item border-bottom-0">
                            <div className="d-flex flex-row align-items-center gap-3">
                              <i className="ak ak-times-circle ak-cor-vermelho" />
                              <p className="m-0">
                                {MaskUtil.applyDataMask(item.data)}{" "}
                                {MaskUtil.applyMonetaryMask(item.valor)}{" "}
                                {item.nomeMovimentacao}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex flex-row-reverse">
                      <Button
                        label="Baixar lista de erros"
                        className="btn-quadro active"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <hr />
          <div className="d-flex flex-row-reverse">
            <Button
              label="Avançar"
              className="btn-azul"
              onClick={() => {
                if (Step < 3) setStep((e) => e + 1);
                else {
                  setShow(false);
                  setStep(0);
                }
              }}
            />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

ModalNewBase.propTypes = {
  Show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
};

export default ModalNewBase;
