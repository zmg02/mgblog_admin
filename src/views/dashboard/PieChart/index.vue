<template>
  <div class="chart" ref="main"></div>
</template>
  
  <script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      clothingData: [
        { name: "衬衫", value: "72" },
        { name: "羊毛衫", value: "12" },
        { name: "雪纺衫", value: "10" },
        { name: "裤子", value: "42" },
        { name: "高跟鞋", value: "62" },
        { name: "袜子", value: "102" },
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
        title: {
        //   text: "圆环图的例子",
          left: "center",
          top: "center",
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: this.clothingData.map((item) => item.name),
        },
        series: [
          {
            name: "销量",
            type: "pie",
            data: this.clothingData,
            // 饼图的半径
            // radius: "50%",
            // 圆环图
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
              emphasis: {
                show: true,
              },
            },
            labelLine: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
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
.chart {
  width: 50%;
  height: 500px;
}
</style>