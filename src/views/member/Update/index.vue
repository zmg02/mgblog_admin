<template>
  <div>
    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="name">
          <el-input
            v-model="form.email"
            autocomplete="off"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>

        <el-form-item label="头像" :label-width="formLabelWidth" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/v1/users/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="个性签名" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            rows="4"
            v-model="form.desc"
            placeholder="请输入个性签名"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="验证时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.email_verified_time"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="管理员" :label-width="formLabelWidth">
          <el-radio v-model="form.is_admin" :label="1">是</el-radio>
          <el-radio v-model="form.is_admin" :label="0">否</el-radio>
        </el-form-item>

        <el-form-item label="作者" :label-width="formLabelWidth">
          <el-radio v-model="form.is_author" :label="1">是</el-radio>
          <el-radio v-model="form.is_author" :label="0">否</el-radio>
        </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="form.status" placeholder="请选择用户状态">
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        email: "",
        avatar: "",
        desc: "",
        email_verified_time: "",
        is_admin: 0,
        is_author: 0,
        name: "",
        phone: "",
        status: 0,
      },
      userId: "",
      formLabelWidth: "120px",
      // 时间选择
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
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
      },
    };
  },
  computed: {
    ...mapState("user", ["status"]),
  },
  methods: {
    // 获取用户状态
    async getUserStatus() {
      try {
        await this.$store.dispatch("user/getUserStatus");
      } catch (error) {
        this.$message({
          type: "error",
          message: error,
        });
      }
    },
    // upload
    handleAvatarSuccess(res, file) {
      this.form.avatar = res.data;
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
    // edit
    edit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.form.email_verified_time =
            Date.parse(this.form.email_verified_time) / 1000;
          let result = await this.$API.user.reqPutUser(this.userId, this.form);
          if (result.code == 200) {
            this.$emit("editOk");
          }
          this.dialogFormVisible = false;
        } else {
          this.$message({
            type: 'error',
            message: 'error submit!!'
          })
        }
      });
    },
  },
  mounted() {
    this.$bus.$on("showUserUpdate", (userInfo) => {
      this.dialogFormVisible = true;
      // 浅拷贝对象，修改数据时不会动到服务器返回数据
      this.form = { ...userInfo };
      this.userId = userInfo.id;
    });
  },
};
</script>

<style scoped>
/* 用户头像上传 */
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
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>