/* eslint-disable no-plusplus */

import { format, } from 'date-fns';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { ptBR } from 'date-fns/locale';
import parseISO from 'date-fns/parseISO';

class MaskUtil {
  static valicaDado(value) {
    return value == null || value === ""
  }

  static applyNumero(numero) {
    try {
      // Converte o número para uma string
      let numeroString = numero.toString();

      // Verifica se o número é negativo
      const negativo = numeroString.startsWith('-');

      // Remove o sinal de negativo temporariamente para facilitar a formatação
      if (negativo) {
        numeroString = numeroString.substring(1);
      }

      // Divide a parte inteira e decimal (se houver)
      const partes = numeroString.split('.');
      const parteInteira = partes[0];
      const parteDecimal = partes.length > 1 ? `.${partes[1]}` : '';

      // Formata a parte inteira adicionando um ponto a cada três dígitos da direita para a esquerda
      let parteInteiraFormatada = '';
      for (let i = parteInteira.length - 1, j = 1; i >= 0; i--, j++) {
        parteInteiraFormatada = parteInteira[i] + parteInteiraFormatada;
        if (j % 3 === 0 && i !== 0) {
          parteInteiraFormatada = `.${parteInteiraFormatada}`;
        }
      }

      // Adiciona o sinal de negativo novamente (se necessário)
      if (negativo) {
        parteInteiraFormatada = `-${parteInteiraFormatada}`;
      }

      // Retorna o número formatado
      return parteInteiraFormatada + parteDecimal;
    } catch (error) {
      console.error(error);
      return 'NaN';
    }
  }

  static aQuantoTempo(data) {
    try {
      const AjustarDataParaFusoHorario = (dataISO) => {
        // Extrair as partes da data
        const partes = dataISO.match(/(\d+)/g);
        if (partes.length >= 6) {
          const [ano, mes, dia, hora, minuto, segundo] = partes;

          // Ajuste para -3 horas
          const dataAjustada = new Date(ano, mes - 1, dia, hora, minuto, segundo);
          dataAjustada.setHours(dataAjustada.getHours() - 3);

          // Retorne a data formatada
          return dataAjustada.toISOString();
        }
        // Se a string não estiver no formato esperado, retorne a mesma data
        return dataISO;
      };

      const dataCriacao = parseISO(AjustarDataParaFusoHorario(data));
      const tempoDecorrido = formatDistanceToNow(dataCriacao, { addSuffix: true, locale: ptBR })
        .replace('há cerca de', 'há')
        .replace('em cerca de', 'há');

      return tempoDecorrido;
    } catch (error) {
      console.error(error);
      return 'NaN';
    }
  }

  static applyNumeroCartao(value) {
    const numericValue = value.replace(/\D/g, '');
    return this.applyGenericMask(numericValue, '**** **** **** ####');
  }

  static applyMesAnoMask(value) {
    try {
      if (this.valicaDado(value)) return null
      return format(new Date(value), "MMMM yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return null;
    }
  }

  /**
   * Formata uma data para o formato "dd/MM/yyyy".
   *
   * Esta função recebe uma data no formato aceito pelo construtor de `Date` do JavaScript e a formata
   * como uma string no padrão de data "dia/mês/ano". É útil quando você precisa exibir datas em um formato
   * mais legível para o usuário.
   *
   * @param {string | Date | number} value - A data a ser formatada, que pode ser uma string, um objeto `Date`,
   *                                         ou um timestamp em milissegundos.
   * @returns {string} - A data formatada no padrão "dd/MM/yyyy".
   */
  static applyDataMask(value) {
    if (value == null) return null
    return format(new Date(value), 'dd/MM/yyyy');
  }

  /**
   * Formata uma data e hora para o formato "dd/MM/yyyy HH:mm:ss".
   *
   * Esta função recebe uma data e hora no formato aceito pelo construtor de `Date` do JavaScript e a formata
   * como uma string no padrão "dia/mês/ano horas:minutos:segundos". É útil quando você precisa exibir
   * informações de data e hora em um formato detalhado e legível para o usuário.
   *
   * @param {string | Date | number} value - A data e hora a ser formatada, que pode ser uma string, um objeto `Date`,
   *                                         ou um timestamp em milissegundos.
   * @returns {string} - A data e hora formatadas no padrão "dd/MM/yyyy HH:mm:ss".
   */
  static applyDataAndHoraMask(value) {
    if (this.valicaDado(value)) return null
    return format(new Date(value), 'dd/MM/yyyy HH:mm:ss');
  }

  static applyDiaMesHorario(value) {
    if (this.valicaDado(value)) return null
    const data = parseISO(value);
    return format(data, "dd MMMM HH:mm", { locale: ptBR });
  }

  static applyDia(value) {
    try {

      if (this.valicaDado(value)) return null
      const data = parseISO(value);
      return format(data, "dd", { locale: ptBR });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static applyMes(value) {
    try {
      if (this.valicaDado(value)) return null
      const data = parseISO(value);
      return format(data, "MMMM", { locale: ptBR });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static applyHorario(value) {
    try {
      if (this.valicaDado(value)) return null
      const data = parseISO(value);
      return format(data, "HH:mm", { locale: ptBR });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static applyRgfMask(value) {
    const numericValue = value.replace(/\D/g, '');
    return this.applyGenericMask(numericValue, '##.###.###-#');
  }


  static applyCpfMask(value) {
    const numericValue = value.replace(/\D/g, '');
    return this.applyGenericMask(numericValue, '###.###.###-##');
  }

  static applyCnpjMask(value) {
    const numericValue = value.replace(/\D/g, '');
    return this.applyGenericMask(numericValue, '##.###.###/####-##');
  }

  static applyRgCpfMask(value) {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length <= 9)
      return this.applyRgfMask(numericValue)

    return this.applyCpfMask(numericValue);
  }

  static applyCpfCnpjMask(value) {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');

    // Aplica a máscara independentemente do número de caracteres
    if (numericValue.length <= 11) {
      // Máscara para CPF
      return this.applyCpfMask(numericValue);
    }
    // Máscara para CNPJ
    return this.applyCnpjMask(numericValue);
  }

  static applyCepMask(value) {
    const numericValue = value.replace(/\D/g, '');

    return this.applyGenericMask(numericValue, '#####-###');
  }

  static applyCelularOrTelefoneMask(numero) {
    const numericValue = numero.replace(/\D/g, '');
    if (numericValue.length > 9) {
      return this.applyCelularMask(numero)
    }
    return this.applyTelefoneMask(numero)
  }

  static applyCelularMask(numero) {
    const numericValue = numero.replace(/\D/g, '');
    return this.applyGenericMask(numericValue, '(##) #####-####');
  }

  static applyTelefoneMask(value) {
    const numericValue = value.replace(/\D/g, '');

    return this.applyGenericMask(numericValue, '#####-####');
  }

  static normalizarNumeroData(value) {
    try {
      if (value > 9) return value;
      return `0${value}`;
    } catch (error) {
      console.error(error);
      return "01"
    }
  }

  static applyMonetaryMask(value) {
    if (this.valicaDado(value)) return null
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  static applyGenericMask(value, mask) {
    let maskedValue = '';
    let i = 0;
    let j = 0;

    while (i < value.length && j < mask.length) {
      if (mask[j] === '#') {
        maskedValue += value[i];
        i++;
      } else {
        maskedValue += mask[j];
      }
      j++;
    }

    return maskedValue;
  }
}

export default MaskUtil;
