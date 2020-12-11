<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button v-permission="['POST /admin/presell/create']" class="filter-item" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="类型" min-width="100" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">满赠</span>
          <span v-if="scope.row.type == 2">买A赠B</span>
          <span v-if="scope.row.type == 3">新用户赠送</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type ===1" align="center" label="达标金额（元）" min-width="100" prop="limitAmount"/>
      <el-table-column v-if="type ===4" align="center" label="立减金额（元）" min-width="100" prop="reduceAmount"/>
      <el-table-column v-if="type ===2" align="center" label="购买物品名称" min-width="100" prop="buyGoodsVo.title"/>
      <el-table-column v-if="type===2" align="center" label="购买物品规格" min-width="100" prop="buyGoodsVo.onlineSpec"/>
      <el-table-column v-if="type === 2" align="center" label="购买数量" min-width="100" prop="buyNum"/>
      <el-table-column align="center" label="满赠物品名称" min-width="100" prop="givingGoodsVo.title"/>
      <el-table-column align="center" label="满赠物品规格" min-width="100" prop="givingGoodsVo.onlineSpec"/>
      <el-table-column align="center" label="赠送数量" min-width="100" prop="giveNum"/>
      <el-table-column align="center" label="是否可叠加" min-width="100" prop="isSuperposition">
        <template slot-scope="scope">
          <el-switch
            @change="handleIsSuperpositionChange(scope.row)"
            :active-value="true"
            :inactive-value="false"
            v-model="scope.row.isSuperposition">
          </el-switch>
        </template>
      </el-table-column>
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
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="规则类型" prop="type">
          <el-select v-model="dataForm.type" placeholder="规则类型">
            <el-option v-for="type in discountOption" :key="type.value" :label="type.label" :value="type.value"
                       disabled/>
          </el-select>
        </el-form-item>
        <el-form-item label="达标金额" prop="limitAmount" v-show="dataForm.type === 1">
          <el-input v-model="dataForm.limitAmount" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="立减金额" prop="reduceAmount" v-show="dataForm.type === 4">
          <el-input v-model="dataForm.reduceAmount" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.buyGoodsVo != null && dataForm.buyGoodsVo != undefined && dataForm.type ===2 "
                      label="购买物品" prop="buyGoodsVo">
          <el-select v-model="dataForm.buyGoodsVo.id" placeholder="购买物品">
            <el-option v-for="item in buyGoods" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataForm.buyGoodsVo != null && dataForm.buyGoodsVo != undefined && dataForm.type ===2 "
                      label="购买数量" prop="buyNum">
          <el-input v-model="dataForm.buyNum"/>
        </el-form-item>
        <el-form-item label="赠送物品" prop="givingGoodsId">
          <el-select v-model="dataForm.givingGoodsVo.id" placeholder="赠送物品">
            <el-option v-for="item in givingGoods" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="赠送数量" prop="giveNum">
          <el-input v-model="dataForm.giveNum"/>
        </el-form-item>
        <el-form-item label="是否叠加" prop="isSuperposition">
          <el-radio-group v-model="dataForm.isSuperposition">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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
import {getPressGoodsList,queryParmList} from '@/api/goods'
import {getZcmActivitySpecList, saveOrUpdateZcmActivitySpec, deleteZcmActivitySpecById} from '@/api/discountRule'
import {getToken} from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'discountRuleDetail',
  components: {Pagination},
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
      type: undefined,
      list: [],
      buyGoods:[],
      givingGoods:[],
      presellGoodsList: [],
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        activitySpecVo: {id: undefined}
      },
      dataForm: {
        buyGoodsVo: {id: undefined},
        givingGoodsVo: {id: undefined}
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      activitySpecVo: {
        id: undefined,
        isSuperposition: undefined
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
    goodsShow() {
      return this.dataForm.type === 2
    },
    limitAmountShow() {
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
      this.type = this.$route.query.type
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
      queryParmList(acstatus).then(response => {
        this.buyGoods = response.data.data.goodsVos;
        this.givingGoods = response.data.data.givingGoodsVos;
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
      this.dataForm.type = this.$route.query.type
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
    handleIsSuperpositionChange(row) {
      this.activitySpecVo.id = row.id
      this.activitySpecVo.isSuperposition = row.isSuperposition;
      saveOrUpdateZcmActivitySpec(this.activitySpecVo).then(() => {
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
