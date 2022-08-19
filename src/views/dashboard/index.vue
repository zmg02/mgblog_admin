<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <div class="head-chart">
      <el-row>
        <el-col :span="6">
          <el-card>
            <el-row>
              <el-col :span="12">新增用户</el-col>
              <el-col :span="12" style="text-align: right"
                ><span class="el-icon-info"></span
              ></el-col>
            </el-row>

            <LineChart />

            <div>用户总数：50001</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <div class="left-card">
            <el-card>
              <el-row>
                <el-col :span="12">新增用户</el-col>
                <el-col :span="12" style="text-align: right"
                  ><span class="el-icon-info"></span
                ></el-col>
              </el-row>

              <LineChart />

              <div>用户总数：50001</div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="left-card">
            <el-card>
              <el-row>
                <el-col :span="12">新增用户</el-col>
                <el-col :span="12" style="text-align: right"
                  ><span class="el-icon-info"></span
                ></el-col>
              </el-row>

              <LineChart />

              <div>用户总数：50001</div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="left-card">
            <el-card>
              <!-- <el-row>
                <el-col :span="12">新增用户</el-col>
                <el-col :span="12" style="text-align: right"
                  ><span class="el-icon-info"></span
                ></el-col>
              </el-row> -->

              <GaugeClock />

              <!-- <div>用户总数：50001</div> -->
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>

    <div>
                    <GaugeClock />
    </div>

    <div class="content">
      <el-row>
        <el-col :span="16">
          <el-card>
            <BarChart />
          </el-card>
        </el-col>
        <el-col :span="8">
          <div class="left-card">
            <el-card>
              <h3>最热文章</h3>
              <ul>
                <li v-for="value in articles" :key="value.id">
                  {{ value.title }}
                </li>
              </ul>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import GaugeClock from "./GaugeClock";
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      articles: [
        { id: 1, title: "大富翁" },
        { id: 2, title: "有钱银" },
        { id: 3, title: "三个愿望" },
        { id: 4, title: "三个愿望" },
        { id: 5, title: "三个愿望" },
        { id: 6, title: "三个愿望" },
        { id: 7, title: "三个愿望" },
        { id: 8, title: "三个愿望" },
        { id: 9, title: "三个愿望" },
        { id: 10, title: "三个愿望" },
      ],
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  components: {
    LineChart,
    BarChart,
    GaugeClock,
  },
};
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
.left-card {
  margin-left: 20px;
}
.content {
  margin: 20px 0;
}
</style>
