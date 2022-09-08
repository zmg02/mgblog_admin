<template>
  <div>
    <div v-if="showType == 'role'">
      <el-card class="card">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" @click="create"
              >创建角色</el-button
            >
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div>
          <el-table :data="list.data" style="width: 100%">
            <el-table-column
              type="index"
              label="编号"
              width="80"
              align="center"
            >
            </el-table-column>

            <el-table-column prop="name" label="角色名称" width="width">
            </el-table-column>

            <el-table-column prop="slug" label="别名" width="width">
            </el-table-column>

            <el-table-column prop="prop" label="状态" width="100">
              <template slot-scope="{ row }">
                <span v-if="row.status == 1" class="normal">正常</span>
                <span v-else class="delete">删除</span>
              </template>
            </el-table-column>

            <el-table-column prop="update_time" label="修改时间" width="width">
            </el-table-column>

            <el-table-column
              prop="prop"
              label="操作"
              align="center"
              width="421px"
            >
              <template slot-scope="{ row }">
                <el-button
                  type="info"
                  icon="el-icon-info"
                  @click="show_permission(row)"
                  >权限</el-button
                >
                <el-button
                  type="info"
                  icon="el-icon-info"
                  @click="show_user(row)"
                  >管理员</el-button
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
              :total="list.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
      <div class="create_role">
        <el-dialog
          :title="info.id ? '修改角色' : '创建角色'"
          :visible.sync="createDialogVisible"
          @close="close"
          width="30%"
        >
          <el-form :model="info" class="create" :rules="rules" ref="ruleForm">
            <el-form-item
              label="名称"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input
                v-model="info.name"
                autocomplete="off"
                placeholder="请输入名称"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="别名"
              :label-width="formLabelWidth"
              prop="slug"
            >
              <el-input
                v-model="info.slug"
                autocomplete="off"
                placeholder="请输入别名"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select v-model="info.status" placeholder="请选择状态">
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

    <Permission :role="info" @handleShowType="handleShowType" v-else-if="showType == 'permission'"/>
    <Admin :role="info" @handleShowType="handleShowType"  v-else-if="showType == 'admin'"/>
  </div>
</template>
  
  <script>
import Permission from "./Permission/index.vue";
import Admin from "./Admin/index.vue";
export default {
  data() {
    return {
      showType: "role",
      params: {
        page: 1,
        per_page: 10,
      },
      list: {},
      createDialogVisible: false,
      formLabelWidth: "120px",
      info: {},
      status: ["删除", "正常"],
      // validate
      rules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
        slug: [
          { required: true, message: "请输入角色别名", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
      roleId: ''
    };
  },
  methods: {
    async getData() {
      let result = await this.$API.role.reqGetRole(this.params);
      if (result.code == 200) {
        this.list = result.data;
      }
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
    create() {
      this.createDialogVisible = true;
    },
    save() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let message = "",
            result = {};
          console.log(this.info.id);
          if (this.info.id) {
            result = await this.$API.role.reqPutRole(this.info.id, this.info);
            message = "修改成功";
          } else {
            result = await this.$API.role.reqPostRole(this.info);
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
    async remove(row) {
      let result = await this.$API.role.reqDelRole(row.id);
      if (result.code == 200) {
        this.getData();
        this.$message({
          type: "success",
          message: "删除成功",
        });
      }
    },
    show_permission(row) {
      this.showType = 'permission';
      this.info = { ...row };
    },
    async show_user(row) {
      this.showType = 'admin';
      this.info = { ...row };
    },
    handleShowType(type) {
      this.showType = type;
    }
  },
  mounted() {
    this.getData();
  },
  components: { Permission, Admin },
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