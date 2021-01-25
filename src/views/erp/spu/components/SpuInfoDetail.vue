<template>
  <div style="margin-top: 50px">
    <el-form :model="erpSpuVo" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="物料分类：" prop="categoryId">
        <el-cascader v-model="erpSpuVo.categoryId" :options="categoryList"></el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="erpSpuVo.name"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandId">
        <el-select v-model="erpSpuVo.brandId"  placeholder="请选择品牌">
          <el-option v-for="item in brandList" :key="item.erpSpuVo" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专柜价格：">
        <el-input v-model="erpSpuVo.counterPrice"></el-input>
      </el-form-item>
      <el-form-item label="零售价格：">
        <el-input v-model="erpSpuVo.retailPrice"></el-input>
      </el-form-item>
      <el-form-item label="最低售价：">
        <el-input v-model="erpSpuVo.lowPrice"></el-input>
      </el-form-item>
      <el-form-item label="保质期：">
        <el-date-picker v-model="erpSpuVo.expirationDate" value-format="timestamp" type="date" :picker-options="pickerOptions1" placeholder="选择时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="排序：">
        <el-input v-model="erpSpuVo.sort"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {listCatAndBrand} from '@/api/goods'

  export default {
    name: "SpuInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated:false,
        //选中商品分类的值
        selectProductCateValue: [],
        categoryList: [],
        brandList: [],
        erpSpuVo:{
          id:undefined,
          sort: 10
        },
        //日期选择器配置
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          subTitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
          categoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
          brandId: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
          description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
          requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
        }
      };
    },
    created() {
      listCatAndBrand().then(response => {
        this.categoryList = response.data.data.categoryList
        this.brandList = response.data.data.brandList
      })
    },
    computed:{
      //商品的编号
      productId(){
        return this.value.id;
      }
    },
    watch: {
      productId:function(newValue){
        if(!this.isEdit)return;
        if(this.hasEditCreated)return;
        if(newValue===undefined||newValue==null||newValue===0)return;
        this.handleEditCreated();
      },
      selectProductCateValue: function (value) {
        this.erpSpuVo.categoryId = value[value.length - 1];
      }
    },
    methods: {
      //处理编辑逻辑
      handleEditCreated(){
        if(this.value.productCategoryId!=null){
//          this.selectProductCateValue.push(this.value.cateParentId);
//          this.selectProductCateValue.push(this.value.productCategoryId);
        }
        this.hasEditCreated=true;
      },
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
</style>
