<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="params.goodsName" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="params.categoryId" filterable placeholder="请选择" clearable>
          <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货日期">
        <el-date-picker
          v-model="params.checkDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="allList" v-permission="['GET /admin/po/allList']">查询</el-button>
      <el-button type="primary" @click="CreateOneFormPage">打印</el-button>
    </el-form>

    <el-table
      :data="purList"
      style="width: 100%;"
      border
      id="printJS-formPur"
      :row-style="{height: '1px'}"
      :cell-style="{padding: '5px'}"
    >
      <el-table-column align="center" label="序号" width="70" type="index"></el-table-column>
      <!-- <el-table-column align="center" label="品类" width="100">
        <template slot-scope="scope">{{ scope.row.plateName }}</template>
      </el-table-column> -->
      <el-table-column label="名称" width="240">
        <template slot-scope="scope">{{ scope.row.goods_name }}</template>
      </el-table-column>
      <el-table-column label="报货规格" width="120">
        <template slot-scope="scope">{{ scope.row.goods_spec }}</template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="80">
        <template slot-scope="scope">{{ scope.row.goods_number }}</template>
      </el-table-column>
      <el-table-column align="center" label="总" width="300">
        <template slot-scope="scope">{{ scope.row.goods_number_str }}</template>
      </el-table-column>
      <!-- <el-table-column label="商城规格" width="170">
        <template slot-scope="scope">{{ scope.row.skuSpec }}</template>
      </el-table-column> -->
      <el-table-column align="center" label="商城数量" width="140">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
      <el-table-column align="center" label="采购" width="70">
        <!-- <template slot-scope="scope"></template> -->
      </el-table-column>
      <el-table-column align="center" label="采购价" width="70">
        <!-- <template slot-scope="scope"></template> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import print from "print-js";
import path from "path";
import { formatTime, formatDate } from "@/utils";
import { allList } from "@/api/po";
import { listCategory } from "@/api/category";

export default {
  data() {
    return {
      purList: [],
      params: {
        checkDate: formatDate(
          new Date()
        ),
      },
      showId: null,
      categorys: [],
    };
  },
  // computed: {
  //   sum() {
  //     return function (row) {
  //       return (
  //         parseFloat(row.bookCount == null ? 0 : row.bookCount) +
  //         parseFloat(row.goodsCount == null ? 0 : row.goodsCount) /
  //           parseFloat(row.skuMpBookInc == null ? 1 : row.skuMpBookInc)
  //       );
  //     };
  //   },
  // },
  created() {
    this.allList();
    this.listCategory();
  },
  methods: {
    async allList() {
      const res = await allList(this.params);
      this.purList = res.data.data;
    },
    async listCategory() {
      const res = await listCategory();
      this.categorys = res.data.data.list;
    },
    CreateOneFormPage() {
      print({
        printable: "printJS-formPur",
        type: "html",
        header: "订单汇总",
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
