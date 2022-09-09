<template>
  <div>
    <el-row>
      <el-col :span="16">
        <el-card>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>

          <el-tree
            class="filter-tree"
            :data="list"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <span class="menu-info menu-title" :class="{isDelete:data.status == 0}">{{ data.name }}</span>
                <span class="menu-info menu-slug">slug:{{ data.slug }}</span>
                <span class="menu-info menu-path">{{data.http_method}}</span>
                <span class="menu-info menu-uri">
                  <router-link :to="data.uri">{{ data.http_path }}</router-link>  
                </span>
              </span>
              <span>
                <i class="el-icon-edit primary icon-size" @click="() => edit(node, data)"></i>
                <i class="el-icon-delete danger icon-size" @click="() => remove(node, data)"></i>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card style="margin-left: 20px">
          <h2>
            <span v-if="h2Type=='create'">创建权限</span>
            <span v-else>修改权限</span>
          </h2>
          <el-form :model="permissionInfo">
            <el-form-item label="上级权限" :label-width="formLabelWidth">
              <select-tree v-model="permissionInfo.parent_id" filterable :data="list"></select-tree>
            </el-form-item>

            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input
                v-model="permissionInfo.name"
                autocomplete="off"
                placeholder="请输入名称"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="别名" :label-width="formLabelWidth">
              <el-input
                v-model="permissionInfo.slug"
                autocomplete="off"
                placeholder="请输入别名"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="请求方式" :label-width="formLabelWidth">
              <el-input
                v-model="permissionInfo.http_method"
                autocomplete="off"
                placeholder="请输入请求方式"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="请求路径" :label-width="formLabelWidth">
              <el-input
                v-model="permissionInfo.http_path"
                autocomplete="off"
                placeholder="请输入请求路径"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select v-model="permissionInfo.status" placeholder="">
                <el-option label="正常" :value="1">正常</el-option>
                <el-option label="删除" :value="0">删除</el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button type="primary" icon="el-icon-upload2" @click="saveForm"
                >提 交</el-button>
              <el-button type="primary" icon="el-icon-arrow-right" @click="toCreate" :disabled="!permissionInfo.id"
                >创建权限</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      filterText: "",
      list: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      formLabelWidth: "120px",
      permissionInfo: {
        parent_id: 0,
        name: "",
        slug: "",
        http_method: "",
        http_path: "",
        status: 1
      },
      h2Type: 'create',
    };
  },
  methods: {
    async getData() {
      let result = await this.$API.permission.reqGetPermission();
      if (result.code == 200) {
        this.list = result.data;
      }
    },
    edit(node, data) {
      this.h2Type = 'edit';
      this.permissionInfo = {...data};
    },
    remove(node, data) {
      this.$confirm(`确定删除${data.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.permission.reqDelPermission(data.id);
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
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    toCreate() {
      this.h2Type = 'create';
      this.permissionInfo = {};
    },
    async saveForm() {
      let result = {};
      if (this.permissionInfo.id) {
        result = await this.$API.permission.reqPutPermission(this.permissionInfo.id, this.permissionInfo);
      } else {
        result = await this.$API.permission.reqPostPermission(this.permissionInfo);
      }
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: this.permissionInfo.id ? '修改成功' : '创建成功'
        })
        this.permissionInfo = {};
        this.h2Type = 'create';
        this.getData();
      } else {
        this.$message({
          type: 'error',
          message: this.permissionInfo.id ? '修改失败' : '创建失败'
        })
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getData();
  },
};
</script>
  
<style scoped>
.filter-tree {
  margin-top: 10px;
}
>>> .el-tree-node__content {
  height: 30px;
}
>>> .el-checkbox__inner {
  width: 17px;
  height: 17px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 5px 0px 5px 8px;
}
.menu-info {
  padding-right: 15px;
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

.icon-size {
  font-size: 20px;
  padding-right: 10px;
}

.el-input {
  width: 80%;
}
.option {
  height: auto;
  line-height: 1;
  padding: 0;
  background-color: #fff;
}
.select-tree {
  padding: 4px 20px;
  font-weight: 400;
}
.isDelete {
  color: #F56C6C;
}
</style>