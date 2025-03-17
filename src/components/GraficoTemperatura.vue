<template>
    <div id="grafico-temperatura" style="width: 100%; height: 400px;"></div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    name: 'GraficoTemperatura',
    props: {
      dadosFiltrados: {
        type: Array,
        required: true,
      },
    },
    watch: {
      // Observa mudanças nos dados filtrados
      dadosFiltrados: {
        handler(novosDados) {
          this.atualizarGrafico(novosDados);
        },
        immediate: true, // Executa o handler imediatamente ao montar o componente
      },
    },
    methods: {
      atualizarGrafico(dados) {
        const chartDom = document.getElementById('grafico-temperatura');
        if (!chartDom) {
          console.error('Elemento do gráfico não encontrado.');
          return;
        }
  
        const myChart = echarts.init(chartDom);
  
        const horas = dados.map((item) => item.dataHora.split(' ')[1]); // Extrai a hora
        const tempIdeal = dados.length > 0 ? dados[0].tempIdeal : null; // Assume que tempIdeal é o mesmo para todos os registros
  
        // Calcula a máxima e mínima temperatura do dia
        const temperaturas = dados.map((item) => item.tempAtual);
        const maximaDia = Math.max(...temperaturas);
        const minimaDia = Math.min(...temperaturas);
  
        // Calcula os limites do eixo Y com base na máxima e mínima do dia
        const minY = minimaDia - 0.5; // Mínima do dia - 0.5
        const maxY = maximaDia + 0.5; // Máxima do dia + 0.5
  
        // Calcula a máxima e mínima desejada com base na tempIdeal
        const maximaDesejada = tempIdeal + 0.3;
        const minimaDesejada = tempIdeal - 0.3;
  
        // Configura os marcadores com base no status do aquecedor e ventilador
        const pontos = dados.map((item, index) => {
          const estilo = {};
  
          if (item.ventilador === 1) {
            estilo.itemStyle = { color: 'green' }; // Preenche com azul se o ventilador estiver ligado
          } else if (item.aquecedor === 1) {
            estilo.itemStyle = { color: 'red' }; // Preenche com vermelho se o aquecedor estiver ligado
          }
  
          return {
            ...estilo,
            value: item.tempAtual,
            name: horas[index],
          };
        });
  
        const option = {
          backgroundColor: '#f0f0f0', // Fundo cinza
          title: {
            text: 'Variação da Temperatura',
          },
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              const data = params[0].data.value; // Acessa o valor da temperatura
              const hora = params[0].name; // Hora
              const temp = data.toFixed(2); // Temperatura formatada
              const aquecedor = dados[params[0].dataIndex].aquecedor ? 'Aquecedor Ligado' : '';
              const ventilador = dados[params[0].dataIndex].ventilador ? 'Ventilador Ligado' : '';
  
              return `
                Hora: ${hora}<br>
                Temperatura: ${temp}°C<br>
                ${aquecedor}<br>
                ${ventilador}
              `;
            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: horas,
          },
          yAxis: {
            type: 'value',
            min: minY, // Valor mínimo do eixo Y (mínima do dia - 0.5)
            max: maxY, // Valor máximo do eixo Y (máxima do dia + 0.5)
            axisLabel: {
              formatter: '{value} °C',
            },
          },
          series: [
            {
              name: 'Temperatura',
              type: 'line',
              data: pontos, // Usa os pontos configurados
              markPoint: {
                data: [
                  {
                    type: 'max',
                    name: 'Máxima',
                    itemStyle: { color: 'red' }, // Cor do ponto máximo
                  },
                  {
                    type: 'min',
                    name: 'Mínima',
                    itemStyle: { color: 'blue' }, // Cor do ponto mínimo
                  },
                ],
              },
              markLine: {
                data: [
                  {
                    name: 'Máxima Desejada',
                    yAxis: maximaDesejada, // Linha de máxima desejada
                    lineStyle: { color: 'red', type: 'dashed' }, // Estilo da linha
                    label: {
                      show: true,
                      position: 'end',
                      formatter: `Máx: ${maximaDesejada.toFixed(2)}°C`, // Exibe o valor calculado
                    },
                  },
                  {
                    name: 'Mínima Desejada',
                    yAxis: minimaDesejada, // Linha de mínima desejada
                    lineStyle: { color: 'blue', type: 'dashed' }, // Estilo da linha
                    label: {
                      show: true,
                      position: 'end',
                      formatter: `Mín: ${minimaDesejada.toFixed(2)}°C`, // Exibe o valor calculado
                    },
                  },
                ],
              },
            },
          ],
        };
  
        myChart.setOption(option);
      },
    },
  };
  </script>