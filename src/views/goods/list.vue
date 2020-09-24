<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称"/>
      <el-cascader :options="categoryList" clearable class="filter-item" expand-trigger="hover" placeholder="请选择所属分类" @change="handleCategoryChange"/>
      <el-select v-model="listQuery.brandId" clearable class="filter-item" placeholder="请选择所属品牌商">
        <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.isNew" clearable style="width: 200px" class="filter-item" placeholder="请选择是否新品状态">
        <el-option v-for="type in isNewOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.isHot" clearable style="width: 200px" class="filter-item" placeholder="请选择是否热卖状态">
        <el-option v-for="type in isHotOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.isChoice" clearable style="width: 200px" class="filter-item" placeholder="请选择限时特惠状态">
        <el-option v-for="type in isChoiceOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.isOnSale" clearable style="width: 200px" class="filter-item" placeholder="请选择售货状态">
        <el-option v-for="type in isOnSaleOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.acStatus" clearable style="width: 200px" class="filter-item" placeholder="请选择销售类型">
        <el-option v-for="type in isPressOption" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/goods/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-permission="['GET /admin/goods/list']" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-printer" @click="handlePrinter">打印</el-button> -->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="宣传画廊">
              <img v-for="pic in props.row.gallery" :key="pic" :src="pic" class="gallery">
            </el-form-item>
            <el-form-item label="商品介绍">
              <span>{{ props.row.brief }}</span>
            </el-form-item>
            <el-form-item label="标题">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="副标题">
              <span>{{ props.row.subtitle }}</span>
            </el-form-item>
            <el-form-item label="商品单位">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
            <el-form-item label="关键字">
              <span>{{ props.row.keywords }}</span>
            </el-form-item>
            <el-form-item label="类目ID">
              <span>{{ props.row.categoryId }}</span>
            </el-form-item>
            <el-form-item label="品牌商ID">
              <span>{{ props.row.brandId }}</span>
            </el-form-item>
            <el-form-item label="线上价格">
              <span>{{ props.row.onlinePrice }}元</span>
            </el-form-item>
            <el-form-item label="线下价格">
              <span>{{ props.row.offlinePrice }}元</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

<!--      <el-table-column align="center" label="商品编号" prop="goodsSn"/>-->

      <el-table-column align="center" min-width="100" label="线上名称" prop="onlineName"/>

      <el-table-column align="center" min-width="100" label="线下名称" prop="offlineName"/>

      <el-table-column align="center" property="iconUrl" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" property="iconUrl" label="分享图">
        <template slot-scope="scope">
          <img :src="scope.row.shareUrl" width="40">
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

<!--      <el-table-column align="center" label="专柜价格" prop="counterPrice"/>-->

<!--      <el-table-column align="center" label="当前价格" prop="retailPrice"/>-->

      <el-table-column align="center" label="销售类型" width="110px" prop="acStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.acStatus == 0">正常</span>
          <span v-if="scope.row.acStatus == 1">预售</span>
          <span v-if="scope.row.acStatus == 2">限时特价</span>
          <span v-if="scope.row.acStatus == 98">新用户赠送</span>
          <span v-if="scope.row.acStatus == 99">买即送</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否新品" prop="isNew">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isNew ? 'success' : 'error' ">{{ scope.row.isNew ? '新品' : '非新品' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否热品" prop="isHot">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isHot ? 'success' : 'error' ">{{ scope.row.isHot ? '热品' : '非热品' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否特惠" prop="isChoice">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isChoice ? 'success' : 'error' ">{{ scope.row.isChoice ? '特惠' : '普通' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否在售" prop="isOnSale">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isOnSale ? 'success' : 'error' ">{{ scope.row.isOnSale ? '在售' : '未售' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/goods/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
<!--          <el-button v-permission="['GET /admin/goods/list']" type="primary" size="mini" @click="handlePrinter(scope.row)">打印</el-button>-->
          <el-button v-permission="['POST /admin/goods/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
import { getLodop } from '@/utils/lodopFuncs'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GoodsList',
  components: { BackToTop, Pagination },
  data() {
    return {
      isPressOption: [
        {
          label: '正常',
          value: 0
        },
        {
          label: '预售',
          value: 1
        },
        {
          label: '限时特价',
          value: 2
        },  {
          label: '新用户赠送物品',
          value: 98
        }, {
          value: 99,
          label: '赠送物品'
        }],
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
        acStatus: undefined,
        categoryId: undefined,
        brandId: undefined,
        page: 1,
        limit: 20,
        goodsSn: undefined,
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
    this.getList()
    listCatAndBrand().then(response => {
      this.categoryList = response.data.data.categoryList
      this.brandList = response.data.data.brandList
    })
  },
  methods: {
    handleCategoryChange(value) {
      this.listQuery.categoryId = value[value.length - 1]
    },
    getList() {
      this.listLoading = true
      listGoods(this.listQuery).then(response => {
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
