<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.presellVo.acStatus" clearable style="width: 200px" class="filter-item" placeholder="请选择预售状态">
        <el-option v-for="type in isStatusOption" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-input v-model="listQuery.presellVo.title" clearable class="filter-item" style="width: 200px;" placeholder="请输入预售标题"/>
      <el-button v-permission="['GET /admin/presell/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/presell/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="标题"  prop="title"/>
      <el-table-column align="center" label="副标题"  prop="subtitle"/>
      <el-table-column align="center" label="开始时间" width="160" prop="startTime"/>
      <el-table-column align="center" label="结束时间"  width="160" prop="endTime"/>
      <el-table-column align="center" label="状态" width="80"  prop="acStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.acStatus == 0">未开始</span>
          <span v-if="scope.row.acStatus == 1">已开始</span>
          <span v-if="scope.row.acStatus == 2">已结束</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配送日期" width="120" prop="deliveryTime"/>
      <el-table-column align="center" fixed ="right" label="操作" width="270" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/zcmpresell/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/zcmpresell/update']" type="primary" size="small" @click="handleItemGoods(scope.row)">编辑预售物品</el-button>
          <el-button v-permission="['POST /admin/zcmpresell/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title"/>
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="dataForm.subtitle"/>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="dataForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="请选择开始日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="dataForm.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="请选择结束日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="配送日期" prop="deliveryTime">
          <el-date-picker
            v-model="dataForm.deliveryTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择配送日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动状态" prop="acStatus">
          <el-select v-model="dataForm.acStatus"  placeholder="请选择预售状态">
            <el-option v-for="type in isStatusOption" :key="type.value" :label="type.label" :value="type.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="标题图片" prop="url">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.url" :src="dataForm.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
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
.filter-item{
  margin-left: 100px;
}
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
import { getPresellListByParam, deletePresellById, saveOrUpdatePresell} from '@/api/goods'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Presell',
  components: { Pagination },
  data() {
    return {
      isStatusOption: [
        {
          label: '未开始',
          value: 0
        },
        {
          label: '已开始',
          value: 1
        },
        {
          label: '已结束',
          value: 2
        }
      ],
      uploadPath,
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        presellVo: {},
      },
      dataForm: {
        id: undefined,
        name: '',
        keywords: '',
        level: 'L2',
        pid: 0,
        desc: '',
        iconUrl: '',
        picUrl: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },

      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        startTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }],
        deliveryTime: [{ required: true, message: '配送日期不能为空', trigger: 'blur' }]
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
    getList() {
      this.listLoading = true;
      getPresellListByParam(this.listQuery.presellVo,this.listQuery.page,this.listQuery.limit).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.total;
        this.listLoading = false
      }).catch(() => {
        this.list = [];
        this.total = 0;
        this.listLoading = false
      })
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        title: '',
        subtitle: '',
        startTime: undefined,
        endTime: undefined,
        acStatus: 0,
        url: ''
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
    uploadUrl: function(response) {
      this.dataForm.url = response.data.url
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          saveOrUpdatePresell(this.dataForm)
            .then(response => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '创建成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
        this.getList();
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
          saveOrUpdatePresell(this.dataForm).then(() => {
              this.dialogFormVisible = false
              this.getList();
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            }).catch(response => {
            this.getList();
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
      this.getList();
    },
    handleDelete(row) {
      deletePresellById(row.id).then(response => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },

    handleItemGoods(row) {
      this.$router.push({ path: '/goods/presellItems', query: { id: row.id }})
    },
  }
}
</script>
