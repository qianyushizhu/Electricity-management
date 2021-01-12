<template>
  <div class="category">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addCate">添加分类</el-button>

      <tree-table
        :data="categoryList"
        :selection-type="selectiontype"
        :expand-type="isexpandtype"
        show-index
        index-text="#"
        border
        :columns="columns"
      >
        <template slot="isok" slot-scope="scope">
          <i
            v-if="!scope.row.cat_deleted"
            style="color:lightgreen"
            class="el-icon-circle-check"
          ></i>
          <i v-else class="el-icon-circle-close" style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>

        <template slot-scope="scope" slot="control">
          <el-button type="primary" icon="el-icon-edit" size="mini">
            编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">
            删除
          </el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.categoryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="this.categoryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="50%" @close="cateClose">
      <el-form
        :model="addRuleForm"
        :rules="cateRules"
        ref="cateRuleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addRuleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
          style="width:100%"
          clearable
          change-on-select 
            v-model="categoryParentId"
            :options="categoryParentList"
            :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name' ,children: 'children'  }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogVisible"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "category",

  data() {
    return {
      categoryParentId:[],
      categoryParentList: [],
      cateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      addRuleForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      cateDialogVisible: false,
      selectiontype: false,
      isexpandtype: false,
      categoryList: [],
      categoryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          lable: "分类名称",
          prop: "cat_name",
        },
        {
          lable: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          lable: "排序",
          type: "template",
          template: "order",
        },
        {
          lable: "操作",
          type: "template",
          template: "control",
        },
      ],
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    cateClose(){
      this.$refs.cateRuleForm.resetFields()
      this.categoryParentId=[]
      this.addRuleForm.cat_id=0
      this.addRuleForm.cat_level=0
      
    },
    addCateDialogVisible(pzy){
      // console.log(this.addRuleForm)
      // const pzy=this.addRuleForm
      this.$refs.cateRuleForm.validate(valid=>{
        if(!valid) return
        this.$http.post('categories',this.addRuleForm).then(res=>{
        console.log(res)
        if(res.data.meta.status!==201){
          this.$message.error('创建失败')
        }
        this.$message.success('创建成功')
        this.cateDialogVisible=false
        this.getCategoryList()
      })
      })
      
    },
    handleChange(){
      console.log(this.categoryParentId)
      if(this.categoryParentId.length>0){
        this.addRuleForm.cat_id=this.categoryParentId[this.categoryParentId.length-1]
        this.addRuleForm.cat_level=this.categoryParentId.length
        return
      }else{
        this.addRuleForm.cat_id=0
        this.addRuleForm.cat_level=0
        return
      }
      
    },
    cateParentList() {
      this.$http.get("categories", { params: { type: 2 } }).then((res) => {
        console.log(res.data.data);
        if (res.data.meta.status !== 200) {
          this.$message.error("请求失败");
        }
        this.categoryParentList = res.data.data;
      });
    },
    addCate() {
      this.cateDialogVisible = true;
      this.cateParentList();
    },
    handleSizeChange(newsize) {
      this.categoryInfo.pagesize = newsize;
    },
    handleCurrentChange(newpage) {
      this.categoryInfo.pagenum = newpage;
    },
    getCategoryList() {
      this.$http
        .get("categories", { params: this.categoryInfo })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            this.$message.error("获取失败");
          }
          this.categoryList = res.data.data.result;
          this.total = res.data.data.total;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.bread {
  font-size: 13px;
  margin-bottom: 20px;
}
</style>
