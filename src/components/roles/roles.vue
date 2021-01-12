<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesUser">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table :data="rolesList" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            class="vcenter"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
          >
            <el-col :span="6">
              <el-tag
                type=""
                closable
                @close="rolesRemoveTag(scope.row, item1.id)"
                >{{ item1.authName }}</el-tag
              >
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="18">
              <el-row
                class="vcenter"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="rolesRemoveTag(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="(item3, i3) in item2.children"
                    :key="item3.id"
                    closable
                    @close="rolesRemoveTag(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="350px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="rolesChangeInfo(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="rolesRemoveInfo(scope.row.id)"
            >删除</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="rolesChangeTreeInfo(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加角色"
      :visible.sync="rolesDialogVisible"
      width="50%"
      @close="rolesDialog"
    >
      <el-form
        :model="rolesInfo"
        status-icon
        ref="ruleFormInfo"
        label-width="100px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="rolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改角色信息"
      :visible.sync="rolesDialogVisible"
      width="50%"
    >
      <el-form :model="rolesInfo" ref="changeRuleForm" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="rolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editmessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="rolesRightVisible" width="50%" @close="setResetTree">
      <el-tree
      
        :data="rolesTreeInfoList"
        :props="treeProps"
        show-checkbox 
        ref="treeRef"
        default-expand-all 
        :default-checked-keys="defkeys"
        node-key="id"
        
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      rolesList: [],
      rolesDialogVisible: false,
      rolesInfo: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      rolesRightVisible: false,
      rolesTreeInfoList: [],
      treeProps:{
         children: 'children',
          label: 'authName'
      },
      defkeys:[],
      defTreeId:'',
      
      
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    allotRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()

      ]
      const keysStr=keys.join(',')
      this.$http.post(`roles/${this.defTreeId}/rights`,{rids:keysStr}).then((res=>{
        console.log(res)
        if(res.data.meta!==200){
           this.$message.error('请求失败')
        }
        this.$message.success('分配成功')
        this.getRolesList()
        this.rolesRightVisible=false
      }))
    },
    setResetTree(){
      this.defkeys=[]
    },
    getLeafTrees(node,arr){
      if(!node.children){
        arr.push(node.id)
      }
      node.children.forEach(item=>{
        this.getLeafTrees(item,arr)
      })
    },
    rolesChangeTreeInfo(role) {
      
      this.$http.get("rights/tree").then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error("获取失败");
        }
        this.rolesTreeInfoList = res.data.data;
        this.getLeafTrees(role,this.defkeys)
        this.rolesRightVisible = true;
      });
      
    },
    rolesRemoveTag(role, rightid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .delete(`roles/${role.id}/rights/${rightid}`)
            .then((res) => {
              // console.log(res)
              if (res.data.meta.status !== 200) {
                this.$message.error("删除失败");
              }
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              role.children = res.data.data;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    rolesRemoveInfo(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete(`roles/${id}`).then((res) => {
            // console.log(res)
            if (res.data.meta.status !== 200) {
              this.$message.error("删除失败");
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getRolesList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editmessage() {
      this.$http
        .put(`roles/${this.rolesInfo.roleId}`, {
          roleName: this.rolesInfo.roleName,
          roleDesc: this.rolesInfo.roleDesc,
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("获取失败");
          }
          this.$message.success("成功");
          this.rolesDialogVisible = false;
          this.getRolesList();
        });
    },
    rolesChangeInfo(id) {
      this.rolesDialogVisible = true;
      this.$http.get(`roles/${id}`).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("查询失败");
        }

        this.rolesInfo = res.data.data;

        this.rolesDialogVisible = true;
      });
    },
    rolesDialog() {
      this.$refs.ruleFormInfo.resetFields();
    },
    getRolesList() {
      this.$http.get("roles").then((res) => {
        // console.log(res);
        this.rolesList = res.data.data;
      });
    },
    addRolesUser() {
      this.rolesDialogVisible = true;
    },
    addRolesUserInfo() {
      this.$http.post("roles", this.rolesInfo).then((res) => {
        if (res.data.meta.status !== 201) {
          this.$message.error("更新失败");
        }
        this.$message.success("更新成功");
      });

      this.rolesDialogVisible = false;
      this.getRolesList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-tag {
  margin: 8px;
}
.vcenter {
  display: flex;
  align-items: center;
}

</style>
