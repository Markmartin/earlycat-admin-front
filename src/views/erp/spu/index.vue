<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">查询结果</el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="物料名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader clearable  :options="categoryList"></el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option v-for="item in brandList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="float:right" class="btn-add" @click="handleAddProduct()" type="primary" size="small" icon="el-icon-plus">添加</el-button>
    </el-card>
    <div class="table-container" v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row
         :header-cell-style="{background:'#B4D5F6',color:'#606266'}">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column align="center" min-width="100" label="商品名称" prop="onlineName">
          <template slot-scope="scope">
            <p>名称：{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100" label="商品属性" prop="onlineName">
          <template slot-scope="scope">
            <p>专柜价格：￥{{ scope.row.counterPrice }} 元</p>
            <p>零售价格：￥{{ scope.row.retailPrice }} 元</p>
            <p>最低售价：￥{{ scope.row.lowPrice }} 元</p>
            <p>保质日期：{{ scope.row.expirationDate }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" property="iconUrl" label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" width="150">
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)" >编辑</el-button>
            </p>
            <p>
              <el-button size="mini" @click="handleShowLog(scope.$index, scope.row)">日志</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize"
                     :page-sizes="[5,10,15]" :current-page.sync="listQuery.pageNum" :total="total"></el-pagination>
    </div>
    <el-dialog
      title="编辑货品信息"
      :visible.sync="editSkuInfo.dialogVisible"
      width="40%">
      <span>商品货号：</span>
      <span>{{ editSkuInfo.productSn }}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
        <el-table-column label="SKU编号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in editSkuInfo.productAttr" :label="item.name" :key="item.id"
                         align="center">
          <template slot-scope="scope">
            {{ getProductSkuSp(scope.row, index) }}
          </template>
        </el-table-column>
        <el-table-column label="销售价格" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存预警值" width="100" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateDeleteStatus, updateNewStatus, updateRecommendStatus, updatePublishStatus} from '@/api/test/product'
import {fetchList as fetchSkuStockList, update as updateSkuStockList} from '@/api/test/skuStock'
import {fetchList as fetchProductAttrList} from '@/api/test/productAttr'
import {listSpu} from '@/api/erp/spu'
import {listCatAndBrand} from '@/api/goods'

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 10,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
};
export default {
  name: "productList",
  data() {
    return {
      editSkuInfo: {
        dialogVisible: false,
        productId: null,
        productSn: '',
        productAttributeCategoryId: null,
        stockList: [],
        productAttr: [],
        keyword: null
      },
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      categoryList: [],
      brandList: [],
      params: {
        page: 1,
        limit: 10,
      },
      erpSpuVo: {
        id: undefined
      },
    }
  },
  created() {
    this.getList();
    listCatAndBrand().then(response => {
      this.categoryList = response.data.data.categoryList
      this.brandList = response.data.data.brandList
    })
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }

    }
  },
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return '审核通过';
      } else {
        return '未审核';
      }
    }
  },
  methods: {
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.spData);
      if (spData != null && index < spData.length) {
        return spData[index].value;
      } else {
        return null;
      }
    },
    getList() {
      this.listLoading = true;
      listSpu(this.erpSpuVo, this.params.page, this.params.limit).then(response => {
        this.listLoading = false;
        this.list = response.data.data.list
        this.total = response.data.data.total
      });
    },
    handleShowSkuEditDialog(index, row) {
      this.editSkuInfo.dialogVisible = true;
      this.editSkuInfo.productId = row.id;
      this.editSkuInfo.productSn = row.productSn;
      this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
      this.editSkuInfo.keyword = null;
      fetchSkuStockList(row.id, {keyword: this.editSkuInfo.keyword}).then(response => {
        this.editSkuInfo.stockList = response.data;
      });
      if (row.productAttributeCategoryId != null) {
        fetchProductAttrList(row.productAttributeCategoryId, {type: 0}).then(response => {
          this.editSkuInfo.productAttr = response.data.list;
        });
      }
    },
    handleSearchEditSku() {
      fetchSkuStockList(this.editSkuInfo.productId, {keyword: this.editSkuInfo.keyword}).then(response => {
        this.editSkuInfo.stockList = response.data;
      });
    },
    handleEditSkuConfirm() {
      if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
        this.$message({
          message: '暂无sku信息',
          type: 'warning',
          duration: 1000
        });
        return
      }
      this.$confirm('是否要进行修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateSkuStockList(this.editSkuInfo.productId, this.editSkuInfo.stockList).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.editSkuInfo.dialogVisible = false;
        });
      });
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleAddProduct() {
      this.$router.push({path: '/erp/spu/add'});
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    },
    handleNewStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateNewStatus(row.newStatus, ids);
    },
    handleRecommendStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateRecommendStatus(row.recommandStatus, ids);
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleDelete(index, row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.updateDeleteStatus(1, ids);
      });
    },
    handleUpdateProduct(index, row) {
      this.$router.push({path: '/erp/spu/update', query: {id: row.id}});
    },
    handleShowProduct(index, row) {
      console.log("handleShowProduct", row);
    },
    handleShowVerifyDetail(index, row) {
      console.log("handleShowVerifyDetail", row);
    },
    handleShowLog(index, row) {
      console.log("handleShowLog", row);
    },
    updatePublishStatus(publishStatus, ids) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('publishStatus', publishStatus);
      updatePublishStatus(params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    updateNewStatus(newStatus, ids) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('newStatus', newStatus);
      updateNewStatus(params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    updateRecommendStatus(recommendStatus, ids) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('recommendStatus', recommendStatus);
      updateRecommendStatus(params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('deleteStatus', deleteStatus);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
      });
      this.getList();
    }
  }
}
</script>
<style></style>


