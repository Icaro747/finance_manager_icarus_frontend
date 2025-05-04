import { useState, useEffect } from "react";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import { BoxCards, Card } from "components/CardLayout";
import ConfirmDialog from "components/ConfirmDialog";
import FormBanco from "components/FormBanco";
import FormCartao from "components/FormCartao";
import LogoAvatar from "components/LogoAvatar";
import ModalLateral from "components/ModalLateral";

import { useAuth } from "context/AuthContext";
import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import useQuery from "utils/useQuery";

const ListaBanco = () => {
  // Contextos e utilitários
  const Auth = useAuth();
  const Query = useQuery();
  const Notify = useNotification();
  const Requisicao = new Api(Auth.logout, Notify);
  const { setLoading } = useLoading();

  // Estados iniciais
  const InitDataBanco = {
    nome: "",
    numero: ""
  };

  // Estados dos Bancos
  const [Lista, setLista] = useState([]);
  const [Buscar, setBuscar] = useState("");
  const [IdBanco, setIdBanco] = useState(null);
  const [DataBanco, setDataBanco] = useState(InitDataBanco);
  const [ShowExcluirBanco, setShowExcluir] = useState(false);
  const [ShowModal, setShowModal] = useState(false);

  // Estados de visualização
  const [OrdemCrescente, setOrdemCrescente] = useState(true);
  const [LayoutLista, setLayoutLista] = useState(false);

  const [ShowDetalhes, setShowDetalhes] = useState(false);
  const [ListaCartao, setListaCartao] = useState([]);
  const [ShowModalCartao, setShowModalCartao] = useState(false);
  const [DataCartao, setDataCartao] = useState(InitDataBanco);
  const [IdCartao, setIdCartao] = useState(null);
  const [ShowExcluirCartao, setShowExcluirCartao] = useState(false);

  // Funções de manipulação de dados básicos
  const HandleChangeBanco = (field, value) => {
    setDataBanco((prev) => ({ ...prev, [field]: value }));
  };

  const HandleChangeCartao = (field, value) => {
    setDataCartao((prev) => ({ ...prev, [field]: value }));
  };

  const LimparCamposCartao = () => {
    setDataCartao(InitDataBanco);
  };

  const LimparCamposBanco = () => {
    setIdBanco(null);
    setDataBanco(InitDataBanco);
  };

  // Funções de API - Operações CRUD
  const GetListaBanco = async () => {
    try {
      const resposta = await Requisicao.Get({
        endpoint: "/Banco",
        config: Auth.GetHeaders()
      });
      setLista(resposta);
    } catch (error) {
      console.error(error);
    }
  };

  const CarregarBanco = async (id, noShow) => {
    try {
      setLoading(true);
      const data = await Requisicao.Get({
        endpoint: `/Banco/${id}`,
        config: Auth.GetHeaders()
      });
      setDataBanco(data);
      if (!noShow) setShowModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const CriarBanco = async () => {
    try {
      await Requisicao.Post({
        endpoint: "/Banco",
        data: DataBanco,
        config: Auth.GetHeaders()
      });
      Notify({
        type: "sucesso",
        message: "Banco cadastrado com sucesso"
      });
      return true;
    } catch (error) {
      console.error(error);

      Notify({
        type: "erro",
        message: "Erro ao tentar cadastrar o banco"
      });
      return false;
    }
  };

  const AtualizarBanco = async () => {
    try {
      await Requisicao.Put({
        endpoint: `/Banco/${IdBanco}`,
        data: DataBanco,
        config: Auth.GetHeaders()
      });

      Notify({
        type: "sucesso",
        message: "Banco atualizado com sucesso"
      });
      return true;
    } catch (error) {
      console.error(error);

      Notify({
        type: "erro",
        message: "Erro ao tentar atualizar o banco"
      });
      return false;
    }
  };

  const DeleteBanco = async () => {
    try {
      setLoading(true);
      await Requisicao.Delete({
        endpoint: `/Banco/${IdBanco}`,
        config: Auth.GetHeaders()
      });
      setShowExcluir(false);
      LimparCamposBanco();
      Notify({
        type: "sucesso",
        message: "Banco removido"
      });
      await GetListaBanco();
    } catch (error) {
      console.error(error);

      Notify({
        type: "erro",
        message: "Erro ao tentar excluir o banco"
      });
    } finally {
      setLoading(false);
    }
  };

  const GetCartao = async (bancoId) => {
    try {
      setLoading(true);
      const data = await Requisicao.Get({
        endpoint: "/Cartao/ByBancoIdAndUsuarioId",
        params: { bancoId },
        config: Auth.GetHeaders()
      });
      setListaCartao(data);
      setShowDetalhes(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const DeleteCartao = async () => {
    try {
      setLoading(true);
      await Requisicao.Delete({
        endpoint: `/Cartao/${IdCartao}`,
        config: Auth.GetHeaders()
      });
      await GetCartao(IdBanco);
      setShowExcluirCartao(false);
      Notify({
        type: "sucesso",
        message: "Cartão removido"
      });
    } catch (error) {
      console.error(error);
      Notify({
        type: "erro",
        message: "Erro ao tentar excluir o cartão"
      });
    } finally {
      setLoading(false);
    }
  };

  const CriarCartao = async () => {
    try {
      await Requisicao.Post({
        endpoint: "/Cartao",
        data: { ...DataCartao, Banco_Id: IdBanco },
        config: Auth.GetHeaders()
      });
      Notify({
        type: "sucesso",
        message: "Cartão cadastrado com sucesso"
      });
      return true;
    } catch (error) {
      console.error(error);

      Notify({
        type: "erro",
        message: "Erro ao tentar cadastrar o cartão"
      });
      return false;
    }
  };

  const GetCartaoById = async (id) => {
    try {
      setLoading(true);
      const data = await Requisicao.Get({
        endpoint: `/Cartao/${id}`,
        config: Auth.GetHeaders()
      });
      setDataCartao(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const AtualizarCartao = async () => {
    try {
      await Requisicao.Put({
        endpoint: `/Cartao/${IdCartao}`,
        data: DataCartao,
        config: Auth.GetHeaders()
      });
      Notify({
        type: "sucesso",
        message: "Cartão atualizado com sucesso"
      });
    } catch (error) {
      Notify({
        type: "erro",
        message: "Erro ao tentar atualizar o cartão"
      });
    }
  };

  const HandleSubmitCartao = async () => {
    try {
      setLoading(true);
      if (IdCartao == null) await CriarCartao();
      else await AtualizarCartao();
      await GetCartao(IdBanco);
      LimparCamposCartao();
      setIdCartao(null);
      setShowModalCartao(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const HandleSubmitBanco = async () => {
    try {
      setLoading(true);
      let sucesso = false;

      if (!IdBanco) sucesso = await CriarBanco();
      else sucesso = await AtualizarBanco();

      if (sucesso) {
        setShowModal(false);
        LimparCamposBanco();
        await GetListaBanco();
      }
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
      await GetListaBanco();
      setLoading(false);
    };
    Init();
  }, []);

  useEffect(() => {
    const id = Query.get("id");

    if (id) {
      setIdBanco(id);
      CarregarBanco(id);
    }
  }, [Query]);

  // Filtragem e ordenação
  const getListaFiltrada = () => {
    let listaFiltrada = [...Lista];

    // Aplicar filtro de busca
    if (Buscar) {
      listaFiltrada = listaFiltrada.filter(
        (item) =>
          item.nome.toLowerCase().includes(Buscar.toLowerCase()) ||
          (item.numero &&
            item.numero.toLowerCase().includes(Buscar.toLowerCase()))
      );
    }

    // Aplicar ordenação
    listaFiltrada.sort((a, b) => {
      const comparacao = a.nome.localeCompare(b.nome);
      return OrdemCrescente ? comparacao : -comparacao;
    });

    return listaFiltrada;
  };

  // Renderização
  return (
    <section>
      <header>
        <div className="d-flex flex-row flex-wrap justify-content-between gap-2">
          <div className="d-flex flex-row flex-wrap gap-2">
            <Button
              label="Novo Banco"
              className="btn btn-quadro active"
              icon="ak ak-plus-circle"
              iconPos="right"
              onClick={() => {
                LimparCamposBanco();
                setShowModal(true);
              }}
            />
            <IconField iconPosition="left" style={{ maxWidth: "170px" }}>
              <InputIcon className="ak ak-magnifying-glass" />
              <InputText
                placeholder="Buscar banco"
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
        <BoxCards itens={getListaFiltrada().length}>
          {getListaFiltrada().map((item) => (
            <Card
              key={item.banco_id}
              LayoutLista={LayoutLista}
              HeaderComponent={
                <div className="d-flex flex-row align-items-center gap-3">
                  <LogoAvatar name={item.nome} />
                  <div className="text-cor-2">
                    <p className="m-0 fs-5">
                      <b>{item.nome}</b>
                    </p>
                    {item.numero && (
                      <p className="m-0 fs-6">
                        Número:{" "}
                        <span className="text-cor-1">{item.numero}</span>
                      </p>
                    )}
                  </div>
                </div>
              }
              detalhesWidth={15}
              btnsCardWidth={10}
              onExcluir={() => {
                setShowExcluir(true);
                setIdBanco(item.banco_id);
              }}
              onEditar={() => {
                CarregarBanco(item.banco_id);
                setIdBanco(item.banco_id);
              }}
              onDetalhes={() => {
                setIdBanco(item.banco_id);
                GetCartao(item.banco_id);
                CarregarBanco(item.banco_id, true);
              }}
            />
          ))}
        </BoxCards>
      </article>

      <ModalLateral
        visible={ShowModalCartao}
        onHide={() => setShowModalCartao(false)}
        style={{ width: "40vw" }}
        header={<h3 className="m-0">Cartão</h3>}
        body={
          <div className="row g-3">
            <FormCartao data={DataCartao} handleChange={HandleChangeCartao} />{" "}
            <div className="col-12">
              <div className="d-flex flex-row-reverse gap-3 mt-3">
                <Button
                  label="Salvar"
                  className="btn btn-azul"
                  onClick={HandleSubmitCartao}
                />
                <Button
                  label="Cancelar"
                  className="btn btn-preto"
                  onClick={() => {
                    LimparCamposCartao();
                    setShowModalCartao(false);
                  }}
                />
              </div>
            </div>
          </div>
        }
      />

      <ModalLateral
        visible={ShowDetalhes}
        onHide={() => setShowDetalhes(false)}
        style={{ width: "45vw" }}
        header={<h3 className="m-0">Detalhes do Banco</h3>}
        body={
          <div className="row g-3">
            <div className="col-12">
              <p className="m-0 fs-5">
                Nome: <b>{DataBanco.nome}</b>
              </p>
              {DataBanco.numero && (
                <p className="m-0 fs-6">
                  Número: <span className="text-cor-1">{DataBanco.numero}</span>
                </p>
              )}
            </div>
            <div className="col-12">
              <div className="mt-3 d-flex justify-content-between">
                <h4 className="m-0 fs-4">Cartoes</h4>
                <Button
                  label="Adicionar Cartao"
                  icon="ak ak-plus-circle"
                  className="btn btn-preto"
                  onClick={() => setShowModalCartao(true)}
                />
              </div>
            </div>
            <div className="col-12">
              <DataTable value={ListaCartao}>
                <Column field="nome" header="Apelido" />
                <Column field="numero" header="Número" />
                <Column
                  header="Ação"
                  body={(rowData) => (
                    <>
                      <Button
                        icon="ak ak-edit"
                        text
                        severity="secondary"
                        className="btn-card"
                        onClick={() => {
                          GetCartaoById(rowData.cartao_id);
                          setIdCartao(rowData.cartao_id);
                          setShowModalCartao(true);
                        }}
                      />
                      <Button
                        icon="ak ak-trash"
                        text
                        severity="secondary"
                        className="btn-card"
                        onClick={() => {
                          setIdCartao(rowData.cartao_id);
                          setShowExcluirCartao(true);
                        }}
                      />
                    </>
                  )}
                />
              </DataTable>
            </div>
          </div>
        }
      />

      <ModalLateral
        visible={ShowModal}
        onHide={() => {
          setShowModal(false);
          LimparCamposBanco();
        }}
        style={{ width: "40vw" }}
        header={<h3 className="m-0">{IdBanco ? "Atualizar" : "Novo"} Banco</h3>}
        body={
          <div className="row g-3">
            <FormBanco data={DataBanco} handleChange={HandleChangeBanco} />
            <div className="col-12">
              <div className="d-flex flex-row-reverse gap-3 mt-3">
                <Button
                  label="Salvar"
                  className="btn btn-azul"
                  onClick={HandleSubmitBanco}
                />
                <Button
                  label="Cancelar"
                  className="btn btn-preto"
                  onClick={() => {
                    LimparCamposBanco();
                    setShowModal(false);
                  }}
                />
              </div>
            </div>
          </div>
        }
      />

      <ConfirmDialog
        visible={ShowExcluirCartao}
        message={
          <>
            Você está <b>excluindo um cartão</b>, quer continuar?
          </>
        }
        onHide={() => setShowExcluirCartao(false)}
        onConfirm={DeleteCartao}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <ConfirmDialog
        visible={ShowExcluirBanco}
        message={
          <>
            Você está <b>excluindo um banco</b>, quer continuar?
          </>
        }
        onHide={() => setShowExcluir(false)}
        onConfirm={DeleteBanco}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </section>
  );
};

export default ListaBanco;
