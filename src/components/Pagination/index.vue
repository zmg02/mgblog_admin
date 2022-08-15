<template>
  <div class="pagination">
    <button :disabled="pageNo <= 1" @click="$emit('getPageNo', pageNo-1)">上一页</button>
    <button v-if="startAndEnd.start > 1" @click="$emit('getPageNo', 1)">1</button>
    <button v-if="startAndEnd.start > 2">...</button>
    <button v-if="page >= startAndEnd.start" v-for="(page, index) in startAndEnd.end" :key="index" @click="$emit('getPageNo', page)">{{page}}</button>
    <button v-if="startAndEnd.end < maxPage-1">...</button>
    <button v-if="startAndEnd.end < maxPage" @click="$emit('getPageNo', maxPage)">{{ maxPage }}</button>
    <button :disabled="pageNo >= maxPage" @click="$emit('getPageNo', pageNo+1)">下一页</button>
    <button>共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    maxPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    startAndEnd() {
        let start = 0, end = 0;
        let { continues, maxPage, pageNo } = this;
        if (continues > maxPage) {
            start = 1;
            end = maxPage;
        } else {
            start = pageNo - parseInt(continues / 2);
            end = pageNo + parseInt(continues / 2);

            if (start < 1) {
                start = 1;
                end = continues;
            }
            if (end > maxPage) {
                start = maxPage - continues + 1;
                end = maxPage;
            }
        }
        return {start, end};
    }
  },
};
</script>

<style lang="less" scoped>
  .pagination {
    margin: 20px 0 50px;
    text-align: center;
    button {
      margin: 0 5px;
      background-color: #f4f4f5;
      color: #606266;
      outline: none;
      border-radius: 2px;
      padding: 0 4px;
      vertical-align: top;
      display: inline-block;
      font-size: 13px;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border: 0;

      &[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.active {
        cursor: not-allowed;
        background-color: #409eff;
        color: #fff;
      }
    }
  }
</style>