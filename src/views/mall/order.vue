<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.consignee" clearable class="filter-item" style="width: 200px;" placeholder="请输入收货人"/>
      <el-input v-model="listQuery.orderSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入订单编号"/>
      <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item" placeholder="请选择订单状态">
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
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
      <!--<el-select-->
      <!--v-permission="['GET /admin/community/list']"-->
      <!--v-model="listQuery.communityId"-->
      <!--:remote-method="communityMethod"-->
      <!--:loading="communityLoading"-->
      <!--class="filter-item"-->
      <!--clearable-->
      <!--filterable-->
      <!--remote-->
      <!--reserve-keyword-->
      <!--placeholder="请输入小区名称">-->
      <!--<el-option-->
      <!--v-for="item in communityList"-->
      <!--:key="item.id"-->
      <!--:label="item.name"-->
      <!--:value="item.id"/>-->
      <!--</el-select>-->
      <el-button v-permission="['GET /admin/order/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <!--<el-button v-permission="['POST /admin/order/export']" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload(false, 'downloadLoading')">导出配送单</el-button>-->
      <!--<el-button v-permission="['POST /admin/order/export']" :loading="downloadLoading1" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload(true, 'downloadLoading1')">导出(含商品)</el-button>-->
      <!--<el-button v-permission="['POST /admin/order/print']" class="filter-item" type="primary" icon="el-icon-printer" @click="handlePrinter">打印</el-button>-->
      <!--<el-button v-permission="['POST /admin/order/batchship']" class="filter-item" type="primary" icon="el-icon-tickets" @click="handleBatchship">批量发货</el-button>-->
      <!-- <el-button v-permission="['POST /admin/order/print']" class="filter-item" type="primary" icon="el-icon-tickets" @click="exportPurchasing">测试导出采购单</el-button> -->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" ref="multipleTable" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row @select-all="handleSelectionAll" @select="handleSelection">
      <el-table-column :selectable="isDisabled" type="selection" width="55"/>

      <el-table-column align="center" min-width="100" label="订单编号" prop="orderSn" width="140"/>

      <!--<el-table-column align="center" label="用户ID" width="100" prop="userId"/>-->
      <el-table-column align="center" label="收货人名称" width="100" prop="consignee"/>

      <el-table-column align="center" label="订单状态" prop="orderStatus" width="100">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.orderStatus | orderStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付金额" prop="actualPrice"/>

      <el-table-column align="center" label="支付时间" width="160" prop="payTime"/>

      <el-table-column align="center" label="物流单号" prop="shipSn" width="140"/>

      <el-table-column align="center" label="物流渠道" prop="shipChannel"/>

      <!--<el-table-column align="center" label="社区名" prop="communityName"/>-->
      <el-table-column align="center" label="分拣号" prop="sortingNo"/>
      <el-table-column align="center" label="订单备注" prop="message"/>

      <el-table-column align="center" label="操作" width="400" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/order/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
          <el-button v-permission="['POST /admin/order/modifyAddress']" type="primary" size="small" @click="handleModifyAddress(scope.row)">修改地址及备注</el-button>
          <!--<el-button v-permission="['POST /admin/order/print']" type="primary" size="mini" @click="handlePrinter(scope.row)">打印</el-button>-->
          <!--<el-button v-permission="['POST /admin/order/ship']" v-if="scope.row.orderStatus==201" type="primary" size="mini" @click="handleShip(scope.row)">发货</el-button>-->
          <!-- <el-button v-permission="['POST /admin/order/arrive']" v-if="scope.row.orderStatus==201 || scope.row.orderStatus==301" type="primary" size="mini" @click="handleArrive(scope.row)">到达</el-button> -->
          <!--<el-button v-permission="['POST /admin/order/refund']" v-if="scope.row.orderStatus==201 || scope.row.orderStatus==202 || scope.row.orderStatus==301 || scope.row.orderStatus==302" type="primary" size="mini" @click="handleRefund(scope.row)">退款</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="orderDialogVisible" title="订单详情" width="800">

      <el-form :data="orderDetail" label-position="left">
        <el-form-item label="订单编号">
          <span>{{ orderDetail.order.orderSn }}</span>
        </el-form-item>
        <el-form-item label="订单状态" >
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
            <el-table-column align="center" label="商品名称" prop="goodsName" />
            <el-table-column align="center" label="商品编号" prop="goodsSn" />
            <el-table-column align="center" label="货品规格" prop="specifications" />
            <el-table-column align="center" label="货品价格" prop="price" />
            <el-table-column align="center" label="实付金额" prop="finalPrice" />
            <el-table-column align="center" label="购买数量" prop="number" >
              <template slot-scope="scope">
                {{ scope.row.number + scope.row.refundNumber }}
              </template>
            </el-table-column>
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
        <el-form-item label="退款信息">
          <span>(退款金额){{ orderDetail.order.refundPrice == null ? 0: orderDetail.order.refundPrice}}元</span>
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

    <!-- 发货对话框 -->
    <el-dialog :visible.sync="shipDialogVisible" title="发货">
      <el-form ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="快递公司" prop="shipChannel">
          <el-select v-model="shipForm.shipChannel" placeholder="请选择">
            <el-option
              v-for="item in expressList"
              :key="item.code"
              :label="item.name"
              :value="item.code"/>
          </el-select>
          <!-- <el-input v-model="shipForm.shipChannel"/> -->
        </el-form-item>
        <el-form-item label="快递编号" prop="shipSn">
          <el-input v-model="shipForm.shipSn"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmShip">确定</el-button>
      </div>
    </el-dialog>

    <!-- 退款对话框 -->
    <el-dialog :visible.sync="refundDialogVisible" title="退款">
      <el-form ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="退款金额" prop="refundMoney">
          <el-input v-model="refundForm.refundMoney" type="number"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRefund">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改收货地址对话框 -->
    <el-dialog :visible.sync="modifyAddressDialogVisible" title="修改地址及备注">
      <el-form ref="modifyAddressForm" :model="modifyAddressForm" status-icon label-position="left" label-width="100px" >
        <el-form-item label="订单编号" prop="orderSn">
          <span>{{modifyAddressForm.orderSn}}</span>
        </el-form-item>
        <el-form-item label="收货人" prop="consignee">
          <span>{{modifyAddressForm.consignee}}</span>
        </el-form-item>
        <el-form-item label="收货地址" prop="newAddress">
          <el-input v-model="modifyAddressForm.newAddress"/>
        </el-form-item>
        <el-form-item label="备注" prop="newMessage">
          <el-input v-model="modifyAddressForm.newMessage"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyAddressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmModifyAddress">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>

</style>

<script>
  import axios from 'axios'
  import { accMul } from '@/utils/index'
  import { getToken } from '@/utils/auth'
  import { getLodop } from '@/utils/lodopFuncs'
  import { listCommunity, expressList } from '@/api/community'
  import { listOrder, shipOrder, arriveOrder, refundOrder, detailOrder, printOrder, rbatchshipOrder, modifyAddress } from '@/api/order'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import checkPermission from '@/utils/permission' // 权限判断函数

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
    name: 'Order',
    components: { Pagination },
    filters: {
      orderStatusFilter(status) {
        return statusMap[status]
      }
    },
    data() {
      return {
        multipleSelection: [],
        purchasingList: [],
        expressList: [],
        communityLoading: false,
        communityList: [],
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
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
          name: undefined,
          orderStatusArray: [],
          sort: 'add_time',
          order: 'desc',
          queryStartTime: '',
          queryEndTime: '',
          communityId: '',
          consignee: ''
        },
        statusMap,
        orderDialogVisible: false,
        orderDetail: {
          order: {},
          user: {},
          orderGoods: []
        },
        shipForm: {
          orderId: undefined,
          shipChannel: undefined,
          shipSn: undefined
        },
        shipDialogVisible: false,
        maxRefundMoney: 0,
        refundForm: {
          orderId: undefined,
          refundMoney: undefined
        },
        modifyAddressForm: {
          orderSn: undefined,
          consignee: undefined,
          newAddress: undefined,
          newMessage: undefined
        },
        refundDialogVisible: false,
        modifyAddressDialogVisible: false,
        downloadLoading: false,
        downloadLoading1: false
      }
    },
    created() {
      this.getExpressList()
      this.getList()
    },
    methods: {
      isDisabled(row, rowIndex) {
        if (row.orderStatus !== 201) {
          return false
        } else {
          return true
        }
      },
      handleSelection(selection, row) {
        console.log()
      },
      handleSelectionAll(rows) {
        // if (rows.length > 20) {
        //   this.$message.error('选择订单不得超过20条')
        //   return false
        // }
        // this.$refs.multipleTable.clearSelection()
        // rows.forEach(row => {
        //   if (row.orderStatus === 201) {
        //     this.$refs.multipleTable.toggleRowSelection(row, true)
        //   }
        // })
      },
      handleBatchship() {
        const list = []
        this.$refs.multipleTable.selection.forEach(row => {
          list.push(row.id)
        })
        if (list.length === 0) {
          this.$message.error('请先选择已付款订单')
          return false
        }
        if (list.length > 20) {
          this.$message.error('选择订单不得超过20条')
          return false
        }
        this.$confirm('确定批量发货?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rbatchshipOrder(list).then(response => {
            this.$notify.success({
              title: '成功',
              message: '批量发货完成'
            })
            this.getList()
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }).catch(() => {})
      },
      checkPermission,
      getExpressList() {
        expressList().then(response => {
          this.expressList = response.data.data
        }).catch(() => {
          this.communityList = []
        })
      },
      handlePrinter(row) {
        const that = this
        printOrder(
          {
            userId: that.listQuery.userId,
            orderSn: row.orderSn ? row.orderSn : that.listQuery.orderSn,
            orderStatusArray: that.listQuery.orderStatusArray,
            sort: that.listQuery.sort,
            order: that.listQuery.order,
            queryStartTime: that.listQuery.queryStartTime,
            queryEndTime: that.listQuery.queryEndTime,
            communityId: that.listQuery.communityId
          }
        ).then(response => {
          const LODOP = getLodop()
          const data = response.data.data.list
          for (const idx1 in data) {
            for (const idx2 in data[idx1].orderVoList) {
              let item = ''
              let total = 0
              for (const idx3 in data[idx1].orderVoList[idx2].orderGoodsVo) {
                total += data[idx1].orderVoList[idx2].orderGoodsVo[idx3].number
                item += `<tr align="center">
                <td><font size="2">${data[idx1].orderVoList[idx2].orderGoodsVo[idx3].goodsName}</font></td>
                <td><font size="2">${data[idx1].orderVoList[idx2].orderGoodsVo[idx3].price}</font></td>
                <td><font size="2">${data[idx1].orderVoList[idx2].orderGoodsVo[idx3].number}</font></td>
                <td><font size="2">${accMul(data[idx1].orderVoList[idx2].orderGoodsVo[idx3].price, data[idx1].orderVoList[idx2].orderGoodsVo[idx3].number)}</font></td>
              </tr>`
              }
              const html = `<table>
              <tr align="center"><td width="55%"><font size="2">商品名</font></td><td width="15%"><font size="2">单价</font></td><td width="10%"><font size="2">数量</font></td><td width="15%"><font size="2">金额</font></td></tr>
              ${item}
              <tr align="center"><td></td><td><font size="2">运费:</font></td><td><font size="2"></td><td><font size="2">${data[idx1].orderVoList[idx2].freightPrice}</font></td></tr>
              <tr align="center"><td></td><td><font size="2">合计:</font></td><td><font size="2">${total}</td><td><font size="2">${data[idx1].orderVoList[idx2].goodsPrice + data[idx1].orderVoList[idx2].freightPrice}</font></td></tr>
              <tr align="center"><td></td><td><font size="2">抵扣:</font></td><td></td><td><font size="2">- ${data[idx1].orderVoList[idx2].couponPrice + data[idx1].orderVoList[idx2].integralPrice}</font></td></tr>
              <tr align="center"><td></td><td><font size="2">总计:</font></td><td></td><td><font size="2">${data[idx1].orderVoList[idx2].actualPrice}</font></td></tr>
              <tr><td colspan="4">&nbsp;</td></tr>
              <tr><td align="center"><font size="3">今日订,明日达</font></td><td colspan="3"></td></tr>
              <tr><td></td><td  align="center" colspan="3"><font size="3">新鲜,健康每一天</font></td></tr>
              <tr><td colspan="4">&nbsp;&nbsp;</td></tr>
              <tr><td colspan="4">-------------------------------------------------</td></tr>
            </table>`
              LODOP.PRINT_INIT('订单打印')
              LODOP.ADD_PRINT_TEXT('5mm', '2.01mm', '22.01mm', '7.87mm', '瓦砾家园')
              LODOP.SET_PRINT_STYLEA(0, 'FontSize', 13)
              LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
              LODOP.ADD_PRINT_BARCODE('3.77mm', '24.55mm', '52.11mm', '9.14mm', 'Code39', data[idx1].orderVoList[idx2].orderSn)
              LODOP.ADD_PRINT_LINE('15.22mm', '2.01mm', '15.01mm', '78mm', 2, 1)
              LODOP.ADD_PRINT_TEXT('16.83mm', '2.01mm', '16.93mm', '7.49mm', '收货人:')
              LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
              LODOP.ADD_PRINT_TEXT('16.83mm', '19.84mm', '17.01mm', '7.49mm', data[idx1].orderVoList[idx2].consignee)
              LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
              LODOP.ADD_PRINT_TEXT('16.83mm', '39mm', '13mm', '7.49mm', '电话:')
              LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
              LODOP.ADD_PRINT_TEXT('16.83mm', '51.99mm', '26.01mm', '7.49mm', data[idx1].orderVoList[idx2].mobile)
              LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
              LODOP.ADD_PRINT_TEXT('24mm', '2.01mm', '21.17mm', '7.49mm', '收货地址:')
              LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
              LODOP.ADD_PRINT_TEXT('24mm', '23.28mm', '54.69mm', '11.2mm', data[idx1].orderVoList[idx2].address)
              LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

              if (data[idx1].orderVoList[idx2].message === '') {
                LODOP.ADD_PRINT_LINE('34.95mm', '2.01mm', '34.73mm', '78mm', 0, 1)
                LODOP.ADD_PRINT_TEXT('36.62mm', '2.01mm', '35.98mm', '8mm', data[idx1].sheetNames)
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 15)
                LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
                LODOP.ADD_PRINT_TEXT('36.62mm', '42.01mm', '35.98mm', '8mm', (data[idx1].orderVoList[idx2].deliveryPointId === '' || data[idx1].orderVoList[idx2].deliveryPointId === 0) ? '送货上门' : '自提')
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 15)
                LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
                LODOP.ADD_PRINT_LINE('43.31mm', '2.01mm', '43.1mm', '78mm', 0, 1)
                LODOP.ADD_PRINT_TEXT('44.87mm', '2.12mm', '75.99mm', '5.93mm', '订单信息')
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
                LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
                LODOP.ADD_PRINT_LINE('50.59mm', '2.01mm', '50.38mm', '78mm', 2, 1)
                LODOP.ADD_PRINT_HTM('51.99mm', '2.01mm', '75.99mm', '100%', html)
              } else {
                LODOP.ADD_PRINT_TEXT('35.3mm', '2.01mm', '21.17mm', '7.49mm', '用户留言:')
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
                LODOP.ADD_PRINT_TEXT('35.3mm', '23.28mm', '54.69mm', '11.2mm', data[idx1].orderVoList[idx2].message)
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
                LODOP.ADD_PRINT_LINE('45.9mm', '2.01mm', '45.9mm', '78mm', 0, 1)
                LODOP.ADD_PRINT_TEXT('47.57mm', '2.01mm', '35.98mm', '8mm', data[idx1].sheetNames)
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 15)
                LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
                LODOP.ADD_PRINT_TEXT('47.57mm', '42.01mm', '35.98mm', '8mm', (data[idx1].orderVoList[idx2].deliveryPointId === '' || data[idx1].orderVoList[idx2].deliveryPointId === 0) ? '送货上门' : '自提')
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 15)
                LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
                LODOP.ADD_PRINT_LINE('54mm', '2.01mm', '54mm', '78mm', 0, 1)
                LODOP.ADD_PRINT_TEXT('56mm', '2.12mm', '75.99mm', '5.93mm', '订单信息')
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
                LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
                LODOP.ADD_PRINT_LINE('61.54mm', '2.01mm', '61.54mm', '78mm', 2, 1)
                LODOP.ADD_PRINT_HTM('62mm', '2.01mm', '75.99mm', '100%', html)
              }
              LODOP.SET_PRINT_STYLEA(0, 'Horient', 3)
              LODOP.SET_PRINT_PAGESIZE(3, 800, 20, '')// 这里3表示纵向打印且纸高“按内容的高度”；800表示纸宽80.00mm；20表示页底空白2.0mm
              LODOP.PRINT()
              // LODOP.PREVIEW()
            }
          }
        }).catch((response) => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
      },
      communityMethod(query) {
        if (query !== '') {
          this.communityLoading = true
          listCommunity({
            name: query,
            page: 1,
            limit: 20
          }).then(response => {
            this.communityList = response.data.data.list
            this.communityLoading = false
          }).catch(() => {
            this.communityList = []
            this.communityLoading = false
          })
        } else {
          this.communityList = []
        }
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
      getList() {
        this.listLoading = true
        listOrder(this.listQuery).then(response => {
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
        detailOrder(row.id).then(response => {
          this.orderDetail = response.data.data
        })
        this.orderDialogVisible = true
      },
      handleModifyAddress(row) {
        this.modifyAddressForm.orderSn = row.orderSn
        this.modifyAddressForm.consignee = row.consignee
        this.modifyAddressForm.newAddress = row.address
        this.modifyAddressDialogVisible = true
        this.$nextTick(() => {
          this.$refs['modifyAddressForm'].clearValidate()
        })
      },
      confirmModifyAddress() {
        this.$refs['modifyAddressForm'].validate((valid) => {
          if (valid) {
            modifyAddress(this.modifyAddressForm).then(response => {
              this.modifyAddressDialogVisible = false
              this.$notify.success({
                title: '成功',
                message: '订单修改成功'
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
      },
      handleShip(row) {
        this.shipForm.orderId = row.id
        this.shipForm.shipChannel = '-'
        this.shipForm.shipSn = ' '

        this.shipDialogVisible = true
        this.$nextTick(() => {
          this.$refs['shipForm'].clearValidate()
        })
      },
      handleArrive(row) {
        this.$confirm('确定订单到达小区?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          arriveOrder({ orderId: row.id }).then(response => {
            this.$notify.success({
              title: '成功',
              message: '订单状态变更成功'
            })
            this.getList()
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }).catch(() => {})
      },
      confirmShip() {
        this.$refs['shipForm'].validate((valid) => {
          if (valid) {
            shipOrder(this.shipForm).then(response => {
              this.shipDialogVisible = false
              this.$notify.success({
                title: '成功',
                message: '确认发货成功'
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
      },
      handleRefund(row) {
        this.refundForm.orderId = row.id
        this.maxRefundMoney = JSON.parse(JSON.stringify(row.actualPrice))
        this.refundForm.refundMoney = row.actualPrice

        this.refundDialogVisible = true
        this.$nextTick(() => {
          this.$refs['refundForm'].clearValidate()
        })
      },
      confirmRefund() {
        this.$refs['refundForm'].validate((valid) => {
          if (valid) {
            if (this.refundForm.refundMoney > this.maxRefundMoney) {
              this.$notify.error({
                title: '失败',
                message: '不能大于支付金额'
              })
              return false
            }
            refundOrder(this.refundForm).then(response => {
              this.refundDialogVisible = false
              this.$notify.success({
                title: '成功',
                message: '确认退款成功'
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
      },
      handleDownload(flag, key) {
        const that = this
        this[key] = true
        axios({
          method: 'POST',
          url: process.env.BASE_API + `/order/export`,
          responseType: 'blob',
          data: {
            goodsInfo: flag,
            userId: that.listQuery.userId,
            orderSn: that.listQuery.orderSn,
            orderStatusArray: that.listQuery.orderStatusArray,
            sort: that.listQuery.sort,
            order: that.listQuery.order,
            queryStartTime: that.listQuery.queryStartTime,
            queryEndTime: that.listQuery.queryEndTime,
            communityId: that.listQuery.communityId
          },
          headers: {
            'X-Wali-Token': getToken()
          }
        }).then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          // 获取heads中的filename文件名
          // var aa = res.headers['content-disposition']
          const temp = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
          var fileName = decodeURIComponent(temp)
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this[key] = false
        }).catch(err => {
          this[key] = false
          this.$notify.error({
            title: '失败',
            message: err
          })
        })
        // import('@/vendor/Export2Excel').then(excel => {
        //   const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
        //   const filterVal = ['id', 'orderSn', 'userId', 'orderStatus', 'isDelete', 'consignee', 'mobile', 'address']
        //   excel.export_json_to_excel2(tHeader, this.list, filterVal, '订单信息')
        //   this.downloadLoading = false
        // })
      },
      exportPurchasing() {
        const that = this
        printOrder(
          {
            userId: that.listQuery.userId,
            orderSn: that.listQuery.orderSn,
            orderStatusArray: that.listQuery.orderStatusArray,
            sort: that.listQuery.sort,
            order: that.listQuery.order,
            queryStartTime: that.listQuery.queryStartTime,
            queryEndTime: that.listQuery.queryEndTime,
            communityId: that.listQuery.communityId
          }
        ).then(response => {
          const data = response.data.data.list
          let list1 = []
          data.map((item, index) => { list1 = [...list1, ...item.orderVoList] })
          let list2 = []
          list1.map((item, index) => { list2 = [...list2, ...item.orderGoodsVo] })
          for (let i = 0; i < list2.length; i++) {
            for (let j = i + 1; j < list2.length; j++) {
              if (list2[i].goodsId === list2[j].goodsId) {
                list2[i].number += list2[j].number
                list2.splice(j, 1)
                j--
              }
            }
          }
          that.purchasingList = list2
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['商品名称', '数量']
            const filterVal = ['goodsName', 'number']
            excel.export_json_to_excel2(tHeader, that.purchasingList, filterVal, that.listQuery.queryStartTime !== '' ? (that.listQuery.queryStartTime + '-' + that.listQuery.queryEndTime) : '' + '采购单')
          })
        }).catch((response) => {
          that.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
      }
    }
  }
</script>
