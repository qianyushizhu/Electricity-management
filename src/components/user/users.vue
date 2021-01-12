<template>
  <div>
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getusers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getusers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="changeDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch
              @change="userChangState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editClick(scope.row.id)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUsersInfo(scope.row.id)"
            ></el-button>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配人员"
              placement="top"
            >
              <el-button
                @click="userShare(scope.row)"
                type="primary"
                icon="el-icon-share"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 弹出对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addusers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出修改对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClose"
    >
      <el-form
        :model="editFromList"
        :rules="editRules"
        ref="editRuleForm"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="editFromList.username"
            :disabled="isdisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFromList.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFromList.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editmessage">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="usersDialogIsVisible"
      width="50%"
    >
      <div>
        <p>{{ userInfo.username }}</p>
        <p>{{ userInfo.role_name }}</p>
        <el-select v-model="selectUserinfo" placeholder="请选择">
          <el-option
            v-for="item in userroleslist"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="usersDialogIsVisible = false">取 消</el-button>
        <el-button type="primary" @click="userSelectInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {getusers} from '../../network/users'
export default {
  name: "users",
  data() {
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("邮箱格式错误"));
    };
    const checkPhone = (rule, value, callback) => {
      const regEmail = /^1[34578]\d{9}$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("手机号码格式错误"));
    };
    const checkEmail1 = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("邮箱格式错误"));
    };
    const checkPhone1 = (rule, value, callback) => {
      const regEmail = /^1[34578]\d{9}$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("手机号码格式错误"));
    };

    return {
      userInfo: {},
      userroleslist: [],
      usersDialogIsVisible: false,
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addVisible: false,
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editFromList: {},
      editRules: {
        editemail: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail1, trigger: "blur" },
        ],
        editmobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhone1, trigger: "blur" },
        ],
      },
      isdisabled: true,

      addFromRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      selectUserinfo:''
    };
  },
  created() {
    this.getusers();
  },
  methods: {
    userSelectInfo(){
      if(!this.selectUserinfo){
        this.$message.error('请选择')
      }
      this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectUserinfo.id}).then(res=>{
        if(res.data.meta.status!==200){
          this.$message.error('获取失败')
        }
        this.$message.success('success')
        this.getusers()
        this.usersDialogIsVisible=false
      })
    },
    userShare(info) {
      this.userInfo = info;
      console.log(info);
      this.$http.get("roles").then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error("获取失败");
        }
        this.userroleslist = res.data.data;
      });
      this.usersDialogIsVisible=true
    },
    async deleteUsersInfo(id) {
      const confirmRusult = await this.$confirm(
        "此操作将永久删除该人员, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRusult !== "confirm") {
        this.$message.info("已取消删除");
      }
      this.$http.delete(`users/${id}`).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success("已成功删除");
        this.getusers();
      });
    },

    editClose() {
      this.$refs.editRuleForm.resetFields();
    },
    editClick(id) {
      this.$http.get(`users/${id}`).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("查询失败");
        }

        this.editFromList = res.data.data;
        //  this.editRuleForm.email=res.data.data.email
        //  this.editRuleForm.mobile=res.data.data.mobile
        this.editDialogVisible = true;
      });
    },
    editmessage() {
      this.$refs.editRuleForm.validate((vaild) => {
        if (!vaild) return;
        this.$http
          .put(`users/${this.editFromList.id}`, {
            email: this.editFromList.email,
            mobile: this.editFromList.mobile,
          })
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              this.$message.error("提交失败");
            }

            this.editDialogVisible = false;

            this.getusers();
            this.$message.success("提交成功");
          });
      });
    },
    addDialogClose() {
      this.$refs.addFromRef.resetFields();
    },
    getusers() {
      this.$http.get("users", { params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取失败");
        }
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    handleSizeChange(newSive) {
      // console.log(newSive)
      this.queryInfo.pagesize = newSive;
      this.getusers();
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage;
      this.getusers();
    },
    userChangState(newState) {
      console.log(newState);
      this.$http
        .put(`users/${newState.id}/state/${newState.mg_state}`)
        .then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            newState.mg_state = !newState.mg_state;
            return this.$message.error("用户状态跟新失败");
          }
          return this.$message.success(res.data.meta.msg);
        });
    },
    changeDialog() {
      this.addVisible = true;
    },

    addusers() {
      this.$refs.addFromRef.validate((vaild) => {
        console.log(vaild);
        if (!vaild) return;
        this.$http.post("users", this.addFrom).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 201) {
            return this.$message.error("添加用户失败");
          }
          this.$message.success("添加用户成功");
          this.addVisible = false;
          this.getusers();
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
}
</style>
