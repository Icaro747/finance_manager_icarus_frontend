import { useState, useEffect, useMemo } from "react";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import { BoxCards, BtnsLayout } from "components/CardLayoutV2";
import FormNomeMovimentacao from "components/FormNomeMovimentacao";
import ModalLateral from "components/ModalLateral";

import { useAuth } from "context/AuthContext";
import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import MaskUtil from "utils/MaskUtil";

const ListaNomeMovimentacao = () => {
  // Contextos e utilitários
  const Auth = useAuth();
  const Notify = useNotification();
  const Requisicao = new Api(Auth.logout, Notify);
  const { setLoading } = useLoading();

  // Estados iniciais
  const InitDataNomeMovimentacao = {
    nome: "",
    categoria: null
  };

  // Estados das Testemunhas
  const [Lista, setLista] = useState([]);
  const [Buscar, setBuscar] = useState("");
  const [IdNomeMovimentacao, setIdNomeMovimentacao] = useState(null);
  const [DataNomeMovimentacao, setDataNomeMovimentacao] = useState(
    InitDataNomeMovimentacao
  );
  const [ShowExcluir, setShowExcluir] = useState(false);
  const [ShowModal, setShowModal] = useState(false);
  const [ShowModalDetalhes, setShowModalDetalhes] = useState(false);
  const [ListaMovimentecao, setListaMovimentecao] = useState([]);

  // Estados de visualização
  const [OrdemCrescente, setOrdemCrescente] = useState(true);
  const [LayoutLista, setLayoutLista] = useState(false);

  // Funções de manipulação de dados básicos
  const HandleChangeNomeMovimentacao = (field, value) => {
    setDataNomeMovimentacao((prev) => ({ ...prev, [field]: value }));
  };

  const LimparCamposNomeMovimentacao = () => {
    setIdNomeMovimentacao(null);
    setDataNomeMovimentacao(InitDataNomeMovimentacao);
  };

  // Funções de API - Operações CRUD
  const GetListaNomeMovimentacao = async () => {
    try {
      const resposta = await Requisicao.Get({
        endpoint: "/NomeMovimentacao/My",
        config: Auth.GetHeaders()
      });
      setLista(resposta);
    } catch (error) {
      console.error(error);
    }
  };

  const CarregarNomeMovimentacao = async (id, noShow) => {
    try {
      setLoading(true);
      const data = await Requisicao.Get({
        endpoint: `/NomeMovimentacao/${id}`,
        config: Auth.GetHeaders()
      });
      setDataNomeMovimentacao(data);
      if (!noShow) setShowModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const GetMovimentacaoByNome = async (id) => {
    try {
      setLoading(true);
      const data = await Requisicao.Get({
        endpoint: "/Movimentacao/ByNome",
        params: { nome_id: id },
        config: Auth.GetHeaders()
      });
      setListaMovimentecao(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const CriarNomeMovimentacao = async () => true;

  // Função auxiliar para atualizar NomeMovimentacao
  const AtualizarNomeMovimentacaoApi = async (data) => {
    await Requisicao.Put({
      endpoint: `/NomeMovimentacao/${IdNomeMovimentacao}`,
      data,
      config: Auth.GetHeaders()
    });
  };

  // Função auxiliar para criar nova categoria e retornar o ID
  const CriarCategoriaENomeMovimentacao = async (categoriaNome) => {
    const response = await Requisicao.Post({
      endpoint: "/Categoria",
      data: { nome: categoriaNome },
      config: Auth.GetHeaders()
    });
    return response.categoria_Id;
  };

  const AtualizarNomeMovimentacao = async () => {
    try {
      let categoriaId = null;

      // Determina o categoria_Id conforme o tipo de categoria
      if (typeof DataNomeMovimentacao?.categoria?.value === "string") {
        categoriaId = DataNomeMovimentacao.categoria.value;
      } else if (typeof DataNomeMovimentacao?.categoria === "string") {
        categoriaId = await CriarCategoriaENomeMovimentacao(
          DataNomeMovimentacao.categoria
        );
      }

      // Monta o payload para atualização
      const payload = {
        ...DataNomeMovimentacao,
        Categoria_Id: categoriaId
      };

      await AtualizarNomeMovimentacaoApi(payload);

      Notify({
        type: "sucesso",
        message: "Nome de Movimentação atualizado com sucesso"
      });
      return true;
    } catch (error) {
      console.error(error);
      Notify({
        type: "erro",
        message: "Erro ao tentar atualizar o nome de movimentação"
      });
      return false;
    }
  };

  const HandleSubmitNomeMovimentacao = async () => {
    try {
      setLoading(true);
      let sucesso = false;

      if (!IdNomeMovimentacao) sucesso = await CriarNomeMovimentacao();
      else sucesso = await AtualizarNomeMovimentacao();

      if (sucesso) {
        setShowModal(false);
        LimparCamposNomeMovimentacao();
        await GetListaNomeMovimentacao();
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
      await GetListaNomeMovimentacao();
      setLoading(false);
    };
    Init();
  }, []);

  const GetCardProps = (item) =>
    item
      ? {
          papel: "nome movimentoção",
          titulo: item.nome,
          borderColor:
            item.categoria === null
              ? "border-cor-laranja"
              : "border-cor-branca",
          infoFrente: [
            { label: "Categoria", valor: item.categoria?.nome ?? "N/D" }
          ],
          onDetalhes: () => {
            CarregarNomeMovimentacao(item.nome_movimentacao_id, true);
            GetMovimentacaoByNome(item.nome_movimentacao_id);
            setShowModalDetalhes(true);
          },
          onExcluir: () => {
            setShowExcluir(true);
            setIdNomeMovimentacao(item.nome_movimentacao_id);
          },
          onEditar: () => {
            CarregarNomeMovimentacao(item.nome_movimentacao_id);
            setIdNomeMovimentacao(item.nome_movimentacao_id);
          }
        }
      : {};

  // Filtragem e ordenação
  const listaFiltrada = useMemo(() => {
    let newListaFiltrada = [...Lista];

    if (newListaFiltrada.length === 0) return [];

    // Aplicar filtro de busca
    if (Buscar !== "") {
      newListaFiltrada = newListaFiltrada.filter((item) =>
        item.nome.toLowerCase().includes(Buscar.toLowerCase())
      );
    }

    // Aplicar ordenação
    newListaFiltrada.sort((a, b) => {
      const comparacao = a.nome.localeCompare(b.nome);
      return OrdemCrescente ? comparacao : -comparacao;
    });

    return newListaFiltrada;
  }, [Lista, Buscar, OrdemCrescente]);

  return (
    <section>
      <header>
        <div className="d-flex flex-row flex-wrap justify-content-between gap-2">
          <div className="d-flex flex-row flex-wrap gap-2">
            <Button
              label="Nova NomeMovimentacao"
              className="btn btn-azul"
              icon="ak ak-plus-circle"
              iconPos="right"
              onClick={() => {
                LimparCamposNomeMovimentacao();
                setShowModal(true);
              }}
            />
            <IconField iconPosition="left" style={{ maxWidth: "170px" }}>
              <InputIcon className="ak ak-magnifying-glass" />
              <InputText
                placeholder="Buscar NomeMovimentacao"
                value={Buscar}
                className="tipo-1"
                onChange={(e) => setBuscar(e.target.value)}
              />
            </IconField>
            <Button
              className="btn-azul"
              icon={`pi ${
                OrdemCrescente ? "pi-sort-alpha-down" : "pi-sort-alpha-up-alt"
              }`}
              onClick={() => setOrdemCrescente((e) => !e)}
            />
          </div>
          <BtnsLayout
            setLayoutLista={setLayoutLista}
            LayoutLista={LayoutLista}
          />
        </div>
        <hr />
      </header>

      <article className="mb-3">
        <BoxCards
          itens={listaFiltrada}
          getEntityId={(entity) => entity.nome_movimentacao_id}
          renderItem={GetCardProps}
          layoutLista={LayoutLista}
        />
      </article>

      <ModalLateral
        visible={ShowModalDetalhes}
        onHide={() => setShowModalDetalhes(false)}
        style={{ width: "50vw" }}
        header={<h3 className="m-0">Detalhes</h3>}
        body={
          <div className="d-flex flex-column gap-3">
            <div className="row g-3">
              <FormNomeMovimentacao
                data={DataNomeMovimentacao}
                handleChange={HandleChangeNomeMovimentacao}
                disabled
              />
              <div className="col-12">
                <DataTable
                  value={ListaMovimentecao}
                  dataKey="movimentacao_id"
                  sortField="data"
                  sortOrder={-1}
                >
                  <Column
                    field="valor"
                    header="Valor"
                    body={(rowData) =>
                      MaskUtil.applyMonetaryMask(rowData.valor)
                    }
                  />
                  <Column
                    field="data"
                    header="Data"
                    body={(rowData) => MaskUtil.applyDataMask(rowData.data)}
                  />
                </DataTable>
              </div>
            </div>
          </div>
        }
      />

      <ModalLateral
        visible={ShowModal}
        onHide={() => {
          setShowModal(false);
          LimparCamposNomeMovimentacao();
        }}
        style={{ width: "50vw" }}
        header={
          <h3 className="m-0">
            {IdNomeMovimentacao ? "Atualizar" : "Nova"} NomeMovimentacao
          </h3>
        }
        body={
          <div className="d-flex flex-column gap-3">
            <div className="row g-3">
              <FormNomeMovimentacao
                data={DataNomeMovimentacao}
                handleChange={HandleChangeNomeMovimentacao}
              />
              <div className="col-12">
                <div className="d-flex flex-row-reverse gap-3 mt-3">
                  <Button
                    label="Salvar"
                    className="btn btn-azul"
                    onClick={HandleSubmitNomeMovimentacao}
                  />
                  <Button
                    label="Cancelar"
                    className="btn btn-preto"
                    onClick={() => {
                      LimparCamposNomeMovimentacao();
                      setShowModal(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      />
    </section>
  );
};

export default ListaNomeMovimentacao;
