<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <el-card class="card">
      <el-row>
        <el-col :span="12">
          <PieChart />
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <ClockChart />
        </el-col>
      </el-row>
    </el-card>

    <el-card class="card">
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <BarChart />
        </el-col>
        <el-col :span="11">
          <LineChart />
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-row>
        <el-col :span="12">
          <PieChart />
        </el-col>
        <el-col :span="12">
          <ScatterChart />
        </el-col>
      </el-row>
    </el-card>


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BarChart from './BarChart/index.vue';
import LineChart from './LineChart/index.vue';
import PieChart from './PieChart/index.vue';
import ScatterChart from './ScatterChart/index.vue';
import ClockChart from './ClockChart/index.vue';


export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: { BarChart, LineChart, PieChart, ScatterChart, ClockChart }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
