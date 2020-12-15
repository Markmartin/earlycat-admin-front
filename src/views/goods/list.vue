<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">

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
      <el-select v-model="listQuery.acStatus" clearable style="width: 200px" class="filter-item" placeholder="请选择销售类型">
        <el-option v-for="type in isPressOption" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.saleType" clearable style="width: 200px" class="filter-item" placeholder="请选择上架类型">
        <el-option v-for="type in onlineOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.condition" clearable style="width: 110px" class="filter-item" placeholder="库存条件">
        <el-option v-for="type in numberCondition" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-input v-model="listQuery.number" clearable class="filter-item" style="width: 110px;" placeholder="库存数量"/>
      <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search"
                 @click="handleFilter">查找
      </el-button>
      <el-button v-permission="['POST /admin/goods/create']" class="filter-item" type="primary" icon="el-icon-edit"
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
            <el-form-item label="编号">
              <span>{{ props.row.id }}</span>
            </el-form-item>
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

      <el-table-column align="center" min-width="100" label="商品名称" prop="onlineName">
        <template slot-scope="scope">
          <p>【
            <span v-if="scope.row.acStatus == 0">正常物品</span>
            <span v-if="scope.row.acStatus == 1">预售物品</span>
            <span v-if="scope.row.acStatus == 2">限时特价物品</span>
            <span v-if="scope.row.acStatus == 98">新用户赠送物品</span>
            <span v-if="scope.row.acStatus == 99">赠送物品</span>
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

      <el-table-column align="center" property="iconUrl" label="分享图">
        <template slot-scope="scope">
          <img :src="scope.row.shareUrl" width="120">
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

      <el-table-column align="center" label="商品类型">
        <template slot-scope="scope">
          <p>上架：
            <el-switch
              @change="updateAdminGoods(scope.row)"
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.isOnSale">
            </el-switch>
          </p>
          <p>新品：
            <el-switch
              @change="updateAdminGoods(scope.row)"
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.isNew">
            </el-switch>
          </p>
          <p>热卖：
            <el-switch
              @change="updateAdminGoods(scope.row)"
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.isHot">
            </el-switch>
          </p>
          <p>上架类型：
            <span v-if="scope.row.saleType == 1">线上</span>
            <span v-if="scope.row.saleType == 2">线下</span>
            <span v-if="scope.row.saleType == 3">线上&线下</span>
          </p>

        </template>
      </el-table-column>

      <el-table-column align="center" min-width="50" label="库存" prop="number">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="UpdateNumber(scope.row)">{{ scope.row.number }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="50" label="排序" prop="sortOrder">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="UpdateSort(scope.row)">{{ scope.row.sortOrder }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button v-if=" scope.row.isOnSale == 0" v-permission="['POST /admin/goods/update']" type="primary" size="mini" @click="handChangeStatus(scope.row)"  plain>上架</el-button>
           <el-button v-else="scope.row.isOnSale == 1" v-permission="['POST /admin/goods/update']" type="warning" size="mini" @click="handChangeStatus(scope.row)"  plain>下架</el-button>-->
          <p>
            <el-button v-permission="['POST /admin/goods/update']" type="primary" size="mini"
                       @click="handleUpdate(scope.row)">编辑
            </el-button>
          </p>
          <!--          <el-button v-permission="['GET /admin/goods/list']" type="primary" size="mini" @click="handlePrinter(scope.row)">打印</el-button>-->
          <p>
            <el-button v-permission="['POST /admin/goods/delete']" type="danger" size="mini"
                       @click="handleDelete(scope.row)">删除
            </el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

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

    <el-dialog :visible.sync="numberDialogVisible" title="库存设置">
      <el-form ref="numberForm" :model="numberForm" status-icon label-position="left" label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="排序" prop="number">
          <el-input-number v-model="numberForm.number" :min="0"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="numberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmNumber">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="sortDialogVisible" title="排序">
      <el-form ref="sortForm" :model="sortForm" status-icon label-position="left" label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="库存数量" prop="sortOrder">
          <el-input-number v-model="sortForm.sortOrder" :min="0"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSort">确定</el-button>
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

img {
  width: 8vw;
  height: 8vw;
  vertical-align: top;
}
</style>

<script>
import {
  listGoods,
  deleteGoods,
  listCatAndBrand,
  updateAdminStock,
  updateAdminGoods
} from '@/api/goods'
import {getLodop} from '@/utils/lodopFuncs'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GoodsList',
  components: {BackToTop, Pagination},
  data() {
    return {
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
      onlineOptions: [
        {
          value: 1,
          label: '线上'
        }, {
          value: 2,
          label: '线下'
        }, {
          value: 3,
          label: '线上&线下'
        }],
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
        },
        {
          label: '大件商品',
          value: 4
        },
        {
          label: '赠送物品',
          value: 98
        }, {
          value: 99,
          label: '买即送物品'
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
        condition: undefined,
        number: undefined,
        isOnSale: '',
        acStatus: undefined,
        saleType: undefined,
        categoryId: undefined,
        brandId: undefined,
        page: 1,
        limit: 10,
        goodsSn: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false,
      sortDialogVisible: false,
      numberDialogVisible: false,
      sortForm: {
        sortOrder: undefined
      },
      numberForm: {
        number: undefined
      }
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
      if (this.$route.query.listQuery != undefined || this.$route.listQuery != null) {
        this.listQuery = this.$route.query.listQuery;
      }
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

      if (this.listQuery.condition == '') {

      }

      if (this.listQuery.condition != undefined || this.listQuery.condition != null) {
        if (this.listQuery.number == undefined || this.listQuery.number == null) {
          this.$message.error('未输入需要查询的库存数量！！')
          return false
        }
      }

      if (this.listQuery.number != undefined || this.listQuery.number != null) {
        if (this.listQuery.condition == undefined || this.listQuery.condition == null) {
          this.$message.error('未输入需要查询的库存条件！！')
          return false
        }
      }
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({path: '/goods/create'})
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
      this.$router.push({path: '/goods/edit', query: {id: row.id, listQuery: this.listQuery}})
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
      }).catch(() => {
      })
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
    UpdateSort(row) {
      this.sortForm = Object.assign({}, row)
      this.sortDialogVisible = true;
      this.$nextTick(() => {
        this.$refs['sortForm'].clearValidate()
      })
    },
    confirmSort() {
      this.$refs['sortForm'].validate((valid) => {
        if (valid) {
          updateAdminGoods(this.sortForm).then(() => {
            this.sortDialogVisible = false
            this.getList()
            this.$notify.success({
              title: '成功',
              message: '更新成功'
            })
          }).catch(response => {
            this.getList()
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    UpdateNumber(row) {
      this.numberForm = Object.assign({}, row)
      this.numberDialogVisible = true;
      this.$nextTick(() => {
        this.$refs['numberForm'].clearValidate()
      })
    },
    confirmNumber() {
      this.$refs['numberForm'].validate((valid) => {
        if (valid) {
          updateAdminStock(this.numberForm.id, this.numberForm.number).then(() => {
            this.numberDialogVisible = false
            this.getList()
            this.$notify.success({
              title: '成功',
              message: '更新成功'
            })
          }).catch(response => {
            this.getList()
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    updateAdminGoods(row) {
      updateAdminGoods(row).then(() => {
        this.getList()
        debugger
        this.$notify.success({
          title: '成功',
          message: '更新成功'
        })
      }).catch(response => {
        this.getList()
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
