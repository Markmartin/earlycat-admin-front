<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入社区名"/>
      <el-select v-model="listQuery.contract" clearable style="width: 200px" class="filter-item" placeholder="请选择开通配送状态">
        <el-option v-for="type in contractOptions" :key="type.value" :label="type.label" :value="type.value"/>
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
        start-placeholder="开始时间"
        end-placeholder="截止时间"
        @change="pickerDateChange"/>
      <el-button v-permission="['GET /admin/community/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/community/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="社区ID" prop="id" sortable/>
      <el-table-column align="center" width="100px" label="小区名" prop="name" sortable/>

      <el-table-column align="center" label="省市区">
        <template slot-scope="scope">
          {{ scope.row.province == scope.row.city ? '' : scope.row.province }} {{ scope.row.city }} {{ scope.row.county }}
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="群二维码">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.effective != undefined" :type="scope.row.effective ? 'success' : 'error' ">{{ scope.row.effective ? '有效' : '失效' }}</el-tag>
        </template>
      </el-table-column> -->

      <!-- <el-table-column align="center" label="固定电话" prop="telephone"/> -->

      <el-table-column align="center" label="入驻时间" min-width="120px" prop="addTime"/>

      <el-table-column align="center" label="开通配送" prop="contract">
        <template slot-scope="scope">
          <el-tag :type="scope.row.contract ? 'success' : 'error' ">{{ scope.row.contract ? '已开通' : '未开通' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" min-width="50px" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'error' "> {{ formatStatus(scope.row.status) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/community/read']" type="primary" size="mini" @click="showWxCode(scope.row)">小程序码</el-button>
          <el-button v-permission="['POST /admin/community/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/community/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 小程序码对话框 -->
    <el-dialog :visible.sync="dialogWxCodeVisible" title="小程序码">
      <img :src="wxCodeImg" width="100%">
    </el-dialog>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="right" label-width="150px" style="width: 100%; padding-left:50px;">
        <el-form-item label="社区名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="地址" prop="addressDetail">
          <!-- <el-cascader :options="globalOptions" v-model="selectedOptions" :props="{ value: 'id', label: 'name' }" value="" @change="handleChange" /> -->
          <div style="width:600px;margin-bottom:22px;">
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
          <el-input v-model="dataForm.addressDetail"/>
        </el-form-item>
        <el-form-item label="所属线上线路" prop="onlineId">
          <el-select v-model="dataForm.onlineId" placeholder="请选择线路">
            <el-option
              v-for="item in onlineOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属线下线路" prop="offlineId">
          <el-select v-model="dataForm.offlineId" placeholder="请选择线路">
            <el-option
              v-for="item in offlineOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="dataForm.longitude"/>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="dataForm.latitude"/>
        </el-form-item>
        <el-form-item label="物管人员" prop="adminId">
          <el-select
            v-model="communityAdmin"
            :remote-method="communityMethod"
            :loading="communityLoading"
            value-key="username"
            class="filter-item"
            clearable
            filterable
            remote
            reserve-keyword
            style="width:100%;"
            placeholder="">
            <el-option
              v-for="item in communityList"
              :key="item.id"
              :label="item.username"
              :value="item"/>
          </el-select>
          <!-- <el-input v-model="dataForm.adminId"/> -->
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="dataForm.contact"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="dataForm.mobile"/>
        </el-form-item>
        <el-form-item label="座机号码" prop="telephone">
          <el-input v-model="dataForm.telephone"/>
        </el-form-item>
        <el-form-item label="开通配送">
          <el-switch v-model="dataForm.contract"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dataForm.status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="群二维码">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIconUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.wechatGroupUrl" :src="dataForm.wechatGroupUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="群组名" prop="weixinWorkGroupId">
          <el-select
            v-model="wxworkAdmin"
            :remote-method="wxworkMethod"
            :loading="wxworkLoading"
            value-key="groupName"
            class="filter-item"
            clearable
            filterable
            remote
            reserve-keyword
            style="width:100%;"
            placeholder="">
            <el-option
              v-for="item in wxworkList"
              :key="item.id"
              :label="item.groupName"
              :value="item"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="二维码有效期">
          <el-date-picker
            v-model="dataForm.wechatGroupExpiredTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"/>
        </el-form-item> -->
        <el-form-item label="自提点">
          <el-row v-for="(item, index) in dataForm.deliveryPoints" :key="index" style="margin-bottom:10px">
            <el-col :span="6" style="padding-right:10px"><el-input v-model="item.contactName" placeholder="请输入联系人"/></el-col>
            <el-col :span="6" style="padding-right:10px"><el-input v-model="item.contactMobile" placeholder="请输入联系电话"/></el-col>
            <el-col :span="6" style="padding-right:10px"><el-input v-model="item.addressDetail" placeholder="请输入自提点地址"/></el-col>
            <el-col :span="6"><el-button type="danger" @click="delDeliveryPoints(index)">删除</el-button></el-col>
          </el-row>
          <el-button @click="addDeliveryPoints">添加自提点</el-button>
        </el-form-item>
        <el-form-item label="接货点联系人" prop="consigneeName">
          <el-input v-model="dataForm.consigneeName" placeholder="请输入接货点联系人"/>
        </el-form-item>
        <el-form-item label="接货点联系电话" prop="consigneeMobile">
          <el-input v-model="dataForm.consigneeMobile" placeholder="请输入接货点联系电话以英文逗号间隔"/>
        </el-form-item>
        <el-form-item label="接货点地址" prop="consigneeAddress">
          <el-input v-model="dataForm.consigneeAddress" placeholder="请输入接货点地址"/>
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
import { uploadPath } from '@/api/storage'
import { listAdmin } from '@/api/admin'
import { listWxwork } from '@/api/wxwork'
import { listCommunity, createCommunity, updateCommunity, deleteCommunity } from '@/api/community'
import { listSubRegion } from '@/api/region'
import { listByType } from '@/api/line'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Community',
  components: { Pagination },
  data() {
    return {
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
      contractOptions: [
        {
          label: '已开通',
          value: true
        },
        {
          label: '未开通',
          value: false
        }
      ],
      uploadPath,
      communityLoading: false,
      communityList: [],
      communityAdmin: '',
      wxworkLoading: false,
      wxworkList: [],
      wxworkAdmin: '',
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        queryEndTime: '',
        queryStartTime: '',
        contract: '',
        page: 1,
        limit: 20,
        name: undefined,
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
      onlineOptions: null,
      offlineOptions: null,
      downloadLoading: false,
      dataForm: {
        deliveryPoints: [],
        consigneeName: undefined,
        consigneeMobile: undefined,
        consigneeAddress: undefined,
        id: undefined,
        name: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
        addressDetail: undefined,
        longitude: undefined,
        latitude: undefined,
        contact: undefined,
        mobile: undefined,
        telephone: undefined,
        status: undefined,
        wechatGroupUrl: '',
        wechatGroupExpiredTime: undefined,
        onlineId: undefined,
        offlineId: undefined
      },
      statusOptions: [{
        value: 1,
        label: '启用'
      }, {
        value: 0,
        label: '禁用'
      }],
      wxCodeImg: '',
      dialogWxCodeVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        /* adminId: [{ required: true, message: '物管人员ID不能为空', trigger: 'blur' }],*/
        name: [{ required: true, message: '社区名称不能为空', trigger: 'blur' }],
        addressDetail: [{ required: true, message: '社区地址不能为空', trigger: 'blur' }],
        /* contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],*/
        /* mobile: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],*/
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        consigneeName: [{ required: true, message: '请输入接货点联系人', trigger: 'blur' }],
        consigneeMobile: [{ required: true, message: '请输入接货点联系电话以英文逗号间隔', trigger: 'blur' }],
        consigneeAddress: [{ required: true, message: '请输入接货点地址', trigger: 'blur' }]
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
    this.getOnlineList()
    this.getOfflineList()
  },
  methods: {
    pickerDateChange() {
      if (this.pickerDate == null) {
        this.listQuery.queryStartTime = ''
        this.listQuery.queryEndTime = ''
      } else {
        this.listQuery.queryStartTime = this.pickerDate[0]
        this.listQuery.queryEndTime = this.pickerDate[1]
      }
    },
    delDeliveryPoints(idx) {
      this.dataForm.deliveryPoints.splice(idx, 1)
    },
    addDeliveryPoints() {
      console.log(this.dataForm)
      this.dataForm.deliveryPoints.push({ contactName: '', contactMobile: '', addressDetail: '' })
    },
    uploadIconUrl(response) {
      this.$set(this.dataForm, 'wechatGroupUrl', response.data.url)
      // this.dataForm.wechatGroupUrl = response.data.url
    },
    communityMethod(query) {
      if (query !== '' && query !== undefined) {
        this.communityLoading = true
        listAdmin({
          username: query,
          type: 2,
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
    wxworkMethod(query) {
      if (query !== '' && query !== undefined) {
        this.wxworkLoading = true
        listWxwork({
          page: 1,
          limit: 20,
          groupName: query,
          sort: 'add_time',
          order: 'desc'
        }).then(response => {
          this.wxworkList = response.data.data.list
          this.wxworkLoading = false
        }).catch(() => {
          this.wxworkList = []
          this.wxworkLoading = false
        })
      } else {
        this.wxworkList = []
      }
    },
    handleChange(value) {
      console.log(value)
    },
    formatStatus(status) {
      for (let i = 0; i < this.statusOptions.length; i++) {
        if (status === this.statusOptions[i].value) {
          return this.statusOptions[i].label
        }
      }
      return ''
    },
    getList() {
      this.listLoading = true
      listCommunity(this.listQuery).then(response => {
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
    getOnlineList() {
      listByType(0).then(response => {
        this.onlineOptions = response.data.data
      }).catch(() => {
        this.onlineOptions = []
      })
    },
    getOfflineList() {
      listByType(1).then(response => {
        this.offlineOptions = response.data.data
      }).catch(() => {
        this.offlineOptions = []
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
        deliveryPoints: [],
        consigneeName: undefined,
        consigneeMobile: undefined,
        consigneeAddress: undefined,
        id: undefined,
        name: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
        addressDetail: undefined,
        longitude: undefined,
        latitude: undefined,
        contact: undefined,
        mobile: undefined,
        telephone: undefined,
        status: undefined,
        wechatGroupUrl: '',
        wechatGroupExpiredTime: undefined
      }
      this.communityList = []
      this.communityAdmin = ''
      this.wxworkList = []
      this.wxworkAdmin = ''
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
          if (this.communityAdmin) {
            this.dataForm.adminId = this.communityAdmin.id
            this.dataForm.adminUserName = this.communityAdmin.username
          } else {
            this.dataForm.adminId = ''
            this.dataForm.adminUserName = ''
          }
          if (this.wxworkAdmin) {
            this.dataForm.weixinWorkGroupId = this.wxworkAdmin.id
            this.dataForm.weixinWorkGroupName = this.wxworkAdmin.groupName
          } else {
            this.dataForm.weixinWorkGroupId = ''
            this.dataForm.weixinWorkGroupName = ''
          }
          createCommunity(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '新建社区成功'
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
    showWxCode(row) {
      this.wxCodeImg = row.shareUrl
      this.dialogWxCodeVisible = true
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      if (row.adminId) {
        this.communityAdmin = { id: row.adminId, username: row.adminUserName }
        this.communityList = [{ id: row.adminId, username: row.adminUserName }]
      } else {
        this.communityAdmin = ''
        this.communityList = []
      }
      if (row.weixinWorkGroupId) {
        this.wxworkAdmin = { id: row.weixinWorkGroupId, groupName: row.weixinWorkGroupName }
        this.wxworkList = [{ id: row.weixinWorkGroupId, groupName: row.weixinWorkGroupName }]
      } else {
        this.wxworkAdmin = ''
        this.wxworkList = []
      }
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
          if (this.communityAdmin) {
            this.dataForm.adminId = this.communityAdmin.id
            this.dataForm.adminUserName = this.communityAdmin.username
          } else {
            this.dataForm.adminId = ''
            this.dataForm.adminUserName = ''
          }
          if (this.wxworkAdmin) {
            this.dataForm.weixinWorkGroupId = this.wxworkAdmin.id
            this.dataForm.weixinWorkGroupName = this.wxworkAdmin.groupName
          } else {
            this.dataForm.weixinWorkGroupId = ''
            this.dataForm.weixinWorkGroupName = ''
          }
          updateCommunity(this.dataForm)
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
                message: '更新社区信息成功'
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
      this.$confirm('确定要删除当前社区吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCommunity(row)
          .then(response => {
            this.$notify.success({
              title: '成功',
              message: '删除社区成功'
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
