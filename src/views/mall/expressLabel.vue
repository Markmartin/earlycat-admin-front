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
        @click="queryList"
        v-permission="['GET /admin/expressLabel/list']"
        >查询</el-button
      >
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
      <el-table-column label="客户" width="140">
        <template slot-scope="scope">{{ scope.row.consignee }}</template>
      </el-table-column>
      <el-table-column align="center" label="电话" width="120">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="listAll"
    />
  </div>
</template>

<script>
import path from "path";
import { formatTime, formatDate } from "@/utils";
import { listAll } from "@/api/expressLabel";
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        date: "",
      },
    };
  },
  created() {
    this.listAll();
  },
  methods: {
    async queryList() {
      this.listQuery.page = 1;
      this.listAll();
    },
    async listAll() {
      const res = await listAll(this.listQuery);
      this.list = res.data.data.list;
      this.total = res.data.data.total;
    },
    // tempSendEgg(){
    //   tempSendEgg({date: '2020-12-12',fullPrice: 59}).then(res => {

    //   })
    // }
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
