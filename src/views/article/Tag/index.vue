<template>
    <div>
      <el-card class="card">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" @click="create"
              >创建标签</el-button
            >
          </el-col>
        </el-row>
      </el-card>
  
      <el-card>
        <div>
          <el-table
            :data="list"
            style="width: 100%"
          >
            <el-table-column type="index" label="编号" width="80" align="center">
            </el-table-column>
  
            <el-table-column prop="name" label="标签名称" width="width">
            </el-table-column>
  
            <el-table-column prop="prop" label="关联文章数" width="width">
              <template slot-scope="{ row }">
                <el-tag
                    type="success"
                    effect="dark">
                    <router-link :to="`/article/list?tag=${row.id}`">{{ row.article_count }}</router-link>
                </el-tag>
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
                  >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="remove(row)"
                  >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
  
      <div class="tag-dialog">
        <el-dialog
          :title="info.id ? '修改分类' : '创建分类'"
          :visible.sync="createDialogVisible"
          @close="close"
          width="30%"
        >
          <el-form
            :model="info"
            class="create"
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
              <el-input
                v-model="info.name"
                autocomplete="off"
                placeholder="请输入名称"
                autofocus="true"
              ></el-input>
            </el-form-item>
  
            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select v-model="info.status" placeholder="请选择">
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
        list: [],
        createDialogVisible: false,
        formLabelWidth: "120px",
        info: {},
        status: ["删除", "正常"],
        // validate
        rules: {
          name: [
            { required: true, message: "请输入标签名称", trigger: "blur" },
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
        let result = await this.$API.tag.reqGetTags();
        if (result.code == 200) {
          this.list = result.data;
        }
      },
      create() {
        this.createDialogVisible = true;
      },
      save() {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            let message = "",
              result = {};
            if (this.info.id) {
              result = await this.$API.tag.reqPutTag(
                this.info.id,
                this.info
              );
              message = "修改成功";
            } else {
              result = await this.$API.tag.reqPostTag(
                this.info
              );
              message = "创建成功";
            }
  
            if (result.code == 200) {
              this.createDialogVisible = false;
              this.getData();
              this.info = {};
              this.$message({
                type: "success",
                message,
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "提交错误!!",
            });
          }
        });
      },
      close() {
        this.createDialogVisible = false;
        this.info = {};
        this.$refs["ruleForm"].resetFields(); //重置表单
      },
      edit(row) {
        this.info = { ...row };
        this.createDialogVisible = true;
      },
      remove(row) {
        this.$confirm(`确定删除${row.name}？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let result = await this.$API.tag.reqDelTag(row.id);
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