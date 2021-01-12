<template>
  

      <el-container class="home_container">


          <!-- 头部 -->
        <el-header>
            
            <div class="headerText">
                <img width="50px" src="../../assets/logo.png" alt="">
                <span>电商后台管理系统</span>
            </div>
             <el-Button type='info' @click="back">退出</el-Button>
        </el-header>





        <!-- 左侧 加右边主体-->
        <el-container>
           <!-- 左侧 -->
        <el-aside :width="isToggleShow ? '64px' :'200px' ">
            <div class="toggle-button" @click="togglebtn" >
                |||
            </div>
            <!-- 左侧菜单区域 -->
            <el-menu background-color="#333744" text-color="#fff" 
            unique-opened
            :default-active='activePath'
            router
            :collapse-transition='false'
            :collapse='isToggleShow'
            active-text-color="#409eff">
                <!-- 一级菜单 -->
            <el-submenu :index="item.id+'' " v-for="item in menuList" :key="item.id">
                <!-- 一级菜单模板区域 -->
            <template slot="title">
                <!-- 图标 -->
            <i :class="iconLIst[item.id]"></i>
            <!-- 文本 -->
            <span>{{item.authName}}</span>
            </template>
        
        
            <!-- 二级菜单 -->
             <el-menu-item :index=" '/' + subItem.path " 
             v-for="subItem in item.children" 
             @click="activemenu('/' + subItem.path)"
             :key="subItem.id">
                      <!-- 二级菜单模板区域 -->
            <template slot="title">
                <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{subItem.authName}}</span>
            </template>
             </el-menu-item>

         </el-submenu>
       </el-menu>
   </el-aside>


        <!-- 主体 -->
        <el-main>
            <router-view/>
        </el-main>

        </el-container>

        </el-container>
  
</template>

<script>
export default {
    data(){
        return{
            menuList:[],
            iconLIst:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao',
            },
            isToggleShow:false,
            activePath:''
        }
    },
    created(){
        this.getmenuList()
        this.activePath=window.sessionStorage.getItem('active')
    },
    name:'home',
    methods:{
        back(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取所有的菜单数据
        getmenuList(){
          this.$http.get('menus').then(res=>{
            //   console.log(res)
              if(res.data.meta.status!==200) return this.$message.error('获取失败')
              this.menuList=res.data.data
              
          })
        },
        togglebtn(){
            this.isToggleShow= !this.isToggleShow
        },
        activemenu(active){
        window.sessionStorage.setItem('active',active)
        this.activePath=active
        }
    }
}
</script>

<style>
.home_container{
    height: 100%;
}
.el-header{
    background-color:#373d41 ;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    font-size: 18px;
    

}
.headerText{
    display: flex;
    align-items: center;
    margin-left: 15px;
    
}
.headerText span{
    margin-left: 15px;
}

.el-aside{
    background-color: #333744;
}
 .el-aside .el-menu{
    border-right: none;
}
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    line-height: 24px;
    background-color: #4a5064;
    font-size: 10px;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
}
</style>