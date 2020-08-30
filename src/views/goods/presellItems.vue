<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button v-permission="['POST /admin/presell/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加预售物品</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="线上名称"  min-width="100"  prop="goodsVo.onlineName"/>
      <el-table-column align="center" label="线上价格"  min-width="100"  prop="goodsVo.onlinePrice"/>
      <el-table-column align="center" label="线上规格"  min-width="100"  prop="goodsVo.onlineSpec"/>
      <el-table-column align="center" label="线下名称"  min-width="100"  prop="goodsVo.offlineName"/>
      <el-table-column align="center" label="线下价格"  min-width="100"  prop="goodsVo.offlinePrice"/>
      <el-table-column align="center" label="线下规格"  min-width="100"  prop="goodsVo.offlineSpec"/>
      <el-table-column align="center" label="库存"  min-width="100"  prop="goodsVo.stock"/>
      <el-table-column align="center" fixed ="right" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/zcmpresell/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">替换</el-button>
          <el-button v-permission="['POST /admin/zcmpresell/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="init" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="活动状态" prop="acStatus">
          <el-select v-model="dataForm.goodsId"  placeholder="请选择预售状态">
            <el-option v-for="item in presellGoodsList" :key="item.id" :label="item.name" :value="item.id"/>
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
  import { deletePresellItemById, saveOrUpdatePresellItem, getPressGoodsList ,saveOrUpdatePresell,getPresellItemList} from '@/api/goods'
  import { getToken } from '@/utils/auth'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'Presell',
    components: { Pagination },
    data() {
      return {
        selectDate:'',
        list: [],
        presellGoodsList: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
        },
        dataForm: {},
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          name: [{ required: true, message: '类目名不能为空', trigger: 'blur' }]
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
      this.init()
      this.getPressGoodsList()
    },
    methods: {
      init() {
        if (this.$route.query.id == null) {
          return
        }
        this.listQuery.id = this.$route.query.id;
        this.listLoading = true
          getPresellItemList(this.listQuery.id,this.listQuery.page,this.listQuery.limit).then(response => {
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
        let acstatus = 1 ;
        getPressGoodsList(acstatus).then(response => {
          this.presellGoodsList = response.data.data.list
        })
      },

      resetForm() {
        this.dataForm = {
          id: undefined,
          presellId: '',
          sort: '',
          goodsId: undefined,
        }
      },
      handleCreate() {
        this.resetForm()
        this.dataForm.presellId= this.$route.query.id;
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            debugger
            saveOrUpdatePresellItem(this.dataForm).then(response => {
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
          this.init();
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
        debugger
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            saveOrUpdatePresellItem(this.dataForm).then(() => {
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '替换成功'
              })
            }).catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
          }
        })
        this.init();
      },
      handleDelete(row) {
        deletePresellItemById(row.id).then(response => {
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
