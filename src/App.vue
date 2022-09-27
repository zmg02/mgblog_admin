<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
ul li {
  list-style: none;
}
.card {
  margin-bottom: 20px;
}
.avatar {
  max-width: 200px;
}
.danger {
  color: #f56c6c;
}
.primary {
  color: #409eff;
}
.warning {
  color: #e6a23c;
}
.info {
  color: #909399;
}
.delete {
  color: #f56c6c;
}
.normal {
  color: #67c23a;
}
.abnormal {
  color: #e6a23c;
}
/* 分页器 */
.mg-pagination {
  text-align: center;
  margin: 30px 0 50px;
}
.mg-tag {
  margin: 2px;
}
</style>
