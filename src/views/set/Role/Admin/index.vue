<template>
  <div>
    <el-card class="card">
      <el-row>
        <el-col :span="12">
          <span>角色：{{role.name}}</span>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" icon="el-icon-plus" @click="getAdmin"
            >添加管理员</el-button
          >
          <el-button type="primary" icon="el-icon-back" @click="toRole"
            >返回角色列表</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="list" style="width: 100%">
        <el-table-column type="selection" width="50" prop="prop">
        </el-table-column>

        <el-table-column label="UID" width="60" prop="id"></el-table-column>

        <el-table-column label="头像" width="100" prop="prop" align="center">
          <template slot-scope="{ row, $index }">
            <img :src="row.avatar" style="width: 50px" class="avatar" />
          </template>
        </el-table-column>

        <el-table-column
          label="名称"
          width="width"
          prop="name"
        ></el-table-column>

        <el-table-column
          label="邮箱"
          width="width"
          prop="email"
        ></el-table-column>

        <el-table-column
          label="手机号"
          width="width"
          prop="phone"
        ></el-table-column>

        <el-table-column label="状态" width="100" prop="prop">
          <template slot-scope="{ row, $index }">
            <span v-if="row.status == 0" class="delete">已删除</span>
            <span v-else-if="row.status == 1" class="normal">正常</span>
            <span v-else class="abnormal">异常</span>
          </template>
        </el-table-column>

        <el-table-column
          label="注册日期"
          width="width"
          prop="create_time"
        ></el-table-column>

        <el-table-column
          label="最后一次登录时间"
          width="width"
          prop="last_login_time"
        ></el-table-column>

        <el-table-column
          label="最后一次登录IP"
          width="width"
          prop="last_login_ip"
        ></el-table-column>

        <el-table-column label="操作" width="310" prop="prop" align="center">
          <template slot-scope="{ row, $index }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeAdmin(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="add-admin">
      <el-dialog
        title="添加管理员"
        :visible.sync="createDialogVisible"
        @close="close"
        width="50%"
        top="5vh"
      >
        <el-form :inline="true" class="demo-form-inline" :model="params">
          <el-form-item label="">
            <el-input
              v-model="params.keywords"
              placeholder="关键词"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="searchAdmin"
              >搜索</el-button>
          </el-form-item>
        </el-form>

        <el-table
          ref="multipleTable"
          :data="userList.data"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="UID" width="60" prop="id"></el-table-column>
          <el-table-column label="头像" width="100" prop="prop" align="center">
            <template slot-scope="{ row, $index }">
              <img :src="row.avatar" style="width: 50px" class="avatar" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="width">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="width">
          </el-table-column>
        </el-table>

        <div style="margin-top: 30px;">
          <el-pagination
            background
            :current-page="params.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="params.per_page"
            :pager-count="5"
            layout="prev, pager, next, jumper,->,total, sizes"
            :total="userList.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="saveRoleAdmin">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // api请求参数
      params: {
        page: 1,
        per_page: 10,
        keywords: "",
      },
      list: [],
      userList: [],
      checkUsers: [],
      createDialogVisible: false,
    };
  },
  props: ["role"],
  methods: {
    async getData() {
      let result = await this.$API.role.reqGetRoleAdmin(this.role.id);
      if (result.code == 200) {
        this.list = result.data;
      }
    },
    // dialog
    async getAdmin() {
      let result = await this.$API.role.reqGetAdmin(this.role.id, this.params);
      if (result.code == 200) {
        this.userList = result.data;
        this.createDialogVisible = true;
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
      }
    },
    // 翻页
    handleSizeChange(val) {
      this.params.per_page = val;
      this.getAdmin();
    },
    handleCurrentChange(page) {
      this.params.page = page;
      this.getAdmin();
    },
    close() {
      this.createDialogVisible = false;
      this.checkUsers = [];
    },
    searchAdmin() {
      this.getAdmin();
    },
    // 表格
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
      this.checkUsers = val;
    },
    async saveRoleAdmin() {
      let checkUserIds = this.checkUsers.map((item) => {
        return item.id;
      })
      let result = await this.$API.role.reqPostRoleAdmin(this.role.id, {'user_ids':checkUserIds});
      if (result.code == 200) {
        this.createDialogVisible = false;
        this.checkUsers = [];
        this.$message({
          type: 'success',
          message: '添加成功'
        });
        this.getData();
      }
    },
    toRole() {
      this.$emit('handleShowType', 'role');
    },
    async removeAdmin(row) {
      let result = await this.$API.role.reqDelRoleAdmin(this.role.id, row.id);
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.getData();
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.avatar {
  border-radius: 50%;
}
</style>