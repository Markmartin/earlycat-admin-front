<template>
  <div class="unit-cell">
    <el-form class="unit-cell-form" :model="item" label-width="100px">
      <el-row :gutter="30">
        <el-col :span="7">
          <el-form-item label="物料供应商：" prop="supplierId">
            <el-select
              v-model="item.supplierId"
              @change="updateSupplier"
              placeholder="请选择品牌"
              clearable
              style="width:100%"
              :remote-method="updateSupplierOptions"
              remote
              filterable
            >
              <el-option
                v-for="item in supplierOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="入库价格￥：">
            <el-input v-model="item.inPrice">
              <template slot="append">
                元
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="出库价格￥：">
            <el-input v-model="item.outPrice">
              <template slot="append">
                元
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item label-width="20px">
            <el-button type="primary" @click="deleteSpuUnit">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { updateSupplierByName } from "@/api/erp/supplier";

export default {
  props: {
    index: { type: Number, required: true },
    item: { default: () => ({}) }
  },
  data() {
    return { supplierOptions: [] };
  },
  methods: {
    async updateSupplierOptions(keyword) {
      const response = await updateSupplierByName(keyword);
      if (response.status) {
        const { list } = response.data;
        this.supplierOptions = [...list];
      }
    },
    updateSupplier(value) {
      //传递供应商名称
      let supplier = this.supplierOptions.find(item => item.id == value);
      this.$emit("uploadData", { index: this.index, data: supplier });
    },
    deleteSpuUnit: function() {
      this.$emit("deleteIndex", this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
.unit-cell {
  position: relative;
  width: 100%;
  margin: 10px auto 0;
  .unit-cell-form {
    width: 100%;
  }
}
</style>
