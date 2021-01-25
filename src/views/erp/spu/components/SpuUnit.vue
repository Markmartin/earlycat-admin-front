<template>
  <div style="margin-top: 100px">
    <el-form :model="spuUnitVo" ref="productSaleForm" label-width="100px" style="width: 400px" size="small">
      <el-row>
        <el-form-item label="物料供应商：" prop="supplierId">
          <el-select v-model="spuUnitVo.supplierId" placeholder="请选择品牌" clearable>
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库价格￥：">
          <el-input v-model="spuUnitVo.inPrice">
          </el-input>
          <i slot="suffix" style="font-style:normal;margin-right: 10px;">元</i>
        </el-form-item>
        <el-form-item label="出库价格￥：">
          <el-input v-model="spuUnitVo.inPrice"></el-input>
          <i slot="suffix" style="font-style:normal;margin-right: 10px;">元</i><button @click="deleteSpuUnit">删除</button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>

  import {listSupplier} from "@/api/erp/supplier";

  export default {
    props: {
      index: {
        type: Number,
        required: true
      },
      items: {
        type: Array,
        default: Array
      }
    },
    data() {
      return {
        supplierList: [],
        spuUnitVo: {
          id: undefined,
          supplierId: '',
          inPrice: '',
          outPrice: ''
        }
      }
    },
    watch: {
      spuUnitVo: {
        handler(newV, oldV) {
          if (newV.supplierId.length === 0) {
            return false
          }
          if (newV.inPrice.length === 0) {
            return false
          }
          if (newV.outPrice.length === 0) {
            return false
          }
          this.supplierList = newV.supplierList

          this.$emit('uploadData', {index: this.index, data: newV})
        },
        deep: true
      },
      items: {
        handler(newV, oldV) {
          if (newV.length !== 0) {
            this.spuUnitVo = {...newV[this.index]}
          }
        },
        deep: true
      }
    },
    methods: {
      deleteSpuUnit: function () {
        this.$emit('deleteIndex', this.index)
      }
    }
  }
</script>

<style scoped>

</style>
