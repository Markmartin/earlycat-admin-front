<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.brandId" clearable placeholder="请选择" class="filter-item">
        <el-option
          v-for="item in brandList"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <el-input v-model="listQuery.poSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入采购单号"/>
      <el-date-picker
        :picker-options="pickerOptions"
        :default-time="['00:00:00', '23:59:59']"
        v-model="pickerDate"
        type="datetimerange"
        align="right"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="margin-bottom:10px;vertical-align: middle;"
        unlink-panels
        range-separator="至"
        start-placeholder="订单开始时间"
        end-placeholder="订单截止时间"
        @change="pickerDateChange"/>
      <el-button v-permission="['GET /admin/po/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/po/generator']" class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">生成采购单</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" min-width="100" label="采购单号" prop="poSn"/>

      <el-table-column align="center" label="供应商" width="100" prop="brandName"/>

      <el-table-column align="center" label="订单开始时间" prop="orderStartTime"/>

      <el-table-column align="center" label="订单截止时间" prop="orderEndTime"/>

      <el-table-column align="center" label="创建时间" prop="addTime"/>

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/po/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
          <el-button v-permission="['GET /admin/po/export']" type="primary" size="mini" @click="handleExport(scope.row)">导出</el-button>
          <el-button v-permission="['POST /admin/po/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 创建对话框 -->
    <el-dialog :visible.sync="createDialogVisible" title="生成采购单">
      <el-form label-width="100px">
        <el-form-item label="选择时间">
          <el-date-picker
            :picker-options="pickerOptions"
            :default-time="['00:00:00', '23:59:59']"
            v-model="pickerDate1"
            type="datetimerange"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="margin-bottom:10px;vertical-align: middle;"
            unlink-panels
            range-separator="至"
            start-placeholder="订单开始时间"
            end-placeholder="订单截止时间"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCreate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>

</style>

<script>
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { poList, poDelete, poGenerator } from '@/api/po'
import { listBrand } from '@/api/brand'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Po',
  components: { Pagination },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      pickerDate: '',
      pickerDate1: '',
      createDialogVisible: false,
      brandList: [],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc',
        brandId: undefined,
        poSn: '',
        queryEndTime: '',
        queryStartTime: ''
      }
    }
  },
  created() {
    this.getBrand()
    this.getList()
  },
  methods: {
    pickerDateChange() {
      this.listQuery.queryStartTime = this.pickerDate[0]
      this.listQuery.queryEndTime = this.pickerDate[1]
    },
    handleCreate() {
      this.pickerDate1 = ''
      this.createDialogVisible = true
    },
    saveCreate() {
      poGenerator({ orderStartTime: this.pickerDate1[0], orderEndTime: this.pickerDate1[1] }).then(response => {
        this.handleFilter()
        this.createDialogVisible = false
        this.$notify.success({
          title: '成功',
          message: '生成采购单成功'
        })
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    getBrand() {
      listBrand({ page: 1, limit: 50 })
        .then(response => {
          this.brandList = response.data.data.list
        })
        .catch(() => {
          this.brandList = []
        })
    },
    getList() {
      this.listLoading = true
      poList(this.listQuery).then(response => {
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
    handleDetail(row) {
      this.$router.push({ path: '/po/details', query: { id: row.id }})
    },
    handleDelete(row) {
      this.$confirm('确定要删除当前采购单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        poDelete(row).then(response => {
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
    handleExport(row) {
      axios({
        method: 'get',
        url: process.env.BASE_API + `/po/export`,
        responseType: 'blob',
        params: {
          id: row.id
        },
        headers: {
          'X-Wali-Token': getToken()
        }
      }).then(res => {
        const link = document.createElement('a')
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        const temp = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
        var fileName = decodeURIComponent(temp)
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$notify.error({
          title: '失败',
          message: err
        })
      })
    }
  }
}
</script>
