<template>
  <div class="bar-chart" ref="main"></div>
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
          data: this.clothingData.map((item) => item.title),
          //   data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: this.clothingData.map((item) => item.num),
            barWidth: "25%",
            itemStyle: {
              barBorderRadius: 5,
              borderWidth: 1,
              borderType: "solid",
              borderColor: "#dd6b66",
              shadowColor: "#5470c6",
              shadowBlur: 3,
            },
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
            // 高亮样式。
            emphasis: {
              itemStyle: {
                // 高亮时点的颜色。
                color: "blue",
              },
              label: {
                show: true,
                // 高亮时标签的文字。
                formatter: "This is a emphasis label.",
              },
            },
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
.bar-chart {
  width: 50%;
  height: 500px;
}
</style>