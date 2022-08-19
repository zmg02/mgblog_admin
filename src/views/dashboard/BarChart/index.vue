<template>
  <div ref="bar" class="bar-chart" />
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.bar);
      const option = {
        barWidth: 25,
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      };
      // 绘制图表
      myChart.setOption(option);
    },
  },
};
</script>

<style>
.bar-chart {
  width: 100%;
  height: 300px;
}
</style>
