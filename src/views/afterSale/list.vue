<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称"/>
      <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/goods/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-permission="['GET /admin/goods/list']" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="申请图片">
              <img v-for="url in props.row.url" :key="url" :src="url" class="url">
            </el-form-item>
            <el-form-item label="申请理由">
              <span>{{ props.row.reason }}</span>
            </el-form-item>
            <el-form-item label="申请原因">
              <span>{{ props.row.detail }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

<!--      <el-table-column align="center" label="商品编号" prop="goodsSn"/>-->

      <el-table-column align="center" min-width="100" label="申请编号" prop="id"/>

      <el-table-column align="center" min-width="100" label="申请人" prop="userName"/>

      <el-table-column align="center" min-width="100" label="申请人账号" prop="phone"/>

      <el-table-column align="center" min-width="100" label="申请订单号" prop="orderId"/>

      <el-table-column align="center" label="退款类型" prop="isAll">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isAll ? 'success' : 'error' ">{{ scope.row.isAll ? '整单退款' : '单品退款' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100" label="申请时间" prop="applyTime"/>

      <el-table-column align="center" label="申请状态" width="110px" prop="acStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">申请中</span>
          <span v-if="scope.row.status == 2">已退款</span>
          <span v-if="scope.row.status == 3">已驳回</span>
          <span v-if="scope.row.status == 4">已取消</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100" label="操作人" prop="operator"/>
      <el-table-column align="center" min-width="100" label="退款时间" prop="operationTime"/>
      <el-table-column align="center" min-width="100" label="退款金额（元）" prop="refundPrice"/>


      <el-table-column align="center" label="操作" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/goods/update']" type="primary" size="mini" @click="handleUpdate(scope.row)" >编辑</el-button>
          <el-button v-permission="['POST /admin/goods/delete']" type="danger" size="mini" @click="handleDelete(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <!-- 创建对话框 -->
    <el-dialog :visible.sync="createDialogVisible" title="打印标签">
      <el-form label-width="100px">
        <el-form-item label="打印份数">
          <el-input v-model="printerValue" clearable type="number" placeholder="请输入打印份数"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button v-permission="['GET /admin/goods/list']" type="primary" @click="handlePrinterSave">确定</el-button>
      </div>
    </el-dialog>
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
</style>

<script>
import { listGoods, deleteGoods, listCatAndBrand } from '@/api/goods'
import { getList} from '@/api/afterSale'
import { getLodop } from '@/utils/lodopFuncs'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GoodsList',
  components: { BackToTop, Pagination },
  data() {
    return {
      printerData: '',
      printerValue: 1,
      createDialogVisible: false,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        afterSaleVo: {}
      },
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getList(this.listQuery.afterSaleVo, this.listQuery.page, this.listQuery.limit).then(response => {
        this.list = response.data.data.afterSaleVos;
        this.total = response.data.data.total;
        this.listLoading = false
      }).catch(() => {
        this.list = [];
        this.total = 0;
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({ path: '/goods/create' })
    },
    handlePrinter(row) {
      this.printerData = row
      this.printerValue = 1
      this.createDialogVisible = true
    },
    handlePrinterSave() {
      const LODOP = getLodop()
      for (var i = 1; i <= this.printerValue; i++) {
        LODOP.PRINT_INITA('0mm', '0mm', '40mm', '30mm', '')
        LODOP.ADD_PRINT_BARCODE('2.98mm', '9.5mm', '30.01mm', '12.02mm', '128A', this.printerData.goodsSn)
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
        LODOP.ADD_PRINT_TEXT('18.5mm', '6.5mm', '33mm', '11.5mm', this.printerData.name)
        LODOP.SET_PRINT_STYLEA(0, 'ReadOnly', 0)
        LODOP.PRINT()
        // LODOP.PREVIEW()
      }
    },
    handleUpdate(row) {
      this.$router.push({ path: '/goods/edit', query: { id: row.id }})
    },
    showDetail(detail) {
      this.goodsDetail = detail
      this.detailDialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定删除当前商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(row).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
      }).catch(() => {})
    },

    handChangeStatus(row) {
      this.activityVo.id = row.id
      let msg = ''
      if (row.isOnSale == 0) {
        this.goods.isOnSale = 1
        msg = '上架'
      } else {
        this.goods.status = 0
        msg = '下架'
      }
      changSaleStatus(this.activityVo).then(() => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify.success({
          title: '成功',
          message: msg + '成功'
        })
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['商品ID', '商品编号', '名称', '专柜价格', '当前价格', '是否新品', '是否热品', '是否在售', '首页主图', '宣传图片列表', '商品介绍', '详细介绍', '商品图片', '商品单位', '关键字', '类目ID', '品牌商ID']
        const filterVal = ['id', 'goodsSn', 'name', 'counterPrice', 'retailPrice', 'isNew', 'isHot', 'isOnSale', 'listPicUrl', 'gallery', 'brief', 'detail', 'picUrl', 'goodsUnit', 'keywords', 'categoryId', 'brandId']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
