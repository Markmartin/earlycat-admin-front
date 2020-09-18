<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.type" class="filter-item" placeholder="管理员类型">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model="listQuery.realname" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户姓名"/>
      <el-input v-model="listQuery.phone" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>
      <el-button v-permission="['GET /admin/admin/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/admin/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-permission="['GET /admin/admin/list']" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
<!--      <el-table-column align="center" label="用户ID" prop="id" sortable/>-->
      <el-table-column align="center" label="用户账号" prop="username"/>
      <el-table-column align="center" label="用户姓名" prop="realname"/>
      <el-table-column align="center" label="手机号" prop="phone"/>
<!--      <el-table-column align="center" label="OPENID" prop="openId"/>-->

      <el-table-column align="center" label="用户头像" prop="avatar">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" :src="scope.row.avatar" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号类型" prop="type">
        <template slot-scope="scope">
          <el-tag :key="scope.row.type" type="primary"> {{ formatType(scope.row.type) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户角色" prop="roleIds">
        <template slot-scope="scope">
          <el-tag v-for="roleId in scope.row.roleIds" :key="roleId" type="primary" style="margin-right: 20px;"> {{ formatRole(roleId) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/admin/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/admin/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户类型" prop="type">
          <el-select v-model="dataForm.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="dataForm.username"/>
        </el-form-item>
        <el-form-item label="用户姓名" prop="realname">
          <el-input v-model="dataForm.realname"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="dataForm.phone"/>
        </el-form-item>
        <el-form-item  label="用户密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleIds">
          <el-select v-model="dataForm.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
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
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
</style>

<script>
import { listAdmin, createAdmin, updateAdmin, deleteAdmin } from '@/api/admin'
import { roleOptions } from '@/api/role'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Admin',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      roleOptions: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        type: undefined,
        realname: undefined,
        phone: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        type: undefined,
        username: undefined,
        realname: undefined,
        phone: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [
          { required: true, min: 6, message: '用户账号至少6位', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, min: 11, max: 11, message: '手机号格式不正确', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '账号类型不能为空', trigger: 'blur' }
        ]
        // password: [{ required: true, min: 6, message: '密码长度至少6位', trigger: 'blur' }]
      },
      typeOptions: [{
        value: 1,
        label: '平台管理员'
      }, {
        value: 2,
        label: '物业管理员'
      }],
      downloadLoading: false
    }
  },
  computed: {
    headers() {
      return {
        'X-Wali-Token': getToken()
      }
    }
  },
  created() {
    this.getList()

    roleOptions()
      .then(response => {
        this.roleOptions = response.data.data.list
      })
  },
  methods: {
    formatType(type) {
      for (let i = 0; i < this.typeOptions.length; i++) {
        if (type === this.typeOptions[i].value) {
          return this.typeOptions[i].label
        }
      }
      return ''
    },
    formatRole(roleId) {
      for (let i = 0; i < this.roleOptions.length; i++) {
        if (roleId === this.roleOptions[i].value) {
          return this.roleOptions[i].label
        }
      }
      return ''
    },
    getList() {
      this.listLoading = true
      listAdmin(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        username: undefined,
        realname: undefined,
        phone: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.avatar = response.data.url
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if(this.dataForm.password == null){
            this.$message.error('请输入用户密码！')
            return false
          }
          createAdmin(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加用户成功'
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
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateAdmin(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新用户成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除当前用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(row)
          .then(response => {
            this.$notify.success({
              title: '成功',
              message: '删除用户成功'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
          .catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
      }).catch(() => {})
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户ID', '用户账号', '用户姓名', '手机号', '用户头像']
        const filterVal = ['id', 'username', 'realname', 'phone', 'avatar']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '用户信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
