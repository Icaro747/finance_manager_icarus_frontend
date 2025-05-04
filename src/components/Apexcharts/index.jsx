import React, { useMemo } from "react";
import Chart from "react-apexcharts";

import PropTypes from "prop-types";

import {
  ConstruirGraficoLinha,
  ConstruirGraficoColuna,
  ConstruirGraficoColunaLinha,
  ConstruirGraficoPizza,
  ConstruirGraficoAreaPolar,
  ConstruirGraficoBolha,
  ConstruirGraficoDispersao,
  ConstruirGraficoPadrao,
  ConstruirSeriesDados,
  VerificadorFormatoData
} from "./chartHelpers";

/**
 * Componente responsável por renderizar gráficos dinâmicos usando React ApexCharts.
 * @param {object} props - Propriedades do componente.
 * @param {object} props.data - Dados para renderização do gráfico.
 */
const Apexcharts = React.memo(({ data }) => {
  // Mapeamento de tipos de gráfico para funções de construção de opções
  const OpcoesMapaGraficos = {
    line: ConstruirGraficoLinha,
    column: ConstruirGraficoColuna,
    column_and_line: ConstruirGraficoColunaLinha,
    pie: ConstruirGraficoPizza,
    polar_area: ConstruirGraficoAreaPolar,
    bubble: ConstruirGraficoBolha,
    scatter: ConstruirGraficoDispersao
  };

  // Seleção da função de construção de opções de gráfico com base no tipo de gráfico
  const construirOpcoesGrafico = useMemo(
    () => OpcoesMapaGraficos[data.type] || ConstruirGraficoPadrao,
    [data.type]
  );

  // Construção das opções do gráfico
  const OpcoesGraficas = useMemo(
    () => construirOpcoesGrafico(data),
    [construirOpcoesGrafico, data]
  );
  console.log("🚀 ~ Apexcharts ~ OpcoesGraficas:", OpcoesGraficas);

  // Construção das séries de dados do gráfico
  const SeriesDados = useMemo(
    () => (VerificadorFormatoData(data) ? ConstruirSeriesDados(data) : []),
    [data]
  );

  return (
    <div className="w-100">
      {SeriesDados.length === 0 ? (
        <div>
          <p>sem conjuntos</p>
        </div>
      ) : (
        <Chart
          options={OpcoesGraficas}
          series={SeriesDados}
          type={OpcoesGraficas.type}
          height={300}
        />
      )}
    </div>
  );
});

// Definição do formato esperado para o conjunto de datasets
const datasetShape = PropTypes.shape({
  name: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
  ]).isRequired,
  type: PropTypes.oneOf(["column", "line"])
});

// Definição das propriedades esperadas pelo componente
Apexcharts.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.oneOf([
      "line",
      "column",
      "column_and_line",
      "pie",
      "polar_area",
      "bubble",
      "scatter"
    ]).isRequired,
    dynamicScale: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(datasetShape).isRequired
  }).isRequired
};

export default Apexcharts;
