<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入总代名称"
      />
      <el-button
        v-permission="['GET /admin/agent/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button
      >
      <el-button
        v-permission="['POST /admin/agent/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加
      </el-button
      >
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        width="100px"
        label="ID"
        prop="id"
        sortable
      />
      <el-table-column
        align="center"
        label="总代名称"
        min-width="120px"
        prop="name"
      />

      <el-table-column
        align="center"
        label="可提现余额"
        min-width="120px"
        prop="remainingIncome"
      />

      <el-table-column
        align="center"
        label="累积收益"
        min-width="120px"
        prop="totalIncome"
      />

      <el-table-column
        align="center"
        label="累积提现"
        min-width="120px"
        prop="totalWithdrawalIncome"
      />

      <el-table-column align="center" label="银行卡列表" prop="list">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showBankList(scope.row)"
          >银行卡列表
          </el-button
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="推广员列表" prop="list">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showUserList(scope.row)"
          >推广员列表
          </el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="创建时间"
        min-width="120px"
        prop="addTime"
        sortable
      />

      <el-table-column
        align="center"
        label="操作"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/agent/update']"
                     type="primary" size="mini" @click="handleUpdate(scope.row)">编辑
          </el-button
          >
          <el-button
            v-permission="['POST /admin/agent/delete']"
            type="danger" size="mini" @click="handleDelete(scope.row)">删除
          </el-button
          >
          <el-button v-permission="['POST /admin/agent/withdraw']" type="primary" size="mini"
                     @click="handleWithdraw(scope.row)">提现
          </el-button>
          <el-button v-permission="['POST /admin/agent/addPromoter']" type="primary" size="small"
                     @click="handleAddPromoter(scope.row)">添加推广
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--银行卡列表 -->
    <el-dialog :visible.sync="strategyDialogVisible" title="银行卡列表">
      <el-form label-width="100px">
        <el-table
          :data="bankList"
          element-loading-text="正在查询中。。。"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="收款方银行卡号" min-width="120px" prop="encBankNo"/>
          <el-table-column align="center" label="收款方用户名" min-width="120px" prop="encTrueName"/>
          <el-table-column align="center" label="收款方开户行" min-width="120px" prop="bankName"/>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="strategyDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--推广员列表 -->
    <el-dialog :visible.sync="userListDialogVisible" title="推广员列表">
      <el-form label-width="100px">
        <el-table
          :data="userList"
          element-loading-text="正在查询中。。。"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="昵称" prop="nickname">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" width="20"> {{scope.row.nickname}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号码" prop="mobile"/>
          <el-table-column align="center" label="性别" prop="gender">
            <template slot-scope="scope">
              <el-tag>{{ genderDic[scope.row.gender] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册时间" prop="addTime"/>

          <el-table-column align="center" label="操作" min-width="50"  class-name="small-padding fixed-width" >
            <template slot-scope="scope">
              <el-button
                type="danger" size="mini" @click="handleDeletePromoter(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userListDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--添加或编辑-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item label="总代名称" prop="name"
                      :rules="[
                      { required: true, message: '请输入总代名称', trigger: 'blur' }]">
          <el-col :span="12">
            <el-input v-model="dataForm.name"/>
          </el-col>
        </el-form-item>

        <el-form-item
          v-for="(detail, index) in dataForm.list"
          :label="'银行卡信息' + index"
          :key="detail.key"
          :prop="'list.' + index + '.name'"
        >
          <el-col :span="6">
            <el-input v-model="detail.encBankNo" placeholder="收款方银行卡号"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input v-model="detail.encTrueName" placeholder="收款方用户名"></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="detail.bankCode" placeholder="收款方开户行">
              <el-option
                v-for="item in bankCodeList"
                :key="item.bankCode"
                :label="item.bankName"
                :value="item.bankCode">
              </el-option>
            </el-select>
          </el-col>
          <el-button @click.prevent="removeDomain(detail)">删除</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="addDomain">新增</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="createData"
        >确定
        </el-button
        >
        <el-button v-else type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>


    <!-- 提现对话框 -->
    <el-dialog :visible.sync="withdrawDialogVisible" title="提现申请">
      <el-form ref="withdrawForm" :model="withdrawForm" status-icon label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="提现金额" prop="withdrawMoney">
          <el-input v-model="withdrawForm.withdrawMoney" type="number"/>
        </el-form-item>

        <el-form-item label="提现到银行卡" prop="agentBankId">
          <el-select v-model="withdrawForm.agentBankId" placeholder="请选择银行卡">
            <el-option
              v-for="item in withdrawForm.agentBankList"
              :key="item.id"
              :label="item.encBankNo + '|' + item.bankName + '|' + item.encTrueName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="withdrawDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmWithdraw">确定</el-button>
      </div>
    </el-dialog>

    <!-- 添加推广员对话框 -->
    <el-dialog :visible.sync="addPromoterDialogVisible" title="添加推广员">
      <el-form ref="addPromoterForm" :model="addPromoterForm" status-icon label-position="left" label-width="100px"
               class="demo-dynamic">

        <el-form-item
          v-for="(detail, index) in addPromoterForm.promoterList"
          :label="'推广员' + index"
          :key="detail.key"
          :prop="'list.' + index + '.name'"
        >
          <el-col :span="10">
            <el-select v-model="detail.strategyGroupId" placeholder="策略组">
              <el-option
                v-for="item in strategyGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input v-model="detail.mobile" placeholder="请输入手机号"/>
          </el-col>
          <el-button @click.prevent="removeAddPromoterDomain(detail)">删除</el-button>
        </el-form-item>


        <el-form-item>
          <el-button @click="addPromoterDomain">新增</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPromoterDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddPromoter">确定</el-button>
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

</style>

<script>
  import {apiBankCodeList, apiList, apiCreate, apiUpdate, apiDelete, apiWithdraw, apiAddPromoter, apiDeletePromoter} from "@/api/agent";
  import { apiListAll } from '@/api/strategy';
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "agent",
    components: {Pagination},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        dialogStatus: "",
        downloadLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          sort: "add_time",
          order: "desc"
        },
        dataForm: {
          name: "",
          list: [{
            encBankNo: '',
            encTrueName: '',
            bankCode: ''
          }]
        },
        withdrawForm: {
          agentId: undefined,
          agentBankId: undefined,
          withdrawMoney: undefined,
          agentBankList: []
        },
        addPromoterForm: {
          agentId: undefined,
          promoterList: [{
            strategyGroupId: undefined,
            mobile: undefined,
          }]
        },
        maxWithdrawMoney: 0,
        textMap: {
          update: "编辑",
          create: "创建"
        },
        genderDic: ['未知', '男', '女'],
        dialogFormVisible: false,
        strategyDialogVisible: false,
        userListDialogVisible: false,
        withdrawDialogVisible: false,
        addPromoterDialogVisible: false,
        bankList: null,
        userList: null,
        bankCodeList: [],
        strategyGroupList: [],
      };
    },
    created() {
      this.getList();
      this.getBankCodeList();
      this.getStrategyGroupList();
    },

    methods: {
      showBankList(row) {
        this.bankList = row.list;
        this.strategyDialogVisible = true;
      },
      showUserList(row) {
        this.userList = row.userList;
        this.userListDialogVisible = true;
      },
      getList() {
        this.listLoading = true;
        apiList(this.listQuery)
          .then(response => {
            this.list = response.data.data.list;
            this.total = response.data.data.total;
            this.listLoading = false;
          })
          .catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          });
      },
      getBankCodeList() {
        apiBankCodeList()
          .then(response => {
            this.bankCodeList = response.data.data;
          })
          .catch(() => {
            this.bankCodeList = [];
          });
      },
      getStrategyGroupList() {
        apiListAll().then(response => {
          this.strategyGroupList = response.data.data.list
        }).catch(() => {
          this.strategyGroupList = []
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleCreate() {
        this.resetForm();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      handleUpdate(row) {
        this.dataForm = Object.assign({}, row);
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      handleDelete(row) {
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            apiDelete(row)
              .then(response => {
                this.$notify.success({
                  title: "成功",
                  message: "删除成功"
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              })
              .catch(response => {
                this.$notify.error({
                  title: "失败",
                  message: response.data.errmsg
                });
              });
          })
          .catch(() => {
          });
      },
      handleDeletePromoter(row) {
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            apiDeletePromoter(row)
              .then(response => {
                this.$notify.success({
                  title: "成功",
                  message: "删除成功"
                });
                const index = this.userList.indexOf(row);
                this.userList.splice(index, 1);
              })
              .catch(response => {
                this.$notify.error({
                  title: "失败",
                  message: response.data.errmsg
                });
              });
          })
          .catch(() => {
          });
      },
      resetForm() {
        this.dataForm = {
          name: "",
          list: [{
            encBankNo: '',
            encTrueName: '',
            bankCode: ''
          }]
        };
        this.addPromoterForm = {
          agentId: '',
          promoterList: [{
            strategyGroupId: '',
            mobile: '',
          }]
        }
      },
      createData() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            apiCreate(this.dataForm)
              .then(response => {
                this.getList();
                this.dialogFormVisible = false;
                this.$notify.success({
                  title: "成功",
                  message: "新建成功"
                });
              })
              .catch(response => {
                this.$notify.error({
                  title: "失败",
                  message: response.data.errmsg
                });
              });
          }
        });
      },
      updateData() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            apiUpdate(this.dataForm)
              .then(() => {
                for (const v of this.list) {
                  if (v.id === this.dataForm.id) {
                    const index = this.list.indexOf(v);
                    this.list.splice(index, 1, this.dataForm);
                    break;
                  }
                }
                this.getList();
                this.dialogFormVisible = false;
                this.$notify.success({
                  title: "成功",
                  message: "更新成功"
                });
              })
              .catch(response => {
                this.$notify.error({
                  title: "失败",
                  message: response.data.errmsg
                });
              });
          }
        });
      },
      removeDomain(item) {
        var index = this.dataForm.list.indexOf(item)
        if (index !== -1) {
          this.dataForm.list.splice(index, 1)
        }
      },
      addDomain() {
        this.dataForm.list.push({
          encBankNo: '',
          encTrueName: '',
          bankCode: '',
          key: Date.now()
        });
      },
      removeAddPromoterDomain(item) {
        var index = this.addPromoterForm.promoterList.indexOf(item)
        if (index !== -1) {
          this.addPromoterForm.promoterList.splice(index, 1)
        }
      },
      addPromoterDomain() {
        this.addPromoterForm.promoterList.push({
          strategyGroupId: '',
          mobile: '',
          key: Date.now()
        });
      },
      handleWithdraw(row) {
        this.withdrawForm.agentId = row.id
        this.maxWithdrawMoney = JSON.parse(JSON.stringify(row.remainingIncome))
        this.withdrawForm.withdrawMoney = row.remainingIncome
        this.withdrawForm.agentBankList = row.list

        this.withdrawDialogVisible = true
        this.$nextTick(() => {
          this.$refs['withdrawForm'].clearValidate()
        })
      },
      confirmWithdraw() {
        this.$refs['withdrawForm'].validate((valid) => {
          if (valid) {
            if (this.withdrawForm.withdrawMoney > this.maxWithdrawMoney) {
              this.$notify.error({
                title: '失败',
                message: '不能大于可提现金额'
              })
              return false
            }
            apiWithdraw(this.withdrawForm).then(response => {
              this.withdrawDialogVisible = false
              this.$notify.success({
                title: '成功',
                message: '申请提现成功'
              })
              this.getList()
            }).catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
          }
        })
      },

      confirmAddPromoter() {
          apiAddPromoter(this.addPromoterForm).then(response => {
            this.getList()
            this.addPromoterDialogVisible = false
            this.$notify.success({
              title: '成功',
              message: '添加推广员成功'
            })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
      },
      handleAddPromoter(row) {
        this.resetForm();
        this.addPromoterForm.agentId = row.id
        this.addPromoterDialogVisible = true
        this.$nextTick(() => {
          this.$refs['addPromoterForm'].clearValidate()
        })
      },
    }
  };
</script>
