<template>
  <div>
    <el-card class="card" />

    <el-card>
      <el-table
        ref="multipleTable"
        :data="bannerList"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" prop="prop" />

        <el-table-column label="图片" width="prop" prop="prop" align="center">
          <template slot-scope="{ row }">
            <img :src="row.url" style="width: 180px" class="avatar">
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" prop="prop">
          <template slot-scope="{ row }">
            <span v-if="row.status == 0" class="delete">已删除</span>
            <span v-else-if="row.status == 1" class="normal">正常</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300" prop="prop" align="center">
          <template slot-scope="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              @click="edit(row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="remove(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="修改轮播图" :visible.sync="dialogFormVisible">
        <el-form :model="banner">
          <el-form-item label="轮播图" :label-width="formLabelWidth" prop="url">
            <el-upload
              class="avatar-uploader"
              action="/dev-api/admin/v1/users/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="banner.url" :src="banner.url" style="width: 300px">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-select v-model="banner.status" placeholder="请选择">
              <el-option
                v-for="(value, index) in status"
                :key="index"
                :label="value"
                :value="index"
              >{{ value }}</el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  data() {
    return {
      bannerList: [],
      // select
      multipleSelection: [],
      banner: {},
      formLabelWidth: '120px',
      dialogFormVisible: false,
      status: ['正常', '已删除']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const result = await this.$API.banner.reqGetBanner()
      if (result.code == 200) {
        this.bannerList = result.data
      } else {
        this.$message({
          type: 'error',
          message: result.message
        })
      }
    },
    // 选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // upload
    handleAvatarSuccess(res, file) {
      this.banner.url = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 修改
    edit(row) {
      this.banner = row
      this.dialogFormVisible = true
    },
    update() {
      console.log(111)
    },
    // 删除轮播图
    remove(row) {
      this.$confirm(`确定删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const result = await this.$API.banner.reqDelBanner(row.id)
          if (result.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getData()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
</style>
