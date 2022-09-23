<template>
  <div>
    <el-card class="card">
      <el-row>
        <el-col :span="12">
          <el-form :inline="true" class="demo-form-inline" :model="params">
            <el-form-item label="">
              <el-input
                v-model="params.keywords"
                placeholder="请输入关键词"
              ></el-input>
            </el-form-item>

            <el-form-item label="">
              <el-select v-model="params.status" placeholder="请选择状态">
                <el-option label="" value="">所有</el-option>
                <el-option :label="value" :value="index" v-for="(value, index) in status" :key="index"></el-option>
              </el-select>
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
      <section>
        <!-- @click="clickImage(index)" -->
        <div
          class="img-wrapper"
          v-for="(item, index) in imgsArr"
          :key="index"
        >
          <div class="img" :style="'backgroundImage: url(' + item.url + ');'">
            <el-image
              class="photo_img"
              :src="item.url"
              :preview-src-list="srcList"
              lazy
            >
              <!-- 加载中 -->
              <div slot="placeholder" class="image-slot">
                <img src="~@/assets/img/loading1.gif" class="loading" />
                <img src="~@/assets/img/error1.jpg" class="error" />
              </div>
              <!-- 加载失败 -->
              <div slot="error" class="image-slot">
                <!-- <img src="~@/assets/img/error1.jpg" /> -->
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div class="info">
            <span class="info_tag">
              <el-tag type="" class="tag" v-for="t in item.tag" :key="t.id">{{t.name}}</el-tag>
            </span>
          </div>
          <span class="set">
            <el-button @click="setImg(item)" size="mini">设置</el-button>
          </span>
          <span class="status">
            <span v-if="item.status == 0">
              <el-badge value="删除" class="item"></el-badge>
            </span>
            <span v-if="item.status == 1">
              <el-badge value="正常" class="item" type="primary"></el-badge>
            </span>
            <span v-if="item.status >= 2 && item.status <= 3">
              <el-badge value="待定" class="item" type="info"></el-badge>
            </span>
            <span v-if="item.status >= 4">
              <el-badge value="拒绝" class="item" type="warning"></el-badge>
            </span>
          </span>
        </div>
      </section>

      <div v-if="noMore" style="text-align: center;">没有更多了！</div>

      <el-dialog
        title="图片设置"
        :visible.sync="imgDialogVisible"
        width="30%"
        center
        @close="cancelSet"
      >
        <span>
          <el-form :model="imgInfo" ref="setForm" style="text-align: center;">
            <el-form-item label="标签" label-width="120px" prop="tag">
              <el-select
                v-model="imgInfo.tag"
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

            <el-form-item label="状态" label-width="120px" prop="status">
              <el-select
                v-model="imgInfo.status"
                placeholder="请选择状态"
              >
                <el-option
                  v-for="(value, index) in status"
                  :key="index"
                  :label="value"
                  :value="index"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="排序" label-width="120px" prop="order">
              <el-input class="input_order" v-model="imgInfo.order" placeholder="请输入排序"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelSet">取 消</el-button>
          <el-button type="primary" @click="setConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
// 滚动加载节流
import throttle from "lodash/throttle";

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
        per_page: 50,
        keywords: "",
        status: "",
      },
      token: "",
      noMore: false,
      // 图片上传
      limit: 5,
      fileList: [],
      uploadDialogVisible: false,
      // validate
      rules: {
        tags: [{ required: true, message: "请选择标签", trigger: "change" }],
        files: [{ required: true, message: "请上传图片", trigger: "change" }],
      },
      // 图片设置
      imgInfo: {},
      imgDialogVisible: false,
      status: [],
    };
  },
  computed: {
    // upload 额外参数-后台获取数据[Object Object]处理
    uploadParams() {
      return { tags: JSON.stringify(this.uploadData.tags) };
    },
  },
  methods: {
    async getData(type = '') {
      let result = await this.$API.instagram.reqGetInstagramList(this.params);
      if (result.code == 200) {
        if (type == "search" || type == "refresh") {
          this.imgsArr = result.data.list.data;
          this.srcList = result.data.srcList;
        } else {
          this.imgsArr = this.imgsArr.concat(result.data.list.data);
          this.srcList = this.srcList.concat(result.data.srcList);
        }
        this.last_page = result.data.list.last_page;
      }
    },
    async getTags() {
      let result = await this.$API.tag.reqGetTags();
      if (result.code == 200) {
        this.tags = result.data;
      }
    },
    async getStatus() {
      let result = await this.$API.instagram.reqInstagramStatus();
      if (result.code == 200) {
        this.status = result.data;
      }
    },
    //  页面滚动事件  常做下拉加载内容 防抖 节流
    pageScroll: throttle(function () {
      // 获取滚动的距离
      let scrollTop = document.documentElement.scrollTop;
      // 获取滚动的高度（获取整个html的高度）
      let scrollHeight = document.documentElement.scrollHeight;
      // 获取屏幕(浏览器)高度
      let clienHeight = document.documentElement.clientHeight;
      // 滚动的距离 + 屏幕高度 - 内容高度 >= 0 表示滚动到底部了      (下拉加载判断条件)

      if(scrollHeight-(scrollTop+clienHeight) <= 228){
        if (this.params.page < this.last_page) {
          //滚动至底部后请求数据
          this.params.page++;
          this.getData();
        } else {
          this.noMore = true;
          return false;
        }
      }
    }, 1000),
    // 图片搜索
    search() {
      this.params.page = 1;
      this.getData("search");
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
      // 排除上传成功的钩子
      if (file.name && file.status != "success") {
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
    // 图片设置
    setImg(img) {
      // 浅拷贝，不影响原始数据
      this.imgInfo = {...img};
      this.imgDialogVisible = true;
    },
    cancelSet() {
      this.imgInfo = {};
      // 关闭弹窗
      this.imgDialogVisible = false;
      // 重置表单
      this.$refs.setForm.resetFields();
    },
    async setConfirm() {
      let result = await this.$API.instagram.reqSetInstagram(this.imgInfo.id, this.imgInfo);
      if (result.code == 200) {
        this.imgInfo = {};
        // 关闭弹窗
        this.imgDialogVisible = false;
        // 重置表单
        this.$refs.setForm.resetFields();
        this.$message({
          type: 'success',
          message: '设置成功！'
        });
        this.getData('refresh');
      }
    }
  },
  created() {
    this.getData();
    this.getTags();
    this.getStatus();
    this.token = "Bearer " + getToken();
  },
  mounted() {
    // 监听页面滚动
    window.onscroll = this.pageScroll;
  },
};
</script>

<style scoped lang="less">
// 瀑布流
section {
  display: flex;
  flex-wrap: wrap;
  padding: 15px 5px;
  &::after {
    content: "";
    flex-grow: 99999;
  }
  .img-wrapper {
    flex-grow: 1;
    margin: 5px;
    position: relative;
    overflow: hidden;
    height: 228px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    .img {
      //   object-fit: cover;
      background-size: cover;
      background-position: center;
      img {
        // opacity: 0;
        min-width: 100%;
        height: 228px;
      }
    }
    .info {
      position: absolute;
      bottom: 0px;
      color: #ffffff;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.3);
      line-height: 44px;
      height: 0px;
    }
    .set {
      position: absolute;
      top: 5px;
      right: 5px;
    }
    .status {
      position: absolute;
      top: 10px;
      left: 5px;
    }
    &:hover .info {
      height: 44px;
      transition: all 0.5s;
    }
  }
}
.error {
  display: none;
}
/deep/ .el-image__inner {
  opacity: 0;
  // min-width: 100%;
  min-width: 200px;
  height: 228px;
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
  min-width: 200px;
  text-align: center;
  line-height: 228px;
}
.tag {
  margin-left: 5px;
  background-color: rgba(236, 245, 255, 0.8);
}
.input_order {
  width: 202px;
}
</style>