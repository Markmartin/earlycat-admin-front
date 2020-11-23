<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>订单详情</h3>
      <el-form :data="orderDetail" label-position="left">
        <el-row>
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
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户留言">
              <span>{{ orderDetail.order.message }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="收货信息" style="text-align: center;">
              <el-table :data="priceDetail" border fit highlight-current-row
                        :header-cell-style="{background:'#B4D5F6',color:'#606266'}">
                <el-table-column align="center" label="收货人" width="150" prop="consignee"/>
                <el-table-column align="center" label="联系方式" width="120" prop="mobile"/>
                <el-table-column align="center" label="收货地址" prop="address"/>
                <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button v-permission="['POST /admin/order/modifyAddress']" type="primary" size="small"
                               @click="handleModifyAddress(scope.row)">编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品信息">
              <el-form-item align="right">
                <el-button type="primary"
                           v-if="(orderDetail.order.orderStatus >= 201 && orderDetail.order.orderStatus !=202 && orderDetail.order.orderStatus !=203 )"
                           @click="handleAllRefund()">整单退款
                </el-button>
              </el-form-item>
              <el-table :data="orderDetail.orderGoods" border fit highlight-current-row
                        :header-cell-style="{background:'#B4D5F6',color:'#606266'}">
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
                    <el-button
                      v-if="(orderDetail.order.orderStatus ===201 && scope.row.number > 0) &&(scope.row.acStatus === 0||scope.row.acStatus === 1||scope.row.acStatus === 2)"
                      v-permission="['POST /admin/afterSale/refund']" type="warning " size="mini" round
                      @click="handleRefund(scope.row)">退款
                    </el-button>
                    <el-button
                      v-if="(orderDetail.order.orderStatus >201 && orderDetail.order.orderStatus !=202 && orderDetail.order.orderStatus !=203
                      && scope.row.refundNumber < scope.row.number)
                      &&(scope.row.acStatus === 0||scope.row.acStatus === 1||scope.row.acStatus === 2)"
                      v-permission="['POST /admin/afterSale/refund']" type="warning " size="mini" round
                      @click="handleRefund(scope.row)">退款
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="费用信息（注：实际费用 = 商品总价 + 快递费用 - 优惠减免 - 积分减免）">
              <el-table :data="priceDetail" border fit highlight-current-row
                        :header-cell-style="{background:'#B4D5F6',color:'#606266'}">
                <el-table-column align="center" label="商品总价(元)" prop="goodsPrice"/>
                <el-table-column align="center" label="快递费用(元)" prop="freightPrice"/>
                <el-table-column align="center" label="优惠减免(元)" prop="couponPrice"/>
                <el-table-column align="center" label="积分减免(元)" prop="integralPrice"/>
                <el-table-column align="center" label="实际费用(元)" prop="actualPrice"/>
                <el-table-column align="center" label="支付时间" prop="payTime"/>
                <el-table-column align="center" label="已退总金额(元)" prop="refundPrice"/>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="快递信息">
              <el-table :data="priceDetail" border fit highlight-current-row
                        :header-cell-style="{background:'#B4D5F6',color:'#606266'}">
                <el-table-column align="center" label="快递公司" prop="shipChannel"/>
                <el-table-column align="center" label="快递单号" prop="shipSn"/>
                <el-table-column align="center" label="发货时间" prop="shipTime"/>
                <el-table-column align="center" label="确认收货时间" prop="confirmTime"/>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="center">
          <el-button type="primary" @click="handleCancel">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 退款对话框 -->
    <el-dialog :visible.sync="refundDialogVisible" width="50%" title="退款">
      <el-form ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px">
        <el-row>
          <h4>售后物品</h4>
          <ul>
            <li v-for='item in refundForm.refundGoodsList'>
              <el-container>
                <el-aside>
                  <el-form-item label="退款图片" prop="picUrl">
                    <img v-if="item.goodsPicUrl" :src="item.goodsPicUrl" class="avatar" width="150" disabled>
                  </el-form-item>
                </el-aside>
                <el-main>
                  <el-form-item label="退款物品" prop="goodsName">
                    <el-input v-model="item.goodsName" placeholder="退款物品" disabled/>
                  </el-form-item>
                  <el-form-item label="退款数量" prop="number">
                    <el-input-number v-model="item.number" :min="0" :max="item.maxNum" style="width:100%"
                                     @change="handleNumberChange(item)">
                    </el-input-number>
                  </el-form-item>
                  <el-form-item label="退款金额" prop="refundMoney">
                    <el-input v-model="item.refundMoney">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-main>
              </el-container>
            </li>
          </ul>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="退款原因" prop="reason">
              <el-select v-model="refundForm.reason" placeholder="请选择" style="width:100%">
                <el-option v-for="item in resonList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" prop="detail">
              <el-input v-model="refundForm.detail" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="上传图片">
              <el-upload
                :action="uploadPath"
                :headers="headers"
                :limit="5"
                :file-list="refundForm.url"
                :on-exceed="uploadOverrun"
                :on-success="handleUrl"
                :on-remove="handleUrlRemove"
                multiple
                accept=".jpg,.jpeg,.png,.gif"
                list-type="picture-card">
                <i class="el-icon-plus"/>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRefund">确定</el-button>
      </div>
    </el-dialog>
    <!--订单信息修改-->
    <el-dialog :visible.sync="modifyAddressDialogVisible" title="修改地址及留言">
      <el-form ref="modifyAddressForm" :model="modifyAddressForm" status-icon label-position="left" label-width="100px"
               style="width: 600px; margin-left:50px;">
        <el-form-item label="订单编号" prop="orderSn">
          <span>{{ modifyAddressForm.orderSn }}</span>
        </el-form-item>
        <el-form-item label="收货人" prop="newConsignee">
          <el-input v-model="modifyAddressForm.newConsignee"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="newMobile">
          <el-input v-model="modifyAddressForm.newMobile"/>
        </el-form-item>
        <el-form-item label="收货地址" prop="newAddress">
          <el-input v-model="modifyAddressForm.newAddress"/>
        </el-form-item>
        <el-form-item label="用户留言" prop="newMessage">
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
  .customWidth {
    width: 30%;
  }
</style>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {detailOrder, getResonList, getOrderGoodsRefundPrice, applyAfterSale} from '@/api/afterSale'
  import {modifyAddress} from '@/api/order'
  import {createStorage, uploadPath} from '@/api/storage'
  import {getToken} from '@/utils/auth'

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
    computed: {
      headers() {
        return {
          'X-Wali-Token': getToken()
        }
      }
    },
    filters: {
      orderStatusFilter(status) {
        return statusMap[status]
      }
    },
    data() {
      return {
        uploadPath,
        orderDetail: {
          order: {},
          user: {},
          orderGoods: []
        },
        priceDetail: [],
        resonList: [],
        orderGoodsPrice: {
          orderId: undefined,
          goodsId: undefined,
          number: undefined
        },
        afterSaleVo: {
          refundPrice: 0.00
        },
        afterSaleItemVos: [],
        url: [],
        refundDialogVisible: false,
        refundForm: {
          refundGoodsList: [],
          reason: undefined,
          detail: undefined
        },
        refundGoods: {
          orderId: undefined,
          goodsId: undefined,
          goodsPicUrl: undefined,
          number: undefined,
          refundMoney: undefined,
          maxNum: undefined,
          minNum: 0
        },
        modifyAddressDialogVisible: false,
        modifyAddressForm: {
          orderSn: undefined,
          newConsignee: undefined,
          newAddress: undefined,
          newMessage: undefined,
          newMobile: undefined,
        },
      }
    },
    created() {
      this.init();
      this.getResonList()
    },
    methods: {
      init: function () {
        if (this.$route.query.id == null) {
          return
        }
        detailOrder(this.$route.query.id).then(response => {
          this.orderDetail = response.data.data;
          this.priceDetail = [];
          this.priceDetail.push(response.data.data.order);
        })
      },
      getResonList: function () {
        getResonList().then(response => {
          this.resonList = response.data.data;
        })
      },
      handleCancel: function () {
        this.$router.push({path: "/afterSale/orderList"});
      },
      handShowRefund: function () {

      },
      handleNumberChange(item) {
        this.orderGoodsPrice.number = item.number;
        this.orderGoodsPrice.orderId = item.orderId;
        this.orderGoodsPrice.goodsId = item.goodsId;
        getOrderGoodsRefundPrice(this.orderGoodsPrice).then(response => {
          const refundGoods = {
            id: item.id,
            orderId: item.orderId,
            goodsId: item.goodsId,
            number: item.number,
            refundMoney: response.data.data.data.applyRefundPrice,
            goodsPicUrl: item.goodsPicUrl,
            goodsName: item.goodsName,
            maxNum: item.maxNum
          };
          this.refundForm.refundGoodsList.splice(item.id, 1, refundGoods);
          const afterSaleItemVo = {
            orderId: this.orderGoodsPrice.orderId,
            orderGoodsId: this.orderGoodsPrice.goodsId,
            number: this.orderGoodsPrice.number,
            price: response.data.data.data.applyRefundPrice,
          };
          this.afterSaleItemVos.splice(item.id, 1, afterSaleItemVo);

          this.afterSaleVo.refundPrice = 0.00;
          for (var j = 0; j < this.refundForm.refundGoodsList.length; j++) {
            this.afterSaleVo.refundPrice = this.afterSaleVo.refundPrice + this.refundForm.refundGoodsList[j].refundMoney;
          }


        }).catch(response => {
          this.$notify.error({
            title: '价格获取异常',
            message: response.data.errmsg
          })
        });


      },
      handleAllRefund() {
        const orderGoodsList = this.orderDetail.orderGoods;
        this.refundForm.refundGoodsList = [];
        this.afterSaleItemVos = [];
        this.afterSaleVo.refundPrice = 0.00;
        for (var i = 0; i < orderGoodsList.length; i++) {
          if (orderGoodsList[i].acStatus != 98 && orderGoodsList[i].acStatus != 99) {
            this.refundGoods = {
              id: i,
              orderId: orderGoodsList[i].orderId,
              goodsId: orderGoodsList[i].goodsId,
              number: this.orderDetail.order.orderStatus === 201 ? orderGoodsList[i].number : orderGoodsList[i].number - orderGoodsList[i].refundNumber,
              refundMoney: orderGoodsList[i].finalPrice,
              goodsPicUrl: orderGoodsList[i].picUrl,
              goodsName: orderGoodsList[i].goodsName,
              maxNum: this.orderDetail.order.orderStatus === 201 ? orderGoodsList[i].number : orderGoodsList[i].number - orderGoodsList[i].refundNumber
            };
            this.refundForm.refundGoodsList.push(this.refundGoods);
            const afterSaleItemVo = {
              orderId: this.refundGoods.orderId,
              orderGoodsId: this.refundGoods.goodsId,
              number: this.refundGoods.number,
              price: orderGoodsList[i].finalPrice,
            };
            this.afterSaleItemVos.push(afterSaleItemVo);
            this.afterSaleVo.refundPrice = this.afterSaleVo.refundPrice + orderGoodsList[i].finalPrice;

          }
        }
        this.afterSaleVo.isAll = true;
        this.refundDialogVisible = true;
        this.$nextTick(() => {
          this.$refs['refundForm'].clearValidate()
        })
      },
      handleRefund(row) {
        this.refundForm.refundGoodsList = [];
        this.afterSaleVo.refundPrice = 0.00;
        this.afterSaleItemVos = [];
        this.refundGoods = {};
        this.refundGoods = {
          orderId: row.orderId,
          goodsId: row.goodsId,
          number: this.orderDetail.order.orderStatus === 201 ? row.number : row.number - row.refundNumber,
          goodsPicUrl: row.picUrl,
          goodsName: row.goodsName,
          maxNum: this.orderDetail.order.orderStatus === 201 ? row.number : row.number - row.refundNumber
        };
        this.orderGoodsPrice = {
          orderId: row.orderId,
          goodsId: row.goodsId,
          number: this.orderDetail.order.orderStatus === 201 ? row.number : row.number - row.refundNumber,
        };
        getOrderGoodsRefundPrice(this.orderGoodsPrice).then(response => {
          this.refundGoods.refundMoney = response.data.data.data.applyRefundPrice;
          this.refundGoods.number = this.orderGoodsPrice.number;
          this.refundForm.refundGoodsList.push(this.refundGoods);
          const afterSaleItemVo = {
            orderId: row.orderId,
            orderGoodsId: row.goodsId,
            number: row.number,
            price: this.refundGoods.refundMoney,
          };
          this.afterSaleItemVos.push(afterSaleItemVo);
          this.afterSaleVo.refundPrice = this.refundGoods.refundMoney;
        }).catch(response => {
          this.$notify.error({
            title: '价格获取异常',
            message: response.data.errmsg
          })
        });

        this.afterSaleVo.isAll = false;
        this.refundDialogVisible = true;
        this.$nextTick(() => {
          this.$refs['refundForm'].clearValidate()
        })
      },
      confirmRefund() {
        this.afterSaleVo.afterSaleItemVos = this.afterSaleItemVos;
        this.afterSaleVo.url = this.url;
        this.afterSaleVo.detail = this.refundForm.detail;
        this.afterSaleVo.reason = this.refundForm.reason;
        this.afterSaleVo.userId = this.orderDetail.order.userId;
        this.afterSaleVo.orderId = this.orderDetail.order.id;
        this.afterSaleVo.orderStatus = this.orderDetail.order.orderStatus;
        this.afterSaleVo.type = 1;

        applyAfterSale(this.afterSaleVo).then(response => {
          this.refundForm = {};
          this.refundDialogVisible = false;
          this.$notify.success({
            title: '成功',
            message: '退款申请提交成功！'
          });
          this.init()
        }).catch(response => {
          this.$notify.error({
            title: '退款申请提交失败！',
            message: response.data.errmsg
          })
        })
      },
      handleModifyAddress(row) {
        this.modifyAddressForm.orderSn = row.orderSn
        this.modifyAddressForm.newConsignee = row.consignee
        this.modifyAddressForm.newMobile = row.mobile
        this.modifyAddressForm.newAddress = row.address
        this.modifyAddressForm.newMessage = row.message
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
              this.init();
            }).catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
          }
        })
      },
      uploadOverrun: function () {
        this.$message({
          type: 'error',
          message: '上传文件个数超出限制!最多上传5张图片!'
        })
      },
      handleUrl(response, file, fileList) {
        if (response.errno === 0) {
          this.url.push(response.data.url)
        }
      },
      handleUrlRemove: function (file, fileList) {
        for (var i = 0; i < this.url.length; i++) {
          // 这里存在两种情况
          // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
          //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
          // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
          var pictureUrl
          if (file.response === undefined) {
            pictureUrl = file.url
          } else {
            pictureUrl = file.response.data.url
          }

          if (this.url[i] === pictureUrl) {
            this.url.splice(i, 1)
          }
        }
      },
    }
  }
</script>
