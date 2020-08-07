<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入设备名"/>
      <el-button v-permission="['GET /admin/terminal/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/terminal/save']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-permission="['GET /admin/terminal/list']" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="设备ID" prop="id" sortable/>

      <el-table-column align="center" label="设备名称" prop="name"/>

      <el-table-column align="center" label="物联网状态" prop="iotStatus">
        <template slot-scope="scope">
          <el-tag :key="scope.row.iotStatus" type="primary"> {{ formatIotStatus(scope.row.iotStatus) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="门磁开关状态" prop="sysDoorLock">
        <template slot-scope="scope">
          <el-tag :key="scope.row.sysDoorLock" type="primary"> {{ formatSysDoorLock(scope.row.sysDoorLock) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="社区名称" prop="communityName"/>

      <el-table-column align="center" label="安装位置" prop="position"/>

      <el-table-column align="center" label="激活状态" prop="terminalActive">
        <template slot-scope="scope">
          <el-tag :key="scope.row.terminalActive" type="primary"> {{ formatActiveStatus(scope.row.terminalActive) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="100px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/terminal/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/terminal/initialization']" type="primary" size="mini" @click="handleCommunity(scope.row)">绑定</el-button>
          <el-button v-permission="['POST /admin/terminal/activation']" type="danger" size="mini" @click="handleActivation(scope.row)">激活</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="设备描述" prop="desc">
          <el-input v-model="dataForm.desc"/>
        </el-form-item>
        <el-form-item label="设备标签" prop="tags">
          <el-input v-model="dataForm.tags"/>
        </el-form-item>
        <el-form-item label="设备序列号" prop="sn">
          <el-input v-model="dataForm.sn"/>
        </el-form-item>
        <el-form-item label="设备mac地址" prop="macaddress">
          <el-input v-model="dataForm.macaddress"/>
        </el-form-item>
        <el-form-item label="设备运行状态" prop="sysRunningState">
          <el-select v-model="dataForm.sysRunningState" placeholder="请选择">
            <el-option
              v-for="item in sysRunningStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="时间自动校准" prop="sysTimeadjust">
          <el-select v-model="dataForm.sysTimeadjust" placeholder="请选择">
            <el-option
              v-for="item in sysTimeadjustOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="重复读卡间隔开关设置" prop="sysReaderinterval">
          <el-select v-model="dataForm.sysReaderinterval" placeholder="请选择">
            <el-option
              v-for="item in sysReaderintervalOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="重复读卡间隔时间设置" prop="sysReaderintervaltime">
          <el-input v-model="dataForm.sysReaderintervaltime"/>
        </el-form-item>
        <el-form-item label="未注册卡报警设置" prop="sysInvalidcardalarm">
          <el-select v-model="dataForm.sysInvalidcardalarm" placeholder="请选择">
            <el-option
              v-for="item in sysInvalidcardalarmOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="使用时段设置" prop="sysWorktime">
          <el-select v-model="dataForm.sysWorktime" placeholder="请选择">
            <el-option
              v-for="item in sysWorktimeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="时段设置" prop="sysTimegroup">
          <el-input v-model="dataForm.sysTimegroup"/>
        </el-form-item>
        <el-form-item label="设备关门速度(1-9档)" prop="sysClosespeed">
          <el-select v-model="dataForm.sysClosespeed" placeholder="请选择">
            <el-option
              v-for="item in sysClosespeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备关门刹车，缓冲(1-9档)" prop="sysClosebuffer">
          <el-select v-model="dataForm.sysClosebuffer" placeholder="请选择">
            <el-option
              v-for="item in sysClosebufferOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备关门到限位后延时工作时间(0.3-9.9秒)" prop="sysClosedelay">
          <el-input v-model="dataForm.sysClosedelay"/>
        </el-form-item>
        <el-form-item label="设备开门保持时间(1-99秒)" prop="sysKeepopen">
          <el-input v-model="dataForm.sysKeepopen"/>
        </el-form-item>
        <el-form-item label="设备开门到限位后延时工作时间(0.3-9.9秒)" prop="sysOpendelay">
          <el-input v-model="dataForm.sysOpendelay"/>
        </el-form-item>
        <el-form-item label="设备电机堵转阈值(20-99)" prop="sysClogthreshold">
          <el-input v-model="dataForm.sysClogthreshold"/>
        </el-form-item>
        <el-form-item label="设备反推门响应时间(0.1-9.0秒)" prop="sysReverseresponse">
          <el-input v-model="dataForm.sysReverseresponse"/>
        </el-form-item>
        <el-form-item label="设备开门方向" prop="sysOpendirection">
          <el-select v-model="dataForm.sysOpendirection" placeholder="请选择">
            <el-option
              v-for="item in sysOpendirectionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备开门速度(1-10档)" prop="sysOpenspeed">
          <el-select v-model="dataForm.sysOpenspeed" placeholder="请选择">
            <el-option
              v-for="item in sysOpenspeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备开门刹车，缓冲(1-9档)" prop="sysOpenbuffer">
          <el-select v-model="dataForm.sysOpenbuffer" placeholder="请选择">
            <el-option
              v-for="item in sysOpenbufferOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备反推门响应灵敏度(1-5档)" prop="sysReversesensity">
          <el-select v-model="dataForm.sysReversesensity" placeholder="请选择">
            <el-option
              v-for="item in sysReversesensityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备LED灯" prop="sysLedstate">
          <el-select v-model="dataForm.sysLedstate" placeholder="请选择">
            <el-option
              v-for="item in sysLedstateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-permission="['POST /admin/terminal/save']" v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-permission="['POST /admin/terminal/update']" v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 绑定小区对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="communityFormVisible">
      <el-autocomplete
        v-model="communityFormInput"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入社区名"
        @select="handleSelectComm"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="communityFormVisible = false">取消</el-button>
        <el-button v-permission="['GET /admin/terminal/binding']" type="primary" @click="bindingData">绑定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listTerminal, createTerminal, updateTerminal, bindingCommunity, activationTerminal } from '@/api/terminal'
import { listCommunity } from '@/api/community'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Terminal',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: 'id',
        order: 'asc'
      },
      downloadLoading: false,
      dataForm: {
        id: undefined,
        name: undefined,
        desc: undefined,
        tags: undefined,
        sn: undefined,
        macaddress: undefined,
        sysRunningState: undefined,
        sysTimeadjust: undefined,
        sysReaderinterval: undefined,
        sysReaderintervaltime: undefined,
        sysInvalidcardalarm: undefined,
        sysWorktime: undefined,
        sysTimegroup: undefined,
        sysClosespeed: undefined,
        sysClosebuffer: undefined,
        sysClosedelay: undefined,
        sysKeepopen: undefined,
        sysOpendelay: undefined,
        sysClogthreshold: undefined,
        sysReverseresponse: undefined,
        sysOpendirection: undefined,
        sysOpenspeed: undefined,
        sysOpenbuffer: undefined,
        sysReversesensity: undefined,
        sysLedstate: undefined
      },
      iotStatusOptions: [{
        value: 0,
        label: '离线'
      }, {
        value: 1,
        label: '在线'
      }],
      sysDoorLockOptions: [{
        value: 0,
        label: '关'
      }, {
        value: 1,
        label: '开'
      }],
      activeStatusOptions: [{
        value: true,
        label: '已激活'
      }, {
        value: false,
        label: '未激活'
      }],
      sysTimeadjustOptions: [{
        value: 0,
        label: '人工'
      }, {
        value: 1,
        label: '自动'
      }],
      sysReaderintervalOptions: [{
        value: 0,
        label: '不启用'
      }, {
        value: 1,
        label: '不做响应'
      }, {
        value: 2,
        label: '记录读卡不开门'
      }, {
        value: 3,
        label: '记录读卡开门'
      }],
      sysInvalidcardalarmOptions: [{
        value: 0,
        label: '禁用'
      }, {
        value: 1,
        label: '启用'
      }],
      sysWorktimeOptions: [{
        value: 0,
        label: '不使用'
      }, {
        value: 1,
        label: '使用'
      }],
      sysClosespeedOptions: [{
        value: 1,
        label: '1档'
      }, {
        value: 2,
        label: '2档'
      }, {
        value: 3,
        label: '3档'
      }, {
        value: 4,
        label: '4档'
      }, {
        value: 5,
        label: '5档'
      }, {
        value: 6,
        label: '6档'
      }, {
        value: 7,
        label: '7档'
      }, {
        value: 8,
        label: '8档'
      }, {
        value: 9,
        label: '9档'
      }],
      sysClosebufferOptions: [{
        value: 1,
        label: '1档'
      }, {
        value: 2,
        label: '2档'
      }, {
        value: 3,
        label: '3档'
      }, {
        value: 4,
        label: '4档'
      }, {
        value: 5,
        label: '5档'
      }, {
        value: 6,
        label: '6档'
      }, {
        value: 7,
        label: '7档'
      }, {
        value: 8,
        label: '8档'
      }, {
        value: 9,
        label: '9档'
      }],
      sysOpendirectionOptions: [{
        value: 1,
        label: '左开门'
      }, {
        value: 2,
        label: '右开门'
      }, {
        value: 3,
        label: '外部拨码'
      }],
      sysOpenspeedOptions: [{
        value: 1,
        label: '1档'
      }, {
        value: 2,
        label: '2档'
      }, {
        value: 3,
        label: '3档'
      }, {
        value: 4,
        label: '4档'
      }, {
        value: 5,
        label: '5档'
      }, {
        value: 6,
        label: '6档'
      }, {
        value: 7,
        label: '7档'
      }, {
        value: 8,
        label: '8档'
      }, {
        value: 9,
        label: '9档'
      }, {
        value: 10,
        label: '10档'
      }],
      sysOpenbufferOptions: [{
        value: 1,
        label: '1档'
      }, {
        value: 2,
        label: '2档'
      }, {
        value: 3,
        label: '3档'
      }, {
        value: 4,
        label: '4档'
      }, {
        value: 5,
        label: '5档'
      }, {
        value: 6,
        label: '6档'
      }, {
        value: 7,
        label: '7档'
      }, {
        value: 8,
        label: '8档'
      }, {
        value: 9,
        label: '9档'
      }],
      sysReversesensityOptions: [{
        value: 1,
        label: '1档'
      }, {
        value: 2,
        label: '2档'
      }, {
        value: 3,
        label: '3档'
      }, {
        value: 4,
        label: '4档'
      }, {
        value: 5,
        label: '5档'
      }],
      sysRunningStateOptions: [{
        value: 0,
        label: '普通'
      }, {
        value: 1,
        label: '常开'
      }, {
        value: 2,
        label: '常闭'
      }],
      sysLedstateOptions: [{
        value: 1,
        label: '强开'
      }, {
        value: 2,
        label: '强关'
      }, {
        value: 3,
        label: '定时开或者关闭'
      }],
      dialogFormVisible: false,
      selectTerId: '',
      selectCommId: '',
      communityFormInput: '',
      communityFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        sn: [{ required: true, message: '设备序列号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }]
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
  },
  methods: {
    formatIotStatus(status) {
      for (let i = 0; i < this.iotStatusOptions.length; i++) {
        if (status === this.iotStatusOptions[i].value) {
          return this.iotStatusOptions[i].label
        }
      }
      return '无状态'
    },
    formatSysDoorLock(status) {
      for (let i = 0; i < this.sysDoorLockOptions.length; i++) {
        if (status === this.sysDoorLockOptions[i].value) {
          return this.sysDoorLockOptions[i].label
        }
      }
      return '无状态'
    },
    formatActiveStatus(status) {
      for (let i = 0; i < this.activeStatusOptions.length; i++) {
        if (status === this.activeStatusOptions[i].value) {
          return this.activeStatusOptions[i].label
        }
      }
      return ''
    },
    getList() {
      this.listLoading = true
      listTerminal(this.listQuery).then(response => {
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
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        desc: undefined,
        tags: undefined,
        sn: undefined,
        macaddress: undefined,
        sysRunningState: 0,
        sysTimeadjust: 1,
        sysReaderinterval: 0,
        sysReaderintervaltime: 0,
        sysInvalidcardalarm: 0,
        sysWorktime: 0,
        sysTimegroup: '',
        sysClosespeed: 1,
        sysClosebuffer: 1,
        sysClosedelay: 0.5,
        sysKeepopen: 5,
        sysOpendelay: 0.5,
        sysClogthreshold: 30,
        sysReverseresponse: 0.3,
        sysOpendirection: 1,
        sysOpenspeed: 1,
        sysOpenbuffer: 1,
        sysReversesensity: 2,
        sysLedstate: 1
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
          createTerminal(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '新建设备成功'
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateTerminal(this.dataForm)
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
                message: '更新设备信息成功'
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
    handleCommunity(row) {
      this.selectTerId = row.id
      this.selectCommId = row.communityId
      this.communityFormInput = row.communityName
      this.dialogStatus = 'add'
      this.communityFormVisible = true
    },
    querySearchAsync(queryString, callback) {
      listCommunity({ 'name': queryString }).then(response => {
        const res = response.data.data.list
        for (const i of res) {
          i.value = i.name
        }
        callback(res)
      }).catch((response) => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    handleSelectComm(item) {
      this.selectCommId = item.id
      this.communityFormInput = item.name
    },
    bindingData() {
      bindingCommunity({ 'terminalId': this.selectTerId, 'communityId': this.selectCommId })
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '绑定成功'
          })
          for (const v of this.list) {
            if (v.id === this.selectTerId) {
              const index = this.list.indexOf(v)
              this.list[index].communityId = this.selectCommId
              this.list[index].communityName = this.communityFormInput
              break
            }
          }
          this.communityFormVisible = false
        }).catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    },
    handleActivation(row) {
      this.$confirm('确定要激活当前设备吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activationTerminal(row)
          .then(response => {
            this.$notify.success({
              title: '成功',
              message: '激活成功'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }).catch(response => {
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
        const tHeader = ['设备名', '物联网状态', '门磁开关状态', '社区名称', '社区ID', '安装位置', '激活状态']
        const filterVal = ['name', 'iotStatus', 'sysDoorLock', 'communityName', 'communityId', 'position', 'terminalActive']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '设备列表')
        this.downloadLoading = false
      })
    }
  }
}
</script>
