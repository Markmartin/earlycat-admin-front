<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入总代名称"
      />
      <el-button
        v-permission="['GET /admin/agent/withdraw/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >查找</el-button
      >
    </div>
    <p>* 付款到账实效为1-3日，最快次日到账</p>
    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        width="100px"
        label="ID"
        prop="id"
        sortable
      />
      <el-table-column
        align="center"
        label="总代名称"
        min-width="120px"
        prop="name"
      />

      <el-table-column
        align="center"
        label="收款方银行卡号"
        min-width="120px"
        prop="encBankNo"
      />

      <el-table-column
        align="center"
        label="收款方用户名"
        min-width="120px"
        prop="encTrueName"
      />

      <el-table-column align="center" label="收款方开户行名称" min-width="120px" prop="bankName" />
      <el-table-column align="center" label="提现金额" min-width="120px" prop="withdrawMoney" />
      <el-table-column align="center" label="状态" min-width="120px" prop="status">
        <template slot-scope="scope">
          <el-tag >{{ status[scope.row.status].label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" min-width="120px" prop="operator" />

      <el-table-column
        align="center"
        label="创建时间"
        min-width="120px"
        prop="addTime"
        sortable
      />

      <el-table-column
        align="center"
        label="操作"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/agent/withdraw/entpay']"
                     v-if="scope.row.status == 0"
                     type="primary" size="small" @click="handleWithdraw(scope.row)">付款到银行卡</el-button>
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
import { apiList , apiEntPayBank} from "@/api/agentWithdraw";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "agentWithdraw",
  components: { Pagination },
  data() {
    return {
      status: [
        {
          label: "申请中",
          value: 0
        },
        {
          label: "已提现",
          value: 1
        },
        {
          label: "已拒绝",
          value: 2
        }
      ],
      list: null,
      total: 0,
      listLoading: true,
      dialogStatus: "",
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: "add_time",
        order: "desc"
      },
      textMap: {
        update: "编辑",
        create: "创建"
      },
      dialogFormVisible: false,
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
    handleWithdraw(row) {
      this.$confirm('确认企业付款到银行卡', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiEntPayBank({ id: row.id })
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
  }
};
</script>
