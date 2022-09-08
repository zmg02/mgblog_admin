<template>
  <div>
    <el-card class="card">
      <el-row>
        <el-col :span="12">
          <span>用户：{{user.name}}</span>
        </el-col>

        <el-col :span="12" style="text-align: right">
          <el-button type="primary" icon="el-icon-back" @click="toAdmin"
            >返回管理员列表</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <!-- check-strictly:在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false -->
      <el-tree
        class="filter-tree"
        :data="list"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedIds"
        :expand-on-click-node="false"
        :check-strictly="true"
        @check-change="handleCheckChange"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <span
              class="menu-info menu-title"
              :class="{ isDelete: data.status == 0 }"
              >{{ data.name }}</span
            >
            <span class="menu-info menu-slug">slug:{{ data.slug }}</span>
            <span class="menu-info menu-path">{{ data.http_method }}</span>
            <span class="menu-info menu-uri">
              <router-link :to="data.uri">{{ data.http_path }}</router-link>
            </span>
          </span>
          <span>

          </span>
        </span>
      </el-tree>

      <el-button type="primary" icon="el-icon-upload2" @click="save" style="margin-top: 20px">保 存</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      checkedIds: [],
      allIds: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  props: ["user"],
  methods: {
    async getData() {
      let result = await this.$API.user.reqGetUserPermission(this.user.id);
      if (result.code == 200) {
        this.list = result.data.data;
        this.allIds = result.data.all_ids;
        this.checkedIds = result.data.checked_ids;
      }
    },
    toAdmin() {
      this.$emit("handleShowType", "admin");
    },
    // 改变选中状态
    handleCheckChange(data, checked, indeterminate) {
      if (data.slug == '*' && checked) {
        // 全选
        this.$refs.tree.setCheckedKeys(this.allIds);
      } else if(data.slug == '*' && !checked) {
        // 全不选
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    // 保存
    async save() {
      let data = this.$refs.tree.getCheckedKeys();
      let result = await this.$API.user.reqPostUserPermission(this.user.id, {'permission_ids':data});
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        this.getData();
      }
    }
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.menu-info {
  padding-right: 35px;
}
.menu-uri {
  color: #409eff;
}
.menu-slug {
  color: #67c23a;
}
.menu-path {
  color: #909399;
}
.menu-component {
  color: #e6a23c;
}
.isDelete {
  color: #F56C6C;
}
</style>