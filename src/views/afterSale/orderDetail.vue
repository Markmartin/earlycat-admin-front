<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>订单详情</h3>
      <el-form :data="orderDetail" label-position="left">
        <el-col :span="8">
        <el-form-item label="订单编号">
          <span>{{ orderDetail.order.orderSn }}</span>
        </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item label="订单状态">
          <el-tag>{{ orderDetail.order.orderStatus | orderStatusFilter }}</el-tag>
        </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item label="订单用户">
          <span>{{ orderDetail.user.nickname }}</span>
        </el-form-item>
        </el-col>
        <el-form-item label="收货信息" style="text-align: center;">
          <el-table :data="priceDetail" border fit highlight-current-row>
            <el-table-column align="center" label="收货人" prop="consignee"/>
            <el-table-column align="center" label="手机号" prop="mobile"/>
            <el-table-column align="center" label="地址" prop="address"/>
            <el-table-column align="center" label="用户留言" prop="message"/>
          </el-table>
        </el-form-item>
        <el-form-item label="商品信息">
          <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
            <el-table-column align="center" label="商品编号" prop="goodsSn"/>
            <el-table-column align="center" label="商品名称" prop="goodsName"/>
            <el-table-column align="center" label="货品图片" prop="picUrl">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" width="40">
              </template>
            </el-table-column>
            <el-table-column align="center" label="货品规格" prop="specifications"/>
            <el-table-column align="center" label="货品价格" prop="price"/>
            <el-table-column align="center" label="实付金额" prop="finalPrice"/>
            <el-table-column align="center" label="购买数量" prop="number">
              <template slot-scope="scope">
                {{ scope.row.number + scope.row.refundNumber }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="已退数量" prop="refundNumber"/>

            <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button  v-if="scope.row.refundNumber === 0 &&
                (scope.row.acStatus === 0
                ||scope.row.acStatus === 1
                ||scope.row.acStatus === 2)" v-permission="['POST /admin/goods/update']" type="primary" size="small" @click="handleUpdate(scope.row)" >申请退款</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="费用信息（注：实际费用 = 商品总价 + 快递费用 - 优惠减免 - 积分减免）">
          <el-table :data="priceDetail" border fit highlight-current-row>
            <el-table-column align="center" label="商品总价(元)" prop="goodsPrice"/>
            <el-table-column align="center" label="快递费用(元)" prop="freightPrice"/>
            <el-table-column align="center" label="优惠减免(元)" prop="couponPrice"/>
            <el-table-column align="center" label="积分减免(元)" prop="integralPrice"/>
            <el-table-column align="center" label="实际费用(元)" prop="actualPrice"/>
            <el-table-column align="center" label="支付时间" prop="payTime"/>
            <el-table-column align="center" label="已退总金额(元)" prop="refundPrice"/>
          </el-table>
        </el-form-item>
        <el-form-item label="快递信息">
          <el-table :data="priceDetail" border fit highlight-current-row>
            <el-table-column align="center" label="快递公司" prop="shipChannel"/>
            <el-table-column align="center" label="快递单号" prop="shipSn"/>
            <el-table-column align="center" label="发货时间" prop="shipTime"/>
            <el-table-column align="center" label="确认收货时间" prop="confirmTime"/>
          </el-table>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="handleCancel">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style>
</style>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {detailOrder} from '@/api/afterSale'

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
    name: 'orderDetail',
    components: {Pagination},
    filters: {
      orderStatusFilter(status) {
        return statusMap[status]
      }
    },
    data() {
      return {
        orderDetail: {
          order: {},
          user: {},
          orderGoods: []
        },
        priceDetail: [],
      }
    },
    created() {
      this.init()
    },
    methods: {
      init: function () {
        if (this.$route.query.id == null) {
          return
        }
        detailOrder(this.$route.query.id).then(response => {
          this.orderDetail = response.data.data;
          this.priceDetail.push(response.data.data.order);
        })
        debugger
      },
      handleCancel: function () {
        this.$router.push({path: "/afterSale/orderList"});
      },
    }
  }
</script>
