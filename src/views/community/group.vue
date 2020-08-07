<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.groupName" clearable class="filter-item" style="width: 200px;" placeholder="请输入群组名"/>
      <el-input v-model="listQuery.groupPlugid" clearable class="filter-item" style="width: 200px;" placeholder="请输入群组ID"/>
      <el-button v-permission="['GET /admin/wxwork/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/wxwork/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="群组名" prop="groupName" />
      <el-table-column align="center" label="配置ID" prop="groupPlugid" min-width="120px" />
      <el-table-column align="center" label="省市区" prop="contract">
        <template slot-scope="scope">
          {{ scope.row.province }}-{{ scope.row.city }}-{{ scope.row.county }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="addTime"/>
      <el-table-column align="center" label="操作" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/wxwork/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/wxwork/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 100%; padding-left:50px;">
        <el-form-item label="群组名" prop="groupName">
          <el-input v-model="dataForm.groupName"/>
        </el-form-item>
        <el-form-item label="配置ID" prop="groupPlugid">
          <el-input v-model="dataForm.groupPlugid"/>
        </el-form-item>
        <el-form-item label="地址">
          <!-- <el-cascader :options="globalOptions" v-model="selectedOptions" :props="{ value: 'id', label: 'name' }" value="" @change="handleChange" /> -->
          <div>
            <el-select v-model="dataForm.province" placeholder="请选择省" @change="changeProvince">
              <el-option
                v-for="item in provinceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
            </el-select>
            <el-select v-model="dataForm.city" placeholder="请选择市" @change="changeCity">
              <el-option
                v-for="item in cityOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
            </el-select>
            <el-select v-model="dataForm.county" placeholder="请选择区">
              <el-option
                v-for="item in countyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
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

<script>
import { listWxwork, createWxwork, updateWxwork, deleteWxwork } from '@/api/wxwork'
import { listSubRegion } from '@/api/region'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Wxwork',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        groupPlugid: undefined,
        groupName: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      regionQuery: {
        id: 0
      },
      globalOptions: [],
      selectedOptions: [],
      provinceOptions: null,
      cityOptions: null,
      countyOptions: null,
      downloadLoading: false,
      dataForm: {
        id: undefined,
        groupName: undefined,
        groupPlugid: undefined,
        province: undefined,
        city: undefined,
        county: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '社区名称不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
      }
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
    this.getProvince()
  },
  methods: {
    uploadIconUrl(response) {
      this.$set(this.dataForm, 'wechatGroupUrl', response.data.url)
      // this.dataForm.wechatGroupUrl = response.data.url
    },
    handleChange(value) {
      console.log(value)
    },
    getList() {
      this.listLoading = true
      listWxwork(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    getProvince() {
      listSubRegion(this.regionQuery).then(response => {
        this.provinceOptions = response.data.data.list
        // this.globalOptions = response.data.data.list
      }).catch(() => {
        this.provinceOptions = []
      })
    },
    changeProvince: function(option, tag) {
      this.cityOptions = []
      this.countyOptions = []
      let id = ''
      for (const idx in this.provinceOptions) {
        if (this.provinceOptions[idx].name === option) {
          id = this.provinceOptions[idx].id
          break
        }
      }
      this.regionQuery.id = id
      if (!tag) {
        this.dataForm.city = undefined
        this.dataForm.county = undefined
      }
      listSubRegion(this.regionQuery).then(response => {
        this.cityOptions = response.data.data.list
        if (tag) {
          this.changeCity(this.dataForm.city, true)
        }
      }).catch(() => {
        this.cityOptions = []
      })
    },
    changeCity: function(option, tag) {
      this.countyOptions = []
      let id = ''
      for (const idx in this.cityOptions) {
        if (this.cityOptions[idx].name === option) {
          id = this.cityOptions[idx].id
          break
        }
      }
      this.regionQuery.id = id
      if (!tag) {
        this.dataForm.county = undefined
      }
      listSubRegion(this.regionQuery).then(response => {
        this.countyOptions = response.data.data.list
      }).catch(() => {
        this.countyOptions = []
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        groupName: undefined,
        groupPlugid: undefined,
        province: undefined,
        city: undefined,
        county: undefined
      }
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
          createWxwork(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '新建群组成功'
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
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.changeProvince(this.dataForm.province, true)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateWxwork(this.dataForm)
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
                message: '更新群组信息成功'
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
      this.$confirm('确定要删除当前群组吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWxwork(row)
          .then(response => {
            this.$notify.success({
              title: '成功',
              message: '删除群组成功'
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
        const tHeader = ['社区名', '联系人', '手机号码', '固定电话']
        const filterVal = ['name', 'contact', 'mobile', 'telephone']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '社区列表')
        this.downloadLoading = false
      })
    }
  }
}
</script>
