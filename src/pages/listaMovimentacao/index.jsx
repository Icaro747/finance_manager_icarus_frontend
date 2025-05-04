import { useState, useEffect } from "react";

import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import { BoxCards, Card } from "components/CardLayout";
import ConfirmDialog from "components/ConfirmDialog";
import LogoAvatar from "components/LogoAvatar";
import ModalLateral from "components/ModalLateral";

import { useAuth } from "context/AuthContext";
import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import MaskUtil from "utils/MaskUtil";
import useQuery from "utils/useQuery";

const ListaMovimentacao = () => {
  // Contextos e utilitários
  const Auth = useAuth();
  const Query = useQuery();
  const Notify = useNotification();
  const Requisicao = new Api(Auth.logout, Notify);
  const { setLoading } = useLoading();

  // Estados iniciais
  const InitDataMovimentacao = {
    nome: "",
    documento: "",
    telefone: "",
    email: "",
    observacoes: ""
  };

  // Estados das Testemunhas
  const [Lista, setLista] = useState([]);
  const [Buscar, setBuscar] = useState("");
  const [IdMovimentacao, setIdMovimentacao] = useState(null);
  const [DataMovimentacao, setDataMovimentacao] =
    useState(InitDataMovimentacao);
  const [ShowExcluir, setShowExcluir] = useState(false);
  const [ShowModal, setShowModal] = useState(false);

  // Estados de visualização
  const [OrdemCrescente, setOrdemCrescente] = useState(true);
  const [LayoutLista, setLayoutLista] = useState(false);

  // Funções de manipulação de dados básicos
  const HandleChangeMovimentacao = (field, value) => {
    setDataMovimentacao((prev) => ({ ...prev, [field]: value }));
  };

  const LimparCamposMovimentacao = () => {
    setIdMovimentacao(null);
    setDataMovimentacao(InitDataMovimentacao);
  };

  // Funções de API - Operações CRUD
  const GetListaMovimentacao = async () => {
    try {
      const resposta = await Requisicao.Get({
        endpoint: "/Movimentacao/My",
        config: Auth.GetHeaders()
      });
      setLista(resposta);
    } catch (error) {
      console.error(error);
    }
  };

  const CarregarMovimentacao = async (id) => {
    try {
      setLoading(true);
      const data = await Requisicao.Get({
        endpoint: `/Movimentacao/${id}`,
        config: Auth.GetHeaders()
      });
      setDataMovimentacao(data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Inicialização e efeitos
  useEffect(() => {
    const Init = async () => {
      setLoading(true);
      await GetListaMovimentacao();
      setLoading(false);
    };
    Init();
  }, []);

  // Filtragem e ordenação
  const GetListaFiltrada = () => {
    let listaFiltrada = [...Lista];

    if (listaFiltrada.length === 0) return [];

    // Aplicar filtro de busca
    if (Buscar !== "") {
      listaFiltrada = listaFiltrada.filter(
        (item) =>
          item.nomeMovimentacao.nome
            .toLowerCase()
            .includes(Buscar.toLowerCase()) ||
          (item.descricao &&
            item.descricao.toLowerCase().includes(Buscar.toLowerCase()))
      );
    }

    // Aplicar ordenação
    listaFiltrada.sort((a, b) => {
      const comparacao = a.nomeMovimentacao.nome.localeCompare(
        b.nomeMovimentacao.nome
      );
      return OrdemCrescente ? comparacao : -comparacao;
    });

    return listaFiltrada;
  };

  return (
    <section>
      <header>
        <div className="d-flex flex-row flex-wrap justify-content-between gap-2">
          <div className="d-flex flex-row flex-wrap gap-2">
            <Button
              label="Nova Movimentacao"
              className="btn btn-quadro active"
              icon="ak ak-plus-circle"
              iconPos="right"
              onClick={() => {
                LimparCamposMovimentacao();
                setShowModal(true);
              }}
            />
            <IconField iconPosition="left" style={{ maxWidth: "170px" }}>
              <InputIcon className="ak ak-magnifying-glass" />
              <InputText
                placeholder="Buscar Movimentacao"
                value={Buscar}
                className="tipo-1"
                onChange={(e) => setBuscar(e.target.value)}
              />
            </IconField>
            <Button
              className="btn-quadro active"
              icon={`pi ${
                OrdemCrescente ? "pi-sort-alpha-down" : "pi-sort-alpha-up-alt"
              }`}
              onClick={() => setOrdemCrescente((e) => !e)}
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
        </div>
        <hr />
      </header>

      <article className="card not-shadow p-3 mb-3 bg-cor-cinza-3">
        <BoxCards itens={GetListaFiltrada().length}>
          {GetListaFiltrada().map((item) => (
            <Card
              key={item.Movimentacao_id}
              LayoutLista={LayoutLista}
              HeaderComponent={
                <p className="m-0 fs-5 truncate-text">
                  <b>{item.nomeMovimentacao.nome}</b>
                </p>
              }
              parametros={[
                {
                  label: "Valor",
                  valor: MaskUtil.applyMonetaryMask(item.valor)
                },
                { label: "Data", valor: MaskUtil.applyDataMask(item.data) },
                {
                  label: "Tipo",
                  valor: item.tipoMovimentacao.nome
                },
                {
                  label: "categoria",
                  valor: item.nomeMovimentacao?.categoria?.nome
                }
              ]}
              detalhesWidth={15}
              btnsCardWidth={10}
              onExcluir={() => {
                setShowExcluir(true);
                setIdMovimentacao(item.Movimentacao_id);
              }}
              onEditar={() => {
                CarregarMovimentacao(item.Movimentacao_id);
                setIdMovimentacao(item.Movimentacao_id);
              }}
            />
          ))}
        </BoxCards>
      </article>

      {/* <ModalLateral
        visible={ShowModal}
        onHide={() => {
          setShowModal(false);
          LimparCamposMovimentacao();
        }}
        style={{ width: "50vw" }}
        header={
          <h3 className="m-0">
            {IdMovimentacao ? "Atualizar" : "Nova"} Movimentacao
          </h3>
        }
        body={
          <div className="d-flex flex-column gap-3">
            <div className="row g-3">
              <FormMovimentacao
                data={DataMovimentacao}
                handleChange={HandleChangeMovimentacao}
              />
              <div className="col-12">
                <div className="d-flex flex-row-reverse gap-3 mt-3">
                  <Button
                    label="Salvar"
                    className="btn btn-azul"
                    onClick={HandleSubmitMovimentacao}
                  />
                  <Button
                    label="Cancelar"
                    className="btn btn-preto"
                    onClick={() => {
                      LimparCamposMovimentacao();
                      setShowModal(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      /> */}

      {/* <ConfirmDialog
            visible={ShowExcluir}
            message={
              <>
                Você está <b>excluindo uma movimentacao</b>, quer continuar?
              </>
            }
            onHide={() => setShowExcluir(false)}
            onConfirm={DeleteMovimentacao}
            confirmText="Excluir"
            cancelText="Cancelar"
          /> */}
    </section>
  );
};

export default ListaMovimentacao;
