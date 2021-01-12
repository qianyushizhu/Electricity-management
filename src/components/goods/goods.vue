<template>
  <div class="goods">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入" clearable>
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods"> 添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsInfoList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="价格"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="upd_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.upd_time | time}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
            @click="goodsDelete(scope.row.goods_id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.goodsInfo.pagenum"
        :page-sizes="[5, 15, 30, 35]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "goods",
  data() {
    return {
      goodsInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsInfoList: [],
      total:0,
    };
  },
  created() {
    this.getGoodsListInfo();
  },
  methods: {
    addGoods(){
      this.$router.push('/goods/add')
    },
    goodsDelete(id){
         this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
            if(res==='confirm'){
              this.$http.delete(`goods/${id}`).then(res=>{
                if(res.data.meta.status!==200){
                    this.$message.error('删除失败')
                    
                }
                this.$message.success('删除成功')
                this.getGoodsListInfo()
              })
            }
          
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    goodsSearch(){

    },
    handleSizeChange(newsize){
      // console.log(newsize)
      this.goodsInfo.pagesize=newsize
      this.getGoodsListInfo()
    },
    handleCurrentChange(newpage){
      // console.log(newpage)
      this.goodsInfo.pagenum=newpage
      this.getGoodsListInfo()
    },
    getGoodsListInfo() {
      this.$http.get("goods", { params: this.goodsInfo }).then((res) => {
        console.log(res.data.data);
        // console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error("获取失败");
        }
        // this.$message.success("获取成功");
        this.goodsInfoList = res.data.data.goods;
        this.total=res.data.data.total
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
