<template>
  <div class="gauge-container">
    <div ref="chartDom" style="width: 100%; height: 250px;"></div>
    <div class="ideal-temperature">
      Ideal: {{ formatTemperature(temperaturaPadrao) }}°C
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { database, ref, onValue } from '../firebase';

export default {
  name: 'TemperatureGauge',
  data() {
    return {
      myChart: null,
      firebaseUnsubscribe: null,
      temperaturaPadrao: 27.0, // Valor inicial será sobrescrito pelo Firebase
      option: {
        series: [
          {
            type: 'gauge',
            min: 25.0, // Valores mínimos e máximos ajustáveis
            max: 29.0,
            startAngle: 200,
            endAngle: -20,
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [0.35, '#67e0e3'],
                  [0.65, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              show: true,
              length: '80%',
              width: 8,
              itemStyle: {
                color: '#FFFFFF'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              valueAnimation: true,
              color: '#FFFFFF',
              fontSize: 28,
              offsetCenter: [0, '70%'],
              borderWidth: 0,
              formatter: (params) => {
                return this.formatTemperature(params) + '°C';
              }
            },
            data: [{
              value: 27.0
            }]
          }
        ]
      }
    };
  },
  methods: {
    formatTemperature(value) {
      return parseFloat(value).toFixed(2);
    },
    initChart() {
      this.myChart = echarts.init(this.$refs.chartDom);
      this.myChart.setOption(this.option);
    },
    setupFirebaseListener() {
      const dadosRef = ref(database, 'dadosMomentaneos');
      
      this.firebaseUnsubscribe = onValue(dadosRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          // Atualiza temperatura atual do gráfico
          if (data.temperatura !== undefined) {
            const tempValue = parseFloat(data.temperatura);
            if (!isNaN(tempValue)) {
              this.updateChart(tempValue);
            }
          }
          
          // Atualiza temperatura padrão (ideal) vinda do Firebase
          if (data.temperatura_ideal !== undefined) {
            const novaTemperaturaPadrao = parseFloat(data.temperatura_ideal);
            if (!isNaN(novaTemperaturaPadrao)) {
              this.temperaturaPadrao = novaTemperaturaPadrao;
              this.updateGaugeRange(); // Atualiza a faixa do gráfico
            }
          }
        }
      });
    },
    updateChart(temperature) {
      this.myChart.setOption({
        series: [{
          data: [{
            value: parseFloat(temperature)
          }]
        }]
      });
    },
    updateGaugeRange() {
      // Atualiza os limites do gráfico baseado na temperatura ideal
      const min = this.temperaturaPadrao - 2;
      const max = this.temperaturaPadrao + 2;
      
      this.myChart.setOption({
        series: [{
          min: min,
          max: max,
          axisLine: {
            lineStyle: {
              color: [
                [(this.temperaturaPadrao - 0.3 - min)/(max-min), '#67e0e3'],
                [(this.temperaturaPadrao + 0.3 - min)/(max-min), '#37a2da'],
                [1, '#fd666d']
              ]
            }
          }
        }]
      });
    }
  },
  mounted() {
    this.initChart();
    this.setupFirebaseListener();
  },
  beforeUnmount() {
    if (this.myChart) {
      this.myChart.dispose();
    }
    if (this.firebaseUnsubscribe) {
      this.firebaseUnsubscribe();
    }
  }
};
</script>

<style scoped>
.gauge-container {
  position: relative;
  width: 100%;
  height: 250px;
}

.ideal-temperature {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 11px;
  color: #AAAAAA;
  
  padding: 4px 8px;
 
  width: auto;
  max-width: 150px;
  margin: 0 auto;
  
}
</style>