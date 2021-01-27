<template>
  <el-card class="filter-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写物料信息"></el-step>
      <el-step title="填写物料属性信息"></el-step>
      <el-step title="填写物库存信息"></el-step>
    </el-steps>
    <spu-info-detail
      v-show="showStatus[0]"
      :is-edit="isEdit"
      :erpSpuVo="erpSpuVo"
      @nextStep="nextStep"
    ></spu-info-detail>
    <spu-unit-detail
      v-show="showStatus[1]"
      :is-edit="isEdit"
      :supplierList.sync="supplierList"
      @nextStep="nextStep"
      @prevStep="prevStep"
    ></spu-unit-detail>
    <spu-attr-detail
      v-show="showStatus[2]"
      :is-edit="isEdit"
      @nextStep="prevStep"
      @finishCommit="finishCommit"
    ></spu-attr-detail>
  </el-card>
</template>
<script>
import SpuInfoDetail from "./SpuInfoDetail.vue";
import SpuUnitDetail from "./SpuUnitDetail.vue";
import SpuAttrDetail from "./SpuAttrDetail.vue";
import { createProduct, getProduct, updateProduct } from "@/api/test/product";

export default {
  name: "SpuDetail",
  components: { SpuInfoDetail, SpuUnitDetail, SpuAttrDetail },
  props: {
    isEdit: { type: Boolean, default: false }
  },
  data() {
    return {
      active: 0,
      showStatus: [true, false, false, false],
      erpSpuVo: { id: null, sort: 10 },
      supplierList: [{}]
    };
  },
  created() {
    if (this.isEdit) {
      // getProduct(this.$route.query.id).then(response => {
      //   this.productParam = response.data;
      // });
    }
  },
  methods: {
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    finishCommit(isEdit) {
      this.$confirm("是否要提交该产品", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (isEdit) {
          updateProduct(this.$route.query.id, this.productParam).then(
            response => {
              this.$message({
                type: "success",
                message: "提交成功",
                duration: 1000
              });
              this.$router.back();
            }
          );
        } else {
          createProduct(this.productParam).then(response => {
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000
            });
            location.reload();
          });
        }
      });
    }
  }
};
</script>
<style>
.form-container {
  width: 800px;
}
</style>
