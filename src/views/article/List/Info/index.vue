<template>
  <div>
    <!-- :title="`${info.title}`" -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="40%"
      class="content"
      center
      top="5vh"
      :show-close="false"
    >
      <span>
        <el-row class="dialog_content">
          <el-col :span="24">
            <div class="post-single">
              <div class="post-single-image">
                <img :src="info.default_img" alt="" />
              </div>
              <!-- 标题 -->
              <div class="post-single-content">
                <a href="#" class="categorie">{{ category.name }}</a>
                <h4>
                  {{ info.title }}
                </h4>
                <div class="post-single-info">
                  <ul class="list-inline">
                    <li>
                      <a href="#"><img :src="user.avatar" alt="" /></a>
                    </li>
                    <li>
                      <a href="#">{{ user.name }}</a>
                    </li>
                    <li class="dot"></li>
                    <li>{{ info.create_time }}</li>
                    <li class="dot"></li>
                    <li>{{ info.comment_count }} comments</li>
                  </ul>
                </div>
              </div>
              <!-- 内容 -->
              <div class="post-single-body">
                <div v-html="info.content"></div>
              </div>
              <!-- 结尾 -->
              <div class="post-single-footer">
                <div class="tags">
                  <ul class="list-inline">
                    <li><a href="#">Travel</a></li>
                    <li><a href="#">Nature</a></li>
                    <li><a href="#">tips</a></li>
                    <li><a href="#">forest</a></li>
                    <li><a href="#">beach</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
    };
  },
  props: ["info"],
  computed: {
    user() {
      return this.info.user || {};
    },
    category() {
      return this.info.category || {};
    },
  },
  mounted() {
    this.$bus.$on("showArticlePreview", () => {
      this.centerDialogVisible = true;
    });
  },
};
</script>

<style lang="scss" scoped>
.el-dialog__header {
  display: none;
}
.content {
  display: block;
  margin-bottom: 50px;
}
.post-single {
  background-color: #fff !important;
  padding: 30px;
  border-radius: 20px !important;
  margin-bottom: 30px;
  margin-top: 30px;
  box-shadow: 0 5px 20px 0 rgba(69, 67, 96, 0.1);
  .post-single-image {
    margin-bottom: 40px;
    border-radius: 20px;
    img {
      width: 100%;
      border-radius: 20px;
      box-shadow: 0 5px 20px 0 rgba(69, 67, 96, 0.1);
    }
  }
  // 标题
  .post-single-content {
    // 分类
    .categorie {
      margin-bottom: 20px;
    }
    // 标题
    h4 {
      margin-bottom: 20px;
      transition: all 0.3s ease-in-out;
    }
    // 作者
    .post-single-info {
      .list-inline {
        padding-left: 0;
        list-style: none;
        li {
          display: inline-block;
        }
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 7px;
      }
      li {
        margin-bottom: 0;
        font-size: 13px;
        color: #506172;
        text-transform: capitalize;
        font-weight: 400;
      }
    }
  }
  // 内容
  .post-single-body {
    margin-top: 30px;
  }
  // 结尾
  .post-single-footer {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
    display: flex;
    align-items: center;
    .list-inline {
      padding-left: 0;
      list-style: none;
      li {
        display: inline-block;
      }
    }
    .tags ul li {
      background-color: #f9f9ff;
      padding: 4px 11px;
      margin-bottom: 5px;
      margin-right: 2px;
      border-radius: 20px;
      font-size: 13px;
      text-transform: capitalize;
      color: #506172;
      font-weight: 700;
    }
  }
}
h4 {
  font-size: 24px;
}
ul {
  margin-bottom: 0;
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
a,
a:focus,
a:hover {
  text-decoration: none;
}
img {
  width: 100%;
  vertical-align: middle;
  border-style: none;
}
.categorie {
  background-color: #f67280;
  color: #fff;
  padding: 2px 15px;
  display: inline-block;
  margin: auto;
  text-align: center;
  font-size: 13px;
  border-radius: 20px;
  font-weight: 800;
  text-transform: capitalize;
  transition: all 0.5s ease-in-out;
}
.dot {
  width: 4px;
  height: 4px;
  background-color: #f67280;
  border-radius: 50%;
  display: block;
  margin: 2px 6px !important;
}

/* dialog */
.dialog_content {
  margin: 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
</style>