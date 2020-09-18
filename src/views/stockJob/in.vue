<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="params.goodsName" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="品类">
        <el-select v-model="params.categoryId" filterable placeholder="请选择">
          <el-option v-for="item in categorys" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="params.checkDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="操作人">
        <el-select v-model="params.adminId" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in admins"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getJobs">查询</el-button>
      <el-button type="primary" @click="handleExportInSearch">导出查询结果</el-button>
      <el-button type="primary" @click="handleExportIn">导出入库模版表</el-button>
      <!-- <el-button type="primary" @click="handleImportIn">导出入库数据</el-button> -->
      <el-upload
        class="upload-demo"
        :action="importInUrl"
        :headers="importInHeaders"
        :on-success="onSuccess"
        :on-error="onError"
        style="display:inline;margin-left:10px;"
      >
        <el-button type="primary">导入入库数据</el-button>
      </el-upload>
    </el-form>

    <el-table :data="jobList" style="width: 100%;margin-top:20px;" border>
      <el-table-column align="center" label="序号" width="60" type="index"></el-table-column>
      <el-table-column align="center" label="code" width="80">
        <template slot-scope="scope">{{ scope.row.job_code }}</template>
      </el-table-column>
      <el-table-column align="center" label="品类" width="80">
        <template slot-scope="scope">{{ scope.row.category_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="240">
        <template slot-scope="scope">{{ scope.row.goods_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="规格" width="120">
        <template slot-scope="scope">{{ scope.row.specification }}</template>
      </el-table-column>
      <el-table-column align="center" label="入库价" width="70">
        <template slot-scope="scope">{{ scope.row.price_in }}</template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="60">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
      <el-table-column align="center" label="金额" width="70">
        <template slot-scope="scope">{{ scope.row.price_sum }}</template>
      </el-table-column>
      <!-- <el-table-column align="center" label="对象" width="60">
        <template slot-scope="scope">{{ scope.row.targetId === 0?'仓库':scope.row.targetName }}</template>
      </el-table-column> -->
      <el-table-column align="center" label="时间" min-width="140">
        <template slot-scope="scope">{{ scope.row.add_time | formatTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作人" >
        <template slot-scope="scope">{{ adminObj[scope.row.admin_id] }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="true"
      :total="total"
      :page.sync="params.pageNo"
      :limit.sync="params.pageSize"
      @pagination="getList"
    />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form :model="job" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="job.goods_name" placeholder="名称" disabled />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="job.specification" placeholder="规格" />
        </el-form-item>
        <el-form-item label="入库价">
          <el-input v-model="job.price_in" placeholder="入库价" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="job.number" placeholder="数量" />
        </el-form-item>
        <el-form-item label="对象">
          <el-input value="仓库" placeholder="仓库" disabled />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmJob">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import Pagination from "@/components/Pagination";
import { deepClone, formatDateTime, formatDate } from "@/utils";
import { getToken } from "@/utils/auth";
import {
  getJobs,
  updateJob,
  deleteJob,
  exportIn,
  importIn,
  exportInSearch,
} from "@/api/stockJob";
import { listCategory } from "@/api/category";
import { allAdmin } from "@/api/admin";

const defaultJob = {
  id: "",
  goods_name: "",
  specification: "",
  price_in: "",
  number: "",
};

export default {
  components: { Pagination },
  data() {
    return {
      job: Object.assign({}, defaultJob),
      // routes: [],
      jobList: [],
      dialogVisible: false,
      dialogType: "new",
      params: {
        type: 1,
        pageNo: 1,
        pageSize: 10,
        checkDate: formatDate(new Date()),
      },
      total: 0,
      importInUrl: process.env.BASE_API + importIn(),
      importInHeaders: {
        'X-Wali-Token': getToken()
      },
      categorys: [
        {
          categoryName: "全部",
          id: 0,
        },
      ],
      admins: [],
      adminObj:{}
    };
  },
  filters: {
    formatTime: function (value) {
      return formatDateTime(value);
    },
  },
  created() {
    this.getJobs();
    this.listCategory();
    this.allAdmin();
  },
  methods: {
    async getJobs() {
      const res = await getJobs(this.params);
      this.jobList = res.data.data.jobs;
      this.total = res.data.data.total;
    },

    async getList(e) {
      this.params.pageNo = e.page;
      this.params.pageSize = e.limit;
      this.getJobs();
    },

    async listCategory() {
      const res = await listCategory();
      this.categorys = [...this.categorys, ...res.data.data];
    },

    async allAdmin(){
      const res = await allAdmin();
      let adminObj = {}
      res.data.data.forEach(f => {
        adminObj[f.id] = f.username
      })
      this.admins = res.data.data
      this.adminObj = adminObj
    },

    handleExportIn() {
      exportIn().then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel",
        });
        let fileName = "入库模版" + formatDateTime(new Date()) + ".xlsx";
        if ("download" in document.createElement("a")) {
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    handleExportInSearch() {
      exportInSearch(this.params).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel",
        });
        let fileName = "查询结果" + formatDateTime(new Date()) + ".xlsx";
        if ("download" in document.createElement("a")) {
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    onSuccess(res) {
      if (res.errno === 0) {
        this.$message({
          type: "success",
          message: "导入成功"
        });
      } else {
        this.$message.error(res.errmsg);
      }
      this.getJobs();
    },
    onError() {
      this.$message.error("导入失败");
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.job = deepClone(scope.row);
    },
    handleDelete({ $index, row }) {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          await deleteJob(row.id).then((res) => {
            this.getJobs();
            this.$message({
              type: "success",
              message: "删除成功",
            });
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async confirmJob() {
      const isEdit = this.dialogType === "edit";

      if (isEdit) {
        await updateJob(this.job).then((res) => {
          this.getJobs();
        });
      } else {
        // await addRole(this.role).then(res => {});
      }

      this.dialogVisible = false;
      this.$notify({
        title: "保存成功",
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },
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
