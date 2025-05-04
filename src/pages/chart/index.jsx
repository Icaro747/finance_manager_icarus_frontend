import { useState, useEffect } from "react";

import { addLocale } from "primereact/api";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";

import Apexcharts from "components/Apexcharts";
import BigNumber from "components/BigNumber";
import { Row, Col } from "components/DynamicRowAndCol";

import { useAuth } from "context/AuthContext";
import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import CalendarioLinguas from "utils/CalendarioLinguas";

const Chart = () => {
  const Notify = useNotification();
  const Auth = useAuth();
  const Requisicao = new Api(Auth.logout, Notify);
  const { setLoading } = useLoading();

  addLocale("pt-br", CalendarioLinguas.ptBR());

  const [dates, setDates] = useState([]);
  const [Show, setShow] = useState(false);

  const json = [
    {
      index: 0,
      size: 12,
      sizeSm: null,
      sizeMd: null,
      sizeLg: null,
      sizeXl: null,
      type: "grafico",
      descricao:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      chartData: {
        type: "line",
        labels: [
          "01/01/2024",
          "02/01/2024",
          "03/01/2024",
          "04/01/2024",
          "05/01/2024",
          "06/01/2024"
        ],
        datasets: [
          { name: "valor 1", data: [10, 20, 30, 25, 35, 15] },
          { name: "valor 2", data: [5, 25, 10, 20, 25, 40] }
        ]
      }
    }
  ];

  const [jsonData, setJsonData] = useState(
    new Map(json.map((item) => [item.index, item]))
  );

  const onChangeJsonData = ({ index, data }) => {
    try {
      const updatedJson = new Map(jsonData); // Crie uma cópia do Map jsonData

      const existingObject = updatedJson.get(index);

      if (existingObject) {
        const newData = { ...existingObject, ...data };

        // Verifica se há outro objeto com o mesmo índice do novo objeto
        const existingIndexObject = [...updatedJson.entries()].find(
          ([key, value]) => key !== index && value.index === data.index
        );

        if (existingIndexObject) {
          // Troca os índices dos objetos
          const [existingIndex, existingData] = existingIndexObject;
          existingData.index = existingObject.index;
          existingObject.index = data.index;

          // Atualiza os objetos no Map
          updatedJson.set(index, existingData);
          updatedJson.set(existingIndex, newData);
        } else {
          // Se não há conflito de índices, apenas atualiza o objeto
          updatedJson.set(index, newData);
        }

        // Atualize o estado com o novo Map
        setJsonData(updatedJson);
      } else {
        console.error("Objeto não encontrado com o índice fornecido.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ShowItem = () => {
    const renderData = [];

    for (const [index, item] of jsonData) {
      if (item.type === "bigsNumbers") {
        renderData.push(
          <Col
            isEditar
            onChange={onChangeJsonData}
            isCard
            index={index}
            size={item.size}
            sizeSm={item.sizeSm}
            sizeMd={item.sizeMd}
            sizeLg={item.sizeLg}
            sizeXl={item.sizeXl}
          >
            <BigNumber data={item.chartData} />
          </Col>
        );
      } else if (item.type === "grafico") {
        renderData.push(
          <Col
            index={index}
            isEditar
            onChange={onChangeJsonData}
            descricao={item.descricao}
            isCard
            itemsCenter
            size={item.size}
            sizeSm={item.sizeSm}
            sizeMd={item.sizeMd}
            sizeLg={item.sizeLg}
            sizeXl={item.sizeXl}
          >
            <Apexcharts data={item.chartData} />
          </Col>
        );
      }
    }

    return renderData;
  };

  useEffect(() => {
    const Go = async () => {
      try {
        setLoading(true);
        const data = await Requisicao.Get({
          endpoint: "/Grafico/Linha/ByRangeData",
          params: {
            date1: new Date(dates[0]).toISOString(),
            date2: new Date(dates[1]).toISOString()
          },
          config: Auth.GetHeaders()
        });

        const thesJson = [
          {
            index: 0,
            size: 12,
            sizeSm: null,
            sizeMd: null,
            sizeLg: null,
            sizeXl: null,
            type: "grafico",
            descricao:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            chartData: data
          }
        ];
        setJsonData(new Map(thesJson.map((item) => [item.index, item])));

        setShow(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (dates[0] && dates[1]) Go();
  }, [dates]);

  return (
    <Row>
      <Col isCard size={12}>
        <div className="d-flex gap-3 w-100">
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value)}
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
            locale="pt-br"
            dateFormat="dd/mm/yy"
          />
          <Button icon="ak ak-clock" className="btn-quadro active" />
        </div>
      </Col>
      {Show && ShowItem()}
    </Row>
  );
};

export default Chart;
