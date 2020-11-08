<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button v-permission="['POST /admin/presell/create']" class="filter-item" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加预售物品
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="类型" min-width="100" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">无优惠</span>
          <span v-if="scope.row.type == 1">满减优惠</span>
          <span v-if="scope.row.type == 2">满赠优惠</span>
          <span v-if="scope.row.type == 3">免邮优惠</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="达标金额" min-width="100" prop="limitAmount"/>
      <el-table-column align="center" label="立减金额" min-width="100" prop="reduceAmount"/>
      <el-table-column align="center" label="满赠物品名称" min-width="100" prop="goodsVo.offlineName"/>
      <el-table-column align="center" label="满赠物品规格" min-width="100" prop="goodsVo.offlineSpec"/>
      <el-table-column align="center" label="物品数量" min-width="100" prop="count"/>
      <el-table-column align="center" fixed="right" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/zcmpresell/update']" type="primary" size="mini"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-permission="['POST /admin/zcmpresell/delete']" type="danger" size="mini"
                     @click="handleDelete(scope.row)">移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="init"/>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="规则类型" prop="type">
          <el-select v-model="dataForm.type" placeholder="赠送物品">
            <el-option v-for="type in discountOption" :key="type.value" :label="type.label" :value="type.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="达标金额" prop="limitAmount" v-show ="dataForm.type === 1 || dataForm.type === 2 || dataForm.type === 3 ">
          <el-input v-model="dataForm.limitAmount" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="立减金额" prop="reduceAmount" v-show ="dataForm.type === 1">
          <el-input v-model="dataForm.reduceAmount" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="赠送物品" prop="goodsId" v-show ="dataForm.type === 2">
          <el-select v-model="dataForm.goodsId" placeholder="赠送物品">
            <el-option v-for="item in presellGoodsList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="count" v-show ="dataForm.type === 1 || dataForm.type === 2 || dataForm.type === 3 ">
          <el-input v-model="dataForm.count"/>
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
  import { getPressGoodsList } from '@/api/goods'
  import { getZcmActivitySpecList, saveOrUpdateZcmActivitySpec, deleteZcmActivitySpecById } from '@/api/discountRule'
  import { getToken } from '@/utils/auth'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'discountRuleDetail',
    components: { Pagination },
    data() {
      return {
        discountOption: [
          {
            label: '无优惠',
            value: 0
          },
          {
            label: '满减优惠',
            value: 1
          },
          {
            label: '满赠优惠',
            value: 2
          },
          {
            label: '免邮优惠',
            value: 3
          }
        ],
        list: [],
        presellGoodsList: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          activitySpecVo: { id: undefined }
        },
        dataForm: {},
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          // type: [{ required: true, message: '规则类型不能为空', trigger: 'blur' }],
          // limitAmount: [{ required: true, message: '达标金额不能为空', trigger: 'blur' }],
          // goodsId: [{ required: this.goodsShow, message: '赠送物品不能为空', trigger: 'blur' }],
          // reduceAmount: [{ required: this.limitAmountShow, message: '立减金额不能为空', trigger: 'blur' }]
        }
      }
    },
    computed: {
      headers() {
        return {
          'X-Wali-Token': getToken()
        }
      },
      goodsShow(){
        return this.dataForm.type === 2
      },
      limitAmountShow(){
        return dataForm.type === 1
      }
    },
    created() {
      this.init()
      this.getPressGoodsList()
    },
    methods: {
      init() {
        if (this.$route.query.id == null) {
          return
        }
        this.listQuery.activitySpecVo.acId = this.$route.query.id
        this.listLoading = true
        getZcmActivitySpecList(this.listQuery.activitySpecVo, this.listQuery.page, this.listQuery.limit).then(response => {
          this.list = response.data.data
          this.total = response.data.data.length
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getPressGoodsList() {
        let acstatus = 3 // 赠送物品
        getPressGoodsList(acstatus).then(response => {
          this.presellGoodsList = response.data.data.list
        })
      },

      resetForm() {
        this.dataForm = {
          id: undefined,
          presellId: '',
          sort: '',
          goodsId: undefined
        }
      },
      handleCreate() {
        this.resetForm()
        this.dataForm.acId = this.$route.query.id
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            saveOrUpdateZcmActivitySpec(this.dataForm).then(response => {
              this.init()
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
          this.init()
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.init()
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
            saveOrUpdateZcmActivitySpec(this.dataForm).then(() => {
              this.dialogFormVisible = false
              this.init()
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
        this.init()
      },
      handleDelete(row) {
        deleteZcmActivitySpecById(row.id).then(response => {
          this.$notify({
            title: '移除成功',
            message: '移除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(response => {
          this.$notify.error({
            title: '移除失败',
            message: response.data.errmsg
          })
        })
      }
    }
  }
</script>
