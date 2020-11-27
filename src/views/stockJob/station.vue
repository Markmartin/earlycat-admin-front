<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="分类">
        <el-select
          v-model="params.stationId"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in stations"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
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
      <el-button
        type="primary"
        @click="stationOrder"
        v-permission="['GET /admin/stockJob/stationOrder']"
        >查询</el-button
      >
      <el-button type="primary" @click="CreateOneFormPage">打印</el-button>
    </el-form>

    <el-table
      :data="list"
      style="width: 100%"
      border
      id="printJS-formOrder"
      :row-style="{ height: '1px' }"
      :cell-style="{ padding: '5px' }"
    >
      <el-table-column
        align="center"
        label="序号"
        width="70"
        type="index"
      ></el-table-column>
      <el-table-column label="库位" width="100">
        <template slot-scope="scope">{{ scope.row.stationName }}</template>
      </el-table-column>
      <el-table-column label="产品名称" width="300">
        <template slot-scope="scope">{{ scope.row.goodsName }}</template>
      </el-table-column>
      <el-table-column align="center" label="规格" width="120">
        <template slot-scope="scope">{{
          scope.row.specifications | spec
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="80">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import print from "print-js";
import path from "path";
import { formatTime, formatDate } from "@/utils";
import { stationList,stationOrder } from "@/api/station";

export default {
  data() {
    return {
      list: [],
      list_bak:[],
      params: {
        date: formatDate(
          new Date()
        ),
      },
      stations: [],
    };
  },
  created() {
    this.stationOrder();
    this.stationList();
  },
  filters: {
    spec(value) {
      return eval(value)[0];
    },
  },
  methods: {
    async stationOrder() {
      if (this.params.stationId) {
          let data = JSON.parse(JSON.stringify(this.list_bak))
          this.list = data.filter(f => f.stationId == this.params.stationId)
      } else {
        const res = await stationOrder(this.params);
        this.list = res.data.data;
        this.list_bak = res.data.data;
      }
    },
    async stationList() {
      const res = await stationList();
      this.stations = res.data.data;
    },
    CreateOneFormPage() {
      print({
        printable: "printJS-formOrder",
        type: "html",
        header: "工位配货",
        headerStyle: "text-align:center;color:#f00;width:100%;",
        // targetStyles: ['border', 'padding: 15px'],
        scanStyles: false,
        style:
          "table tr td,th { border-collapse: collapse;padding: 15px;border:1px #000 solid;}", // 表格样式
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
