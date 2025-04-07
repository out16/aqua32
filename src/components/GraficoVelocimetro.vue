<template>
  <div ref="chartDom" style="width: 100%; height: 250px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import { database, ref, onValue } from '../firebase';

export default {
  name: 'TemperatureGauge',
  data() {
    const temperaturaPadrao = 27.0; // Defina aqui sua temperatura padrão
    
    return {
      myChart: null,
      firebaseUnsubscribe: null,
      temperaturaPadrao, // Disponibiliza como propriedade do componente
      option: {
        series: [
          {
            type: 'gauge',
            min: temperaturaPadrao - 1,   // temperaturaPadrao -1
            max: temperaturaPadrao + 1,   // temperaturaPadrao +1
            startAngle: 200,
            endAngle: -20,
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  // Pontos de quebra calculados dinamicamente
                  [(temperaturaPadrao - 0.3 - (temperaturaPadrao - 1)) / 2, '#67e0e3'], // Faixa baixa
                  [(temperaturaPadrao + 0.3 - (temperaturaPadrao - 1)) / 2, '#37a2da'], // Faixa média
                  [1, '#fd666d'] // Faixa alta
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
              formatter: '{value}°C',
              color: '#FFFFFF',
              fontSize: 28,
              offsetCenter: [0, '70%'],
              borderWidth: 0
            },
            data: [{
              value: temperaturaPadrao // Valor inicial
            }]
          }
        ]
      }
    };
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
  },
  methods: {
    initChart() {
      this.myChart = echarts.init(this.$refs.chartDom);
      this.myChart.setOption(this.option);
    },
    setupFirebaseListener() {
      const dadosRef = ref(database, 'dadosMomentaneos');
      
      this.firebaseUnsubscribe = onValue(dadosRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data && data.temperatura !== undefined) {
          const tempValue = parseFloat(data.temperatura);
          if (!isNaN(tempValue)) {
            this.updateChart(tempValue.toFixed(2));
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
    }
  }
};
</script>