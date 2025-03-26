<template>
    <div ref="chart" class="chart-container"></div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    name: 'GaugeChart',
    mounted() {
      this.initChart();
      this.updateChart();
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$refs.chart);
        this.chart.setOption({
          series: [
            {
              type: 'gauge',
              axisLine: {
                lineStyle: {
                  width: 30,
                  color: [
                    [0.3, '#67e0e3'],
                    [0.7, '#37a2da'],
                    [1, '#fd666d']
                  ]
                }
              },
              pointer: {
                itemStyle: {
                  color: 'auto'
                }
              },
              axisTick: {
                distance: -30,
                length: 8,
                lineStyle: {
                  color: '#fff',
                  width: 2
                }
              },
              splitLine: {
                distance: -30,
                length: 30,
                lineStyle: {
                  color: '#fff',
                  width: 4
                }
              },
              axisLabel: {
                color: 'inherit',
                distance: 40,
                fontSize: 20
              },
              detail: {
                valueAnimation: true,
                formatter: '{value} km/h',
                color: 'inherit'
              },
              data: [{ value: 70 }]
            }
          ]
        });
      },
      updateChart() {
        setInterval(() => {
          this.chart.setOption({
            series: [{
              data: [{ value: +(Math.random() * 100).toFixed(2) }]
            }]
          });
        }, 2000);
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 300px;
  }
  </style>
  