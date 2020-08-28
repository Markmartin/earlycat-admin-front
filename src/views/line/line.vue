<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入线路名称"
      />
      <el-input
        v-model="listQuery.contact"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入负责人"
      />
      <el-input
        v-model="listQuery.phone"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入手机号"
      />
      <el-select
        v-model="listQuery.type"
        clearable
        style="width: 200px"
        class="filter-item"
        placeholder="请选择线路类型"
      >
        <el-option
          v-for="type in types"
          :key="type.value"
          :label="type.label"
          :value="type.value"
        />
      </el-select>
      <el-button
        v-permission="['GET /admin/line/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >查找</el-button
      >
      <el-button
        v-permission="['POST /admin/line/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >添加</el-button
      >
      <el-button
        v-permission="['GET /admin/line/list']"
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        >导出</el-button
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
        label="线路ID"
        prop="id"
        sortable
      />
      <el-table-column
        align="center"
        label="线路名称"
        min-width="120px"
        prop="name"
      />
      <el-table-column
        align="center"
        label="负责人"
        min-width="120px"
        prop="contact"
      />
      <el-table-column
        align="center"
        label="手机号"
        min-width="120px"
        prop="phone"
      />

      <el-table-column align="center" label="线路类型" prop="type">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type ? 'success' : 'error'">{{
            scope.row.type ? "线下" : "线上"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="社区列表" prop="">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showCommunityList(scope.row)"
            >社区列表</el-button
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
            v-permission="['POST /admin/line/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-permission="['POST /admin/line/delete']"
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

    <!-- 关联社区列表对话框 -->
    <el-dialog :visible.sync="communitiesDialogVisible" title="关联社区列表">
      <el-form label-width="100px">
        <el-table
          :data="communityList"
          element-loading-text="正在查询中。。。"
          border
          fit
          highlight-current-row
        >
          <el-table-column
            align="center"
            label="社区名称"
            min-width="120px"
            prop="name"
          />
          <el-table-column
            align="center"
            label="社区地址"
            min-width="120px"
            prop="province,city,county,addressDetail"
          >
            <template slot-scope="scope">
              {{ scope.row.province }} {{ scope.row.city }}
              {{ scope.row.county }} {{ scope.row.addressDetail }}
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="communitiesDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--添加或编辑-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="right"
        label-width="150px"
        style="width: 100%; padding-left:50px;"
      >
        <el-form-item label="线路名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="负责人" prop="contact">
          <el-autocomplete
            prefix-icon="el-icon-search"
            class="inline-input"
            v-model="dataForm.contact"
            :fetch-suggestions="querySearch"
            placeholder="请输入姓名"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus == 'create'"
          label="线路类型"
          prop="type"
        >
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="0">线上</el-radio>
            <el-radio :label="1">线下</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--UPDATE时线路类型不可修改-->
        <el-form-item
          v-if="dialogStatus == 'update'"
          label="线路类型"
          prop="type"
        >
          <el-radio-group v-model="dataForm.type">
            <el-radio
              v-if="dialogStatus == 'update'"
              :disabled="true"
              :label="0"
              >线上</el-radio
            >
            <el-radio
              v-if="dialogStatus == 'update'"
              :disabled="true"
              :label="1"
              >线下</el-radio
            >
          </el-radio-group>
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
        <el-button v-else type="primary" @click="updateData">确定</el-button>
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
import { listLine, deleteLine, createLine, updateLine } from "@/api/line";
import { allAdmin } from "@/api/admin";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "LineList",
  components: { Pagination },
  data() {
    return {
      types: [
        {
          label: "线上",
          value: 0
        },
        {
          label: "线下",
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
        contact: undefined,
        phone: undefined,
        type: undefined,
        sort: "add_time",
        order: "desc"
      },
      dataForm: {
        name: "",
        adminId: "",
        contact: "",
        phone: "",
        type: 0
      },
      rules: {
        name: [{ required: true, message: "线路名称不能为空", trigger: "blur" }]
      },
      textMap: {
        update: "编辑",
        create: "创建"
      },
      dialogFormVisible: false,
      communitiesDialogVisible: false,
      communityList: null,
      restaurants: []
    };
  },
  created() {
    this.getList();
    this.loadAllAdmin();
  },

  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      for (let i = 0; i < restaurants.length; i++) {
        restaurants[i].value = restaurants[i].realname + "";
      }
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    handleSelect(item) {
      console.log(item);
      this.dataForm.adminId = item.id;
      this.dataForm.contact = item.realname;
      this.dataForm.phone = item.phone;
    },
    showCommunityList(row) {
      this.communityList = row.communityList;
      this.communitiesDialogVisible = true;
    },
    getList() {
      this.listLoading = true;
      listLine(this.listQuery)
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
    loadAllAdmin() {
      allAdmin()
        .then(response => {
          this.restaurants = response.data.data;
        })
        .catch(() => {
          this.restaurants = [];
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
      this.$confirm("确定要删除当前线路吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteLine(row)
            .then(response => {
              this.$notify.success({
                title: "成功",
                message: "删除线路成功"
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
        adminId: "",
        contact: "",
        phone: "",
        type: 0
      };
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createLine(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data);
              this.dialogFormVisible = false;
              this.$notify.success({
                title: "成功",
                message: "新建线路成功"
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
          updateLine(this.dataForm)
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
                message: "更新线路信息成功"
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
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "线路ID",
          "线路名称",
          "负责人",
          "手机号",
          "线路类型（0:线上 1:线下）",
          "创建时间"
        ];
        const filterVal = ["id", "name", "contact", "phone", "type", "addTime"];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "线路信息");
        this.downloadLoading = false;
      });
    }
  }
};
</script>
