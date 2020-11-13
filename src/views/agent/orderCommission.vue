<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="佣金状态">
        <el-option v-for="type in statusOps" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-button
        v-permission="['GET /admin/orderCommission/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button
      >
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="推广员" min-width="120px" prop="promoterName">
        <template slot-scope="scope">
          <img :src="scope.row.promoterUrl" width="20"> {{scope.row.promoterName}}
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="所属总代" min-width="120px" prop="agentName"/>-->
      <el-table-column align="center" label="佣金提成金额" min-width="120px" prop="amount"/>
      <el-table-column align="center" label="订单编号" min-width="120px" prop="orderSn"/>
      <el-table-column align="center" label="订单用户" min-width="120px" prop="orderUserNickname"/>
      <el-table-column align="center" label="订单状态" min-width="120px" prop="orderStatus"/>
      <el-table-column align="center" label="佣金状态" min-width="120px" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ statusOps[scope.row.status].label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="120px" prop="addTime" sortable/>

      <el-table-column
        align="center"
        label="操作"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button  v-permission="['GET /admin/orderCommission/orderDetail']" type="primary" size="small" @click="handleDetail(scope.row)">订单详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

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

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

</style>

<script>
  import {apiList, apiOrderDetail} from "@/api/orderCommission";
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "orderCommission",
    components: {Pagination},
    data() {
      return {
        statusOps: [
          {
            label: "即将到账",
            value: 0
          },
          {
            label: "已到账",
            value: 1
          }
        ],
        firstOrderOps: [
          {
            label: "否",
            value: 0
          },
          {
            label: "是",
            value: 1
          }
        ],
        list: null,
        total: 0,
        listLoading: true,
        dialogStatus: "",
        listQuery: {
          page: 1,
          limit: 20,
          status: undefined,
          sort: "add_time",
          order: "desc"
        },
        textMap: {
          update: "编辑",
          create: "创建"
        },
        dialogFormVisible: false,
        detailDialogVisible: false,
        orderDetail: {
          orderInfo: '',
          commission: '',
          goodsList: []
        },

      };
    },
    created() {
      this.getList();
    },

    methods: {
      getList() {
        this.listLoading = true;
        apiList(this.listQuery)
          .then(response => {
            this.list = response.data.data.list;
            this.total = response.data.data.total;
            this.listLoading = false;
          })
          .catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleDetail(row) {
        apiOrderDetail(row.id).then(response => {
          this.orderDetail = response.data.data
        })
        this.detailDialogVisible = true
      },
    }
  };
</script>
