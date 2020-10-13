<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.afterSaleVo.userName" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入申请人"/>
      <el-input v-model="listQuery.afterSaleVo.phone" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入申请人账号"/>
      <el-select v-model="listQuery.afterSaleVo.status" clearable class="filter-item" style="width: 200px;"
                 placeholder="请选择申请状态">
        <el-option v-for="type in afterSaleStatus" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search"
                 @click="handleFilter">查找
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="申请图片">
              <img v-for="url in props.row.url" :key="url" :src="url" width="200" class="url">
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
          <el-button type="text" size="small" @click="showOrderDetail(scope.row)">{{scope.row.orderId}}</el-button>
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
      <el-table-column align="center" min-width="110" label="申请退款金额" prop="refundPrice"/>
      <el-table-column align="center" min-width="110" label="实际退款金额" prop="actualRefundPrice"/>
      <el-table-column align="center" min-width="100" label="操作人" prop="operator"/>
      <el-table-column align="center" min-width="100" label="退款时间" prop="operationTime"/>
      <el-table-column align="center" min-width="100" label="备注" prop="remark"/>
      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/afterSale/detail']" type="info " size="small" round @click="showDetail(scope.row)">申请详情</el-button>
          <el-button v-show="scope.row.status != 2" v-permission="['POST /admin/afterSale/refund']" type="warning " size="mini" round @click="handleRefund(scope.row)">退款</el-button>
          <el-button v-show="scope.row.status != 2" v-permission="['POST /admin/afterSale/reject']" type="success " size="mini" round @click="handleReject(scope.row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="orderDialogVisible" customClass="customWidth" title="订单详情">

      <el-form :data="orderDetail" label-position="left">
        <el-form-item label="订单号">
          <span>{{ orderDetail.order.id }}</span>
        </el-form-item>
        <el-form-item label="订单编号">
          <span>{{ orderDetail.order.orderSn }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-tag>{{ orderDetail.order.orderStatus | orderStatusFilter }}</el-tag>
        </el-form-item>
        <el-form-item label="订单用户">
          <span>{{ orderDetail.user.nickname }}</span>
        </el-form-item>
        <el-form-item label="收货信息">
          <el-table :data="priceDetail" border fit highlight-current-row>
            <el-table-column align="center" label="收货人" prop="consignee"/>
            <el-table-column align="center" label="手机号" prop="mobile"/>
            <el-table-column align="center" label="地址" prop="address"/>
            <el-table-column align="center" label="用户留言" prop="message"/>
          </el-table>
        </el-form-item>
        <el-form-item label="商品信息">
          <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
            <el-table-column align="center" label="商品名称" prop="goodsName"/>
            <el-table-column align="center" label="货品规格" prop="specifications"/>
            <el-table-column align="center" label="货品价格" prop="price"/>
            <el-table-column align="center" label="实付单价金额" prop="finalPrice"/>
            <el-table-column align="center" label="货品数量" prop="number"/>
            <el-table-column align="center" label="货品图片" prop="picUrl">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" width="40">
              </template>
            </el-table-column>
            <el-table-column align="center" label="已退数量" prop="refundNumber"/>
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
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="detailDialogVisible" customClass="customWidth" title="售后申请详情">

      <el-form :data="afterSaleVo" label-position="left">
        <el-form-item label="退款单号">
          <span>{{ afterSaleVo.id }}</span>
        </el-form-item>
        <el-form-item label="申请时间">
          <span>{{ afterSaleVo.applyTime }}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{ afterSaleVo.operationTime }}</span>
        </el-form-item>
        <el-form-item label="退款理由">
          <span>{{ afterSaleVo.reason }}</span>
        </el-form-item>
        <el-form-item label="退款原因">
          <span>{{ afterSaleVo.detail }}</span>
        </el-form-item>
        <el-form-item label="退款图片">
          <img v-for="url in afterSaleVo.url" :key="url" :src="url" width="280" class="url">
        </el-form-item>
        <el-form-item label="退款信息">
          <el-table :data="afterSaleVo.afterSaleItemVos" border fit highlight-current-row>
            <el-table-column align="center" label="商品名称" prop="orderGoods.goodsName"/>
            <el-table-column align="center" label="购买单价（元）" prop="orderGoods.price"/>
            <el-table-column align="center" label="购买数量" prop="orderGoods.number"/>
            <el-table-column align="center" label="已退数量" prop="orderGoods.refundNumber"/>
            <el-table-column align="center" label="本次退款数量" prop="number"/>
            <el-table-column align="center" label="本次退款金额（元）" prop="price"/>
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="refundDialogVisible" title="退款">
      <el-form :rules="refundRules" ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="申请退款金额" prop="refundPrice">
          <el-input-number v-model="refundForm.applyRefundPrice" :min="0" disabled/>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundPrice">
          <el-input-number v-model="refundForm.actualRefundPrice" :min="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRefund">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="rejectDialogVisible" title="驳回">
      <el-form :rules="rejectRules" ref="rejectForm" :model="rejectForm" status-icon label-position="left"
               label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="驳回理由" prop="remark">
          <el-input type="textarea" v-model="rejectForm.remark"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReject">确定</el-button>
      </div>
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
  import { orderDetail, getList, detailAfterSale, refund, reject } from '@/api/afterSale'
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
        priceDetail: [],
        createDialogVisible: false,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          afterSaleVo: {}
        },
        detailDialogVisible: false,
        orderDialogVisible: false,
        rejectDialogVisible: false,
        refundDialogVisible: false,
        detailAfterSale: [],
        afterSaleVo: {},
        afterSaleItemVos: {
          orderGoods: {}
        },
        rejectForm: {
          id: undefined,
          remark: undefined
        },
        rejectRules: {
          remark: [{ required: true, message: '拒绝理由不能为空', trigger: 'blur' }]
        },
        refundForm: {
          id: undefined,
          refundPrice: undefined,
          actualRefundPrice: undefined,
          applyRefundPrice: undefined,
          orderId: undefined
        },
        refundRules: {
          actualRefundPrice: [{ required: true, message: '退款不能为空', trigger: 'blur' }]
        }
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
      showDetail(row) {
        detailAfterSale(row.id).then(response => {
          this.afterSaleVo = response.data.data
//          this.detailAfterSale = [];
//          this.detailAfterSale.push(this.afterSaleVo);
        })
        this.detailDialogVisible = true
      },
      showOrderDetail(row) {
        orderDetail(row.orderId).then(response => {
          this.orderDetail = response.data.data
          this.priceDetail = []
          this.priceDetail.push(response.data.data.order)
        })
        this.orderDialogVisible = true
      },
      //处理退款页面
      handleRefund(row) {
        this.refundForm.id = row.id;
        this.refundForm.actualRefundPrice = row.refundPrice;
        this.refundForm.applyRefundPrice = row.refundPrice;
        this.refundForm.price = row.price;
        this.refundForm.orderId = row.orderId;
        this.refundDialogVisible = true
        this.$nextTick(() => {
          this.$refs['refundForm'].clearValidate()
        })
      },

      confirmRefund() {
        this.$refs['refundForm'].validate((valid) => {
          if (valid) {
            if (this.refundForm.actualRefundPrice > this.refundForm.applyRefundPrice) {
              this.$message.error('退款金额不能大于申请金额！')
              return false
            }
            refund(this.refundForm.orderId, this.refundForm.id, this.refundForm.actualRefundPrice).then(() => {
              this.refundDialogVisible = false
              this.getList()
              this.$notify.success({
                title: '成功',
                message: '退款成功'
              })
            }).catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
          }
        })
      },
      //处理驳回页面
      handleReject(row) {
        this.rejectForm.id = row.id
        this.rejectDialogVisible = true
        this.$nextTick(() => {
          this.$refs['rejectForm'].clearValidate()
        })
      },
      //驳回
      confirmReject() {
        this.$refs['rejectForm'].validate((valid) => {
          if (valid) {
            reject(this.rejectForm.id, this.rejectForm.remark).then(response => {
              this.rejectDialogVisible = false;
              this.getList();
              this.$notify.success({
                title: '成功',
                message: '确认驳回成功'
              })
              this.getList()
            }).catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
          }
        })
      }
    }
  }
</script>
