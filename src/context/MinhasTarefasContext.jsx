/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
import { createContext, useRef, useState, useMemo, useEffect } from "react";

import { format } from "date-fns";
import PropTypes from "prop-types";

import { useAuth } from "context/AuthContext";
import { useLayout } from "context/LayoutContext";
import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import useQuery from "utils/useQuery";

export const MinhasTarefasContext = createContext();

export const MinhasTarefasProvider = ({ children }) => {
  // Exemplo estado inicial dos dados
  /* const initialData = {
    lists: {
      "list-1": {
        id: "list-1",
        title: "To Do",
        cards: ["card-1", "card-2", "card-3"]
      },
      "list-2": {
        id: "list-2",
        title: "In Progress",
        cards: ["card-4"]
      },
      "list-3": { id: "list-3", title: "Done", cards: ["card-6", "card-5"] }
    },
    cards: {
      "card-1": { id: "card-1", titulo: "Task 1", descricao: "", check: false },
      "card-2": { id: "card-2", titulo: "Task 2", descricao: "", check: false },
      "card-3": { id: "card-3", titulo: "Task 3", descricao: "", check: false },
      "card-4": { id: "card-4", titulo: "Task 4", descricao: "", check: false },
      "card-5": { id: "card-5", titulo: "Task 5", descricao: "", check: false },
      "card-6": { id: "card-6", titulo: "Task 6", descricao: "", check: false }
    }
  }; */

  // Exemplo estado inicial dos dados
  const init = {
    lists: {},
    cards: {}
  };

  // Estados
  const draggedItemRef = useRef(); // Referência ao item arrastado
  const modalUser = useRef();
  const modalData = useRef();

  const auth = useAuth();
  const query = useQuery();
  const layout = useLayout();
  const notify = useNotification();
  const Requicicao = new Api(auth.logout, notify);
  const { setLoading } = useLoading();

  const [DataQuadro, setDataQuadro] = useState(init); // Dados do quadeo
  const [DataMenu, setDataMenu] = useState([]);
  const [ListaAtividades, setListaAtividades] = useState([]);

  const [FitroMenu, setFitroMenu] = useState("");
  const [OrdemMenu, setOrdemMenu] = useState(null);

  const [ShowModalTarefa, setShowModalTarefa] = useState(false);
  const [IsEditarTarefa, setIsEditarTarefa] = useState(null);
  const [DataEditaTarefa, setDataEditaTarefa] = useState(null);
  const [FocusTarefa, setFocusTarefa] = useState(null);

  const [ListaUsers, setListaUsers] = useState([]);

  const [previewIndex, setPreviewIndex] = useState(null); // Índice de pré-visualização do item arrastado
  const [previewListIndex, setPreviewListIndex] = useState(null); // Índice de pré-visualização do lista arrastado
  const [heightRef, setheightRef] = useState(0); // Referência altura do item
  const [isCursorTopHalf, setIsCursorTopHalf] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [visibleRight, setVisibleRight] = useState();
  const [dataModal, setDataModal] = useState({
    titulo: "",
    check: false
  });
  const [isEditiCardId, setIsEditiCardId] = useState(null);
  const [indexEditiNameList, setIndexEditiNameList] = useState(null);
  const [isEditiNameList, setIsEditiNameList] = useState(null);

  const [UpdatedCardId, setUpdatedCardId] = useState();

  const [PreserveOldDate, setPreserveOldDate] = useState(null);

  const [ShowAtividadesDia, setShowAtividadesDia] = useState(false);
  const [DataFoco, setDataFoco] = useState(null);

  const ShowListaAtividadesDia = (dia) => {
    setDataFoco(dia);
    setShowAtividadesDia(true);
  };

  /**
   * Manipula o evento de arrastar no começando.
   * @param {Object} e - Objeto de evento.
   * @param {number} index - Índice do item arrastado.
   * @param {string} listId - ID da lista onde o item está.
   */
  const OnDragStart = (e, cardId, index) => {
    try {
      e.dataTransfer.setData("cardId", cardId);

      draggedItemRef.current = e.target;
      setPreviewIndex(index);
      setDraggedCardId(cardId);
      const height = e.target.offsetHeight;
      setheightRef(height);
    } catch (error) {
      console.error("Erro OnDragStart:", error);
    }
  };

  /**
   * Manipula o evento de arrastar sobre.
   * @param {Object} e - Objeto de evento.
   * @param {number} index - Índice onde o item está sendo arrastado.
   * @param {string} listId - Id da lista item está sendo arrastado.
   */
  const OnDragOver = (e, index, listId) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect(); // Obtém as coordenadas do retângulo do elemento
    const mouseY = e.clientY - rect.top; // Calcula a posição do cursor verticalmente dentro do elemento

    // Calcula a altura do elemento
    const elementHeight = rect.bottom - rect.top;

    // Determina se o cursor está na metade superior ou inferior do elemento
    setIsCursorTopHalf(mouseY < elementHeight / 2);

    setPreviewIndex(index);
    setPreviewListIndex(listId);
  };

  /**
   * Manipula o evento de arrastar sobre.
   * @param {Object} e - Objeto de evento.
   * @param {string} listId - Id da lista item está sendo arrastado.
   */
  const OnDragOverList = (e, listId) => {
    e.preventDefault();
    setPreviewListIndex(listId);
  };

  const SetShowModal = (cardId) => {
    setVisibleRight(true);
    setDataModal(DataQuadro.cards[cardId]);
    setIsEditiCardId(cardId);
  };

  const OnChangeItemData = (valor, name) => {
    const newData = { ...DataQuadro };
    if (name === "comantarios") {
      const isData = format(new Date(), "dd/MM/yyyy HH:mm:ss");
      if (Array.isArray(newData.cards[isEditiCardId][name])) {
        newData.cards[isEditiCardId][name].push({ valor, data: isData });
      } else {
        newData.cards[isEditiCardId][name] = [{ valor, data: isData }];
      }
    } else {
      newData.cards[isEditiCardId][name] = valor;
    }
    setDataQuadro(newData);
  };

  const ChangeListTitle = (listId, newTitle) => {
    // Crie uma cópia profunda dos dados originais
    const newData = {
      ...DataQuadro,
      lists: {
        ...DataQuadro.lists,
        [listId]: {
          ...DataQuadro.lists[listId],
          title: newTitle
        }
      }
    };

    // Atualize o estado com o novo título da lista
    setIsEditiNameList(newTitle);
    setDataQuadro(newData);
  };

  const ShowEditiUser = (e, cardId) => {
    try {
      setIsEditiCardId(cardId);
      setDataModal(DataQuadro.cards[cardId]);
      modalUser.current.toggle(e);
    } catch (error) {
      console.error(error);
      notify({
        type: "erro",
        message: "Modulo Edição de usuario não encontrado"
      });
    }
  };

  const ShowEditiData = (e, cardId) => {
    try {
      setIsEditiCardId(cardId);
      setDataModal(DataQuadro.cards[cardId]);
      setPreserveOldDate(DataQuadro.cards[cardId].data);
      modalData.current.toggle(e);
    } catch (error) {
      console.error(error);
      notify({
        type: "erro",
        message: "Modulo Edição de data não encontrado"
      });
    }
  };

  const ShowModalEditarTarefa = (id) => {
    setIsEditarTarefa(id);
    setShowModalTarefa(true);
    setDataEditaTarefa(DataMenu.filter((x) => x.tarefa_id === id)[0]);
  };

  const CloseModalTarefa = () => {
    setShowModalTarefa(false);
    setIsEditarTarefa(null);
    setDataEditaTarefa(null);
  };

  const GetByTarefaId = async () => {
    try {
      setLoading(true);
      const data = await Requicicao.Get({
        endpoint: "/Tarefa/ById",
        params: { id: FocusTarefa },
        config: auth.GetHeaders()
      });

      const compare = (a, b) => {
        if (a.index < b.index) {
          return -1;
        }
        if (a.index > b.index) {
          return 1;
        }
        return 0;
      };

      setListaAtividades(
        data.tarefaCulonas
          .flatMap((culona) =>
            culona.atividades.map((item) => ({
              ...item,
              nome_colona: culona.nome,
              nome_tarefa: data.nome
            }))
          )
          .sort((a, b) => new Date(a.data_limite) - new Date(b.data_limite))
      );

      // Criação das listas com base na resposta da API
      const lists = data.tarefaCulonas.reduce((acc, item) => {
        acc[`list-${item.tarefa_colona_id}`] = {
          id: `list-${item.tarefa_colona_id}`,
          title: item.nome,
          cards: item.atividades
            .sort(compare)
            .map((atividade) => `card-${atividade.atividade_id}`)
        };
        return acc;
      }, {});

      // Criação dos cartões com base na resposta da API
      const cards = data.tarefaCulonas.reduce((acc, tarefa) => {
        tarefa.atividades.forEach((item) => {
          acc[`card-${item.atividade_id}`] = {
            id: `card-${item.atividade_id}`,
            titulo: item.nome,
            descricao: item.descricao ?? "",
            check: item.concluido,
            data: item.data_limite != null ? new Date(item.data_limite) : null,
            dataEntraga:
              item.data_entraga != null ? new Date(item.data_entraga) : null,
            responavel: item.responsavel_id
              ? ListaUsers.filter((x) => x.code === item.responsavel_id)[0]
              : null,
            index: item.index,
            comantarios: item.comentarios
              ? item.comentarios.map((comentario) => ({
                  data: format(comentario.data_hora, "dd/MM/yyyy hh:mm:ss"),
                  valor: comentario.conteudo,
                  user: comentario.nome
                }))
              : [],
            total_subatividades: item.total_subatividades,
            total_subatividades_concluidas: item.total_subatividades_concluidas,
            total_anexo: item.total_anexo
          };
        });
        return acc;
      }, {});

      // Define o estado com a estrutura de dados ajustada
      const tarafa = {
        lists,
        cards
      };
      setDataQuadro(tarafa);

      if (data.cor != null) {
        layout.setCor(JSON.parse(data.cor));
        layout.setImg(null);
      } else if (data.img != null) {
        layout.setImg(data.img);
        layout.setCor(null);
      } else {
        layout.setCor(null);
        layout.setImg(null);
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const NovaSecao = async (nome) => {
    try {
      await Requicicao.Post({
        endpoint: "/Tarefa/Coluna",
        data: { tarefa_id: FocusTarefa, tarefaCulona: { nome } },
        config: auth.GetHeaders()
      });
      await GetByTarefaId();
    } catch (error) {
      console.error(error);
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
    }
  };

  const DeleteSecao = async (params) => {
    try {
      await Requicicao.Delete({
        endpoint: "/Tarefa/Coluna",
        params: { culunaId: parseInt(params.replace("list-", ""), 10) },
        config: auth.GetHeaders()
      });
      await GetByTarefaId();
    } catch (error) {
      console.error(error);
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
    }
  };

  const UpdateSecao = async (secaoId) => {
    try {
      const number = parseInt(secaoId.replace("list-", ""), 10);
      const data = {
        tarefa_colona_id: number,
        nome: DataQuadro.lists[secaoId].title
      };
      await Requicicao.Put({
        endpoint: "/Tarefa/Coluna",
        data,
        config: auth.GetHeaders()
      });
      setIndexEditiNameList(null);
      await GetByTarefaId();
    } catch (error) {
      console.error(error);
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
    }
  };

  const NovoCard = async (listId) => {
    try {
      const number = parseInt(listId.replace("list-", ""), 10);

      const data = await Requicicao.Post({
        endpoint: "/Tarefa/Atividade",
        data: {
          nome: "Task",
          tarefa_colona_id: number
        },
        config: auth.GetHeaders()
      });

      await GetByTarefaId();
      setUpdatedCardId(`card-${data}`);
    } catch (error) {
      console.error(error);
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
    }
  };

  useEffect(() => {
    if (UpdatedCardId) {
      SetShowModal(UpdatedCardId);
      setUpdatedCardId(null); // Reset para evitar chamadas repetidas
    }
  }, [DataQuadro]);

  const CloseModalAtividade = async (atulizaAtividae = true) => {
    try {
      if (dataModal?.id) {
        setLoading(true);
        if (atulizaAtividae) {
          const data = {
            atividade_id: parseInt(dataModal.id.replace("card-", ""), 10),
            nome: dataModal.titulo,
            concluido: dataModal.check,
            data_limite: dataModal.data
              ? format(dataModal.data, "yyyy-MM-dd'T'HH:mm:ss")
              : null,
            responsavel_id: dataModal?.responavel?.code ?? null,
            descricao: dataModal.descricao
          };
          await Requicicao.Put({
            endpoint: "/Tarefa/Atividade",
            data,
            config: auth.GetHeaders()
          });
        }
        await GetByTarefaId();
      }
      setVisibleRight(false);
    } catch (error) {
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
      console.error(error);
    }
  };

  const CloseModalResponavel = async () => {
    try {
      if (
        dataModal?.responavel?.code !== null &&
        dataModal?.responavel?.code !== undefined
      ) {
        const data = {
          atividade_id: parseInt(dataModal.id.replace("card-", ""), 10),
          responsavel_id: dataModal.responavel.code ?? null
        };
        await Requicicao.Put({
          endpoint: "/Tarefa/Atividade/Responsavel",
          data,
          config: auth.GetHeaders()
        });
        GetByTarefaId();
      }
    } catch (error) {
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
      console.error(error);
    }
  };

  const CloseModalDataLimete = async () => {
    try {
      if (dataModal.data) {
        const data = {
          atividade_id: parseInt(dataModal.id.replace("card-", ""), 10),
          data_limite: format(dataModal.data, "yyyy-MM-dd'T'HH:mm:ss")
        };
        await Requicicao.Put({
          endpoint: "/Tarefa/Atividade/DataLimete",
          data,
          config: auth.GetHeaders()
        });
        GetByTarefaId();
      }
    } catch (error) {
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
      OnChangeItemData(PreserveOldDate, "data");
      console.error(error);
    }
  };

  /**
   * Manipula o clique no botão de Concluida.
   * @param {string} cardId - ID do cartão que está sendo verificado.
   */
  const AlternarAtividadeConcluida = async (cardId) => {
    try {
      const data = {
        atividade_id: parseInt(cardId.replace("card-", ""), 10),
        concluido: !DataQuadro.cards[cardId].check
      };
      await Requicicao.Put({
        endpoint: "/Tarefa/Atividade/Concluido",
        data,
        config: auth.GetHeaders()
      });
      await GetByTarefaId();
    } catch (error) {
      console.error(error);
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
    }
  };

  /**
   * Manipula o evento de soltar.
   * @param {Object} e - Objeto de evento.
   * @param {number} index - Índice onde o item está sendo solto.
   * @param {string} listId - ID da lista onde o item está sendo solto.
   */
  const OnDrop = async (e, index, listId) => {
    try {
      const cardId = e.dataTransfer.getData("cardId");

      if (cardId == null || cardId === undefined || cardId === "") {
        throw new Error(
          "O card Id é inválido: valor nulo, indefinido ou vazio." +
            "Feche o navegador e abro de novamente se isso não resolver entre em contato com o suporte"
        );
      }

      let estaEmCima = false;
      if (DataQuadro.lists[listId].cards.length > 0) {
        if (isCursorTopHalf) {
          estaEmCima = true;
        }
      }

      const data = {
        atividade_id: parseInt(cardId.replace("card-", ""), 10),
        index,
        tarefa_colona_id: parseInt(listId.replace("list-", ""), 10),
        esta_em_cima: estaEmCima
      };

      await Requicicao.Put({
        endpoint: "/Tarefa/Atividade/Posicao",
        data,
        config: auth.GetHeaders()
      });

      setheightRef(0);
      setPreviewIndex(null);
      setPreviewListIndex(null);
      await GetByTarefaId();
    } catch (error) {
      console.error({ error });
      if (error?.response?.data != null) {
        if (typeof error?.response?.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
      if (error?.message != null) {
        if (typeof error?.message === "string") {
          notify({
            type: "erro",
            message: error.message
          });
        }
      }
    }
  };

  const GetMyTarefas = async () => {
    try {
      setLoading(true);
      const data = await Requicicao.Get({
        endpoint: "/Tarefa/MyTarefa",
        config: auth.GetHeaders()
      });
      setDataMenu(
        data.map((item) => ({
          ...item,
          cor: item.cor ? JSON.parse(item.cor) : null
        }))
      );
    } catch (error) {
      console.error(error);
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const AddTarefa = async (data) => {
    try {
      setLoading(true);
      if (IsEditarTarefa == null) {
        await Requicicao.Post({
          endpoint: "/Tarefa",
          data,
          config: auth.GetHeaders()
        });
      } else {
        await Requicicao.Put({
          endpoint: "/Tarefa",
          data: { ...data, tarefa_id: IsEditarTarefa },
          config: auth.GetHeaders()
        });
        setIsEditarTarefa(null);
        setDataEditaTarefa(null);
      }
      setShowModalTarefa(false);
      GetMyTarefas();
      return true;
    } catch (error) {
      console.error(error);
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const AddComantarios = async (testo) => {
    try {
      const id = parseInt(dataModal.id.replace("card-", ""), 10);
      const data = { atividade_id: id, conteudo: testo };
      await Requicicao.Post({
        endpoint: "/Tarefa/Comentario",
        data,
        config: auth.GetHeaders()
      });
      GetMyTarefas();
      return true;
    } catch (error) {
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
      console.error(error);
      return false;
    }
  };

  const GetUsers = async () => {
    try {
      setLoading(true);
      const data = await Requicicao.Get({
        endpoint: "/Usuarios/GetByMyEmpresaMinInfo",
        config: auth.GetHeaders()
      });
      if (data != null)
        setListaUsers(
          data.map((item) => ({ name: item.nome, code: item.usuario_id }))
        );
    } catch (error) {
      if (error?.response?.data != null) {
        if (typeof error.response.data === "string") {
          notify({
            type: "erro",
            message: error.response.data
          });
        }
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (FocusTarefa !== null) GetByTarefaId();
  }, [FocusTarefa]);

  useEffect(() => {
    const Go = async () => {
      if (ListaUsers.length === 0) {
        setTimeout(() => Go(), 500);
      } else if (query.get("quadro") != null && FocusTarefa === null) {
        setFocusTarefa(Number(query.get("quadro")));
      }
    };
    Go();
  }, [query, ListaUsers]);

  useEffect(() => {
    const Go = async () => {
      await GetUsers();
      await GetMyTarefas();
    };

    return () => {
      if (auth.isAuthenticated()) Go();
    };
  }, [auth]);

  const value = useMemo(
    () => ({
      modalUser,
      modalData,
      DataQuadro,
      previewIndex,
      previewListIndex,
      heightRef,
      isCursorTopHalf,
      draggedCardId,
      setDraggedCardId,
      visibleRight,
      setVisibleRight,
      dataModal,
      indexEditiNameList,
      setIndexEditiNameList,
      isEditiNameList,
      isEditiCardId,
      setIsEditiNameList,
      OnDragStart,
      OnDragOver,
      OnDragOverList,
      OnDrop,
      SetShowModal,
      NovaSecao,
      NovoCard,
      OnChangeItemData,
      ChangeListTitle,
      ShowEditiUser,
      ShowEditiData,
      DataMenu,
      ShowModalTarefa,
      setShowModalTarefa,
      ListaUsers,
      AddTarefa,
      ShowModalEditarTarefa,
      DataEditaTarefa,
      CloseModalTarefa,
      FocusTarefa,
      setFocusTarefa,
      UpdateSecao,
      CloseModalAtividade,
      CloseModalResponavel,
      CloseModalDataLimete,
      AlternarAtividadeConcluida,
      AddComantarios,
      ListaAtividades,
      FitroMenu,
      setFitroMenu,
      OrdemMenu,
      setOrdemMenu,
      ShowAtividadesDia,
      setShowAtividadesDia,
      DataFoco,
      ShowListaAtividadesDia,
      DeleteSecao
    }),
    [
      modalUser,
      modalData,
      DataQuadro,
      previewIndex,
      previewListIndex,
      heightRef,
      isCursorTopHalf,
      draggedCardId,
      visibleRight,
      dataModal,
      indexEditiNameList,
      isEditiNameList,
      isEditiCardId,
      DataMenu,
      ShowModalTarefa,
      ListaUsers,
      DataEditaTarefa,
      FocusTarefa,
      FitroMenu,
      OrdemMenu,
      ShowAtividadesDia,
      DataFoco
    ]
  );

  return (
    <MinhasTarefasContext.Provider value={value}>
      {children}
    </MinhasTarefasContext.Provider>
  );
};

MinhasTarefasProvider.propTypes = {
  children: PropTypes.element.isRequired
};
