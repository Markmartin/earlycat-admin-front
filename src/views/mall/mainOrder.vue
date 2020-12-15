<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="干线">
        <el-select v-model="params.mainLine" filterable placeholder="请选择" clearable @change="checkLine">
          <el-option v-for="item in mainLines" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货日期">
        <el-date-picker
          v-model="params.date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="listMainOrder" v-permission="['GET /admin/order/listMainOrder']">查询</el-button>
      <el-button type="primary" @click="CreateOneFormPage">打印</el-button>
      <el-button type="primary" @click="handleExportOrder">导出所有订单</el-button>
    </el-form>

    <el-table
      :data="list"
      style="width: 100%;"
      border
      id="printJS-form"
      :row-style="{height: '1px'}"
      :cell-style="{padding: '5px'}"
    >
      <!-- <el-table-column align="center" label="序号" width="70" type="index"></el-table-column> -->
      <!-- <el-table-column align="center" label="品类" width="100">
        <template slot-scope="scope">{{ scope.row.plateName }}</template>
      </el-table-column> -->
      <el-table-column align="center" label="运单" width="200">
        <template slot-scope="scope">{{ scope.row.shipSn }}</template>
      </el-table-column>
      <el-table-column align="center" label="行政区" width="120">
        <template slot-scope="scope">{{ scope.row.area }}</template>
      </el-table-column>
      <el-table-column align="center" label="收货人" width="120">
        <template slot-scope="scope">{{ scope.row.consignee }}</template>
      </el-table-column>
      <el-table-column align="center" label="编号" width="80">
        <template slot-scope="scope">{{ scope.row.sortingNo }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import print from "print-js";
import path from "path";
import { formatTime, formatDate } from "@/utils";
import { listMainOrder,exportAllOrderToDFH } from "@/api/order";

export default {
  data() {
    return {
      list: [],
      list_bak:[],
      params: {
        date: formatDate(new Date()),
        mainLine:''
      },
      mainLines: [],
    };
  },
  created() {
    this.listMainOrder();
  },
  methods: {
    async listMainOrder() {
      const res = await listMainOrder(this.params);
      this.list = res.data.data;
      this.list_bak = res.data.data;
      let ll = JSON.parse(JSON.stringify(res.data.data))
      this.mainLines = Array.from(new Set(ll.map(m => m.area)))
    },
    checkLine(){
      let bak = JSON.parse(JSON.stringify(this.list_bak))
      this.list = bak.filter(f => f.area === this.params.mainLine)
    },
    CreateOneFormPage() {
      print({
        printable: "printJS-form",
        type: "html",
        header: "干线订单 "+(this.params.mainLine?this.params.mainLine:''),
        headerStyle: "text-align:center;color:#f00;width:100%;",
        // targetStyles: ['border', 'padding: 15px'],
        scanStyles: false,
        style:
          "table tr td,th { border-collapse: collapse;padding: 15px;border:1px #000 solid;}", // 表格样式
      });
    },
    handleExportOrder() {
      exportAllOrderToDFH(this.params).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel",
        });
        let fileName = "东方汇" + formatDate(new Date()) + ".xlsx";
        if ("download" in document.createElement("a")) {
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
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
