<template>
  <div>
    <div v-if="showType == 'table'">
      <el-card class="card">
        <el-form :inline="true" class="demo-form-inline" :model="params">
          <el-form-item label="关键词">
            <el-input v-model="params.keywords" placeholder="关键词"></el-input>
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
      </el-card>

      <el-card>
        <div>
          <el-table
            ref="multipleTable"
            :data="articleList.data"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" prop="prop">
            </el-table-column>

            <el-table-column
              label="主图"
              width="100"
              prop="prop"
              align="center"
            >
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
              width="200"
            ></el-table-column>

            <el-table-column
              label="标题"
              prop="title"
              width="width"
            ></el-table-column>

            <el-table-column label="内容" prop="prop" width="500">
              <template slot-scope="{ row, $index }">
                <p class="content">{{ row.content }}</p>
              </template>
            </el-table-column>

            <el-table-column
              label="分类"
              prop="category.name"
              width="width"
            ></el-table-column>

            <el-table-column label="状态" prop="prop" width="100">
              <template slot-scope="{ row }">
                <span v-if="row.status == 1" class="normal">正常</span>
                <span v-else class="delete">已删除</span>
              </template>
            </el-table-column>

            <el-table-column label="评论" prop="prop" width="100">
              <template slot-scope="{ row }">
                <a href="" v-if="row.comment_count > 0">{{
                  row.comment_count
                }}</a>
                <span v-else>{{ row.comment_count }}</span>
              </template>
            </el-table-column>

            <el-table-column label="点赞" prop="praise_count" width="100">
            </el-table-column>

            <el-table-column label="创建时间" prop="create_time" width="150">
            </el-table-column>

            <el-table-column
              label="操作"
              width="310"
              prop="prop"
              align="center"
            >
              <template slot-scope="{ row, $index }">
                <el-button type="info" icon="el-icon-info" @click="preview(row)"
                  >详情</el-button
                >
                <el-button type="warning" icon="el-icon-edit" @click="edit(row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="remove(row)"
                  >删除</el-button
                >
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

    <div v-else-if="showType == 'form'">
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
        <el-form :model="articleInfo">
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input
              v-model="articleInfo.title"
              autocomplete="off"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>

          <el-form-item label="作者" :label-width="formLabelWidth">
            <span>{{ articleInfo.user.name }}</span>
          </el-form-item>

          <el-form-item label="主图" :label-width="formLabelWidth">
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

          <el-form-item label="内容" :label-width="formLabelWidth">
            <Tinymce
              v-model="articleInfo.content"
            ></Tinymce>
          </el-form-item>

          <el-form-item label="分类" :label-width="formLabelWidth">
            <el-select v-model="articleInfo.category_id" placeholder="请选择">
              <el-option
                :label="value.name"
                :value="value.id"
                v-for="(value, index) in categories"
                :key="value.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态" :label-width="formLabelWidth">
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
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
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
      status: [
        "已删除",
        "正常",
      ],
      categories: [],
      articleList: [],
      // 选中内容
      multipleSelection: [],
      // 显示内容
      showType: "table",
      articleInfo: {},
      formLabelWidth: "120px",
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
    // 获取文章列表
    async getData() {
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
    preview(row) {
      console.log(row);
    },
    // 修改文章
    edit(row) {
      this.showType = "form";
      this.articleInfo = { ...row };
    },
    // upload
    handleAvatarSuccess(res, file) {
      this.articleInfo.default_img = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    remove() {},
    // 保存
    async save() {
      let result = await this.$API.article.reqPutArticle(this.articleInfo.id, this.articleInfo);
      if (result.code == 200) {
        this.articleInfo = {};
        this.getData();
      }
    }
  },
  mounted() {
    this.getCategories();
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
</style>