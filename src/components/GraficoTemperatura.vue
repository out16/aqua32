<template>
  <div id="grafico-temperatura" class="grafico-container"></div>
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
  data() {
    return {
      myChart: null
    };
  },
  watch: {
    dadosFiltrados: {
      handler(novosDados) {
        if (novosDados && novosDados.length > 0) {
          this.atualizarGrafico(novosDados);
        }
      },
      immediate: true,
      deep: true
    },
  },
  mounted() {
    this.inicializarGrafico();
    window.addEventListener('resize', this.redimensionarGrafico);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.redimensionarGrafico);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  methods: {
    inicializarGrafico() {
      const chartDom = document.getElementById('grafico-temperatura');
      if (!chartDom) {
        console.error('Elemento do gráfico não encontrado.');
        return;
      }
      this.myChart = echarts.init(chartDom);
      if (this.dadosFiltrados && this.dadosFiltrados.length > 0) {
        this.atualizarGrafico(this.dadosFiltrados);
      }
    },
    atualizarGrafico(dados) {
      if (!this.myChart) return;

      // Verifica se os dados têm a estrutura esperada
      if (!dados.every(item => 'dataHora' in item && 'tempAtual' in item)) {
        console.error('Estrutura de dados inválida para o gráfico');
        return;
      }

      const dadosInvertidos = [...dados].reverse();
      const horas = dadosInvertidos.map((item) => {
        // Garante que dataHora seja tratada corretamente
        if (typeof item.dataHora === 'string') {
          return item.dataHora.split(' ')[1]; // Pega apenas a hora
        }
        return new Date(item.dataHora).toLocaleTimeString();
      });

      const tempIdeal = dadosInvertidos.length > 0 ? 
        parseFloat(dadosInvertidos[0].tempIdeal) || 26.5 : 26.5;

      const temperaturas = dadosInvertidos.map(item => parseFloat(item.tempAtual));
      const maximaDia = Math.max(...temperaturas);
      const minimaDia = Math.min(...temperaturas);

      const minY = Math.min(minimaDia - 0.5, tempIdeal - 1.5);
      const maxY = Math.max(maximaDia + 0.5, tempIdeal + 1.5);

      const maximaDesejada = tempIdeal + 0.3;
      const minimaDesejada = tempIdeal - 0.3;

      const pontos = dadosInvertidos.map((item, index) => {
        const estilo = {};
        if (item.ventilador === 1) {
          estilo.itemStyle = { color: '#002463' };
        } else if (item.aquecedor === 1) {
          estilo.itemStyle = { color: '#BB0600' };
        }
        return {
          ...estilo,
          value: parseFloat(item.tempAtual),
          name: horas[index],
        };
      });

      const option = {
        backgroundColor: '#000533',
        title: {
          text: 'Variação de Temperatura',
          textStyle: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0].data;
            const hora = data.name;
            const temp = data.value.toFixed(2);
            const item = dadosInvertidos[params[0].dataIndex];
            const aquecedor = item.aquecedor ? 'Aquecedor Ligado' : '';
            const ventilador = item.ventilador ? 'Ventilador Ligado' : '';
            
            return `Hora: ${hora}<br/>
                    Temperatura: ${temp}°C<br/>
                    ${aquecedor}<br/>
                    ${ventilador}`;
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: horas,
          axisLabel: {
            color: '#FFFFFF',
            rotate: 45
          },
          axisLine: {
            lineStyle: {
              color: '#FFFFFF'
            }
          }
        },
        yAxis: {
          type: 'value',
          min: minY,
          max: maxY,
          axisLabel: {
            color: '#FFFFFF',
            formatter: '{value}°C'
          },
          axisLine: {
            lineStyle: {
              color: '#FFFFFF'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        series: [
          {
            name: 'Temperatura',
            type: 'line',
            data: pontos,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#1A25ED',
              width: 3
            },
            markPoint: {
              data: [
                {
                  type: 'max',
                  name: 'Máxima',
                  itemStyle: { color: 'Red' },
                  label: {
                    formatter: 'Max: {c}°C',
                    color: '#FFFFFF'
                  },
                },
                {
                  type: 'min',
                  name: 'Mínima',
                  itemStyle: { color: '#1A25ED' },
                  label: {
                    formatter: 'Min: {c}°C',
                    color: '#FFFFFF'
                  },
                },
              ],
            },
            markLine: {
              data: [
                {
                  name: 'Máxima Desejada',
                  yAxis: maximaDesejada,
                  lineStyle: { 
                    color: '#BB0600', 
                    type: 'dashed',
                    width: 2
                  },
                  label: {
                    show: true,
                    position: 'end',
                    formatter: `Máx: ${maximaDesejada.toFixed(2)}°C`,
                    color: '#FFFFFF'
                  },
                },
                {
                  name: 'Mínima Desejada',
                  yAxis: minimaDesejada,
                  lineStyle: { 
                    color: '#002463', 
                    type: 'dashed',
                    width: 2
                  },
                  label: {
                    show: true,
                    position: 'end',
                    formatter: `Mín: ${minimaDesejada.toFixed(2)}°C`,
                    color: '#FFFFFF'
                  },
                },
              ],
            },
          },
        ],
      };

      this.myChart.setOption(option, true);
    },
    redimensionarGrafico() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
  },
};
</script>

<style scoped>
.grafico-container {
  width: 100%;
  height: 400px;
  min-height: 400px;
}
</style>