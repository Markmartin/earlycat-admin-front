<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="erpSpuVo.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入物料名称"/>
      <el-cascader :options="categoryList" clearable class="filter-item"  placeholder="请选择所属分类" @change="handleCategoryChange"/>
      <el-select v-model="erpSpuVo.brandId" clearable class="filter-item" placeholder="请选择所属供应商">
        <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="erpSpuVo.condition" clearable style="width: 110px" class="filter-item" placeholder="库存条件">
        <el-option v-for="type in numberCondition" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-input v-model="erpSpuVo.number" clearable class="filter-item" style="width: 110px;" placeholder="库存数量"/>
      <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/goods/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row :header-cell-style="{background:'#B4D5F6',color:'#606266'}">

      <el-table-column align="center" min-width="100" label="商品名称" prop="onlineName">
        <template slot-scope="scope">
          <p>【
            <span v-if="scope.row.acStatus == 0">正常物品</span>
            <span v-if="scope.row.acStatus == 1">预售物品</span>
            <span v-if="scope.row.acStatus == 2">限时特价物品</span>
            <span v-if="scope.row.acStatus == 98">赠送物品</span>
            <span v-if="scope.row.acStatus == 99">买即送物品</span>
            】
          </p>
          <p>线上名称：{{ scope.row.onlineName }}</p>
          <p>线下名称：{{ scope.row.offlineName }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="商品属性" prop="onlineName">
        <template slot-scope="scope">
          <p>线上价格：￥{{ scope.row.onlinePrice }} 元</p>
          <p>线下价格：￥{{ scope.row.offlinePrice }} 元</p>
          <p>零售价格：￥{{ scope.row.counterPrice }} 元</p>
          <p>商品单位：{{ scope.row.unit }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" property="iconUrl" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="150">
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <p>
            <!--<el-button v-permission="['POST /admin/goods/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>-->
          </p>
          <p>
            <!--<el-button v-permission="['POST /admin/goods/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>-->
          </p>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="params.page" :limit.sync="params.limit" @pagination="getSpuList"/>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100"/>
    </el-tooltip>



  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }

  .gallery {
    width: 80px;
    margin-right: 10px;
  }

  img {
    width: 8vw;
    height: 8vw;
    vertical-align: top;
  }
</style>

<script>
  import {listSpu} from '@/api/erp/spu'
  import {getLodop} from '@/utils/lodopFuncs'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'GoodsList',
    components: {BackToTop, Pagination},
    data() {
      return {
        listLoading: true,
        total: 0,
        list: [],
        numberCondition: [
          {
            value: '>',
            label: '大于'
          }, {
            value: '<',
            label: '小于'
          }, {
            value: '=',
            label: '等于'
          }],
        brandList: [],
        categoryList: [],
        erpSpuVo: {
          id: undefined
        },
        params: {
          page: 1,
          limit: 10,
        },
      }
    },
    created() {
      this.getSpuList()
    },
    methods: {
      handleCategoryChange(value) {
        this.listQuery.categoryId = value[value.length - 1]
      },
      getSpuList() {
        this.listLoading = true
        listSpu(this.erpSpuVo, this.params.page, this.params.limit).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter() {

      },
      handleCreate() {

      }
    }
  }
</script>
