<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.userType" clearable style="width: 200px" class="filter-item" placeholder="请选择推广类型">
        <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-input v-model="listQuery.mobile" clearable style="width: 200px" class="filter-item" placeholder="请收入手机号"/>
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
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="pickerDateChange"/>
      <el-button v-permission="['GET /admin/orderCommission/count/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="推广用户">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="width:40px;height:40px;" >
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" prop="mobile"/>
      <el-table-column align="center" label="所属总代">
        <template slot-scope="scope">
          {{ scope.row.agentName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计推广">
        <template slot-scope="scope">
          <span class="link-type" @click="handleDetail(scope.row)"> {{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计收益">
        <template slot-scope="scope">
          {{ scope.row.totalIncome }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="成为推广员时间" prop="applyPassTime"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100"/>
    </el-tooltip>

  </div>
</template>

<style>
</style>

<script>
import { listOrderCommissionCount } from '@/api/orderCommission'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const typeOptions = [
  {
    label: '普通推广',
    value: 1
  },
  {
    label: '总代推广',
    value: 2
  }
]

export default {
  name: 'orderCommissionCount',
  components: { BackToTop, Pagination },
  filters: {
    formatType(type) {
      for (let i = 0; i < typeOptions.length; i++) {
        if (type === typeOptions[i].value) {
          return typeOptions[i].label
        }
      }
      return ''
    }
  },
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
      typeOptions: typeOptions,
      multipleSelection: [],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        queryEndTime: '',
        queryStartTime: '',
        userType: '',
        mobile: '',
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      detailDialogVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listOrderCommissionCount(this.listQuery).then(response => {
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
      this.$router.push({ path: '/promotion/orderCommission', query: { userId: row.userId,
        queryStartTime: row.queryStartTime, queryEndTime: row.queryEndTime} })
    },
    pickerDateChange() {
      if (this.pickerDate == null) {
        this.listQuery.queryStartTime = ''
        this.listQuery.queryEndTime = ''
      } else {
        this.listQuery.queryStartTime = this.pickerDate[0]
        this.listQuery.queryEndTime = this.pickerDate[1]
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  }
}
</script>
