<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="名称">
        <el-select
          v-model="listQuery.communityId"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in communitis"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="listQuery.checkDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-button
        type="primary"
        @click="getList"
        v-permission="['GET /admin/retail/selectAll']"
        >查询</el-button
      >
    </el-form>

    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="commId" label="对象" align="center">
        <template slot-scope="scope">
          {{ lineObj[scope.row.lineId] }}
        </template>
      </el-table-column>
      <el-table-column prop="commId" label="社区" align="center">
        <template slot-scope="scope">
          {{ commObj[scope.row.commId] }}
        </template>
      </el-table-column>
      <el-table-column prop="sumDate" label="日期" align="center">
      </el-table-column>
      <el-table-column
        prop="sumMoney"
        label="收银机金额"
        align="center"
      ></el-table-column>
      <el-table-column prop="sumPay" label="交账金额" align="center">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['GET /admin/retail/update']"
            type="primary"
            size="mini"
            @click="handleEdit(scope)"
            >编辑</el-button
          >
          <el-button
            v-permission="['POST /admin/retail/delete']"
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

    <!-- 创建对话框 -->
    <el-dialog :visible.sync="editDialogVisible" title="生成采购单">
      <el-form label-width="100px">
        <el-form-item label="选择时间">
          <el-select
            v-model="retail.commId"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in communitis"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实收金额">
          <el-input v-model="retail.sumPay" placeholder="实收金额"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
</style>

<script>
import { deepClone } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { selectAll, updateRetail, deleteRetail } from "@/api/retail";
import { allList } from "@/api/community";
import { listByType } from "@/api/line";
const defaultRetail = {
  id: "",
  goodsName: "",
  goodsSpec: "",
  number: "",
  price: "",
};
export default {
  name: "retail",
  components: { Pagination },
  data() {
    return {
      retail: Object.assign({}, defaultRetail),
      list: [],
      communitis: [],
      commObj: {},
      lines: [],
      lineObj: {},
      total: 0,
      editDialogVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  created() {
    this.getList();
    allList({ page: 1, limit: 10000 }).then((res) => {
      this.communitis = res.data.data;
      let commObj = {};
      res.data.data.forEach((m) => {
        commObj[m.id] = m.name;
      });
      this.commObj = commObj;
    });
    listByType(1).then((res) => {
      this.lines = res.data.data;
      let lineObj = {};
      res.data.data.forEach((m) => {
        lineObj[m.id] = m.name;
      });
      this.lineObj = lineObj;
    });
  },
  methods: {
    getList() {
      selectAll(this.listQuery).then((res) => {
        this.total = res.data.data.total;
        this.list = res.data.data.list;
      });
    },
    handleEdit(scope) {
      this.editDialogVisible = true;
      this.retail = deepClone(scope.row);
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    save() {
      updateRetail(this.retail).then((res) => {
        if (res.data.errno === 0) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
        }
        this.getList();
      });
      this.editDialogVisible = false;
    },
    handleDelete(row) {
      this.$confirm("此操作将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRetail({ id: row.id }).then((res) => {
            if (res.data.errno === 0) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getList();
            }
          });
        })
    },
  },
};
</script>
