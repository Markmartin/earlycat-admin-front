<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.afterSaleVo.userName" clearable class="filter-item" style="width: 200px;" placeholder="请输入申请人"/>
      <el-input v-model="listQuery.afterSaleVo.phone" clearable class="filter-item" style="width: 200px;" placeholder="请输入申请人账号"/>
      <el-select v-model="listQuery.afterSaleVo.status" clearable class="filter-item" style="width: 200px;" placeholder="请选择申请状态">
        <el-option v-for="type in afterSaleStatus" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
      <el-table-column align="center" min-width="100" label="申请编号" prop="id"/>
      <el-table-column align="center" min-width="100" label="申请人" prop="userName"/>
      <el-table-column align="center" min-width="110" label="申请人账号" prop="phone"/>
      <el-table-column align="center" min-width="100" label="退款订单号" prop="orderId">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/afterSale/detail']" type="info " size="small" round @click="handleDetail(scope.row)">
            {{orderId}}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="退款类型" min-width="100" prop="isAll">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isAll ? 'success' : 'error' ">{{ scope.row.isAll ? '整单退款' : '单品退款' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="申请时间" prop="applyTime"/>
      <el-table-column align="center" label="申请状态" min-width="80" prop="acStatus">
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
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/afterSale/detail']" type="info " size="small" round @click="handleDetail(scope.row)">申请详情</el-button>
          <el-button v-permission="['POST /admin/order/detail']" type="text" size="small" @click="handleDetail(scope.row)">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="orderDialogVisible" customClass="customWidth" title="订单详情" width="1200">

      <el-form :data="orderDetail" label-position="left">
        <el-form-item label="订单编号">
          <span>{{ orderDetail.order.orderSn }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-tag>{{ orderDetail.order.orderStatus | orderStatusFilter }}</el-tag>
        </el-form-item>
        <el-form-item label="订单用户">
          <span>{{ orderDetail.user.nickname }}</span>
        </el-form-item>
        <el-form-item label="用户留言">
          <span>{{ orderDetail.order.message }}</span>
        </el-form-item>
        <el-form-item label="收货信息">
          <span>（收货人）{{ orderDetail.order.consignee }}</span>
          <span>（手机号）{{ orderDetail.order.mobile }}</span>
          <span>（地址）{{ orderDetail.order.address }}</span>
        </el-form-item>
        <el-form-item label="商品信息">
          <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
            <el-table-column align="center" label="商品名称" prop="goodsName"/>
            <!--            <el-table-column align="center" label="商品编号" prop="goodsSn"/>-->
            <el-table-column align="center" label="货品规格" prop="specifications"/>
            <el-table-column align="center" label="货品价格" prop="price"/>
            <el-table-column align="center" label="实付金额" prop="finalPrice"/>
            <el-table-column align="center" label="货品数量" prop="number"/>
            <el-table-column align="center" label="已退数量" prop="refundNumber"/>
            <el-table-column align="center" label="货品图片" prop="picUrl">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" width="40">
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="费用信息">
          <span>
            (实际费用){{ orderDetail.order.actualPrice }}元 =
            (商品总价){{ orderDetail.order.goodsPrice }}元 +
            (快递费用){{ orderDetail.order.freightPrice }}元 -
            (优惠减免){{ orderDetail.order.couponPrice }}元 -
            (积分减免){{ orderDetail.order.integralPrice }}元
          </span>
        </el-form-item>
        <el-form-item label="支付信息">
          <span>（支付渠道）微信支付</span>
          <span>（支付时间）{{ orderDetail.order.payTime }}</span>
        </el-form-item>
        <el-form-item label="快递信息">
          <span>（快递公司）{{ orderDetail.order.shipChannel }}</span>
          <span>（快递单号）{{ orderDetail.order.shipSn }}</span>
          <span>（发货时间）{{ orderDetail.order.shipTime }}</span>
        </el-form-item>
        <el-form-item label="收货信息">
          <span>（确认收货时间）{{ orderDetail.order.confirmTime }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100"/>
    </el-tooltip>

  </div>
</template>

<style>
  .customWidth {
    width: 80%;
  }

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
  import { detailOrder } from '@/api/order'
  import { getList } from '@/api/afterSale'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const statusMap = {
    101: '未付款',
    102: '用户取消',
    103: '系统取消',
    201: '已付款',
    202: '申请退款',
    203: '已退款',
    204: '配货中',
    301: '已发货',
    302: '待取货',
    401: '用户收货',
    402: '系统收货'
  }

  export default {
    name: 'GoodsList',
    components: { BackToTop, Pagination },
    filters: {
      orderStatusFilter(status) {
        return statusMap[status]
      }
    },
    data() {
      return {
        afterSaleStatus: [
          {
            label: '申请中',
            value: 1
          },
          {
            label: '已退款',
            value: 2
          },
          {
            label: '已驳回',
            value: 3
          },
          {
            label: '已取消',
            value: 4
          }
        ],
        statusMap,
        printerData: '',
        printerValue: 1,
        orderDetail: {
          order: {},
          user: {},
          orderGoods: []
        },
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
        orderDialogVisible: false,
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getList(this.listQuery.afterSaleVo, this.listQuery.page, this.listQuery.limit).then(response => {
          this.list = response.data.data.afterSaleVos
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
        detailOrder(row.orderId).then(response => {
          this.orderDetail = response.data.data
        })
        this.orderDialogVisible = true
      }
    }
  }
</script>
