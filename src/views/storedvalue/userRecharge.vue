<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名"/>
      <el-date-picker
        :picker-options="pickerOptions"
        :default-time="['00:00:00', '23:59:59']"
        v-model="pickerDate"
        type="datetimerange"
        align="right"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="margin-bottom:10px;vertical-align: middle;"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="pickerDateChange"/>
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
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        pickerDate: '',
        list: null,
        total: 0,
        listLoading: true,
        dialogStatus: "",
        listQuery: {
          nickname: '',
          page: 1,
          limit: 20,
          sort: "add_time",
          order: "desc",
          queryStartTime: '',
          queryEndTime: '',
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
      pickerDateChange() {
        if (this.pickerDate == null) {
          this.listQuery.queryStartTime = ''
          this.listQuery.queryEndTime = ''
        } else {
          this.listQuery.queryStartTime = this.pickerDate[0]
          this.listQuery.queryEndTime = this.pickerDate[1]
        }
      },
    }
  };
</script>
