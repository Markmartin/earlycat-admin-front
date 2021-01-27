<template>
  <div class="spu-unit-detail">
    <spu-unit
      class="spu-unit-cell"
      v-for="(item, index) in supplierList"
      :key="index"
      :index="index"
      :item="item"
      @deleteIndex="del"
      @uploadData="uploadData"
    >
    </spu-unit>
    <el-button type="primary" @click="add">添加</el-button>
    <div class="action">
      <el-button type="primary" @click="$emit('prevStep')">上一步</el-button>
      <el-button type="primary" @click="$emit('nextStep')">下一步</el-button>
    </div>
  </div>
</template>

<script>
import spuUnit from "./SpuUnit";
import { listSupplier } from "@/api/erp/supplier";

export default {
  name: "SpuUnitDetail",
  components: {
    spuUnit
  },
  props: {
    supplierList: { required: true },
    isEdit: { type: Boolean, default: false }
  },
  data() {
    return {
      dataRec: [],
      erpSupplierVo: { id: undefined },
      //日期选择器配置
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  methods: {
    add() {
      let updateSupplier = [...this.supplierList];
      updateSupplier.push({ supplierId: "", inPrice: "", outPrice: "" });
      this.$emit("update:supplierList", updateSupplier);
    },
    del(index) {
      if (index !== 0) {
        let updateSupplier = [...this.supplierList];
        updateSupplier.splice(index, 1);
        this.$emit("update:supplierList", updateSupplier);
      }
    },
    //  get the data from child
    uploadData(payload) {
      const { index, data } = payload;
      let updateSupplier = [...this.supplierList];
      updateSupplier[index] = {
        ...updateSupplier[index],
        supplier: data.name
      };
      this.$emit("update:supplierList", updateSupplier);
    }
  }
};
</script>

<style lang="scss" scoped>
.spu-unit-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  .action {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    el-button + el-button {
      margin-left: 20px;
    }
  }
}
</style>
