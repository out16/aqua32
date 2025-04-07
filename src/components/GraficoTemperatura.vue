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
  watch: {
    dadosFiltrados: {
      handler(novosDados) {
        this.atualizarGrafico(novosDados);
      },
      immediate: true,
    },
  },
  mounted() {
    window.addEventListener('resize', this.redimensionarGrafico);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.redimensionarGrafico);
  },
  methods: {
    atualizarGrafico(dados) {
      // Cria uma cópia invertida dos dados para o gráfico
      const dadosInvertidos = [...dados].reverse();

      const chartDom = document.getElementById('grafico-temperatura');
      if (!chartDom) {
        console.error('Elemento do gráfico não encontrado.');
        return;
      }

      const myChart = echarts.init(chartDom);

      // Usa os dados invertidos para o gráfico
      const horas = dadosInvertidos.map((item) => item.dataHora.split(' ')[1]);
      const tempIdeal = dadosInvertidos.length > 0 ? dadosInvertidos[0].tempIdeal : null;

      const temperaturas = dadosInvertidos.map((item) => item.tempAtual);
      const maximaDia = Math.max(...temperaturas);
      const minimaDia = Math.min(...temperaturas);

      const minY = minimaDia - 0.2;
      const maxY = maximaDia + 0.2;

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
          value: item.tempAtual,
          name: horas[index],
        };
      });

      const option = {
        backgroundColor: '#000533',
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0].data.value;
            const hora = params[0].name;
            const temp = data.toFixed(2);
            const aquecedor = dadosInvertidos[params[0].dataIndex].aquecedor ? 'Aquecedor Ligado' : '';
            const ventilador = dadosInvertidos[params[0].dataIndex].ventilador ? 'Ventilador Ligado' : '';

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
          axisLabel: {
    color: '#FFFFFF' // Cor dos rótulos do eixo X
  },
        },
        yAxis: {
          type: 'value',
          min: minY,
          max: maxY,
          axisLabel: {
    color: '#FFFFFF' // Cor dos rótulos do eixo X
  },
        },
        series: [
          {
            name: 'Temperatura',
            type: 'line',
            data: pontos,
            lineStyle: {
              color: '#1A25ED',
            },
            markPoint: {
              data: [
                {
                  type: 'max',
                  name: 'Máxima',
                  itemStyle: { color: 'Red' },
                  label: {
                    formatter: '{c} °C',
                  },
                },
                {
                  type: 'min',
                  name: 'Mínima',
                  itemStyle: { color: '#1A25ED' },
                  label: {
                    formatter: '{c} °C',
                  },
                },
              ],
            },
            markLine: {
              data: [
                {
                  name: 'Máxima Desejada',
                  yAxis: maximaDesejada,
                  lineStyle: { color: '#BB0600', type: 'dashed' },
                  label: {
                    show: true,
                    position: 'end',
                    formatter: `Máx: ${maximaDesejada.toFixed(2)}°C`,
                  },
                },
                {
                  name: 'Mínima Desejada',
                  yAxis: minimaDesejada,
                  lineStyle: { color: '#002463', type: 'dashed' },
                  label: {
                    show: true,
                    position: 'end',
                    formatter: `Mín: ${minimaDesejada.toFixed(2)}°C`,
                  },
                },
              ],
            },
          },
        ],
      };

      myChart.setOption(option);
      this.myChart = myChart;
    },
    redimensionarGrafico() {
      if (this.myChart) {
        setTimeout(() => {
          this.myChart.resize();
        }, 100);
      }
    },
  },
};
</script>

<style scoped>
.grafico-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>