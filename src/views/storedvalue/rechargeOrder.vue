<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名"/>
      <el-select v-model="listQuery.payType" clearable style="width: 200px" class="filter-item" placeholder="消费类型">
        <el-option v-for="type in payTypeOps" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-button
        v-permission="['GET /admin/rechargeOrder/list']"
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
      <!--<el-table-column align="center" width="100px" label="ID" prop="id" sortable/>-->
      <el-table-column align="center" label="订单号" min-width="120px" prop="orderSn"/>
      <el-table-column align="center" label="订单状态" min-width="120px" prop="orderStatus">
        <template slot-scope="scope">
          <el-tag>{{ statusOps[scope.row.orderStatus].label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="width:40px;height:40px;" >
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" min-width="120px" prop="nickname"/>
      <el-table-column align="center" label="消费类型" min-width="120px" prop="payType">
        <template slot-scope="scope">
          <el-tag>{{ payTypeOps[scope.row.payType].label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额" min-width="120px" prop="amount"/>
      <el-table-column align="center" label="赠送金额" min-width="120px" prop="aditionalAmount"/>
      <el-table-column align="center" label="支付时间" min-width="120px" prop="payTime"/>
      <el-table-column align="center" label="创建时间" min-width="120px" prop="addTime" sortable/>
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
  import {apiList} from "@/api/rechargeOrder";
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "rechargeOrder",
    components: {Pagination},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        dialogStatus: "",
        listQuery: {
          userId: '',
          nickname: '',
          orderStatus: '',
          payType: '',
          page: 1,
          limit: 20,
          sort: "add_time",
          order: "desc"
        },
        textMap: {
          update: "编辑",
          create: "创建"
        },
        statusOps: [
          {
            label: "未支付",
            value: 0
          },
          {
            label: "已支付",
            value: 1
          }
        ],
        payTypeOps: [
          {
            label: "充值",
            value: 0
          },
          {
            label: "消费",
            value: 1
          },
          {
            label: "退款",
            value: 2
          }
        ],
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
