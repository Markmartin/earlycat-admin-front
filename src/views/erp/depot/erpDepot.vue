<template>
  <div class="app-container">
    <el-form :inline="true" :model="erpDepotVo" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="erpDepotVo.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="erpDepotVo.phone" placeholder="电话" clearable></el-input>
      </el-form-item>
      <el-button type="primary" @click="listDepot" v-permission="['POST /admin/erp/depot/list']">查询</el-button>
      <el-button type="primary" @click="handleCreate" v-permission="['POST /admin/erp/depot/saveOrUpdate']">新增
      </el-button>
    </el-form>

    <el-table v-loading="listLoading" :data="list" style="width: 100%" border :row-style="{ height: '1px' }"
              :cell-style="{ padding: '5px' }">
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <el-table-column label="联系人" align="center">
        <template slot-scope="scope">{{ scope.row.principal }}</template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="启用状态" align="center">
        <template slot-scope="scope">
          <el-switch
            @change="changeData(scope.row)"
            :active-value="true"
            :inactive-value="false"
            v-model="scope.row.enable">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template slot-scope="scope">{{ scope.row.user }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <p>
            <el-button v-permission="['POST /admin/erp/depot/saveOrUpdate']" type="primary" size="mini"
                       @click="handleEdit(scope.row)">编辑
            </el-button>
          </p>
          <p>
            <el-button v-permission="['GET /admin/erp/depot/saveOrUpdate']" type="danger" size="mini"
                       @click="handleDelete(scope.row)">删除
            </el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="params.page" :limit.sync="params.limit"
                @pagination="listDepot"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="仓库名称：" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="仓库地址：" prop="address">
          <el-input v-model="dataForm.address"/>
        </el-form-item>
        <el-form-item label="联系人电话：" prop="phone">
          <el-input v-model="dataForm.phone"/>
        </el-form-item>
        <el-form-item label="联系人：" prop="principal">
          <el-input v-model="dataForm.principal"/>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
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

<script>
import {listDepot, saveOrUpdate, deleteDepot} from "@/api/erp/depot";
import Pagination from "@/components/Pagination";

export default {
  components: {Pagination},
  data() {
    return {
      listLoading: true,
      list: [],
      params: {
        page: 1,
        limit: 10,
      },
      erpDepotVo: {
        id: undefined
      },
      total: 0,
      categorys: {},
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogStatus: '',
      dataForm: {
        id: undefined,
        name: undefined,
        address: undefined,
        principal: undefined,
        phone: undefined
      },

      rules: {
        name: [{required: true, message: '标题不能为空', trigger: 'blur'}],
        address: [{required: true, message: '开始时间不能为空', trigger: 'blur'}]
      }
    };
  },
  created() {
    this.listDepot();
  },
  methods: {
    listDepot() {
      this.listLoading = true
      listDepot(this.erpDepotVo, this.params.page, this.params.limit).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleDelete(row) {
      deleteSupplier({id: row.id}).then((res) => {
        this.listSupplier();
      });
    },

    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleEdit(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    saveOrUpdate(data) {
      saveOrUpdate(data).then(() => {
        this.dialogFormVisible = false
        this.listDepot()
        this.$notify.success({
          title: '成功',
          message: '更新成功'
        })
      }).catch(response => {
        this.listDepot()
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },

    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.saveOrUpdate(this.dataForm);
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.saveOrUpdate(this.dataForm);
        }
      })
    },

    changeData(data) {
      this.saveOrUpdate(data);
    }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
