<template>
<div>
1111
  <ECharts class='chart' :option='option' />
</div>
</template>

<script>

export default {
  name: "GaugeClock",
  data() {
    return {
      option: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      }
    };
  }
};
</script>

<style scoped>

.chart {
  height: 400px;
}
</style>
