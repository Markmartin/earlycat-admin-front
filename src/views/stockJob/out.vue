<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="params.goodsName" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="params.checkDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="对象">
        <el-select v-model="params.lineId" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in lines"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getJobs">查询</el-button>
      <el-button type="primary" @click="handleExportOutSearch">导出查询结果</el-button>
      <el-button type="primary" @click="handleExportOut">导出出库模版表</el-button>
      <!-- <el-button type="primary" @click="handleImportIn">导出入库数据</el-button> -->
      <el-upload
        class="upload-demo"
        :action="importOutUrl"
        :headers="importHeaders"
        :on-success="onSuccess"
        :on-error="onError"
        style="display:inline;margin-left:10px;"
      >
        <el-button type="primary">导入出库数据</el-button>
      </el-upload>
    </el-form>

    <el-table :data="jobList" style="width: 100%;margin-top:20px;" border>
      <el-table-column align="center" label="序号" width="60" type="index"></el-table-column>
      <el-table-column align="center" label="code" width="80">
        <template slot-scope="scope">{{ scope.row.job_code }}</template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="240">
        <template slot-scope="scope">{{ scope.row.goods_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="规格" width="120">
        <template slot-scope="scope">{{ scope.row.specification }}</template>
      </el-table-column>
      <el-table-column align="center" label="出库价" width="70">
        <template slot-scope="scope">{{ scope.row.price_out }}</template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="60">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
      <el-table-column align="center" label="金额" width="70">
        <template slot-scope="scope">{{ scope.row.price_sum }}</template>
      </el-table-column>
      <el-table-column align="center" label="对象" width="120">
        <template slot-scope="scope">{{ scope.row.line_id === 0?'仓库':scope.row.line_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="时间" min-width="130">
        <template slot-scope="scope">{{ scope.row.add_time | formatTime }}</template>
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
        <el-form-item label="出库价">
          <el-input v-model="job.price_out" placeholder="出库价" />
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
import { deepClone, formatDateTime } from "@/utils";
import { getToken } from "@/utils/auth";
import {
  getJobs,
  updateJob,
  deleteJob,
  exportIn,
  importIn,
  exportOut,
  importOut,
  exportOutSearch
} from "@/api/stockJob";
import {
  listByType
} from "@/api/line";

const defaultJob = {
  id: "",
  goods_name: "",
  specification: "",
  price_out: "",
  number: ""
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
        type: 2,
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      importInUrl: process.env.BASE_API + importIn(),
      importOutUrl: process.env.BASE_API + importOut(),
      importHeaders: {
        'X-Wali-Token': getToken()
      },
      lines:[],
    };
  },
  filters: {
    formatTime: function(value) {
      return formatDateTime(value);
    }
  },
  created() {
    this.getJobs();
    this.listByType();
  },
  methods: {
    async getJobs() {
      const res = await getJobs(this.params);
      this.jobList = res.data.data.jobs;
      this.total = res.data.data.total;
    },
    async listByType(){
      const res = await listByType(1);
      this.lines = res.data.data
    },

    async getList(e) {
      this.params.pageNo = e.page;
      this.params.pageSize = e.limit;
      this.getJobs();
    },
    handleExportOutSearch(){
      exportOutSearch(this.params).then(res => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel"
        });
        let fileName = "查询出库导出.xlsx";
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
    handleExportOut() {
      exportOut().then(res => {
        console.log(res)
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel"
        });
        let fileName = "出库模版" + formatDateTime(new Date()) + ".xlsx";
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
      this.getJobs()
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
        type: "提示"
      })
        .then(async () => {
          await deleteJob(row.id).then(res => {
            this.getJobs();
            this.$message({
              type: "success",
              message: "删除成功"
            });
          });
        })
        .catch(err => {
          console.error(err);
        });
    },

    async confirmJob() {
      const isEdit = this.dialogType === "edit";

      if (isEdit) {
        await updateJob(this.job).then(res => {
          this.getJobs();
        });
      } else {
        // await addRole(this.role).then(res => {});
      }

      this.dialogVisible = false;
      this.$notify({
        title: "保存成功",
        dangerouslyUseHTMLString: true,
        type: "success"
      });
    },
    
  }
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
