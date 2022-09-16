<template>
  <div>
    <el-card class="card">
      <el-row>
        <el-col :span="12">
          <h3>{{article.title}}</h3>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <router-link :to="`/article/list`">
            <el-button type="primary" icon="el-icon-back">返回文章列表</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-card>

    <el-row>
      <el-col :span="16">
        <el-card>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>

          <el-tree
            class="filter-tree"
            :data="list"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            :indent="50"
            ref="tree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="comment-item">
                <img :src="data.user.avatar" />
                <div class="content">
                  <ul class="info list-inline">
                    <li>{{ data.user.name }}</li>
                    <li class="dot"></li>
                    <li>{{ data.create_time }}</li>
                  </ul>
                  <p
                    class="comment-content"
                    :class="{ isDelete: data.status == 0 }"
                  >
                    {{ data.content }}
                  </p>
                  <div>
                    <el-button
                      type="danger"
                      size="mini"
                      round
                      icon="el-icon-back"
                      @click.stop="reply(data)"
                    >
                      回复</el-button
                    >
                  </div>
                </div>
              </span>

              <span class="comment-operation">
                <i
                  class="el-icon-edit primary icon-size"
                  @click="() => edit(node, data)"
                ></i>
                <i
                  class="el-icon-delete danger icon-size"
                  @click="() => remove(node, data)"
                ></i>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card style="margin-left: 20px">
          <h2>
            <span v-if="h2Type == 'create'">添加评论</span>
            <span v-else-if="h2Type == 'reply'">回复评论</span>
            <span v-else>修改评论</span>
          </h2>
          <el-form :model="info">
            <el-form-item label="上级评论编号" :label-width="formLabelWidth">
              <el-input
                v-model="info.pid"
                :autofocus="true"
                :disabled="true"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="用户"
              :label-width="formLabelWidth"
              prop="user_id"
            >
              <el-select v-model="info.user_id" placeholder="请选择">
                <el-option
                  :label="value.name"
                  :value="value.id"
                  v-for="value in users"
                  :key="value.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="内容" :label-width="formLabelWidth">
              <el-input
                v-model="info.content"
                autocomplete="off"
                placeholder="请输入评论内容"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="排序" :label-width="formLabelWidth">
              <el-input
                v-model="info.order"
                autocomplete="off"
                placeholder="请输入排序"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select v-model="info.status" placeholder="">
                <el-option label="正常" :value="1">正常</el-option>
                <el-option label="删除" :value="0">删除</el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button type="primary" icon="el-icon-upload2" @click="saveForm"
                >提 交</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-arrow-right"
                @click="toCreate"
                :disabled="!info.id"
                >添加评论</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articleId: "",
      filterText: "",
      filterMenuText: "",
      list: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      formLabelWidth: "120px",
      info: {
        pid: 0,
        status: 1,
      },
      h2Type: "create",
      users: [],
      article: {}
    };
  },
  methods: {
    async getData() {
      let result = await this.$API.article.reqGetCommentList(this.articleId);
      if (result.code == 200) {
        this.list = result.data;
      }
    },
    async getArticle() {
      let result = await this.$API.article.reqGetArticle(this.articleId);
      if (result.code == 200) {
        this.article = result.data;
      }
    },
    async getUsers() {
      let result = await this.$API.article.reqGetAuthors();
      if (result.code == 200) {
        this.users = result.data;
      }
    },
    toCreate() {
      this.h2Type = "create";
      this.info = {};
    },
    async saveForm() {
      let result = {};
      if (this.info.id) {
        result = await this.$API.article.reqPutComment(this.info.id, this.info);
      } else {
        result = await this.$API.article.reqPostComment(
          this.articleId,
          this.info
        );
      }
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: this.info.id ? "修改成功！" : "评论成功！",
        });
        this.info = {};
        this.info.article_id = this.articleId;
        this.getData();
      }
    },
    // 回复
    reply(data) {
      this.info = {};
      this.info.article_id = this.articleId;
      this.info.pid = data.id;
      this.h2Type = "reply";
    },
    // 编辑
    edit(node, data) {
      this.info = { ...data };
      this.h2Type = "edit";
    },
    // 删除
    remove(node, data) {
      this.$confirm(`确定删除吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.article.reqDelComment(data.id);
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
    filterNode(value, data) {
      if (!value) return true;
      if (data.content.indexOf(value) !== -1) {
        return data.content.indexOf(value) !== -1;
      } else {
        return data.user.name.indexOf(value) !== -1;
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    if (this.$route.query.article_id) {
      sessionStorage.setItem("category_id", this.$route.query.article_id);
    }
  },
  mounted() {
    if (this.$route.query.article_id == undefined) {
      this.$route.query.article_id = sessionStorage.getItem("category_id");
    }

    this.articleId = sessionStorage.getItem("category_id");
    this.info.article_id = sessionStorage.getItem("category_id");
    this.getData();
    this.getUsers();
    this.getArticle();
  },
  beforeDestroy() {
    sessionStorage.removeItem("category_id");
  },
};
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}
/* element 原始样式修改 */
>>> .el-tree-node__content {
  height: auto;
}
>>> .el-checkbox__inner {
  width: 17px;
  height: 17px;
}
>>> .custom-tree-node {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
  -webkit-line-clamp: 6; /* 控制在第几行进行加省略号 */
  -webkit-box-orient: vertical;
}
>>> .el-tree-node__content > .el-tree-node__expand-icon {
  display: none;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
/* 评论内容 */
.comment-item {
  display: flex;
  margin: 20px 0;
}
.comment-item img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
}
.comment-item .content .info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.comment-item .content .info li {
  margin-right: 5px;
  font-size: 14px;
  color: #506172;
  /* text-transform: capitalize; */
  font-weight: 400;
}
.comment-item .content .info li.dot {
  margin: 2px 15px !important;
}
.comment-item .content p {
  margin-bottom: 15px;
}
.dot {
  width: 4px;
  height: 4px;
  background-color: #f67280;
  border-radius: 50%;
  display: block;
  margin: 2px 6px !important;
}
.comment-content {
  display: inline-block;
  width: 85%;
}
.comment-operation {
  display: inline-block;
  width: 15%;
  text-align: right;
}
.icon-size {
  font-size: 20px;
  padding-right: 10px;
}
</style>