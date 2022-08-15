<template>
  <div>
    <el-dialog
      :title="`${userInfo.name} 详情`"
      :visible.sync="centerDialogVisible"
      width="40%"
      center
    >
      <span>
        <el-row class="dialog_content">
          <el-col :span="5">
            <div class="grid-content bg-purple grid-right">邮箱：</div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              {{ userInfo.email }}
            </div>
          </el-col>
        </el-row>

        <el-row class="dialog_content">
          <el-col :span="5">
            <div class="grid-content bg-purple grid-right">手机：</div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              {{ userInfo.phone }}
            </div>
          </el-col>
        </el-row>

        <el-row class="dialog_content">
          <el-col :span="5">
            <div class="grid-content bg-purple grid-right">个性签名：</div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              {{ userInfo.desc }}
            </div>
          </el-col>
        </el-row>

        <el-row class="dialog_content">
          <el-col :span="5">
            <div class="grid-content bg-purple grid-right">文章数：</div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              {{ userInfo.article_count }}
            </div>
          </el-col>
        </el-row>

        <el-row class="dialog_content">
          <el-col :span="5">
            <div class="grid-content bg-purple grid-right">
              最后一次登录时间：
            </div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              {{ userInfo.last_login_time }}
            </div>
          </el-col>
        </el-row>

        <el-row class="dialog_content">
          <el-col :span="5">
            <div class="grid-content bg-purple grid-right">
              最后一次登录IP：
            </div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              {{ userInfo.last_login_ip }}
            </div>
          </el-col>
        </el-row>

        <el-row class="dialog_content">
          <el-col :span="5">
            <div class="grid-content bg-purple grid-right">注册时间：</div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              {{ userInfo.create_time }}
            </div>
          </el-col>
        </el-row>

        <el-row class="dialog_content">
          <el-col :span="5">
            <div class="grid-content bg-purple grid-right">状态：</div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              <span v-if="userInfo.status == 0" class="danger">已删除</span>
              <span v-else-if="userInfo.status == 1" class="primary">正常</span>
              <span v-else class="warning">异常</span>
            </div>
          </el-col>
        </el-row>
      </span>
      <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false"
              >确 定</el-button
            >
          </span> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            centerDialogVisible: false
        }
    },
    props: ['userInfo'],
    mounted() {
        this.$bus.$on('showUserPreview', ()=>{
            this.centerDialogVisible = true;
        })
    },
};
</script>

<style>
/* dialog */
.dialog_content {
  margin: 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.grid-right {
  text-align: right;
  padding-right: 20px;
}
</style>