<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="params.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          v-model="params.categoryId"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in categorys"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="供应商">
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
      </el-form-item> -->
      <el-form-item label="填写时间">
        <el-date-picker
          v-model="inDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-button
        type="primary"
        @click="listByAdmin"
        v-permission="['GET /admin/purchaserGoods/listByAdmin']"
        >查询</el-button
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
      <el-table-column label="名称" width="240">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="库存规格" align="center">
        <template slot-scope="scope">
          {{ scope.row.cargoSpec }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="系数" align="center" width="90">
        <template slot-scope="scope">
          <el-input v-model="scope.row.outRatio" placeholder="系数"></el-input>
        </template>
      </el-table-column> -->
      <el-table-column label="入库日期" align="center" width="140">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.inDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" width="160">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.supplierId"
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
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.number"
            placeholder="数量"
            type="number"
            min="0"
            @input="inStock(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="入库价" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.price"
            placeholder="入库价"
            type="number"
            min="0"
            @input="inStock(scope.row)"
            @focus="onFClear(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.payPrice"
            :placeholder="scope.row.payPricePH"
            type="number"
            min="0"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['GET /admin/purchaser/detail']"
            type="primary"
            size="mini"
            @click="savePurchase(scope.row)"
            >保存</el-button
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
  </div>
</template>
<script>
import path from "path";
import { formatTime, formatDate } from "@/utils";
import Pagination from "@/components/Pagination";
import { listCatL1 } from "@/api/category";
import { listSupplier } from "@/api/supplier";
import { listByAdmin } from "@/api/purchaseGoods";
import { saveOrUpdate } from "@/api/purchaseJob";
export default {
  components: { Pagination },
  data() {
    return {
      params: {
        page: 1,
        limit: 10,
      },
      categorys: {},
      suppliers: {},
      list: [],
      total: 0,
      inDate: "",
    };
  },
  created() {
    listCatL1({ page: 1, limit: 100 }).then((res) => {
      this.categorys = res.data.data.list;
    });
    this.listSupplier();
    this.checkDate();
  },
  methods: {
    listSupplier() {
      listSupplier({ page: 1, limit: 1000 }).then((res) => {
        this.suppliers = res.data.data.list;
      });
    },
    checkDate() {
      this.inDate = formatDate(new Date());
      this.listByAdmin();
    },
    listByAdmin() {
      listByAdmin(this.params).then((res) => {
        this.list = res.data.data.list.map((m) => {
          m.inDate = this.inDate;
          if (m.litemallPurchaseJob) {
            m.supplierId = m.litemallPurchaseJob.supplierId;
            m.price = m.inPrice
          }
          return m;
        });
        this.total = res.data.data.total;
      });
    },
    savePurchase(row) {
      let obj = {
        goodsId: row.id,
        supplierId: row.supplierId,
        goodsName: row.offlineName,
        goodsSpec: row.cargoSpec,
        number: row.number,
        price: row.price,
        payPrice: row.payPrice,
        purchaseSn: row.inDate.replace(/\-/g, "") + "-" + row.supplierId,
        isVerify: 0,
        updateOutJob: true,
      };
      if (!obj.payPrice) {
        obj.payPrice = row.payPricePH
      }
      if (!obj.goodsSpec) {
        this.$message.error("规格为空，请联系运营");
        return;
      }
      if (!obj.supplierId) {
        this.$message.error("供应商不能为空");
        return;
      }
      if (!obj.number) {
        this.$message.error("数量不能为空");
        return;
      }
      if (!obj.price) {
        this.$message.error("单价不能为空");
        return;
      }
      if (!obj.purchaseSn) {
        this.$message.error("日期不能为空");
        return;
      }
      if (!obj.payPrice) {
        this.$message.error("金额不能为空");
        return;
      }
      saveOrUpdate(obj)
        .then((res) => {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          // this.params.name = null;
          this.listByAdmin();
        })
        .catch((e) => {
          this.$message.error(e.data.errmsg);
        });
    },
    inStock(row) {
      if (row.number && row.price) {
        row.payPricePH = (row.number * row.price).toFixed(2);
      }else {
        row.payPricePH = null
      }
    },
    onFClear(row){
      row.price = null;
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
.el-input__inner {
  width: 54% !important;
}
</style>
