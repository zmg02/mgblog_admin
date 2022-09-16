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
      <div class="infinite-list-wrapper" style="overflow: auto">
        <div
          class="mg-masonry"
          v-infinite-scroll="load"
          :infinite-scroll-delay="500"
          infinite-scroll-disabled="disabled"
        >
          <div class="mg-masonry-item" v-for="item in list" :key="item.id">
            <div class="item-content">
              <div class="item-image">
                <el-image
                  style="width: 100%; border-radius: 10px 10px 0 0"
                  :src="item.url"
                  :preview-src-list="srcList"
                  infinite-scroll-distance="50px"
                  lazy
                >
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <!-- fit="cover" -->
              </div>
              <div class="item-text">
                <!-- <ul class="item-tag">
                <li class="item-tag-item" v-for="tag in item.tag" :key="tag.id">
                  <el-tag type="success">{{ tag.name }}</el-tag>
                </li>
              </ul> -->

                <div class="post-card-info">
                  <ul class="list-inline">
                    <li>
                      <a href="author.html">
                        <img
                          :src="item.user.avatar"
                          style="width: 40px; border-radius: 20px"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="author.html">{{ item.user.name }}</a>
                    </li>
                    <li class="dot"></li>
                    <li>2022年1月09日</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p v-if="loading" class="loading-text">加载中...</p>
        <p v-if="noMore" class="loading-text">没有更多了！</p>
      </div>

    </el-card>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      list: [],
      srcList: [],
      total: 0,
      last_page: 0,
      params: {
        page: 1,
        per_page: 20,
        keywords: "",
      },
      token: "",
      loading: false,
    };
  },
  computed: {
    noMore() {
      return this.last_page <= this.params.page;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  methods: {
    async getData() {
      let result = await this.$API.instagram.reqGetInstagramList(this.params);
      if (result.code == 200) {
        this.total = result.data.list.total;
        this.last_page = result.data.list.last_page;
        this.list.push(...result.data.list.data);
        this.srcList.push(...result.data.srcList);
      }
    },
    search() {
      this.getData();
    },
    // 上传图片 Todo
    handleSuccess(file, fileList) {
      console.log(file);
      if (file.code == 200) {
        this.$message({
          type: "success",
          message: "上传成功！",
        });
        this.getData();
      }
    },
    // 无限滚动
    load () {
        this.loading = true
        setTimeout(() => {
          this.params.page += 1;
          this.getData();
          this.loading = false
        }, 2000)
    },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePreview(file) {
    //   console.log(file);
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(
    //     `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
    //       files.length + fileList.length
    //     } 个文件`
    //   );
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // },
  },
  mounted() {
    this.getData();
    this.token = "Bearer " + getToken();
  },
};
</script>

<style scoped lang="less">
ul {
  padding: 0;
  margin: 0;
}
.infinite-list-wrapper {
  height: calc(100vh - 300px);
}
.infinite-list-wrapper::-webkit-scrollbar {display:none}
.mg-masonry {
  -moz-column-count: 5;
  -webkit-column-count: 5;
  column-count: 5;
  -moz-column-gap: 0;
  -webkit-column-gap: 0;
  padding-top: 0.5em;
}

.mg-masonry-item {
  border: 1px solid #cccccc;
  // padding: 8px;
  border-radius: 10px;
  -moz-page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  break-inside: avoid;
  margin: 0 0.5em 0.5em;
}
// 弹性布局
// .item-user {
//   display: flex;
//   align-items: center;
//   padding: 5px;
//   .user-name {
//     padding-left: 5px;
//   }
// }
.item-tag {
  display: flex;
}
.item-tag-item {
  flex: 1;
}
// 用户
.post-card-info ul {
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
.loading-text {
  text-align: center;
  margin-top: 50px;
}
</style>