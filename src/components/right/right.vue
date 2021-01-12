<template>
  <div class="right">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightList" border style="width: 100%" class="table" stripe >
          <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" >
        </el-table-column>
        <el-table-column prop="path" label="路径" >
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level==0">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
                <el-tag type="warning" v-else="scope.row.level==2">三级</el-tag>
            </template>
             </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "right",
  created() {
    this.getRightLIst();
  },

  data() {
    return {
      rightList: [],
    };
  },
  methods: {
    getRightLIst() {
      this.$http.get("rights/list").then((res) => {
        console.log(res);
        if(res.data.meta.status!==200){
            return this.$message.error('获取失败');
        }
        this.rightList=res.data.data
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
}
.el-table{
    border-collapse:collapse !important;
}
</style>
