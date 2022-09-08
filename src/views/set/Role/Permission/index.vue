<template>
  <div>
    <el-card class="card">
      <el-row>
        <el-col :span="12">
          <span>角色：{{role.name}}</span>
        </el-col>

        <el-col :span="12" style="text-align: right">
          <el-button type="primary" icon="el-icon-back" @click="toRole"
            >返回角色列表</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card>
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
            <!-- <i class="el-icon-edit primary icon-size" @click="() => edit(node, data)"></i>
                <i class="el-icon-delete danger icon-size" @click="() => remove(node, data)"></i> -->
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
  props: ["role"],
  methods: {
    async getData() {
      let result = await this.$API.role.reqGetRolePermission(this.role.id);
      if (result.code == 200) {
        this.list = result.data.data;
        this.allIds = result.data.all_ids;
        this.checkedIds = result.data.checked_ids;
      }
    },
    toRole() {
      this.$emit("handleShowType", "role");
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
      // console.log(data, checked, indeterminate);
    },
    // 保存
    async save() {
      let data = this.$refs.tree.getCheckedKeys();
      let result = await this.$API.role.reqPostRolePermission(this.role.id, {'permission_ids':data});
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