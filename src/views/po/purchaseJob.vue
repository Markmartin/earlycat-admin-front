<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="params.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="供应商">
        <el-select
          v-model="params.supplierId"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in suppliers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="searchTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-button
        type="primary"
        @click="listByAdmin"
        v-permission="['GET /admin/purchaser/list']"
        >查询</el-button
      >
      <el-button
        type="primary"
        @click="exportPurchase"
        v-permission="['GET /admin/purchaser/list']"
        >导出</el-button
      >
    </el-form>
    <el-table
      :data="list"
      style="width: 100%"
      border
      :row-style="{ height: '1px' }"
      :cell-style="{ padding: '5px' }"
    >
      <el-table-column
        align="center"
        label="序号"
        width="70"
        type="index"
      ></el-table-column>
      <el-table-column label="批次" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.purchaseSn }}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="240">
        <template slot-scope="scope">{{ scope.row.goodsName }}</template>
      </el-table-column>
      <el-table-column label="库存规格" align="center">
        <template slot-scope="scope">
          {{ scope.row.goodsSpec }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" width="160">
        <template slot-scope="scope">
          {{ supplierObj[scope.row.supplierId] }}
        </template>
      </el-table-column>
      <el-table-column label="入库价" align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="实际收货" align="center">
        <template slot-scope="scope">
          {{ scope.row.finalNumber }}
        </template>
      </el-table-column>
      <el-table-column label="入库价" align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.payPrice }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button
            v-permission="['GET /admin/purchaser/detail']"
            type="primary"
            size="mini"
            @click="handleEdit(scope)"
            >编辑</el-button
          > -->
          <el-button
            v-permission="['GET /admin/purchaseJob/delete']"
            type="danger"
            size="mini"
            @click="deleteJob(scope.row)"
            :disabled="scope.row.isVerify == 1"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="params.page"
      :limit.sync="params.limit"
      @pagination="listByAdmin"
    />
    <el-dialog :visible.sync="dialogVisible" title="编辑">
      <el-form :model="job" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="job.goodsName" placeholder="名称" disabled />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="job.goodsSpec" placeholder="规格" disabled />
        </el-form-item>
        <el-form-item label="入库价">
          <el-input v-model="job.price" placeholder="出库价" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="job.number" placeholder="数量" />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmJob">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import path from "path";
import { deepClone, formatTime, formatDate } from "@/utils";
import Pagination from "@/components/Pagination";
import { listSupplier } from "@/api/supplier";
import {
  listByAdmin,
  saveOrUpdate,
  deleteJob,
  exportPurchase,
} from "@/api/purchaseJob";

const defaultJob = {
  id: "",
  goodsName: "",
  goodsSpec: "",
  number: "",
  price: "",
};

export default {
  components: { Pagination },
  data() {
    return {
      job: Object.assign({}, defaultJob),
      params: {
        page: 1,
        limit: 10,
      },
      suppliers: [],
      supplierObj: {},
      list: [],
      total: 0,
      inDate: "",
      dialogVisible: false,
      searchTime: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "前天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this.listSupplier();
    this.checkDate();
  },
  methods: {
    listSupplier() {
      listSupplier({ page: 1, limit: 1000 }).then((res) => {
        this.suppliers = res.data.data.list;
        let obj = {};
        res.data.data.list.forEach((element) => {
          obj[element.id] = element.name;
        });
        this.supplierObj = obj;
      });
    },
    checkDate() {
      this.inDate = formatDate(new Date());
      this.listByAdmin();
    },
    listByAdmin() {
      if (this.searchTime) {
        this.params.startTime = this.searchTime[0];
        this.params.endTime = this.searchTime[1];
      }
      listByAdmin(this.params).then((res) => {
        this.list = res.data.data.list.map((m) => {
          m.inDate = this.inDate;
          if (m.litemallPurchaseJob) {
            m.supplierId = m.litemallPurchaseJob.supplierId;
          }
          return m;
        });
        this.total = res.data.data.total;
      });
    },
    handleEdit(scope) {
      this.dialogVisible = true;
      this.job = deepClone(scope.row);
    },
    confirmJob() {
      if (!this.job.number) {
        this.$message.error("数量不能为空");
        return;
      }
      if (!this.job.price) {
        this.$message.error("单价不能为空");
        return;
      }
      saveOrUpdate(this.job).then((res) => {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.listByAdmin();
      });
    },
    deleteJob(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteJob({ id: row.id }).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.listByAdmin();
        });
      });
    },
    exportPurchase() {
      if (this.searchTime) {
        this.params.startTime = this.searchTime[0];
        this.params.endTime = this.searchTime[1];
        exportPurchase(this.params).then((res) => {
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          let fileName =
            "采购单" +
            this.params.startTime +
            "-" +
            this.params.endTime +
            ".xlsx";
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
      } else {
        this.$message.error("请选择日期")
      }
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
