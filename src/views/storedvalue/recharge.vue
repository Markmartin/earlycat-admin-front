<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button
        v-permission="['GET /admin/recharge/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button
      >
      <el-button
        v-permission="['POST /admin/recharge/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加
      </el-button
      >
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。"
              border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable/>
      <el-table-column align="center" label="充值金额" min-width="120px" prop="amount" sortable/>
      <el-table-column align="center" label="赠送金额" min-width="120px" prop="aditionalAmount"/>
      <el-table-column align="center" label="描述" min-width="120px" prop="desc"/>
      <el-table-column align="center" label="封面图片" min-width="120px" prop="picUrl">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" style="width:80px;height:40px;" >
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="120px" prop="addTime" sortable/>

      <el-table-column
        align="center"
        label="操作"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/recharge/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/recharge/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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

    <!--添加或编辑-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item label="充值金额" prop="amount">
          <el-input v-model="dataForm.amount">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="赠送金额" prop="aditionalAmount">
          <el-input v-model="dataForm.aditionalAmount">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="dataForm.desc">
          </el-input>
        </el-form-item>
        <el-form-item label="封面图片" prop="picUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="createData">确定</el-button>
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
  import {apiList, apiCreate, apiUpdate, apiDelete} from "@/api/recharge";
  import { createStorage, uploadPath } from "@/api/storage";
  import { getToken } from "@/utils/auth";
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "recharge",
    components: {Pagination},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        dialogStatus: "",
        listQuery: {
          page: 1,
          limit: 20,
          sort: "add_time",
          order: "desc"
        },
        textMap: {
          update: "编辑",
          create: "创建"
        },
        dataForm: {
          amount: 0,
          aditionalAmount: 0,
          desc: '',
          picUrl: '',
        },
        dialogFormVisible: false,
        uploadPath,
      };
    },
    computed: {
      headers() {
        return {
          "X-Wali-Token": getToken()
        };
      }
    },
    created() {
      this.getList();
    },
    methods: {
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
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },
      resetForm() {
        this.dataForm = {
          amount: 0,
          aditionalAmount: 0,
          desc: '',
          picUrl: '',
        }
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
      uploadPicUrl: function(response) {
        this.dataForm.picUrl = response.data.url;
      },
    }
  };
</script>
