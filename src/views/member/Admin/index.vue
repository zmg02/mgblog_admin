<template>
  <div>
    <div v-if="showType == 'admin'">
      <el-card class="card">
        <el-row>
          <el-col :span="18">
            <Search @formSearch="formSearch" />
          </el-col>
          <el-col :span="6" style="text-align: right">
            <el-button type="primary" icon="el-icon-plus" @click="createUser"
              >创建用户</el-button
            >
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div>
          <!-- 表格 -->
          <el-table
            ref="multipleTable"
            :data="userList.data"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" prop="prop">
            </el-table-column>

            <el-table-column label="UID" width="60" prop="id"></el-table-column>

            <el-table-column
              label="头像"
              width="100"
              prop="prop"
              align="center"
            >
              <template slot-scope="{ row, $index }">
                <img :src="row.avatar" style="width: 80px" class="avatar" />
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

            <el-table-column
              label="操作"
              width="410"
              prop="prop"
              align="center"
            >
              <template slot-scope="{ row, $index }">
                <el-button
                  type="info"
                  icon="el-icon-info"
                  @click="show_permission(row)"
                  >权限</el-button
                >
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

          <!-- 批量操作 -->
          <div class="button-group">
            <el-button type="warning" @click="blacklist">拉黑</el-button>
            <el-button type="danger" @click="removeSelect">删除</el-button>
          </div>

          <!-- 分页器 -->
          <div class="block">
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
        <!-- dialog -->
        <div class="create-user-form">
          <el-dialog title="创建用户" :visible.sync="dialogFormVisible">
            <el-form :model="userForm" :rules="rules" ref="ruleForm">
              <el-form-item
                label="名称"
                :label-width="formLabelWidth"
                prop="name"
              >
                <el-input
                  v-model="userForm.name"
                  autocomplete="off"
                  placeholder="请输入名称"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="邮箱"
                :label-width="formLabelWidth"
                prop="email"
              >
                <el-input
                  v-model="userForm.email"
                  autocomplete="off"
                  placeholder="请输入邮箱地址"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="密码"
                :label-width="formLabelWidth"
                prop="password"
              >
                <el-input
                  v-model="userForm.password"
                  autocomplete="off"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="头像"
                :label-width="formLabelWidth"
                prop="avatar"
              >
                <el-upload
                  class="avatar-uploader"
                  action="/prod-api/admin/v1/users/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件，且不超过2 Mb
                  </div>
                </el-upload>
              </el-form-item>

              <el-form-item label="个性签名" :label-width="formLabelWidth">
                <el-input
                  type="textarea"
                  rows="4"
                  v-model="userForm.desc"
                  placeholder="请输入个性签名"
                ></el-input>
              </el-form-item>

              <el-form-item label="手机号" :label-width="formLabelWidth">
                <el-input
                  v-model="userForm.phone"
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>

              <el-form-item label="管理员" :label-width="formLabelWidth">
                <el-radio v-model="userForm.is_admin" :label="1">是</el-radio>
                <el-radio v-model="userForm.is_admin" :label="0">否</el-radio>
              </el-form-item>

              <el-form-item label="作者" :label-width="formLabelWidth">
                <el-radio v-model="userForm.is_author" :label="1">是</el-radio>
                <el-radio v-model="userForm.is_author" :label="0">否</el-radio>
              </el-form-item>

              <el-form-item
                label="状态"
                :label-width="formLabelWidth"
                prop="status"
              >
                <el-select
                  v-model="userForm.status"
                  placeholder="请选择用户状态"
                >
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
              <el-button @click="createUserCancel">取 消</el-button>
              <el-button type="primary" @click="saveUser">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <!-- 详情 -->
        <Info :userInfo="userInfo" />
        <!-- 修改页 -->
        <Update :userInfo="userInfo" @editOk="editOk" />
      </el-card>
    </div>

    <Permission
      :user="userInfo"
      @handleShowType="handleShowType"
      v-else-if="showType == 'permission'"
    />
  </div>
</template>

<script>
import Search from "../Search/index.vue";
import Permission from "./Permission";
import Info from "../Info/index.vue";
import Update from "../Update/index.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      // api请求参数
      params: {
        page: 1,
        page_size: 10,
        is_admin: 1,
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
      showType: "admin",
      // 创建用户
      dialogFormVisible: false,
      userForm: {
        name: "",
        email: "",
        password: "",
        avatar: "",
        desc: "",
        phone: "",
        is_admin: "",
        is_author: "",
        status: "",
      },
      // validate
      rules: {
        name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { max: 100, message: "长度在 100 个字符以内", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "120px",
    };
  },
  components: { Search, Info, Update, Permission },
  computed: {
    ...mapState("user", ["status"]),
  },
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
        this.params.is_admin = 1;
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
    // 显示创建用户表单
    createUser() {
      this.dialogFormVisible = true;
    },
    // 头像上传
    handleAvatarSuccess(res, file) {
      this.userForm.avatar = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isJPG || isPNG) && isLt2M;
    },
    createUserCancel() {
      this.userForm = {};
      this.dialogFormVisible = false;
    },
    async saveUser() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let result = await this.$API.user.reqPostUser(this.userForm);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "保存成功",
            });
            this.getData();
          }
          this.dialogFormVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "提交出错了!!",
          });
        }
      });
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
        type: "success",
        message: "修改成功",
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
    show_permission(row) {
      this.userInfo = row;
      this.showType = "permission";
    },
    // 切换显示
    handleShowType(type) {
      this.showType = type;
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
/* 分页器 */
.block {
  text-align: center;
  margin: 30px 0 50px;
}
/* 图片上传 */
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