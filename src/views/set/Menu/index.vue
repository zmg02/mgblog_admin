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
                <span class="menu-info menu-title" :class="{isDelete:data.status == 0}">{{ data.title }}</span>
                <span class="menu-info menu-slug">slug:{{ data.slug }}</span>
                <span class="menu-info menu-uri">
                  <router-link :to="data.uri">uri:{{ data.uri }}</router-link>
                </span>
                <span class="menu-info menu-path">path:{{ data.path }}</span>
                <span class="menu-info menu-component"
                  >component:{{ data.component }}</span
                >
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
            <span v-if="h2Type=='create'">创建菜单</span>
            <span v-else>修改菜单</span>
          </h2>
          <el-form :model="menuInfo">
            <el-form-item label="上级菜单" :label-width="formLabelWidth">
              <select-tree v-model="menuInfo.parent_id" filterable :data="list"></select-tree>
            </el-form-item>

            <el-form-item label="路径" :label-width="formLabelWidth">
              <el-input
                v-model="menuInfo.path"
                autocomplete="off"
                placeholder="请输入路径（如：/test或test）"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="别名" :label-width="formLabelWidth">
              <el-input
                v-model="menuInfo.slug"
                autocomplete="off"
                placeholder="请输入别名"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="组件名" :label-width="formLabelWidth">
              <el-input
                v-model="menuInfo.component"
                autocomplete="off"
                placeholder="请输入组件名"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="菜单名称" :label-width="formLabelWidth">
              <el-input
                v-model="menuInfo.title"
                autocomplete="off"
                placeholder="请输入菜单名称"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="菜单图标" :label-width="formLabelWidth">
              <el-input
                v-model="menuInfo.icon"
                autocomplete="off"
                placeholder="请输入菜单图标"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="uri" :label-width="formLabelWidth">
              <el-input
                v-model="menuInfo.uri"
                autocomplete="off"
                placeholder="请输入菜单uri"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="排序" :label-width="formLabelWidth">
              <el-input
                v-model="menuInfo.order"
                autocomplete="off"
                placeholder="请输入排序"
                autofocus="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select v-model="menuInfo.status" placeholder="">
                <el-option label="正常" :value="1">正常</el-option>
                <el-option label="删除" :value="0">删除</el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="隐藏" :label-width="formLabelWidth">
              <el-select v-model="menuInfo.hidden" placeholder="">
                <el-option label="隐藏" :value="1">隐藏</el-option>
                <el-option label="显示" :value="0">显示</el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button type="primary" icon="el-icon-upload2" @click="saveForm"
                >提 交</el-button>
              <el-button type="primary" icon="el-icon-arrow-right" @click="toCreate" :disabled="!menuInfo.id"
                >创建菜单</el-button>
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
      filterMenuText: "",
      list: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      formLabelWidth: "120px",
      menuInfo: {
        parent_id: 0,
        path: "",
        slug: "",
        component: "",
        title: "",
        icon: "",
        uri: "",
        status: 1,
        order: "",
        hidden: 0,
      },
      menuId: 0,
      h2Type: 'create',
    };
  },
  methods: {
    async getData() {
      let result = await this.$API.menu.reqGetMenu({'status': "all"});
      if (result.code == 200) {
        this.list = result.data;
      }
    },
    edit(node, data) {
      this.h2Type = 'edit';
      this.menuInfo = {...data};
    },
    remove(node, data) {
      this.$confirm(`确定删除${data.title}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.menu.reqDelMenu(data.id);
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
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex((d) => d.id === data.id);
      // children.splice(index, 1);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    filterMenu(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    // handleNodeClick(data) {
    //   this.$refs['select-tree'].visible = false
    //   // this.menuId = data.id;
    //   // this.menuInfo.parent_id = data.id;
    //   console.log(data);
    // },
    toCreate() {
      this.h2Type = 'create';
      this.menuInfo = {};
    },
    async saveForm() {
      let result = {};
      if (this.menuInfo.id) {
        result = await this.$API.menu.reqPutMenu(this.menuInfo.id, this.menuInfo);
      } else {
        result = await this.$API.menu.reqPostMenu(this.menuInfo);
      }
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: this.menuInfo.id ? '修改成功' : '创建成功'
        })
        this.menuInfo = {};
        this.h2Type = 'create';
        this.getData();
      } else {
        this.$message({
          type: 'error',
          message: this.menuInfo.id ? '修改失败' : '创建失败'
        })
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterMenuText(val) {
      this.$refs['select-tree'].filter(val);
    },
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