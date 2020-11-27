<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名"/>
      <el-button
        v-permission="['GET /admin/userRecharge/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。"
              border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable/>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="width:40px;height:40px;" >
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" min-width="120px" prop="nickname"/>
      <el-table-column align="center" label="账户余额" min-width="120px" prop="remaining"/>
      <el-table-column align="center" label="开户时间" min-width="120px" prop="openTime" sortable/>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }
</style>

<script>
  import {apiList} from "@/api/userRecharge";
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "userRecharge",
    components: {Pagination},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        dialogStatus: "",
        listQuery: {
          nickname: '',
          page: 1,
          limit: 20,
          sort: "add_time",
          order: "desc"
        },
        textMap: {
          update: "编辑",
          create: "创建"
        },
        dialogFormVisible: false,
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        apiList(this.listQuery)
          .then(response => {
            this.list = response.data.data.list;
            this.total = response.data.data.total;
            this.listLoading = false;
          })
          .catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },
    }
  };
</script>
