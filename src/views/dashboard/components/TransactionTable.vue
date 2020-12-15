<template>
  <el-table :data="list" style="width: 100%; ">
    <el-table-column label="排名" type="index" align="center" width="50">
    </el-table-column>
    <el-table-column label="组别" min-width="50" align="center">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="社区" min-width="50" align="center">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="金额" min-width="50" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="客单价" width="80" align="center">
      <template slot-scope="{ row }">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from "@/api/remote-search";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        pending: "danger",
      };
      return statusMap[status];
    },
    orderNoFilter(str) {
      return str.substring(0, 30);
    },
  },
  data() {
    return {
      list: [
        {
          order_no: "121",
          price: 1,
          status: 0,
        },
        {
          order_no: "121",
          price: 1,
          status: 0,
        },
        {
          order_no: "121",
          price: 1,
          status: 0,
        },
        {
          order_no: "121",
          price: 1,
          status: 0,
        },
        {
          order_no: "121",
          price: 1,
          status: 0,
        },
        {
          order_no: "121",
          price: 1,
          status: 0,
        },
        {
          order_no: "121",
          price: 1,
          status: 0,
        },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      transactionList().then((response) => {
        this.list = response.data.items.slice(0, 8);
      });
    },
  },
};
</script>
