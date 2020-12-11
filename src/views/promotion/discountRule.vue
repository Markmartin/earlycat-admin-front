<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
<!--      <el-button v-permission="['POST /admin/presell/create']" class="filter-item" type="primary" icon="el-icon-edit"-->
<!--                 @click="handleCreate">添加-->
<!--      </el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="规则标题" prop="title"/>
      <el-table-column align="center" label="规则副标题" prop="subtitle"/>
      <el-table-column align="center" label="规则类型" min-width="100" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">满赠</span>
          <span v-if="scope.row.type == 2">买A赠B</span>
          <span v-if="scope.row.type == 3">新用户赠送</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启用状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status ? '启用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" width="60" prop="sort"/>
      <el-table-column align="center" fixed="right" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if=" scope.row.status == 0" v-permission="['POST /admin/zcmpresell/update']" type="warning" size="mini" @click="handChangeStatus(scope.row)">
            启用
          </el-button>
          <el-button v-if=" scope.row.status == 1" v-permission="['POST /admin/zcmpresell/update']" type="danger" size="mini" @click="handChangeStatus(scope.row)">
            停用
          </el-button>
<!--          <el-button v-permission="['POST /admin/zcmpresell/update']" type="primary" size="mini"-->
<!--                     @click="handleUpdate(scope.row)">编辑-->
<!--          </el-button>-->
          <el-button v-permission="['POST /admin/zcmpresell/update']" type="primary" size="mini"
                     @click="handleItemGoods(scope.row)">详细
          </el-button>
<!--          <el-button v-permission="['POST /admin/zcmpresell/delete']" type="danger" size="mini"-->
<!--                     @click="handleDelete(scope.row)">删除-->
<!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title"/>
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="dataForm.subtitle"/>
        </el-form-item>
        <el-form-item label="规则类型" prop="type">
          <el-select v-model="dataForm.type" placeholder="赠送物品">
            <el-option v-for="type in discountOption" :key="type.value" :label="type.label" :value="type.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort"/>
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
  .filter-item {
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
  import { getZcmActivityList, saveOrUpdateZcmActivity, deleteZcmActivityById } from '@/api/discountRule'
  import { getToken } from '@/utils/auth'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'discountRule',
    components: { Pagination },
    data() {
      return {
        discountOption: [
          {
            label: '满赠',
            value: 1
          },
          {
            label: '买A赠B',
            value: 2
          },
          {
            label: '新用户赠送',
            value: 3
          }
        ],
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          activityVo: {}
        },
        activityVo: {},
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
          title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
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
        this.listLoading = true
        getZcmActivityList(this.listQuery.activityVo, this.listQuery.page, this.listQuery.limit).then(response => {
          this.list = response.data.data
          this.total = response.data.data.length
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      resetForm() {
        this.dataForm = {
          id: undefined,
          title: '',
          subtitle: '',
          isCoupons: undefined,
          isCouponsAdd: undefined,
          status: 0,
          sort: ''
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
            saveOrUpdateZcmActivity(this.dataForm).then(response => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '创建成功'
              })
            }).catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
          }
          this.getList()
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handChangeStatus(row) {
        this.activityVo.id = row.id
        let msg = ''
        if (row.status == 1) {
          this.activityVo.status = 0
          msg = '停用'
        } else {
          this.activityVo.status = 1
          msg = '启用'
        }
        saveOrUpdateZcmActivity(this.activityVo).then(() => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify.success({
            title: '成功',
            message: msg + '成功'
          })
        }).catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
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
            saveOrUpdateZcmActivity(this.dataForm).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify.success({
                title: '成功',
                message: '更新成功'
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
      handleDelete(row) {
        deleteZcmActivityById(row.id).then(response => {
          this.getList()
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
        this.$router.push({ path: '/promotion/discountRuleDetail', query: { id: row.id, type: row.type } })
      }
    }
  }
</script>
