<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="发货日期">
        <el-date-picker
          v-model="listQuery.date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-button
        type="primary"
        @click="getOrderByAcStatus"
        v-permission="['GET /admin/order/getOrderByAcStatus']"
        >查询</el-button
      >
     <el-upload
        class="upload-demo"
        :action="importUrl"
        :headers="importHeaders"
        :on-success="onSuccess"
        :on-error="onError"
        style="display:inline;margin-left:10px;"
      >
        <el-button type="primary">导入</el-button>
      </el-upload>
       <!-- <el-button
        type="primary"
        @click="tempSendEgg"
        v-permission="['GET /admin/order/getOrderByAcStatus']"
        >赠送鸡蛋（勿点）</el-button
      > -->
    </el-form>

    <el-table
      :data="list"
      style="width: 100%"
      border
      id="printJS-form"
      :row-style="{ height: '1px' }"
      :cell-style="{ padding: '5px' }"
    >
      <!-- <el-table-column align="center" label="序号" width="70" type="index"></el-table-column> -->
      <!-- <el-table-column align="center" label="品类" width="100">
        <template slot-scope="scope">{{ scope.row.plateName }}</template>
      </el-table-column> -->
      <el-table-column
        align="center"
        label="序号"
        width="70"
        type="index"
      ></el-table-column>
      <el-table-column align="center" label="订单" width="200">
        <template slot-scope="scope">{{ scope.row.orderSn }}</template>
      </el-table-column>
      <el-table-column align="center" label="客户" width="140">
        <template slot-scope="scope">{{ scope.row.consignee }}</template>
      </el-table-column>
      <el-table-column label="电话" width="120">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <el-table-column align="center" label="编号" width="80">
        <template slot-scope="scope">{{ scope.row.sortingNo }}</template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getOrderByAcStatus"
    />
  </div>
</template>

<script>
import path from "path";
import { formatTime, formatDate } from "@/utils";
import { getOrderByAcStatus,importSxShopOrder,tempSendEgg } from "@/api/order";
import Pagination from '@/components/Pagination';
import { getToken } from "@/utils/auth";

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      importUrl: process.env.BASE_API + importSxShopOrder(),
      importHeaders: {
        'X-Wali-Token': getToken()
      },
      listQuery: {
        page: 1,
        limit: 20,
        acStatus: 6,
        date: "",
      },
    };
  },
  created() {
    this.getOrderByAcStatus();
  },
  methods: {
    async getOrderByAcStatus() {
      const res = await getOrderByAcStatus(this.listQuery);
      this.list = res.data.data.list;
      this.total = res.data.data.total;
    },
    onSuccess(res) {
      if (res.errno === 0) {
        this.$message({
          type: "success",
          message: "导入成功"
        });
        this.getOrderByAcStatus();
      } else {
        this.$message.error(res.errmsg);
      }
      this.getOrderByAcStatus()
    },
    onError() {
      this.$message.error("导入失败");
    },
    tempSendEgg(){
      tempSendEgg({date: '2020-12-12',fullPrice: 59}).then(res => {

      })
    }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
