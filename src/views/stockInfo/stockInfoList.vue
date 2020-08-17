<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称"/>
      <el-cascader :options="categoryList" clearable class="filter-item" expand-trigger="hover" placeholder="请选择所属分类"
                   @change="handleCategoryChange"/>
      <el-select v-model="listQuery.brandId" clearable class="filter-item" placeholder="请选择所属品牌商">
        <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.isNew" clearable style="width: 200px" class="filter-item" placeholder="请选择是否新品状态">
        <el-option v-for="type in isNewOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.isHot" clearable style="width: 200px" class="filter-item" placeholder="请选择是否热卖状态">
        <el-option v-for="type in isHotOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.isChoice" clearable style="width: 200px" class="filter-item"
                 placeholder="请选择限时特惠状态">
        <el-option v-for="type in isChoiceOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.isOnSale" clearable style="width: 200px" class="filter-item" placeholder="请选择售货状态">
        <el-option v-for="type in isOnSaleOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-button v-permission="['GET /admin/stockInfo/stockInfoList']" class="filter-item" type="primary" icon="el-icon-search"
                 @click="handleFilter">查找
      </el-button>
      <el-button v-permission="['POST /admin/stockInfo/stockInfoCreate']" class="filter-item" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加
      </el-button>
      <el-button v-permission="['GET /admin/goods/list']" :loading="downloadLoading" class="filter-item" type="primary"
                 icon="el-icon-download" @click="handleDownload">导出
      </el-button>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-printer" @click="handlePrinter">打印</el-button> -->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="商品介绍">
              <span>{{ props.row.subtitle }}</span>
            </el-form-item>
            <el-form-item label="商品单位">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
            <el-form-item label="类目ID">
              <span>{{ props.row.categoryId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="id" label="id" prop="id"/>

      <el-table-column align="center" label="小程序标题" prop="title"/>

      <el-table-column align="center" min-width="100" label="小程序副标题" prop="subtitle"/>

      <el-table-column align="center" property="picUrl" label="展示图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" label="详情" prop="detail">
        <template slot-scope="scope">
          <el-dialog :visible.sync="detailDialogVisible" title="商品详情">
            <div v-html="goodsDetail"/>
          </el-dialog>
          <el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="线上名称" prop="onlineName"/>
      <el-table-column align="center" label="线上规格" prop="onlineSpec"/>
      <el-table-column align="center" label="线上价格" prop="onlinePrice"/>
      <el-table-column align="center" label="线上销量" prop="onlineSales"/>

      <el-table-column align="center" label="线下名称" prop="offlineName"/>
      <el-table-column align="center" label="线下规格" prop="offlineSpec"/>
      <el-table-column align="center" label="线下价格" prop="offlinePrice"/>
      <el-table-column align="center" label="线下销量" prop="offlineSales"/>

      <el-table-column align="center" label="专柜价格" prop="counterPrice"/>


      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/stockInfo/update']" type="primary" size="mini"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-permission="['GET /admin/stockInfo/list']" type="primary" size="mini"
                     @click="handlePrinter(scope.row)">打印
          </el-button>
          <el-button v-permission="['POST /admin/stockInfo/delete']" type="danger" size="mini"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getStockInfoList"/>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100"/>
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
  import { listGoods, deleteStockInfo, listCatAndBrand, listStockInfoList } from '@/api/stockInfo'
  import { getLodop } from '@/utils/lodopFuncs'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'StockInfoList',
    components: { BackToTop, Pagination },
    data() {
      return {
        isNewOptions: [
          {
            label: '新品',
            value: true
          },
          {
            label: '非新品',
            value: false
          }
        ],
        isHotOptions: [
          {
            label: '热卖',
            value: true
          },
          {
            label: '普通',
            value: false
          }
        ],
        isChoiceOptions: [
          {
            label: '特惠',
            value: true
          },
          {
            label: '普通',
            value: false
          }
        ],
        isOnSaleOptions: [
          {
            label: '在售',
            value: true
          },
          {
            label: '未售',
            value: false
          }
        ],
        categoryList: [],
        brandList: [],
        printerData: '',
        printerValue: 1,
        createDialogVisible: false,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          isOnSale: '',
          categoryId: undefined,
          page: 1,
          limit: 20,
          name: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        goodsDetail: '',
        detailDialogVisible: false,
        downloadLoading: false
      }
    },
    created() {
      this.getStockInfoList()
      listCatAndBrand().then(response => {
        this.categoryList = response.data.data.categoryList
        this.brandList = response.data.data.brandList
      })
    },
    methods: {
      handleCategoryChange(value) {
        this.listQuery.categoryId = value[value.length - 1]
      },
      getStockInfoList() {
        this.listLoading = true
        listStockInfoList(this.listQuery).then(response => {
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
        this.listQuery.page = 1
        this.getList()
      },
      handleCreate() {
        this.$router.push({ path: '/stockInfo/stockInfoCreate' })
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
        this.$router.push({ path: '/stockInfo/stockInfoEdit', query: { id: row.id } })
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
          deleteStockInfo(row).then(response => {
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
        }).catch(() => {
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
