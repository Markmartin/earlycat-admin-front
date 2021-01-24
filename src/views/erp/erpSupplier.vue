<template>
  <div class="app-container">
    <el-form :inline="true" :model="erpSupplierVo" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="erpSupplierVo.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="erpSupplierVo.phone" placeholder="电话" clearable></el-input>
      </el-form-item>
      <el-button type="primary" @click="listSupplier" v-permission="['POST /admin/erp/supplier/list']">查询</el-button>
      <el-button type="primary" @click="handleCreate" v-permission="['POST /admin/erp/supplier/saveOrUpdate']">新增
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
        <template slot-scope="scope">{{ scope.row.contacts }}</template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column label="纳税人识别号" align="center">
        <template slot-scope="scope">{{ scope.row.taxNum }}</template>
      </el-table-column>
      <el-table-column label="银行账号" align="center">
        <template slot-scope="scope">{{ scope.row.bankAccount }}</template>
      </el-table-column>
      <el-table-column label="开户行" align="center">
        <template slot-scope="scope">{{ scope.row.bank }}</template>
      </el-table-column>
      <el-table-column label="税率" align="center">
        <template slot-scope="scope">{{ scope.row.taxRate }}</template>
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
            <el-button v-permission="['POST /admin/erp/supplier/saveOrUpdate']" type="primary" size="mini"
                       @click="handleEdit(scope.row)">编辑
            </el-button>
          </p>
          <p>
            <el-button v-permission="['GET /admin/erp/supplier/delete']" type="danger" size="mini"
                       @click="handleDelete(scope.row)">删除
            </el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="params.page" :limit.sync="params.limit"
                @pagination="listSupplier"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
          <el-input v-model="dataForm.address"/>
        </el-form-item>
        <el-form-item label="联系人：" prop="contacts">
          <el-input v-model="dataForm.contacts"/>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="dataForm.phone"/>
        </el-form-item>
        <el-form-item label="座机号：" prop="telephone">
          <el-input v-model="dataForm.telephone"/>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="dataForm.email"/>
        </el-form-item>
        <el-form-item label="纳税人识别号：" prop="taxNum">
          <el-input v-model="dataForm.taxNum"/>
        </el-form-item>
        <el-form-item label="银行账号：" prop="bankAccount">
          <el-input v-model="dataForm.bankAccount"/>
        </el-form-item>
        <el-form-item label="开户行：" prop="bank">
          <el-input v-model="dataForm.bank"/>
        </el-form-item>
        <el-form-item label="税率：" prop="taxRate">
          <el-input v-model="dataForm.taxRate"/>
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
  import {listSupplier, saveOrUpdate, deleteSupplier} from "@/api/erp/supplier";
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
        erpSupplierVo: {
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
      this.listSupplier();
    },
    methods: {
      listSupplier() {
        this.listLoading = true
        listSupplier(this.erpSupplierVo, this.params.page, this.params.limit).then(response => {
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
        deleteSupplier({id: row.id}).then(response => {
          this.listSupplier();
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        }).catch(response => {
          this.listSupplier();
          this.$notify.error({
            title: '移除失败',
            message: response.data.errmsg
          })
        })
      },

      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        const data = {
          id: undefined,
          name: undefined,
          address: undefined,
          principal: undefined,
          phone: undefined
        };
        this.dataForm = data;
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
        debugger
        saveOrUpdate(data).then(() => {
          this.dialogFormVisible = false
          this.listSupplier()
          this.$notify.success({
            title: '成功',
            message: '操作成功！'
          })
        }).catch(response => {
          this.listSupplier()
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
