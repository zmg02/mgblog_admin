<template>
  <div class="chart" ref="main"></div>
</template>
  
  <script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      clothingData: [
        { title: "衬衫", num: "72" },
        { title: "羊毛衫", num: "12" },
        { title: "雪纺衫", num: "10" },
        { title: "裤子", num: "42" },
        { title: "高跟鞋", num: "62" },
        { title: "袜子", num: "102" },
      ],
      // 监视窗口大小
      screenWidth: "",
      screenHeight: "",
      myChart: null,
    };
  },
  methods: {
    init() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.main);
      // 绘制图表
      this.myChart.setOption({
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        xAxis: {
          data: this.clothingData.map((item) => item.title),
        },
        yAxis: {},
        series: [
          {
            type: "scatter",
            data: this.clothingData.map((item) => item.num),
            // symbolSize: 20,
            symbolSize: function (value) {
              return value / 2;
            },
            symbol:
              "path://M51.911,16.242C51.152,7.888,45.239,1.827,37.839,1.827c-4.93,0-9.444,2.653-11.984,6.905 c-2.517-4.307-6.846-6.906-11.697-6.906c-7.399,0-13.313,6.061-14.071,14.415c-0.06,0.369-0.306,2.311,0.442,5.478 c1.078,4.568,3.568,8.723,7.199,12.013l18.115,16.439l18.426-16.438c3.631-3.291,6.121-7.445,7.199-12.014 C52.216,18.553,51.97,16.611,51.911,16.242z",
            // 此系列自己的调色盘。
            color: [
              "#c23531",
              "#dd6b66",
              "#759aa0",
              "#e69d87",
              "#8dc1a9",
              "#ea7e53",
              "#eedd78",
              "#73a373",
              "#73b9bc",
              "#7289ab",
              "#91ca8c",
              "#f49f42",
            ],
          },
        ],
      });
    },
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    this.screenHeight = document.body.clientHeight;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        this.screenHeight = document.body.clientHeight;
        this.myChart.resize();
      })();
    };

    this.init();
  },
};
</script>
  
<style>
.chart {
  width: 50%;
  height: 500px;
}
</style>