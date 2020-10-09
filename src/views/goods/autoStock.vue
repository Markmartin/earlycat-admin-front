<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button type="primary" @click="show = true">新增</el-button>
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
        type="index"
        align="center"
        width="50"
        label="序号"
      ></el-table-column>
      <el-table-column align="center" label="名称" prop="title" />
      <el-table-column align="center" label="设置库存" prop="number">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.number"
            placeholder="请输入内容"
            type="number"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="save(scope.row)"
            >保存</el-button
          >
          <el-button type="danger" size="mini" @click="deleteStock(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--  -->
    <el-dialog :visible.sync="show" title="新增">
      <el-form ref="stock" :rules="rules" :model="stock" label-width="150px">
        <el-row>
          <el-col>
            <el-form-item label="名称" prop="title">
              <el-autocomplete
                class="inline-input"
                v-model="query.name"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入名称"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="id" prop="goodsId">
              <el-input
                v-model="stock.goodsId"
                placeholder="请选择商品"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item label="规格" prop="spec">
              <el-input
                v-model="stock.spec"
                placeholder="请选择商品"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="number">
              <el-input
                type="number"
                v-model="stock.number"
                placeholder="请输入库存"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { list, update, add, deleteStock } from "@/api/autoStock";
import { listGoods } from "@/api/goods";
export default {
  name: "autoStock",
  data() {
    return {
      list: [],
      listLoading: true,
      show: false,
      query: {},
      stock: {},
      rules: {
        goodsId: [{ required: true, message: "商品不能为空", trigger: "blur" }],
        number: [{ required: true, message: "库存不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      list()
        .then((response) => {
          this.list = response.data.data;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.listLoading = false;
        });
    },
    save(row) {
      update(row).then((res) => {
        if (res.data.errno === 0) {
          this.$message({
            message: "成功",
            type: "success",
          });
        }
      });
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        listGoods(this.query).then((res) => {
          let results = res.data.data.list.map((m) => {
            m["value"] = m.title;
            return m;
          });
          cb(results);
        });
      } else {
        this.stock = {};
      }
    },
    handleSelect(item) {
      this.stock.goodsId = item.id;
      this.stock.title = item.title;
      this.stock.spec = item.onlineSpec;
    },
    save() {
      this.$refs["stock"].validate((valid) => {
        if (valid) {
          add(this.stock).then((res) => {
            if (res.data.errno === 0) {
              this.$message({
                message: "成功",
                type: "success",
              });
              this.show = false;
              this.getList();
            }
          });
        } else {
          return false;
        }
      });
    },
    deleteStock(row) {
      console.log(row.id);
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteStock({ id: row.id }).then((res) => {
          if (res.data.errno === 0) {
            this.$message({
              message: "成功",
              type: "success",
            });
            this.show = false;
            this.getList();
          }
        });
      });
    },
  },
};
</script>
