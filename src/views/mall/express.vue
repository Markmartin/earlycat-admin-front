<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input
          v-model="listQuery.orderSn"
          placeholder="请输入订单号"
        ></el-input>
      </el-form-item>
      <el-form-item label="编号">
        <el-input
          v-model="listQuery.sortingNo"
          placeholder="请输入编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          v-model="listQuery.mobile"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="发货日期">
        <el-date-picker
          v-model="listQuery.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button type="primary" @click="sendExpress">推送订单</el-button>
    </el-form>

    <el-table
      :data="list"
      style="width: 100%"
      border
      :row-style="{ height: '1px' }"
      :cell-style="{ padding: '5px' }"
      v-loading="listLoading"
    >
      <el-table-column
        align="center"
        label="序号"
        width="70"
        type="index"
      ></el-table-column>
      <el-table-column label="运单号" width="150">
        <template slot-scope="scope">{{ scope.row.shipSn }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单号" width="140">
        <template slot-scope="scope">{{ scope.row.orderSn }}</template>
      </el-table-column>
      <el-table-column align="center" label="编号" width="60">
        <template slot-scope="scope">{{ scope.row.sortingNo }}</template>
      </el-table-column>
      <el-table-column align="center" label="地址" width="160">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <el-table-column align="center" label="收件人" width="120">
        <template slot-scope="scope">{{ scope.row.consignee }}</template>
      </el-table-column>
      <el-table-column align="center" label="电话" width="120">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.acStatus == 1">预售</el-tag>
          <el-tag type="success" v-else>普通</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="detailOrder(scope)"
            >查询商品</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="express(scope)"
            :disabled="scope.row.shipSn == null"
            >查询订单</el-button
          >
          <el-button
            type="success"
            size="small"
            @click="uploadExpress(scope)"
            :disabled="scope.row.shipSn != null || scope.row.orderStatus != 204"
            >推送订单</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :visible.sync="dialogVisibleDetail" title="运单详细">
      <div>
        运单：{{ detail.orderid }}
        <br />
        订单：{{ detail.outOrderId }}
      </div>
      <div>
        <el-table :data="detail.waybillTracker" style="margin-top: 20px" border>
          <el-table-column label="详细">
            <template slot-scope="scope"
              >{{ scope.row.time }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                scope.row.info
              }}</template
            >
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisibleDetail = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleGoods" title="商品">
      <div id="printJS-form">
        <el-table
          :data="showGoods"
          style="margin-top: 20px"
          border
        >
          <el-table-column
            align="center"
            label="序号"
            width="70"
            type="index"
          ></el-table-column>
          <el-table-column align="center" label="名称" width="210">
            <template slot-scope="scope">{{ scope.row.goodsName }}</template>
          </el-table-column>
          <el-table-column align="center" label="规格" width="160">
            <template slot-scope="scope">{{
              scope.row.specifications[0]
            }}</template>
          </el-table-column>
          <el-table-column align="center" label="单价" width="80">
            <template slot-scope="scope">{{ scope.row.price }}</template>
          </el-table-column>
          <el-table-column align="center" label="数量" width="80">
            <template slot-scope="scope">{{ scope.row.number }}</template>
          </el-table-column>
          <el-table-column align="center" label="金额" width="80">
            <template slot-scope="scope">{{ scope.row.finalPrice }}</template>
          </el-table-column>
        </el-table>
        <div style="text-align: right; padding: 10px 30px 10px 0;font-size:1.1rem;">
          实付：{{ order.actualPrice }} 元
        </div>
      </div>

      <div style="text-align: right">
        <el-button type="primary" @click="CreateOneFormPage">打印</el-button>
        <el-button type="danger" @click="dialogVisibleGoods = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import print from "print-js";
import Pagination from "@/components/Pagination";
import path from "path";
import {
  uploadExpress,
  expresslist,
  detailOrder,
  sendExpress,
  express,
} from "@/api/order";
import { deepClone, formatDate } from "@/utils";
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        date: "",
      },
      list: [],
      dialogVisibleGoods: false,
      dialogVisibleDetail: false,
      showGoods: [],
      detail: {},
      total: 0,
      listLoading: true,
      order: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      expresslist(this.listQuery)
        .then((response) => {
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
    // exportPostage() {
    //   exportPostage(this.params).then((res) => {
    //     const blob = new Blob([res], {
    //       type: "application/vnd.ms-excel",
    //     });
    //     let fileName = "运单 " + formatDateTime(new Date()) + ".xlsx";
    //     if ("download" in document.createElement("a")) {
    //       const elink = document.createElement("a");
    //       elink.download = fileName;
    //       elink.style.display = "none";
    //       elink.href = URL.createObjectURL(blob);
    //       document.body.appendChild(elink);
    //       elink.click();
    //       URL.revokeObjectURL(elink.href); // 释放URL 对象
    //       document.body.removeChild(elink);
    //     } else {
    //       navigator.msSaveBlob(blob, fileName);
    //     }
    //   });
    // },
    uploadExpress(scope) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      uploadExpress({ orderId: scope.row.id }).then((res) => {
        if (res.message === "SUCCESS") {
          this.$notify({
            title: "上传成功",
            dangerouslyUseHTMLString: true,
            type: "success",
          });
        }
        loading.close();
      });
    },
    sendExpress() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      sendExpress().then((res) => {
        if (res.message === "SUCCESS") {
          this.$notify({
            title: "上传成功",
            dangerouslyUseHTMLString: true,
            type: "success",
          });
        }
        loading.close();
        this.getList();
      });
    },
    express(scope) {
      this.detail = {};
      this.dialogVisibleDetail = true;
      express({ orderId: scope.row.id }).then((res) => {
        this.detail = res.data.data.expressInfo;
      });
    },
    async detailOrder(scope) {
      this.showGoods = [];
      this.dialogVisibleGoods = true;
      const res = await detailOrder(scope.row.id);
      this.order = res.data.data.order;
      this.showGoods = res.data.data.orderGoods;
    },
    CreateOneFormPage() {
      print({
        printable: "printJS-form",
        type: "html",
        header: "订单 "+formatDate(new Date()),
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
