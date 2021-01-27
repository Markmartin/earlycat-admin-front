<template>
  <div style="margin-top: 50px">
    <el-form ref="productAttrForm" label-width="120px"> </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuAttrDetail",
  props: {
    isEdit: { type: Boolean, default: false }
  },
  data() {
    return {};
  }
};
</script>

<style scoped></style>
