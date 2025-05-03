import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import { useAuth } from "context/AuthContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import MaskUtil from "utils/MaskUtil";

import "./styled.scss";

const Home = () => {
  const auth = useAuth();
  const notify = useNotification();
  const Requicicao = new Api(auth.logout, notify);

  const [TarefasPendentes, setTarefasPendentes] = useState([]);
  const [TarefasHoje, setTarefasHoje] = useState([]);
  const [LembretesNotificacoes, setLembretesNotificacoes] = useState([]);

  const [SelectedAtividade, setSelectedAtividade] = useState(null);

  const GetAtividade = async () => {
    try {
      const data = await Requicicao.Get({
        endpoint: "/Tarefa/Atividade",
        config: auth.GetHeaders()
      });
      setTarefasPendentes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const GetAtividadeHoje = async () => {
    try {
      const data = await Requicicao.Get({
        endpoint: "/Tarefa/Atividade/Hoje",
        config: auth.GetHeaders()
      });
      setTarefasHoje(data);
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateLogAtividade = async (id, fazedo) => {
    try {
      if (fazedo) {
        await Requicicao.Put({
          endpoint: "/Tarefa/Log",
          data: {
            atividade_id: id
          },
          config: auth.GetHeaders()
        });
      } else {
        await Requicicao.Post({
          endpoint: "/Tarefa/Log",
          data: {
            atividade_id: id
          },
          config: auth.GetHeaders()
        });
      }
      await GetAtividade();
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

  const GetAllNotifications = async () => {
    try {
      const data = await Requicicao.Get({
        endpoint: "/Notificacao/MyNotificacao/Top5",
        config: auth.GetHeaders()
      });

      setLembretesNotificacoes(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const [AtividadeId, setAtividadeId] = useState(null);

  useEffect(() => {
    if (SelectedAtividade != null) {
      setAtividadeId(SelectedAtividade.atividade_id);
    } else {
      setAtividadeId(null);
    }
  }, [SelectedAtividade]);

  useEffect(() => {
    const Go = async () => {
      await GetAtividade();
      await GetAtividadeHoje();
      await GetAllNotifications();
    };

    if (auth.isAuthenticated()) {
      Go();
    }
  }, [auth]);

  return (
    <div className="home home-grid">
      <div className="item-tarefas">
        <div className="card sub-lista p-3">
          <div className="box-titulo pendentes">
            <div>
              <i
                className="bi bi-exclamation-circle-fill"
                style={{ color: "#000" }}
              />
              <h2 className="fs-4">Tarefas Pendentes</h2>
            </div>
            <Link className="btn btn-azul" to="/app/quadro/tarefas-pendentes">
              Visualizar todas
            </Link>
          </div>
          <DataTable
            value={TarefasPendentes}
            rows={5}
            selection={SelectedAtividade}
            onSelectionChange={(e) => setSelectedAtividade(e.value)}
            dataKey="atividade_id"
            selectionMode="single"
            metaKeySelection
            emptyMessage="Sem pendências"
          >
            <Column field="nome" header="Nome" />

            <Column field="nome_tarefa" header="Quadro" />
            <Column field="nome_colona" header="Seção" />
            <Column
              fieId="data_limite"
              header="Date Limite"
              body={(rowData) => MaskUtil.applyDataMask(rowData.data_limite)}
            />
            <Column
              header="Ação"
              body={(rowData) => (
                <Button
                  rounded
                  icon={!rowData.fazendo ? "pi pi-play" : "pi pi-pause"}
                  text={!rowData.fazendo}
                  severity={!rowData.fazendo ? "secondary" : "success"}
                  tooltip={
                    !rowData.fazendo
                      ? "Começar a registrar o tempo gasto nesta atividade"
                      : "Pausar o registro do tempo gasto nesta atividade"
                  }
                  tooltipOptions={{ position: "bottom" }}
                  onClick={() =>
                    UpdateLogAtividade(rowData.atividade_id, rowData.fazendo)
                  }
                />
              )}
            />
          </DataTable>
        </div>
      </div>
      <div className="item-hoje">
        <div className="card sub-lista p-3">
          <div className="box-titulo calenderio">
            <div>
              <i className="bi bi-calendar-check" style={{ color: "#000" }} />
              <h2 className="fs-4">Hoje</h2>
            </div>
            <Link className="btn btn-azul" to="/app/chart">
              Dashboard
            </Link>
          </div>
          <DataTable
            value={TarefasHoje}
            rows={5}
            selection={SelectedAtividade}
            onSelectionChange={(e) => setSelectedAtividade(e.value)}
            dataKey="atividade_id"
            selectionMode="single"
            metaKeySelection
            emptyMessage="Nenhuma tarefa agendada para hoje"
          >
            <Column field="nome" header="Nome" />
            <Column field="nome_tarefa" header="Quadro" />
            <Column field="nome_colona" header="Seção" />
            <Column
              fieId="data_limite"
              header="Date Limite"
              body={(rowData) => MaskUtil.applyDataMask(rowData.data_limite)}
            />

            <Column
              header="Ação"
              body={(rowData) => (
                <Button
                  rounded
                  icon={!rowData.fazendo ? "pi pi-play" : "pi pi-pause"}
                  text={!rowData.fazendo}
                  severity={!rowData.fazendo ? "secondary" : "success"}
                  tooltip={
                    !rowData.fazendo
                      ? "Começar a registrar o tempo gasto nesta atividade"
                      : "Pausar o registro do tempo gasto nesta atividade"
                  }
                  tooltipOptions={{ position: "bottom" }}
                  onClick={() =>
                    UpdateLogAtividade(rowData.atividade_id, rowData.fazendo)
                  }
                />
              )}
            />
          </DataTable>
        </div>
      </div>
      <div className="item-notificacao">
        <div className="card sub-lista p-3">
          <div className="box-titulo notificacao">
            <div>
              <i className="ak ak-bell ak-cor-2 fs-6" />
              <h2 className="fs-4">Notificações</h2>
            </div>
            <Link className="btn btn-azul" to="/app/notifications">
              Visualizar todas
            </Link>
          </div>
          <DataTable
            value={LembretesNotificacoes}
            rows={5}
            emptyMessage="Nenhum notificação."
          >
            <Column field="titulo" header="Titulo" />
            <Column
              fieId="data_criacao"
              header="Date"
              body={(rowData) =>
                MaskUtil.applyDataAndHoraMask(rowData.data_criacao)
              }
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Home;
