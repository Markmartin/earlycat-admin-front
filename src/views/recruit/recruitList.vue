<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.zcmRecruitVo.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入应聘者姓名"/>
      <el-input v-model="listQuery.zcmRecruitVo.domicile" clearable class="filter-item" style="width: 200px;" placeholder="请输入应聘者户籍"/>
      <el-input v-model="listQuery.zcmRecruitVo.phone" clearable class="filter-item" style="width: 200px;" placeholder="请输入应聘者电话"/>
      <el-input v-model="listQuery.zcmRecruitVo.address" clearable class="filter-item" style="width: 200px;" placeholder="请输入应聘者地址"/>
      <el-button v-permission="['POST /admin/recruit/list']" class="filter-item" type="primary" icon="el-icon-search"
                 @click="handleFilter">查找
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :row-class-name="tableRowClassName"
              element-loading-text="正在查询中。。。"
              border fit highlight-current-row>
      <el-table-column align="center" min-width="100" label="应聘者姓名" prop="name"/>
      <el-table-column align="center" min-width="100" label="应聘者年龄" prop="age"/>
      <el-table-column align="center" min-width="100" label="应聘者性別" prop="gender">
      <template slot-scope="scope">
        <span v-if="scope.row.gender == 0">男</span>
        <span v-if="scope.row.gender == 1">女</span>
      </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="应聘者戶籍" prop="domicile"/>
      <el-table-column align="center" min-width="100" label="应聘者民族" prop="minority"/>
      <el-table-column align="center" min-width="100" label="应聘者电话" prop="phone"/>
      <el-table-column align="center" label="应聘者有无驾照" min-width="120" prop="isDrivingLicense">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isDrivingLicense ? 'success' : 'error' ">{{ scope.row.isDrivingLicense ? '有' : '无' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="200" label="应聘者居住地址" prop="address"/>
      <el-table-column align="center" min-width="150" label="应聘岗位"  prop="post"  >
      <template slot-scope="scope">
        <div>
          <ul>
            <li v-for="item in scope.row.post">
              {{ item }}
            </li>
          </ul>
        </div>
      </template>
      </el-table-column>
      <!--<el-table-column align="center" min-width="100" label="备注" prop="remark"/>-->
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100"/>
    </el-tooltip>

  </div>
</template>

<style>

  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
  import { list } from '@/api/recruit'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination


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
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          zcmRecruitVo: {}
        },
        list: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        list(this.listQuery.zcmRecruitVo, this.listQuery.page, this.listQuery.limit).then(response => {
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
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2=== 1)
        {
          return 'warning-row';
        }
        return '';
      }
    }
  }
</script>
