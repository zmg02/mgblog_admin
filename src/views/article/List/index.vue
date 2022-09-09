<template>
  <div>
    <div v-if="showType == 'table'">
      <el-card class="card">
        <el-row>
          <el-col :span="18">
            <el-form :inline="true" class="demo-form-inline" :model="params">
              <el-form-item label="关键词">
                <el-input
                  v-model="params.keywords"
                  placeholder="关键词"
                ></el-input>
              </el-form-item>

              <el-form-item label="文章分类">
                <el-select
                  v-model="params.category_id"
                  placeholder="请选择文章分类"
                >
                  <el-option label="请选择文章分类" value=""></el-option>
                  <el-option
                    :label="value.name"
                    :value="value.id"
                    v-for="(value, index) in categories"
                    :key="value.id"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="状态">
                <el-select v-model="params.status" placeholder="请选择">
                  <el-option label="请选择状态" value=""></el-option>
                  <el-option
                    :label="value"
                    :value="index"
                    v-for="(value, index) in status"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="">
                <el-button type="primary" icon="el-icon-search" @click="search"
                  >搜索</el-button
                >
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" style="text-align: right">
            <el-button type="primary" icon="el-icon-plus" @click="create"
              >创建文章</el-button
            >
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div>
          <el-table
            ref="multipleTable"
            :data="articleList.data"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="45" prop="prop">
            </el-table-column>

            <el-table-column label="主图" width="88" prop="prop" align="center">
              <template slot-scope="{ row, $index }">
                <el-image
                  style="width: 80"
                  :src="row.default_img"
                  :preview-src-list="[row.default_img]"
                  fit="cover"
                  lazy
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </template>
            </el-table-column>

            <el-table-column
              label="作者"
              prop="user.name"
              width="width"
            ></el-table-column>

            <el-table-column label="标题" prop="prop" width="150">
              <template slot-scope="{ row }">
                <p class="content">{{ row.title }}</p>
              </template>
            </el-table-column>

            <el-table-column label="内容" prop="prop" width="200">
              <template slot-scope="{ row }">
                <p class="content">{{ row.content }}</p>
              </template>
            </el-table-column>

            <el-table-column
              label="分类"
              prop="category.name"
              width="width"
            ></el-table-column>

            <el-table-column
              label="标签"
              prop="tag"
              width="width"
            >
            <template slot-scope="{ row }">
              <el-tag type="success" effect="dark" v-for="tag in row.tag" :key="tag.id">{{tag.name}}</el-tag>
            </template>
          </el-table-column>

            <el-table-column label="状态" prop="prop" width="width">
              <template slot-scope="{ row }">
                <span v-if="row.status == 1" class="normal">正常</span>
                <span v-else class="delete">删除</span>
              </template>
            </el-table-column>

            <el-table-column label="评论" prop="prop" width="width">
              <template slot-scope="{ row }">
                <a href="" v-if="row.comment_count > 0">{{
                  row.comment_count
                }}</a>
                <span v-else>{{ row.comment_count }}</span>
              </template>
            </el-table-column>

            <el-table-column label="点赞" prop="praise_count" width="width">
            </el-table-column>

            <!-- <el-table-column label="创建时间" prop="create_time" width="150">
            </el-table-column> -->

            <el-table-column
              label="操作"
              width="210"
              prop="prop"
              align="center"
            >
              <template slot-scope="{ row, $index }">
                <el-tooltip class="item" effect="light" content="文章详情" placement="top">
                  <el-button type="info" icon="el-icon-info" @click="preview(row)"></el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="light" content="修改文章" placement="top">
                  <el-button type="warning" icon="el-icon-edit" @click="edit(row)"></el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="light" content="删除文章" placement="top">
                  <el-button type="danger" icon="el-icon-delete" @click="remove(row)" ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <div class="mg-pagination">
            <el-pagination
              background
              :current-page="params.page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="params.per_page"
              layout="prev, pager, next, jumper,->,total, sizes"
              :total="articleList.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>

    <div v-else-if="showType == 'edit'">
      <el-card class="card">
        <el-row>
          <el-col :span="12" style="line-height: 40px">修改文章</el-col>
          <el-col :span="12" style="text-align: right">
            <el-button
              type="primary"
              icon="el-icon-back"
              @click="showType = 'table'"
              >返回文章列表</el-button
            >
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <el-form :model="articleInfo" :rules="rules" ref="ruleEditForm">
          <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
            <el-input
              v-model="articleInfo.title"
              autocomplete="off"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>

          <el-form-item label="作者" :label-width="formLabelWidth">
            <span>{{ articleInfo.user.name }}</span>
          </el-form-item>

          <el-form-item
            label="主图"
            :label-width="formLabelWidth"
            prop="default_img"
          >
            <el-upload
              class="avatar-uploader"
              action="/dev-api/admin/v1/articles/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="articleInfo.default_img"
                :src="articleInfo.default_img"
                style="width: 200px"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item
            label="内容"
            :label-width="formLabelWidth"
            prop="content"
          >
            <Tinymce v-model="articleInfo.content"></Tinymce>
          </el-form-item>

          <el-form-item
            label="分类"
            :label-width="formLabelWidth"
            prop="category_id"
          >
            <el-select v-model="articleInfo.category_id" placeholder="请选择">
              <el-option
                :label="value.name"
                :value="value.id"
                v-for="(value, index) in categories"
                :key="value.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="标签"
            :label-width="formLabelWidth"
            prop="tag_id"
          >
          <!-- value-key="name" 作为 value 唯一标识的键名，绑定值为对象类型时必填 -->
            <el-select
              v-model="articleInfo.tag"
              value-key="name"
              multiple
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="{id:item.id, name:item.name}">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="状态"
            :label-width="formLabelWidth"
            prop="status"
          >
            <el-select v-model="articleInfo.status" placeholder="请选择">
              <el-option
                :label="value"
                :value="index"
                v-for="(value, index) in status"
                :key="index"
                >{{ value }}</el-option
              >
            </el-select>
          </el-form-item>

          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input
              v-model="articleInfo.order"
              placeholder="请输入排序"
            ></el-input>
          </el-form-item>

          <el-form-item label="点赞数" :label-width="formLabelWidth">
            <el-input
              v-model="articleInfo.praise_count"
              placeholder="请输入点赞数"
            ></el-input>
          </el-form-item>

          <el-form-item label="评论数" :label-width="formLabelWidth">
            <span>{{ articleInfo.comment_count }}</span>
          </el-form-item>

          <el-form-item label="" :label-width="formLabelWidth">
            <el-button type="primary" @click="saveEditArticle">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div v-else-if="showType == 'new'">
      <el-card class="card">
        <el-row>
          <el-col :span="12" style="line-height: 40px">创建文章</el-col>
          <el-col :span="12" style="text-align: right">
            <el-button
              type="primary"
              icon="el-icon-back"
              @click="showType = 'table'"
              >返回文章列表</el-button
            >
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <el-form :model="newArticle" :rules="rules" ref="ruleNewForm">
          <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
            <el-input
              v-model="newArticle.title"
              autocomplete="off"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="作者"
            :label-width="formLabelWidth"
            prop="user_id"
          >
            <el-select v-model="newArticle.user_id" placeholder="请选择">
              <el-option
                :label="value.name"
                :value="value.id"
                v-for="(value, index) in authors"
                :key="value.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="主图"
            :label-width="formLabelWidth"
            prop="default_img"
          >
            <el-upload
              class="avatar-uploader"
              action="/dev-api/admin/v1/articles/upload"
              :show-file-list="false"
              :on-success="handleArticleSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="newArticle.default_img"
                :src="newArticle.default_img"
                style="width: 200px"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过 3 Mb
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item
            label="内容"
            :label-width="formLabelWidth"
            prop="content"
          >
            <Tinymce v-model="newArticle.content"></Tinymce>
          </el-form-item>

          <el-form-item
            label="分类"
            :label-width="formLabelWidth"
            prop="category_id"
          >
            <el-select v-model="newArticle.category_id" placeholder="请选择">
              <el-option
                :label="value.name"
                :value="value.id"
                v-for="(value, index) in categories"
                :key="value.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="标签"
            :label-width="formLabelWidth"
            prop="tag"
          >
          <!-- value-key="name" 作为 value 唯一标识的键名，绑定值为对象类型时必填 -->
            <el-select
              v-model="newArticle.tag"
              value-key="name"
              multiple
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="{id:item.id, name:item.name}">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="状态"
            :label-width="formLabelWidth"
            prop="status"
          >
            <el-select v-model="newArticle.status" placeholder="请选择">
              <el-option
                :label="value"
                :value="index"
                v-for="(value, index) in status"
                :key="index"
                >{{ value }}</el-option
              >
            </el-select>
          </el-form-item>

          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input
              v-model="newArticle.order"
              placeholder="请输入排序"
            ></el-input>
          </el-form-item>

          <el-form-item label="" :label-width="formLabelWidth">
            <el-button type="primary" @click="saveCreateArticle"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <Info :info="articleInfo" />
  </div>
</template>

<script>
import Info from "./Info/index.vue";
export default {
  data() {
    return {
      params: {
        page: 1,
        per_page: 10,
        keywords: "",
        category_id: "",
        status: "",
      },
      status: ["已删除", "正常"],
      categories: [],
      tags: [],
      authors: [],
      articleList: {},
      // 选中内容
      multipleSelection: [],
      // 显示内容
      showType: "table",
      articleInfo: {},
      formLabelWidth: "120px",
      newArticle: {
        title: "",
        user_id: "",
        default_img: "",
        content: "",
        category_id: "",
        tag: [],
        status: 1,
        order: 0,
      },
      // validate
      rules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
            trigger: "blur",
          },
        ],
        user_id: [{ required: true, message: "请选择作者", trigger: "change" }],
        default_img: [
          { required: true, message: "请上传文章主图", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
          { min: 20, message: "长度大于 20 个字符", trigger: "blur" },
        ],
        category_id: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  methods: {
    // 获取文章分类
    async getCategories() {
      let result = await this.$API.article.reqGetArticleCategories();
      if (result.code == 200) {
        this.categories = result.data;
      }
    },
    // 获取标签
    async getTags() {
      let result = await this.$API.tag.reqGetTags();
      if (result.code == 200) {
        this.tags = result.data;
      }
    },
    // 获取作者
    async getAuthors() {
      let result = await this.$API.article.reqGetAuthors();
      if (result.code == 200) {
        this.authors = result.data;
      }
    },
    // 获取文章列表
    async getData() {
      Object.assign(this.params, this.$route.query);
      let result = await this.$API.article.reqGetArticleList(this.params);
      if (result.code == 200) {
        this.articleList = result.data;
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
      }
    },
    // 搜索
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
    // 选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 预览
    preview(row) {
      this.$bus.$emit("showArticlePreview", true);
      this.articleInfo = row;
    },
    // 修改文章
    edit(row) {
      this.showType = "edit";
      this.articleInfo = { ...row };
    },
    // 上传
    handleAvatarSuccess(res, file) {
      this.articleInfo.default_img = res.data;
    },
    handleArticleSuccess(res, file) {
      this.newArticle.default_img = res.data;
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
    // 删除
    remove(row) {
      this.$confirm(`确定删除${row.title}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.article.reqDelArticle(row.id);
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
    // 新增
    create() {
      this.showType = "new";
      this.getAuthors();
    },
    // 保存修改文章
    saveEditArticle() {
      this.$refs.ruleEditForm.validate(async (valid) => {
        if (valid) {
          let result = await this.$API.article.reqPutArticle(
            this.articleInfo.id,
            this.articleInfo
          );
          if (result.code == 200) {
            this.articleInfo = {};
            this.showType = "table";
            this.$message({
              type: "success",
              message: "修改成功",
            });
            this.getData();
          }
        } else {
          this.$message({
            type: "error",
            message: "提交错误!!",
          });
        }
      });
    },
    // 保存创建文章
    async saveCreateArticle() {
      this.$refs.ruleNewForm.validate(async (valid) => {
        if (valid) {
          let result = await this.$API.article.reqPostArticle(this.newArticle);
          if (result.code == 200) {
            this.newArticle = {};
            this.showType = "table";
            this.$message({
              type: "success",
              message: "修改成功",
            });
            this.getData();
          }
        } else {
          this.$message({
            type: "error",
            message: "提交错误!!",
          });
        }
      });
    },
  },
  mounted() {
    this.getCategories();
    this.getTags();
    this.getData();
  },
  components: { Info },
};
</script>

<style scoped>
.content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
/* 文章图片上传 */
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
</style>