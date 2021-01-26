<template>
  <div style="margin-top: 50px;" align="center">
    <el-form :model="value" ref="productSaleForm" label-width="120px" style="width: 600px" size="small">
      <spu-unit v-for="(item,index) in items"
                :key="index"
                :index="index"
                :items="items"
                @deleteIndex="del"
                @uploadData="getData">
      </spu-unit>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写物料信息</el-button>
        <el-button size="medium" @click="add">添加</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写物料属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import spuUnit from './SpuUnit'
import {listSupplier} from "@/api/erp/supplier";

export default {
  name: "SpuUnitDetail",
  components: {
    spuUnit
  },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
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
      },
      items: [],
      erpSupplierVo: {id: undefined}
    }
  },
  created() {
    this.listSupplier();
  },

  methods: {
    listSupplier() {
      this.listLoading = true
      listSupplier(this.erpSupplierVo, null, null).then(response => {
        this.supplierList = response.data.data.list;
        const viewData = {
          spuUnitVo: this.spuUnitVo,
          supplierList: response.data.data.list
        }
        this.items.push(viewData)
        this.total = response.data.data.total;
        this.listLoading = false
      }).catch(() => {
        this.supplierList = response.data.data.list;
        this.items.supplierList = this.supplierList;
        this.total = 0
        this.listLoading = false
      })
    },
    //  add student
    add: function () {
      const spuUnitVo = {
        id: undefined,
        supplierId: '',
        inPrice: '',
        outPrice: ''
      };
      const viewData = {
        spuUnitVo: spuUnitVo,
        supplierList: this.supplierList
      }

      this.items.push(viewData)
    },
    // delete student
    del: function (index) {
      //  not allow to delete the first
      if (index !== 0) {
        this.items.splice(index, 1)
        this.items.spuSupplierList = this.supplierList;
      }
    },
    //  get the data from child
    getData: function (val) {
      let index = val.index
      this.items[index] = val.data
    },

    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.$emit('nextStep')
    }
  }
}
</script>

<style scoped>

.el-select .el-input {
  width: 200px;
}
</style>
