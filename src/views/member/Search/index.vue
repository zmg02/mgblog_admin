<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="formData">
      <el-form-item label="关键词">
        <el-input v-model="formData.keywords" placeholder="关键词"></el-input>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-select v-model="formData.time" placeholder="请选择">
          <el-option :label="value.name" :value="value.value" v-for="(value, index) in time" :key="index"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="formData.status" placeholder="请选择">
          <el-option :label="value" :value="index" v-for="(value, index) in status" :key="index"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'Search',
    data() {
      return {
        time: [
          {
            name: '7日',
            value: 'week'
          },
          {
            name: '一个月',
            value: 'month'
          },
          {
            name: '一季度',
            value: 'quarterly'
          },
          {
            name: '一年',
            value: 'year'
          }
        ],
        formData: {
          'keywords': '',
          'time': '',
          'status': ''
        }
      }
    },
    computed: {
      ...mapState('user', ['status']),
    },
    methods: {
      async getUserStatus() {
        try {
          await this.$store.dispatch('user/getUserStatus');
        } catch (error) {
          alert(error);
        }
      },
      search() {
        this.$emit('formSearch', this.formData);
      }
    },
    mounted() {
      this.getUserStatus();
      // this.search();
    },
}
</script>

<style>

</style>