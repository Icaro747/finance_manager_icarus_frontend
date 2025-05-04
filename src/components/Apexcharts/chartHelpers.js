export function ConstruirGraficoLinha(data) {
  return {
    type: 'line',
    chart: { id: 'line-chart', type: 'line' },
    xaxis: { categories: data.labels, tickAmount: 7, },
  };
}

export function ConstruirGraficoColuna(data) {
  return {
    type: 'bar',
    chart: { id: 'bar-chart', type: 'bar' },
    xaxis: { categories: data.labels },
  };
}

export function ConstruirGraficoColunaLinha(data) {
  return {
    type: 'line',
    chart: { id: 'column_and_line-chart', type: 'line' },
    xaxis: { categories: data.labels },
    yaxis: data.dynamicScale
      ? data.datasets.map((dataset, i) => ({
        opposite: i > 0,
        title: { text: dataset.name },
      }))
      : {},
    stroke: { width: [0, 2] },
    dataLabels: { enabled: true, enabledOnSeries: [1] },
  };
}

export function ConstruirGraficoPizza(data) {
  return {
    type: 'pie',
    chart: { id: 'pie-chart', type: 'pie' },
    labels: data.labels,
  };
}

export function ConstruirGraficoAreaPolar(data) {
  return {
    type: 'polarArea',
    chart: { id: 'polarArea-chart', type: 'polarArea' },
    labels: data.labels,
  };
}

export function ConstruirGraficoBolha() {
  return {
    type: 'bubble',
    chart: { id: 'bubble-chart', type: 'bubble' },
    xaxis: { tickAmount: 10, type: 'numeric' },
  };
}

export function ConstruirGraficoDispersao() {
  return {
    type: 'scatter',
    chart: { id: 'scatter-chart', type: 'scatter' },
    xaxis: { tickAmount: 10, type: 'numeric' },
  };
}

export function ConstruirGraficoPadrao(data) {
  return {
    chart: { type: 'line' },
    xaxis: { categories: data.labels },
  };
}

export function VerificadorFormatoData(data) {
  /**
   * Função comum que executa verificações em datasets
   * @param {Array} datasets - Um array contendo os conjuntos de dados a serem verificados.
   * @param {Function} specificCheck - Uma função que realiza verificações específicas em cada conjunto de dados.
   * @returns {boolean} - Retorna true se todas as verificações forem bem-sucedidas, caso contrário, retorna false.
   */
  const CommonChecks = (datasets, specificCheck) => {
    if (!Array.isArray(datasets) || datasets.length === 0) {
      return false;
    }

    for (const dataset of datasets) {
      if (!specificCheck(dataset)) {
        return false;
      }
    }
    return true;
  };

  /**
   * Função que verifica se os datasets de 'column' e 'line' têm os campos 'name' e 'data'
   * @param {Object} dataset - O dataset a ser verificado.
   * @returns {boolean} - Retorna true se o dataset passar na verificação, caso contrário, retorna false.
   */
  const VerificaColumnOrLine = (dataset) => {
    if (!(
      dataset.name
      && dataset.data
      && Array.isArray(dataset.data)
      && dataset.data.every((num) => typeof num === 'number')
    )) {
      console.error("Erro: Dataset de 'column' ou 'line' inválido.");
      return false;
    }
    return true;
  };

  /**
   * Função que verifica se os datasets de 'column_and_line' têm os campos 'name', 'type' e 'data'
   * @param {Object} dataset - O dataset a ser verificado.
   * @returns {boolean} - Retorna true se o dataset passar na verificação, caso contrário, retorna false.
   */
  const VerificaColumnAndLine = (dataset) => {
    if (!(
      dataset.name
      && dataset.type
      && dataset.data
      && Array.isArray(dataset.data)
      && dataset.data.every((num) => typeof num === 'number')
    )) {
      console.error("Erro: Dataset de 'column_and_line' inválido.");
      return false;
    }
    return true;
  };

  /**
   * Função que verifica se os datasets de 'pie' e 'polar_area' têm o campo 'data'
   * @param {Object} dataset - O dataset a ser verificado.
   * @returns {boolean} - Retorna true se o dataset passar na verificação, caso contrário, retorna false.
   */
  const VerificaPieOrPolarArea = (dataset) => {
    if (!(
      dataset.data
      && Array.isArray(dataset.data)
      && dataset.data.every((num) => typeof num === 'number')
    )) {
      console.error("Erro: Dataset de 'pie' ou 'polar_area' inválido.");
      return false;
    }
    return true;
  };

  /**
   * Função que verifica se os datasets de 'bubble' têm os campos 'name', 'data',
   * e se cada ponto tem os campos 'x', 'y' e 'z'
   * @param {Object} dataset - O dataset a ser verificado.
   * @returns {boolean} - Retorna true se o dataset passar na verificação, caso contrário, retorna false.
   */
  const VerificaBubble = (dataset) => {
    if (!(
      dataset.name
      && dataset.data
      && Array.isArray(dataset.data)
      && dataset.data.every((point) => typeof point.x === 'string'
        && typeof point.y === 'number'
        && typeof point.z === 'number')
    )) {
      console.error("Erro: Dataset de 'bubble' inválido.");
      return false;
    }
    return true;
  };

  /**
   * Função que verifica se os datasets de 'scatter' têm os campos 'name', 'data',
   * e se cada ponto de dados é um array de dois elementos
   * @param {Object} dataset - O dataset a ser verificado.
   * @returns {boolean} - Retorna true se o dataset passar na verificação, caso contrário, retorna false.
   */
  const VerificaScatter = (dataset) => {
    if (!(
      dataset.name
      && dataset.data
      && Array.isArray(dataset.data)
      && dataset.data.every((point) => Array.isArray(point)
        && point.length === 2
        && typeof point[0] === 'number'
        && typeof point[1] === 'number')
    )) {
      console.error("Erro: Dataset de 'scatter' inválido.");
      return false;
    }
    return true;
  };

  switch (data.type) {
    case 'column':
    case 'line':
      return CommonChecks(data.datasets, VerificaColumnOrLine);
    case 'column_and_line':
      return CommonChecks(data.datasets, VerificaColumnAndLine);
    case 'pie':
    case 'polar_area':
      return CommonChecks(data.datasets, VerificaPieOrPolarArea);
    case 'bubble':
      return CommonChecks(data.datasets, VerificaBubble);
    case 'scatter':
      return CommonChecks(data.datasets, VerificaScatter);
    default:
      console.error('tipo de gráfico não reconhecido');
      return false;
  }
}

export function ConstruirSeriesDados(data) {
  switch (data.type) {
    case 'line':
    case 'column':
    case 'scatter':
    case 'bubble':
      return data.datasets.map((dataset) => ({
        name: dataset.name,
        data: dataset.data,
      }));
    case 'column_and_line':
      return data.datasets.map((dataset) => ({
        name: dataset.name,
        type: dataset.type,
        data: dataset.data,
      }));
    case 'pie':
    case 'polar_area':
      return data.datasets[0].data;
    default:
      return [];
  }
}
