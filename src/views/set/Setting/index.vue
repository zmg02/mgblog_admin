<template>
  <div>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="系统设置" name="first">
          <el-form :model="formInfo" class="show">
            <el-form-item
              v-for="(item, index) in formData"
              :key="index"
              :label="item.name + ':'"
              :label-width="formLabelWidth"
              prop="name"
            >
              <div v-if="item.type == 1">
                <el-input
                  v-model="item.value"
                  autocomplete="off"
                  placeholder="请输入属性值"
                ></el-input>
              </div>

              <div v-else-if="item.type == 2">
                <el-input
                  type="textarea"
                  v-model="item.value"
                  autocomplete="off"
                  placeholder="请输入属性值"
                ></el-input>
              </div>

              <div v-else-if="item.type == 3">
                <el-radio v-model="item.value" label="1">开启</el-radio>
                <el-radio v-model="item.value" label="0">关闭</el-radio>
              </div>

              <div v-else-if="item.type == 4">
                <el-input
                  type="password"
                  show-password
                  v-model="item.value"
                  autocomplete="off"
                  placeholder="请输入属性值"
                ></el-input>
              </div>

              <div v-else-if="item.type == 5">
                <el-switch
                  v-model="item.value"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开启"
                  inactive-text="关闭"
                >
                </el-switch>
              </div>

            </el-form-item>

            <el-form-item label="" :label-width="formLabelWidth">
              <el-button type="primary" @click="saveSystem">保 存</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="createAttr"
                >新 增</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="邮箱服务设置" name="second">
          邮箱服务设置</el-tab-pane
        >

        <el-tab-pane label="定时任务补偿" name="fourth"
          >定时任务补偿</el-tab-pane
        >
      </el-tabs>

      <el-dialog
        title="新增属性"
        :visible.sync="createDialogVisible"
        @close="close"
        width="30%"
      >
        <el-form
          :model="settingInfo"
          class="create"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item label="名称" label-width="120px" prop="name">
            <el-input
              v-model="settingInfo.name"
              autocomplete="off"
              placeholder="请输入名称"
              autofocus="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="类型" label-width="120px" prop="type">
            <el-select v-model="settingInfo.type" placeholder="请选择表单类型">
              <el-option
                :label="item.name"
                :value="item.value"
                v-for="(item, index) in formType"
                :key="index"
                >{{ item.name }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="saveAttr">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      activeName: "first",
      formInfo: {},
      formData: [],
      formLabelWidth: "240px",
      createDialogVisible: false,
      settingInfo: {},
      formType: [
        { name: "text", value: 1 },
        { name: "textarea", value: 2 },
        { name: "radio", value: 3 },
        // { name: "checkbox", value: 4 },
        { name: "password", value: 4 },
        { name: "switch", value: 5 },
        // { name: "upload", value: 6 },
      ],
      // validate
      rules: {
        name: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "请选择表单类型", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    async getData() {
      let result = await this.$API.setting.reqGetSetting();
      if (result.code == 200) {
        this.formData = result.data;
      }
    },
    // 切换标签页
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 新增
    createAttr() {
      this.createDialogVisible = true;
    },
    // 关闭dialog
    close() {
      this.createDialogVisible = false;
      this.settingInfo = {};
    },
    // 保存新属性
    async saveAttr() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let result = await this.$API.setting.reqPostSetting(this.settingInfo);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "新增成功！",
            });
            this.getData();
            this.createDialogVisible = false;
            this.$refs["ruleForm"].resetFields(); //重置表单
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 保存系统设置
    async saveSystem() {
      let result = await this.$API.setting.reqSaveSetting(this.formData);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功！",
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
</style>