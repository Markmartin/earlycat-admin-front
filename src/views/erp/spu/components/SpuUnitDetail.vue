<template>
  <div style="margin-top: 100px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" style="width: 600px" size="small">
      <el-row>
        <el-col :span="8">
        <el-form-item label="物料供应商：" prop="supplierId">
          <el-select v-model="value.supplierId" placeholder="请选择品牌" clearable>
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库价格￥：">
            <el-input v-model="value.detailTitle">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出库价格￥：">
            <el-input v-model="value.detailDesc">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {fetchList as fetchMemberLevelList} from '@/api/test/memberLevel'
import {listSupplier} from "@/api/erp/supplier";

export default {
  name: "SpuUnitDetail",
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
      erpSupplierVo: {id: undefined},
      //日期选择器配置
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    }
  },
  created() {
    this.listSupplier();
    if (this.isEdit) {
      // this.handleEditCreated();
    } else {
//        fetchMemberLevelList({defaultStatus: 0}).then(response => {
//          let memberPriceList = [];
//          for (let i = 0; i < response.data.length; i++) {
//            let item = response.data[i];
//            memberPriceList.push({memberLevelId: item.id, memberLevelName: item.name})
//          }
//          this.value.memberPriceList = memberPriceList;
//        });
    }
  },
  computed: {
    //选中的服务保证
    selectServiceList: {
      get() {
        let list = [];
        if (this.value.serviceIds === undefined || this.value.serviceIds == null || this.value.serviceIds === '') return list;
        let ids = this.value.serviceIds.split(',');
        for (let i = 0; i < ids.length; i++) {
          list.push(Number(ids[i]));
        }
        return list;
      },
      set(newValue) {
        let serviceIds = '';
        if (newValue != null && newValue.length > 0) {
          for (let i = 0; i < newValue.length; i++) {
            serviceIds += newValue[i] + ',';
          }
          if (serviceIds.endsWith(',')) {
            serviceIds = serviceIds.substr(0, serviceIds.length - 1)
          }
          this.value.serviceIds = serviceIds;
        } else {
          this.value.serviceIds = null;
        }
      }
    }
  },
  methods: {
    listSupplier() {
      this.listLoading = true
      debugger
      listSupplier(this.erpSupplierVo, null, null).then(response => {
        this.supplierList = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.supplierList = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleEditCreated() {
      let ids = this.value.serviceIds.split(',');
      console.log('handleEditCreated', ids);
      for (let i = 0; i < ids.length; i++) {
        this.selectServiceList.push(Number(ids[i]));
      }
    },
    handleRemoveProductLadder(index, row) {
      let productLadderList = this.value.productLadderList;
      if (productLadderList.length === 1) {
        productLadderList.pop();
        productLadderList.push({
          count: 0,
          discount: 0,
          price: 0
        })
      } else {
        productLadderList.splice(index, 1);
      }
    },
    handleAddProductLadder(index, row) {
      let productLadderList = this.value.productLadderList;
      if (productLadderList.length < 3) {
        productLadderList.push({
          count: 0,
          discount: 0,
          price: 0
        })
      } else {
        this.$message({
          message: '最多只能添加三条',
          type: 'warning'
        });
      }
    },
    handleRemoveFullReduction(index, row) {
      let fullReductionList = this.value.productFullReductionList;
      if (fullReductionList.length === 1) {
        fullReductionList.pop();
        fullReductionList.push({
          fullPrice: 0,
          reducePrice: 0
        });
      } else {
        fullReductionList.splice(index, 1);
      }
    },
    handleAddFullReduction(index, row) {
      let fullReductionList = this.value.productFullReductionList;
      if (fullReductionList.length < 3) {
        fullReductionList.push({
          fullPrice: 0,
          reducePrice: 0
        });
      } else {
        this.$message({
          message: '最多只能添加三条',
          type: 'warning'
        });
      }
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
.littleMargin {
  margin-top: 10px;
}
</style>
