<template>
  <div style="margin-top: 50px;" align="center">
    <spu-unit v-for="(item,index) in items"
              :key="index"
              :index="index"
              :items="items"
              @deleteIndex="del"
              @uploadData="getData">
    </spu-unit>
    <button @click="add" type="button">添加</button>
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
        items: [{}],
        dataRec: [],
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

    methods: {
      listSupplier() {
        this.listLoading = true
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
      //  add student
      add: function () {
        const data = this.supplierList;
        this.items.push({ supplierId: '', inPrice: '', outPrice: ''})
      },
      // delete student
      del: function (index) {
        //  not allow to delete the first
        if (index !== 0) {
          this.items.splice(index, 1)
          console.log('deleted:', JSON.stringify(this.items))
        }
      },
      //  get the data from child
      getData: function (val) {
        let index = val.index
        this.items[index] = val.data
        console.log('I got the data:', JSON.stringify(this.items))
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
