<template>
  <div ref="line" class="line-chart" />
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "LineChart",
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.line);
      const option = {
        xAxis: {
          // show: false,
          type: "category",
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          show: false,
          // type: "value",
        },
        series: [
          {
            data: [220, 1932, 90, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
          },
        ],
        grid: {
          top: "10%",
          right: "0%",
          bottom: "10%",
          left: "0%",
        },
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "red", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "blue", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      };
      // 绘制图表
      myChart.setOption(option);
    },
  },
};
</script>

<style>
.line-chart {
  width: 100%;
  height: 130px;
}
</style>
