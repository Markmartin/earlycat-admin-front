<template>
  <div class="spu-info-detail">
    <el-form
      class="form"
      :model="form"
      :rules="rules"
      ref="productInfoForm"
      label-width="150px"
    >
      <el-form-item label="物料分类：" prop="categoryId">
        <el-cascader
          style="width:100%"
          v-model="form.categoryId"
          :options="categoryList"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="商品品牌：" prop="brandId">
        <el-select
          style="width:100%"
          v-model="form.brandId"
          placeholder="请选择品牌"
        >
          <el-option
            v-for="item in brandList"
            :key="item.erpSpuVo"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专柜价格：">
        <el-input v-model="form.counterPrice"></el-input>
      </el-form-item>
      <el-form-item label="零售价格：">
        <el-input v-model="form.retailPrice"></el-input>
      </el-form-item>
      <el-form-item label="最低售价：">
        <el-input v-model="form.lowPrice"></el-input>
      </el-form-item>
      <el-form-item label="保质期：">
        <el-date-picker
          style="width:100%"
          v-model="form.expirationDate"
          value-format="timestamp"
          type="date"
          :picker-options="pickerOptions1"
          placeholder="选择时间"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="排序：">
        <el-input v-model="form.sort"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button
          type="primary"
          size="medium"
          @click="handleNext('productInfoForm')"
        >
          下一步，填写商品促销
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { listCatAndBrand } from "@/api/goods";

export default {
  name: "SpuInfoDetail",
  props: {
    isEdit: { type: Boolean, default: false },
    form: { required: true }
  },
  data() {
    return {
      hasEditCreated: false,
      categoryList: [],
      brandList: [],
      //日期选择器配置
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur"
          }
        ],
        subTitle: [
          { required: true, message: "请输入商品副标题", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ],
        brandId: [
          { required: true, message: "请选择商品品牌", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入商品介绍", trigger: "blur" }
        ],
        requiredProp: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    listCatAndBrand().then(response => {
      this.categoryList = response.data.data.categoryList;
      this.brandList = response.data.data.brandList;
    });
  },
  methods: {
    handleNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("nextStep");
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000
          });
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.spu-info-detail {
  position: relative;
  margin-top: 50px;
  width: 100%;
  .form {
    width: 800px;
    margin: 0 auto;
  }
}
</style>
