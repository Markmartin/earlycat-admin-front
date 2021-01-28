<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 查询和其他操作 -->
      <el-select
        class="filter-item"
        v-model="listQuery.type"
        filterable
        placeholder="请选择渠道"
        clearable
      >
        <el-option
          v-for="item in types"
          :key="item.type"
          :label="item.value"
          :value="item.type"
        >
        </el-option>
      </el-select>
      <el-input
        v-model="listQuery.goodsName"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入产品名称"
      />
      <el-date-picker
        class="filter-item"
        v-model="listQuery.date"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择日期"
      >
      </el-date-picker>
      <el-select
        class="filter-item"
        v-model="listQuery.lineId"
        filterable
        placeholder="请选择对象"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        v-permission="['GET /admin/comment/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
        >查找</el-button
      >
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="exportGoodsInfo"
        >导出</el-button
      >
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      :default-sort="{ prop: 'rate', order: 'ascending' }"
    >
      <el-table-column align="center" label="日期" prop="date" />
      <el-table-column align="center" label="对象" prop="lineName" />
      <el-table-column align="left" label="产品" prop="goodsName" width="260" />
      <el-table-column align="center" label="入库规格" prop="inSpecification" />
      <el-table-column align="center" label="入库单价" prop="inPrice" />
      <el-table-column
        align="center"
        label="销售规格"
        prop="sellSpecification"
      />
      <el-table-column align="center" label="销售单价" prop="sellPrice" />
      <el-table-column
        align="center"
        label="单价差"
        prop="difference"
        sortable
      />
      <el-table-column align="center" label="单价毛利率" prop="rate" sortable>
        <!-- <template slot-scope="scope">
              {{scope.row.rate | CRate}} 
          </template> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { goodsInfo, exportGoodsInfo } from "@/api/goods";
import { formatDate } from "@/utils";
import { listByType } from "@/api/line";
export default {
  name: "Comment",
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        type: 1,
        date: "",
      },
      options: [],
      types: [
        {
          type: 1,
          value: "线上",
        },
        {
          type: 2,
          value: "微菜场",
        },
      ],
    };
  },
  created() {
    this.getList();
    let date = new Date();
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    this.listQuery.date = formatDate(date);
    listByType(1).then((res) => {
      this.options = res.data.data;
    });
  },
  filters: {
    CRate: function (value) {
      if (!value) return "";
      return (parseFloat(value) * 100).toFixed(2) + "%";
    },
  },
  methods: {
    getList() {
      this.listLoading = true;
      goodsInfo(this.listQuery)
        .then((response) => {
          this.list = response.data.data;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    exportGoodsInfo() {
      exportGoodsInfo(this.listQuery).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel",
        });
        let fileName = "产品定价.xlsx";
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
