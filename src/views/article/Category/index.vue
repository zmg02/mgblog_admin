<template>
  <div>
    <el-card class="card">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" icon="el-icon-plus" @click="create"
            >创建文章分类</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <div>
        <el-table
          :data="categoryList"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" label="编号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="name" label="分类名称" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="文章数" width="width">
            <template slot-scope="{ row }">
              <a href="#">{{ row.count }}</a>
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="状态" width="100">
            <template slot-scope="{ row }">
              <span v-if="row.status == 1" class="normal">正常</span>
              <span v-else class="delete">删除</span>
            </template>
          </el-table-column>

          <el-table-column prop="update_time" label="修改时间" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" align="center" width="260">
            <template slot-scope="{ row }">
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
      </div>
    </el-card>

    <div class="create_article">
      <el-dialog
        :title="categoryInfo.id ? '修改分类' : '创建分类'"
        :visible.sync="createDialogVisible"
        @close='close'
        width="30%"
      >
        <!-- v-if="createDialogVisible"
        destroy-on-close -->
        <el-form
          :model="categoryInfo"
          class="create"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
            <el-input
              v-model="categoryInfo.name"
              autocomplete="off"
              placeholder="请输入名称"
              autofocus="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-select v-model="categoryInfo.status" placeholder="请选择状态">
              <el-option
                :label="value"
                :value="index"
                v-for="(value, index) in status"
                :key="index"
                >{{ value }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      createDialogVisible: false,
      formLabelWidth: "120px",
      categoryInfo: {},
      status: ["删除", "正常"],
      // validate
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getData() {
      let result = await this.$API.article.reqGetArticleCategories();
      if (result.code == 200) {
        this.categoryList = result.data;
      }
    },
    // table选择样式
    tableRowClassName({ row, rowIndex }) {
      // if (row.status == 0) {
      //   return 'warning-row';
      // }
      // else {
      //   return 'success-row';
      // }
      return "";
    },
    create() {
      this.createDialogVisible = true;
    },
    save() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let message = "",
            result = {};
          if (this.categoryInfo.id) {
            result = await this.$API.article.reqPutArticleCategory(
              this.categoryInfo.id,
              this.categoryInfo
            );
            message = "修改成功";
          } else {
            result = await this.$API.article.reqPostArticleCategory(
              this.categoryInfo
            );
            message = "创建成功";
          }

          if (result.code == 200) {
            this.createDialogVisible = false;
            this.getData();
            this.categoryInfo = {};
            this.$message({
              type: "success",
              message,
            });
          }
        } else {
          this.$message({
            type: 'error',
            message: '提交错误!!'
          });
        }
      });
    },
    close() {
      this.createDialogVisible = false;
      this.categoryInfo = {};
      this.$refs["ruleForm"].resetFields();//重置表单
      // this.$refs.ruleForm.clearValidate(); //清除验证规则
    },
    edit(row) {
      this.categoryInfo = { ...row };
      this.createDialogVisible = true;
    },
    async remove(row) {
      let result = await this.$API.article.reqDelArticleCategory(row.id);
      if (result.code == 200) {
        this.getData();
        this.$message({
          type: "success",
          message: "删除成功",
        });
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.create {
  .el-form-item {
    .el-input {
      width: 80%;
    }
    .el-select {
      width: 80%;
    }
  }
}
</style>