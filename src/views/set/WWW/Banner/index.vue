<template>
  <div>
    <el-card>
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
          <el-button type="primary" icon="el-icon-plus" @click="createBanner"
            >创建轮播图</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="list.data" style="width: 100%">
        <el-table-column
          type="index"
          label="编号"
          width="88"
          align="center"
        ></el-table-column>

        <el-table-column
          label="轮播图"
          width="width"
          prop="prop"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-image
              style="width: 100"
              :src="row.url"
              :preview-src-list="[row.url]"
              fit="cover"
              lazy
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="prop" width="100">
          <template slot-scope="{ row }">
            <span v-if="row.status == 1" class="normal">正常</span>
            <span v-else class="delete">已删除</span>
          </template>
        </el-table-column>

        <el-table-column label="标题" prop="prop" width="width">
          <template slot-scope="{ row }">
            <p class="content">{{ row.article.title }}</p>
          </template>
        </el-table-column>

        <el-table-column label="分类" prop="prop" width="150">
          <template slot-scope="{ row }">
            <el-tag type="success" effect="dark">
              {{ row.article.category.name }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="310" prop="prop" align="center">
          <template slot-scope="{ row }">
            <el-button type="warning" icon="el-icon-edit" @click="eidt(row)"
              >修改</el-button
            >
            <el-button type="danger" icon="el-icon-delete" @click="remove(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="mg-pagination">
        <el-pagination
          background
          :current-page="params.page"
          :page-sizes="[5, 10, 15]"
          :page-size="params.per_page"
          layout="prev, pager, next, jumper,->,total, sizes"
          :total="list.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>

      <div class="dialog">
        <el-dialog
          :title="info.id ? '修改轮播图' : '创建轮播图'"
          :visible.sync="dialogFormVisible"
          width="30%"
        >
          <el-form :model="info" :rules="rules" ref="ruleForm">
            <el-form-item
              label="轮播图"
              :label-width="formLabelWidth"
              prop="url"
            >
              <el-upload
                class="avatar-uploader"
                action="/dev-api/admin/v1/banners/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="info.url" :src="info.url" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过 3 Mb
                </div>
              </el-upload>
            </el-form-item>

            <el-form-item
              label="文章"
              :label-width="formLabelWidth"
              prop="article_id"
            >
              <el-select v-model="info.article_id" placeholder="请选择文章">
                <el-option
                  :label="article.title"
                  :value="article.id"
                  v-for="article in articleList"
                  :key="article.id"
                  >{{ article.title }}</el-option
                >
              </el-select>
            </el-form-item>

            <el-form-item
              label="排序"
              :label-width="formLabelWidth"
              prop="order"
            >
              <el-input
                v-model="info.order"
                autocomplete="off"
                placeholder="排序"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="状态"
              :label-width="formLabelWidth"
              prop="status"
            >
              <el-select v-model="info.status" placeholder="请选择用户状态">
                <el-option label="正常" :value="1">正常</el-option>
                <el-option label="删除" :value="0">删除</el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      params: {
        page: 1,
        per_page: 5,
        keywords: "",
      },
      list: {},
      info: {
        url: "",
        article_id: "",
        order: 1,
        status: 1,
      },
      articleList: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // validate
      rules: {
        url: [{ required: true, message: "请上传图片", trigger: "change" }],
        article_id: [
          { required: true, message: "请选择文章", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    async getData() {
      let result = await this.$API.www.reqGetBanners(this.params);
      if (result.code == 200) {
        this.list = result.data;
      }
    },
    async getArticles() {
      let result = await this.$API.www.reqGetArticles();
      if (result.code == 200) {
        this.articleList = result.data;
      }
    },
    search() {
      this.getData();
    },
    // 翻页
    handleSizeChange(val) {
      this.params.per_page = val;
      this.getData();
    },
    handleCurrentChange(page) {
      this.params.page = page;
      this.getData();
    },
    // 新建
    createBanner() {
      this.getArticles();
      this.dialogFormVisible = true;
    },
    eidt(row) {
      this.getArticles();
      this.dialogFormVisible = true;
      this.info = { ...row };
    },
    remove(row) {
      this.$confirm(`确定删除吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.www.reqDelBanners(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功！",
            });
            this.getData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // upload
    handleAvatarSuccess(res, file) {
      this.info.url = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      return (isJPG || isPNG) && isLt3M;
    },
    cancel() {
      this.dialogFormVisible = false;
      this.info = {};
    },
    save() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          let result = {};
          if (this.info.id) {
            result = await this.$API.www.reqPutBanners(this.info.id, this.info);
          } else {
            result = await this.$API.www.reqPostBanners(this.info);
          }
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: this.info.id ? "修改成功！" : "创建成功！",
            });
            this.dialogFormVisible = false;
            this.getData();
            this.info = {};
          }
        } else {
          this.$message({
            type: "error",
            message: "错误的提交！",
          });
          return false;
        }
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
/* banner上传 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-input {
  width: 80%;
}
</style>