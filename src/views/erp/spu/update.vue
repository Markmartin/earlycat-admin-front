<template> 
  <product-detail :is-edit='true'></product-detail>
</template>
<script>
  import ProductDetail from './components/SpuDetail'
  export default {
    name: 'updateProduct',
    components: { ProductDetail }
  }
</script>
<style>
</style>
