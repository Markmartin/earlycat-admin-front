<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" clearable class="filter-item" style="width: 200px;" placeholder="请输入昵称"/>
      <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>
      <el-select v-model="listQuery.userType" clearable style="width: 200px" class="filter-item" placeholder="请选择用户类型">
        <el-option v-for="type in userTypeOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.strategyGroupId" clearable style="width: 200px" class="filter-item" placeholder="请选择策略组">
        <el-option v-for="group in strategyGroupList" :key="group.name" :label="group.name" :value="group.id"/>
      </el-select>
      <el-select v-model="listQuery.applyPromoteStatus" clearable style="width: 200px" class="filter-item" placeholder="请选择申请状态">
        <el-option-group>
          <el-option label="申请中" value="1"/>
          <el-option label="审核通过" value="2"/>
          <el-option label="审核拒绝" value="3"/>
        </el-option-group>
      </el-select>
      <el-button v-permission="['GET /admin/user/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['GET /admin/user/list']" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="用户ID" prop="id" sortable/>

      <el-table-column align="center" label="昵称" prop="nickname"/>

      <el-table-column align="center" label="手机号码" prop="mobile"/>

      <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="scope">
          <el-tag >{{ genderDic[scope.row.gender] }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="生日" prop="birthday"/> -->

      <el-table-column align="center" label="用户类型" prop="userLevel">
        <template slot-scope="scope">
          <el-tag >{{ userTypeOptions[scope.row.userType].label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="策略组" prop="strategyGroupName"/>
      <el-table-column align="center" label="申请推广状态" prop="applyPromoteStatus">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/user/sell']" v-if="scope.row.applyPromoteStatus === 1" type="success" size="mini" @click="setUserType(1,scope.row);scope.row.visible = false">同意</el-button>
          <el-button v-permission="['POST /admin/user/applyRefuse']" v-if="scope.row.applyPromoteStatus === 1" type="danger" size="mini" @click="applyRefuse(scope.row)">拒绝</el-button>
          <el-tag v-if="scope.row.applyPromoteStatus === 2 || scope.row.applyPromoteStatus === 3">{{ applyPromoteStatusOptions[scope.row.applyPromoteStatus].label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" prop="addTime"/>
      <el-table-column align="center" width="200" label="操作" prouserp="status">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.userType === 0"
            v-model="scope.row.visible"
            placement="top"
            width="160">
            <div style="text-align: center;">
              <el-button size="mini" type="primary" @click="setUserType(1,scope.row);scope.row.visible = false">普通推广</el-button>
              <!--<el-button size="mini" type="primary" @click="setUserType(2,scope.row);scope.row.visible = false">总代</el-button>-->
            </div>
            <el-button slot="reference" type="primary" size="mini">设为</el-button>
            <!-- <el-button slot="reference">删除</el-button> -->
          </el-popover>
          <!-- <el-button v-if="scope.row.userType === 0" type="primary" size="mini" @click="setUserType(1,scope.row)">设为推广</el-button> -->
          <el-button v-permission="['POST /admin/user/sell']" v-else type="info" size="mini" @click="setUserType(0,scope.row)">取消推广</el-button>
          <el-button v-permission="['POST /admin/user/enable']" v-if="scope.row.status === 1" type="success" size="mini" @click="btnEnable(scope.row)">启用</el-button>
          <el-button v-permission="['POST /admin/user/disable']" v-if="scope.row.status === 0" type="danger" size="mini" @click="btnDisable(scope.row)">禁用</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="选择推广策略组">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="right" label-width="150px" style="width: 100%; padding-left:50px;">
        <!--<el-form-item label="总代人员" prop="inviterId">-->
          <!--<el-select-->
            <!--v-model="dataForm.inviterId"-->
            <!--style="width:100%;"-->
            <!--placeholder="请选择总代人员">-->
            <!--<el-option-->
              <!--v-for="item in inviterList"-->
              <!--:key="item.id"-->
              <!--:label="item.nickname"-->
              <!--:value="item.id"/>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="推广策略组" prop="strategyGroupId">
          <el-select
            v-model="dataForm.strategyGroupId"
            style="width:100%;"
            placeholder="请选择推广策略组">
            <el-option
              v-for="item in strategyGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="setGeneralize('dataForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, userDisable, userEnable, userSell, apiApplyRefuse } from '@/api/user'
import { apiListAll } from '@/api/strategy'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      dataForm: {
        item: {},
        inviterId: '',
        strategyGroupId: '',
        applyPromoteStatus: '',
      },
      inviterList: [],
      strategyGroupList: [],
      dialogVisible: false,
      rules: {
        inviterId: [
          { required: false, message: '请选择总代人员', trigger: 'change' },
          { required: true, message: '请选择推广策略组', trigger: 'change' }
        ]
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        nickname: undefined,
        mobile: undefined,
        strategyGroupId: undefined,
        applyPromoteStatus: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      downloadLoading: false,
      genderDic: ['未知', '男', '女'],
      userTypeOptions: [
        {
          label: '普通用户',
          value: 0
        },
        {
          label: '普通推广',
          value: 1
        }
        ,
        {
          label: '总代推广',
          value: 2
        }
      ],
      applyPromoteStatusOptions: [
        {
          label: '',
          value: 0
        },
        {
          label: '申请中',
          value: 1
        },
        {
          label: '审核通过',
          value: 2
        },
        {
          label: '审核拒绝',
          value: 3
        }
      ],
      statusDic: ['可用', '禁用', '注销']
    }
  },
  created() {
    this.getList()
    this.getStrategyGroupList()
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.$refs['dataForm'].resetFields()
    },
    setGeneralize(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确定要设为推广用户吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            userSell({
              id: this.dataForm.item.id,
              userType: 1,
              inviterId: this.dataForm.inviterId,
              strategyGroupId: this.dataForm.strategyGroupId,
              applyPromoteStatus: 2}).then(response => {
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
              this.getList()
              this.handleClose()
            }).catch(() => {
              this.$message.error('设置失败!')
            })
          }).catch(() => {
          })
        } else {
          return false
        }
      })
    },
    setUserType(type, item) {
      if (type === 1) {
        this.dataForm.item = item
        this.dataForm.inviterId = ''
        this.inviterList = []
        // fetchList({ page: 1, limit: 100, userType: 2 }).then(response => {
        //   this.inviterList = response.data.data.list
        //   this.dialogVisible = true
        // }).catch(() => {
        //   this.inviterList = []
        // })
        apiListAll({ page: 1, limit: 100 }).then(response => {
          this.strategyGroupList = response.data.data.list
          this.dialogVisible = true
        }).catch(() => {
          this.strategyGroupList = []
        })
      } else {
        let hint = ''
        if (type === 0) {
          hint = '确定要取消推广用户吗？'
        }
        if (type === 2) {
          hint = '确定要设为总代吗？'
        }
        this.$confirm(hint, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userSell({ id: item.id, userType: type }).then(response => {
            this.getList()
            this.$message({
              type: 'success',
              message: '设置成功!'
            })
          }).catch(() => {
            this.$message.error('设置失败!')
          })
        }).catch(() => {
        })
      }
    },
    btnEnable(item) {
      this.$confirm('确定启用当前用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userEnable({ id: item.id }).then(response => {
          item.status = 0
          this.$message({
            type: 'success',
            message: '启用成功!'
          })
        }).catch(() => {
          this.$message.error('启用失败!')
        })
      }).catch(() => {
      })
    },
    btnDisable(item) {
      this.$confirm('确定禁用当前用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userDisable({ id: item.id }).then(response => {
          item.status = 1
          this.$message({
            type: 'success',
            message: '禁用成功!'
          })
        }).catch(() => {
          this.$message.error('禁用失败!')
        })
      }).catch(() => {
      })
    },
    applyRefuse(item) {
      this.$confirm('确定拒绝吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiApplyRefuse({ id: item.id }).then(response => {
          item.applyPromoteStatus = 3
          this.$message({
            type: 'success',
            message: '成功!'
          })
        }).catch(() => {
          this.$message.error('失败!')
        })
      }).catch(() => {
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    getStrategyGroupList() {
      apiListAll().then(response => {
        this.strategyGroupList = response.data.data.list
      }).catch(() => {
        this.strategyGroupList = []
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
        const filterVal = ['username', 'mobile', 'gender', 'birthday', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
