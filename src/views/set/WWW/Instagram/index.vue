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
          <el-button type="primary" @click="uploadDialog">点击上传</el-button>
        </el-col>
      </el-row>

      <el-dialog
        title="上传图片"
        :visible.sync="uploadDialogVisible"
        width="50%"
        center
      >
        <span>
          <el-form :model="uploadData" :rules="rules" ref="ruleForm">
            <el-form-item label="标签" label-width="100px" prop="tags">
              <el-select
                v-model="uploadData.tags"
                value-key="name"
                multiple
                collapse-tags
                placeholder="请选择标签"
              >
                <el-option
                  v-for="item in tags"
                  :key="item.id"
                  :label="item.name"
                  :value="{ id: item.id, name: item.name }"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="图片" label-width="100px" prop="files">
              <el-upload
                ref="instagramUpload"
                class="upload-demo"
                :data="uploadParams"
                :auto-upload="false"
                action="/dev-api/admin/v1/instagrams/upload"
                :headers="{ Authorization: token }"
                :before-remove="beforeRemove"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :file-list="fileList"
                multiple
                :on-exceed="handleExceed"
                :on-success="handleSuccess"
                :limit="limit"
                drag
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过 3 Mb，最多上传5张图片
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="uploadConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

    <el-card>
      <div class="infinite-list-wrapper" style="overflow: auto">
        <div
          class="photo_list"
          v-infinite-scroll="handleCurrentChange"
          :infinite-scroll-disabled="disabled"
        >
          <div class="photo_item" v-for="item in imgsArr" :key="item.id">
            <el-image
              class="photo_img"
              :src="item.url"
              :preview-src-list="srcList"
              fit="cover"
              lazy
            >
              <!-- 加载中 -->
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <!-- 加载失败 -->
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <span class="photo_text">
              <el-tag type="" class="tag" v-for="t in item.tag" :key="t.id">{{t.name}}</el-tag>
            </span>
            <!-- <span>{{item}}</span> -->
          </div>

          <img src="" :style="{ 'flex-grow': 999 }" />
        </div>
        <p v-if="loading" class="footer-text">加载中...</p>
        <p v-if="noMore" class="footer-text">没有更多了！</p>
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
      tags: [],
      uploadData: {
        tags: [],
        files: [],
      },
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
      // 图片上传
      limit: 5,
      fileList: [],
      uploadDialogVisible: false,
      // validate
      rules: {
        tags: [{ required: true, message: "请选择标签", trigger: "change" }],
        files: [{ required: true, message: "请上传图片", trigger: "change" }],
      },
    };
  },
  computed: {
    noMore() {
      return this.params.page >= this.last_page;
    },
    disabled() {
      return this.loading || this.noMore;
    },
    // upload 额外参数-后台获取数据[Object Object]处理
    uploadParams() {
      return { tags: JSON.stringify(this.uploadData.tags) };
    },
  },
  methods: {
    async getData(type) {
      let result = await this.$API.instagram.reqGetInstagramList(this.params);
      if (result.code == 200) {
        if (type == 'search') {
          this.imgsArr = result.data.list.data;
          this.srcList = result.data.srcList;
        } else {
          this.imgsArr = this.imgsArr.concat(result.data.list.data);
          this.srcList = this.srcList.concat(result.data.srcList);
        }
        this.last_page = result.data.list.last_page;
        this.loading = false;
      }
    },
    async getTags() {
      let result = await this.$API.tag.reqGetTags();
      if (result.code == 200) {
        this.tags = result.data;
      }
    },
    // 翻页
    handleCurrentChange() {
      this.loading = true;
      setTimeout(() => {
        this.params.page++;
        this.getData();
      }, 2000);
    },
    // 图片搜索
    search() {
      this.params.page = 1;
      this.getData('search');
    },
    // 上传图片
    uploadDialog() {
      this.uploadDialogVisible = true;
    },
    // 文件超出限制个数的钩子
    handleExceed(files, fileList) {
      this.$message({
        type: "warning",
        message: `最多上传 ${this.limit} 个文件`,
      });
    },
    handleChange(file, fileList) {
      if (file.name && file.status != 'success') {
        this.uploadData.files.push(file.name);
      }
    },
    // 移除前的钩子
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除${file.name}？`);
    },
    // 移除钩子
    handleRemove(file, fileList) {
      this.uploadData.files.forEach((item, index) => {
        if (item.indexOf(file.name) !== -1) {
          this.uploadData.files.splice(index, 1);
        }
      });
    },
    handleSuccess(file, fileList) {
      if (file.code == 200) {
        this.$message({
          type: "success",
          message: "上传成功！",
        });
        this.imgsArr.unshift(file.data);
        this.srcList.unshift(file.data.url);
        this.uploadData.files = [];
        this.uploadData.tags = [];
        this.uploadDialogVisible = false;
        // 清空文件
        this.$refs.instagramUpload.clearFiles();
        // 重置表单
        this.$refs.ruleForm.resetFields();
      }
    },
    // 上传确认
    uploadConfirm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.$refs.instagramUpload.submit();
        } else {
          this.$message({
            type: "error",
            message: "提交错误!!",
          });
        }
      });
    },
    // 取消
    cancel() {
      // 重置数据
      this.uploadData.files = [];
      this.uploadData.tags = [];
      // 关闭弹窗
      this.uploadDialogVisible = false;
      // 清空文件
      this.$refs.instagramUpload.clearFiles();
      // 重置表单
      this.$refs.ruleForm.resetFields();
    },
  },
  created() {
    this.getData();
    this.getTags();
    this.token = "Bearer " + getToken();
  },
};
</script>

<style scoped lang="less">
// 瀑布流
.infinite-list-wrapper {
  height: calc(100vh - 300px);
}
.photo_list {
  display: flex;
  flex-wrap: wrap;
  .photo_item {
    height: 228px;
    min-width: 200px;
    flex-grow: 1;
    object-fit: cover;
    margin: 5px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    .photo_text {
      display: inline-block;
    }
    .photo_img {
      height: 228px;
      border-radius: 5px;
      width: 100%;
    }
  }
}
// 预览
/deep/ .el-image-viewer__mask {
  opacity: 1;
  background: #333;
}
/deep/ .el-image-viewer__close {
  color: #fff;
}
.image-slot {
  text-align: center;
  line-height: 228px;
}
.footer-text {
  margin-top: 20px;
  text-align: center;
}
.tag {
  position: relative;
  bottom: 40px;
  margin-left: 5px;
  background-color:rgba(236,245,255,0.8);
}
</style>