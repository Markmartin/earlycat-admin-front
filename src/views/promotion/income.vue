<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.type" clearable style="width: 200px" class="filter-item" placeholder="请选择收益类型">
        <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-if="listQuery.type == 9" v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="请选择提现状态">
        <el-option v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value"/>
      </el-select>
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
      <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>
      <!--<el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户ID"/>-->
      <el-button v-permission="['GET /admin/income/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="用户">
        <template slot-scope="scope">
          <img :src="scope.row.user.avatar" style="width:40px;height:40px;" >
          {{ scope.row.user.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template slot-scope="scope">
          +{{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计收益">
        <template slot-scope="scope">
          {{ scope.row.user.totalIncome }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="来源">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">注册奖励</span>
          <span v-if="scope.row.type == 1">首单奖励</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | formatType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status && scope.row.type == 9">已结算</span>
          <span v-if="scope.row.status == false && scope.row.type == 9">未结算</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算时间" prop="addTime"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/income/entpay']" v-if="scope.row.type === 9 && scope.row.status === false" type="primary" size="mini" @click="handlePayment(scope.row)">企业付款</el-button>
          <el-button v-permission="['GET /admin/income/orderDetail']" v-if="scope.row.type != 9" type="info" size="mini" @click="showDetail(scope.row)">订单提成详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100"/>
    </el-tooltip>

    <!--订单提成详情-->
    <el-dialog :visible.sync="detailDialogVisible" customClass="customWidth" title="订单提成详情">
      <el-form :data="orderDetail" label-position="left">
        <el-form-item label="订单编号">
          <span>{{ orderDetail.commission.orderSn }}</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span>{{ orderDetail.commission.addTime }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span>{{ orderDetail.commission.orderStatus }}</span>
        </el-form-item>
        <el-form-item label="订单实付金额">
          <span>{{ orderDetail.orderInfo.actualPrice }}</span>
        </el-form-item>
        <el-form-item label="订单商品信息">
          <el-table :data="orderDetail.goodsList" border fit highlight-current-row>
            <el-table-column align="center" label="商品名称" prop="goodsName"/>
            <el-table-column align="center" label="购买单价（元）" prop="price"/>
            <el-table-column align="center" label="购买数量" prop="number"/>
            <el-table-column align="center" label="商品图片" prop="picUrl">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" style="width:40px;height:40px;" >
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品规格" prop="specifications"/>
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<style>
</style>

<script>
import { listIncome, entpayIncome, apiOrderDetail } from '@/api/income'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const typeOptions = [
  {
    label: '邀请奖励',
    value: 0
  },
  {
    label: '首单奖励',
    value: 1
  },
  {
    label: '订单提成',
    value: 2
  },
  {
    label: '提现',
    value: 9
  }
]

export default {
  name: 'GrouponActivity',
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
      statusOptions: [
        {
          label: '未结算',
          value: false
        },
        {
          label: '已结算',
          value: true
        }
      ],
      multipleSelection: [],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        mobile: undefined,
        queryEndTime: undefined,
        queryStartTime: undefined,
        status: undefined,
        type: undefined,
        userId: undefined,
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      goodsDetail: '',
      orderDetail: {
        orderInfo: '',
        commission: '',
        goodsList: []
      },
      detailDialogVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handlePayment(row) {
      this.$confirm('确认企业付款到用户零钱包', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        entpayIncome({ id: row.id })
          .then(response => {
            this.$notify.success({
              title: '成功',
              message: '打款成功'
            })
            this.getList()
          })
          .catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
      }).catch(() => {})
    },
    getList() {
      this.listLoading = true
      listIncome(this.listQuery).then(response => {
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
    showDetail(row) {
      apiOrderDetail(row.id).then(response => {
        this.orderDetail = response.data.data
      })
      this.detailDialogVisible = true
    },
  }
}
</script>
