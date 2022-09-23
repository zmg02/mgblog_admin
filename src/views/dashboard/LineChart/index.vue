<template>
    <div class="line-chart" ref="main"></div>
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
          // 全局调色盘。
          color: [
            "#c23531",
            "#2f4554",
            "#61a0a8",
            "#d48265",
            "#91c7ae",
            "#749f83",
            "#ca8622",
            "#bda29a",
            "#6e7074",
            "#546570",
            "#c4ccd3",
          ],
          title: {
            text: "ECharts 入门示例",
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            data: this.clothingData.map((item) => item.title),
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: "销量",
              type: "line",
              data: this.clothingData.map((item) => item.num),
              // 平滑曲线
              smooth: true,
              // 此系列自己的调色盘。
              color: [
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
  .line-chart {
    width: 50%;
    height: 500px;
  }
  </style>