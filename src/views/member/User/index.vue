<template>
  <div>
    <el-card class="card">
      <Search @formSearch="formSearch" />
    </el-card>

    <el-card>
      <div>
        <el-table
          ref="multipleTable"
          :data="userList.data"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" prop="prop">
          </el-table-column>

          <el-table-column label="UID" width="60" prop="id"></el-table-column>

          <el-table-column label="头像" width="100" prop="prop" align="center">
            <template slot-scope="{ row, $index }">
              <el-image
                style="width: 80"
                class="avatar"
                :src="row.avatar"
                :preview-src-list="[row.avatar]"
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
            label="名称"
            width="width"
            prop="prop"
          >
            <template slot-scope="{row, $index}">
              <span @click="preview(row)" style="cursor:pointer">{{row.name}}</span>
            </template>
          </el-table-column>

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

          <el-table-column label="是否验证" width="100" prop="prop">
            <template slot-scope="{ row, $index }">
              <span
                v-if="row.email_verified_time != '1970-01-01 08:00:00'"
                class="normal"
                >已验证</span
              >
              <span v-else class="abnormal">未验证</span>
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

        <div class="button-group">
          <el-button type="primary" @click="verify">验证</el-button>
          <el-button type="warning" @click="blacklist">拉黑</el-button>
          <el-button type="danger" @click="removeSelect">删除</el-button>
        </div>

        <!-- <Pagination
          :pageNo="params.page"
          :pageSize="params.page_size"
          :total="userList.total"
          :continues="5"
          @getPageNo="handleCurrentChange"
        /> -->

        <div class="mg-pagination">
          <el-pagination
            background
            :current-page="params.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="params.page_size"
            layout="prev, pager, next, jumper,->,total, sizes"
            :total="userList.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>

      <Info :userInfo="userInfo" />
      <Update :userInfo="userInfo" @editOk="editOk" />
    </el-card>
  </div>
</template>

<script>
import Search from "../Search/index.vue";
import Info from "../Info/index.vue";
import Update from "../Update/index.vue";
export default {
  data() {
    return {
      // api请求参数
      params: {
        page: 1,
        page_size: 10,
        keywords: "",
        time: "",
        status: "",
      },
      // api返回的用户数据
      userList: [],
      // select
      multipleSelection: [],
      // 用户详情
      userInfo: {},
    };
  },
  components: { Search, Info, Update },
  methods: {
    // 翻页
    handleSizeChange(val) {
      this.params.page_size = val;
      this.getData();
    },
    handleCurrentChange(page) {
      this.params.page = page;
      this.getData();
    },
    // 自定义事件
    formSearch(search) {
      Object.assign(this.params, search);
      this.getData();
    },
    // 获取数据
    async getData() {
      try {
        let result = await this.$API.user.reqUserList(this.params);
        if (result.code == 200) {
          this.userList = result.data;
        } else {
          this.$message({
            type: "error",
            message: result.message,
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error,
        });
      }
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
    // preview
    preview(row) {
      this.$bus.$emit("showUserPreview", true);
      this.userInfo = row;
    },
    // edit
    edit(row) {
      this.$bus.$emit("showUserUpdate", row);
      this.userInfo = row;
    },
    // 自定义事件
    editOk() {
      this.$message({
        type: 'success',
        message: '修改成功'
      });
      this.getData();
    },
    // 删除单个用户
    remove(row) {
      this.$confirm(`确定删除${row.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.user.reqDelUser(row.id);
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
    // 验证用户
    async verify() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          type: "error",
          message: "未选择用户",
        });
        return;
      }

      let result = await this.$API.user.reqVerify({
        data: this.multipleSelection,
      });
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "验证成功",
        });
        this.getData();
      }
    },
    // 拉黑
    async blacklist() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          type: "error",
          message: "未选择用户",
        });
        return;
      }

      let result = await this.$API.user.reqBlacklist({
        data: this.multipleSelection,
      });
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "拉黑成功",
        });
        this.getData();
      }
    },
    // 删除选中用户
    async removeSelect() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          type: "error",
          message: "未选择用户",
        });
        return;
      }
      let result = await this.$API.user.reqDestroy({
        data: this.multipleSelection,
      });
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
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
/* 按钮组 */
.button-group {
  margin-top: 20px;
}
</style>