<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入策略组名称"
      />
      <el-button
        v-permission="['GET /admin/strategy/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >查找</el-button
      >
      <el-button
        v-permission="['GET /admin/strategy/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >添加</el-button
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
        label="策略组名称"
        min-width="120px"
        prop="name"
      />

      <el-table-column align="center" label="策略列表" prop="list">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showStrategyList(scope.row)"
          >策略列表</el-button
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
          <el-button
            v-permission="['POST /admin/strategy/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-permission="['POST /admin/strategy/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
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

     <!--策略列表 -->
    <el-dialog :visible.sync="strategyDialogVisible" title="策略列表">
      <el-form label-width="100px">
        <el-table
          :data="strategyList"
          element-loading-text="正在查询中。。。"
          border
          fit
          highlight-current-row
        >
          <el-table-column
            align="center"
            label="策略名称"
            min-width="120px"
            prop="name"
          />
          <el-table-column  align="center" label="奖励类型"  min-width="120px"  prop="type"  >
            <template slot-scope="scope">
              <el-tag :type="scope.row.type ? 'success' : 'error'">{{
                scope.row.type ? "复购" : "首单"
                }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" label="奖励金额" min-width="120px" prop="amount" >
            <template slot-scope="scope">
              <p v-if="scope.row.type== 0">{{scope.row.amount}} 元</p>
              <p v-if="scope.row.type== 1">{{scope.row.amount}} %</p>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="strategyDialogVisible = false">取消</el-button>
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
        <el-form-item label="策略组名称" prop="name"
                      :rules="[
                      { required: true, message: '请输入策略组名称', trigger: 'blur' }]">
          <el-col :span="12"><el-input v-model="dataForm.name" /></el-col>
        </el-form-item>

        <el-form-item
          v-for="(detail, index) in dataForm.list"
          :label="'策略' + index"
          :key="detail.key"
          :prop="'list.' + index + '.name'"
        >
          <el-col :span="6"><el-input v-model="detail.name" placeholder="请输入策略名称"></el-input></el-col>
          <el-col :span="6">
            <el-select v-model="detail.type" placeholder="请输入奖励类型">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6"><el-input v-model="detail.amount" placeholder="请输入奖励金额"></el-input></el-col>
          <el-col :span="1" v-if="detail.type == 0">元</el-col>
          <el-col :span="1" v-if="detail.type == 1">%</el-col>
          <el-button @click.prevent="removeDomain(detail)">删除</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="addDomain">新增策略</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="createData"
          >确定</el-button
        >
        <el-button v-else type="primary" @click="updateData">更新</el-button>
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
import { fetchStrategyGroupList, apiCreate, apiUpdate, apiDelete} from "@/api/strategy";
import { allAdmin } from "@/api/admin";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "strategyList",
  components: { Pagination },
  data() {
    return {
      types: [
        {
          label: "首单",
          value: 0
        },
        {
          label: "复购",
          value: 1
        }
      ],
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
          name: '',
          type: '',
          amount: ''
        }]
      },
      textMap: {
        update: "编辑",
        create: "创建"
      },
      dialogFormVisible: false,
      strategyDialogVisible: false,
      strategyList: null,
    };
  },
  created() {
    this.getList();
  },

  methods: {
    showStrategyList(row) {
      this.strategyList = row.list;
      this.strategyDialogVisible = true;
    },
    handleSelect(item) {
      console.log(item);
      this.dataForm.adminId = item.id;
      this.dataForm.contact = item.realname;
      this.dataForm.phone = item.phone;
    },
    getList() {
      this.listLoading = true;
      fetchStrategyGroupList(this.listQuery)
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
        .catch(() => {});
    },
    resetForm() {
      this.dataForm = {
        name: "",
        list: [{
          name: '',
          type: '',
          amount: ''
        }]
      };
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
        name: '',
        type: '',
        amount: '',
        key: Date.now()
      });
    }
  }
};
</script>
