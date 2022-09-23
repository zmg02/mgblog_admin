<!-- 轮播图 -->
<template>
  <div>
    <el-card class="card">
      <el-row>
        <el-col :span="12">
          <el-form :inline="true" class="demo-form-inline" :model="params">
            <el-form-item label="">
              <el-input
                v-model="params.keywords"
                placeholder="关键词"
              ></el-input>
            </el-form-item>

            <el-form-item label="">
              <el-button type="primary" icon="el-icon-search" @click="search"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-upload
            class="upload-demo"
            action="/dev-api/admin/v1/instagrams/upload"
            :headers="{ Authorization: token }"
            multiple
            :show-file-list="false"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过 3 Mb
            </div>
          </el-upload>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <div class="img-content">
        <!-- :gap="20"
        :mobileGap="8"
        :imgWidth="300"
        :maxCols="5"
        :imgWidth="imgWidth" -->
        <vue-waterfall-easy
          :imgsArr="imgsArr"
          srcKey="url"
          hrefKey="url"
          @scrollReachBottom="handleCurrentChange"
          @click="clickFn"
          ref="waterfall"
        >
          <div class="img-info" slot-scope="props">
            <div class="post-card-info">
              <ul class="list-inline">
                <li>
                  <a href="author.html">
                    <img
                      :src="props.value.user.avatar"
                      style="width: 40px; border-radius: 20px"
                    />
                  </a>
                </li>
                <li>
                  <a href="author.html">{{ props.value.user.name }}</a>
                </li>
                <li class="dot"></li>
                <li>{{ props.value.create_time }}</li>
              </ul>
            </div>
            <!-- <p class="some-info">第{{ props.index + 1 }}张图片</p> -->
          </div>

          <div slot="loading" slot-scope="{ isFirstLoad }">
            <div slot="loading" v-if="imgsArr.length == 0">暂无图片...</div>
            <div slot="loading" v-else-if="isFirstLoad">首次加载...</div>
            <div v-else>加载中...</div>
          </div>
          <div slot="waterfall-over" style="margin-top: 20px">我是有底的！</div>
        </vue-waterfall-easy>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      imgsArr: [],
      srcList: [],
      last_page: 0,
      params: {
        page: 1,
        per_page: 20,
        keywords: "",
      },
      token: "",
      loading: false,
      screenWidth: null,
      imgWidth: null,
    };
  },
  methods: {
    async getData() {
      let result = await this.$API.instagram.reqGetInstagramList(this.params);
      if (result.code == 200) {
        this.imgsArr = this.imgsArr.concat(result.data.list.data);
        this.srcList = this.srcList.concat(result.data.srcList);
        this.last_page = result.data.list.last_page;
      }
    },
    // 翻页
    handleCurrentChange() {
      if (this.last_page > this.params.page) {
        this.params.page++;
        this.getData();
      } else {
        this.$message({
          type: "error",
          message: "没有更多了！",
        });
        this.$refs.waterfall.waterfallOver();
      }
    },
    search() {
      this.getData();
    },
    // 上传图片 Todo
    handleSuccess(file, fileList) {
      if (file.code == 200) {
        this.$message({
          type: "success",
          message: "上传成功！",
        });
        this.imgsArr.unshift(file.data);
        this.srcList.unshift(file.data.url);
      }
    },
    // 图片点击
    // clickFn(event, { index, value }) {
    //   // 阻止a标签跳转
    //   event.preventDefault();
    //   // 只有当点击到图片时才进行操作
    //   if (event.target.tagName.toLowerCase() == "img") {
    //     this.imgInfo = value;
    //     this.isPreview = true;
    //   }
    // },
  },
  created() {
    this.getData();
    this.token = "Bearer " + getToken();
  },
};
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}

.img-content {
  height: calc(100vh - 300px);
}

/*  用户 */
.post-card-info ul {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.post-card-info li {
  margin-bottom: 0;
  font-size: 13px;
  color: #506172;
  text-transform: capitalize;
  font-weight: 500;
}
.post-card-info img {
  width: 40px !important;
  height: 40px;
  border-radius: 50%;
  margin-right: 7px;
}
.dot {
  width: 4px;
  height: 4px;
  background-color: #f67280;
  border-radius: 50%;
  display: block;
  margin: 2px 6px !important;
}
</style>