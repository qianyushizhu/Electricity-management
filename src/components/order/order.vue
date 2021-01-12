<template>
  <div class="order">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input style="width:450px" placeholder="请输入内容">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <el-table :data="orderInfoList" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === 0" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          t<template slot-scope="scope">
            {{ scope.row.create_time | time }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="changeEdit(scope.row.order_id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              @click="pzy111(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="修改地址"
      :visible.sync="orderdialogVisible"
      width="50%"
      @close="fromClosed"
    >
      <el-form
        :model="addRuleForm"
        :rules="addRuleFormrules"
        ref="addRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/线" prop="address1">
          <el-cascader
            v-model="valueId"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addRuleForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="closedialogVisible">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="物流信息"
      :visible.sync="pzyorderdialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in pzylist"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pzyorderdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pzyorderdialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  name: "order",
  data() {
    return {
      orderInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      orderInfoList: [],
      total: 0,
      cityData,
      addRuleForm: {},
      addRuleFormrules: {
        address1: [{ required: true, message: "请输入", trigger: "blur" }],
        address2: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      valueId: [],
      orderdialogVisible: false,
      pzyorderdialogVisible: false,
      pzylist: [],
    };
  },
  methods: {
    pzy111() {
       
    this. pzyorderdialogVisible = true;
      this.$http.get(`/kuaidi/1106975712662`).then((res) => {
          console.log(res)
        if (res.data.meta.status !== 200) {
          this.$message.error("获取失败");
        }
        this.pzylist = res.data.data;
        this.$message.success("获取成功");
      });
    },
    fromClosed() {
      this.$refs.addRuleFormRef.resetFileds();
    },
    handleChange() {
      console.log(this.valueId);
    },
    closedialogVisible() {},
    handleCurrentChange(newpage) {
      this.orderInfo.pagenum = newpage;
      this.getInfo();
    },
    handleSizeChange(newsize) {
      this.orderInfo.pagesize = newsize;
      this.getInfo();
    },
    closedialogVisible() {
      this.$refs.addRuleFormRef.validata((valid) => {
        if (!valid) return this.$message.error("校验失败");
      });
      
      this.orderdialogVisible = false;
    },
    changeEdit(id) {
      this.orderdialogVisible = true;
    },
    getInfo() {
      this.$http.get("orders", { params: this.orderInfo }).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error("获取失败");
        }
        this.orderInfoList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
  },
  created() {
    this.getInfo();
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-input {
  margin-bottom: 15px;
}
</style>
