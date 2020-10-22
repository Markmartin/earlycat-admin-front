<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="params.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="params.mobile" placeholder="电话"></el-input>
      </el-form-item>
      <el-button
        type="primary"
        @click="listSupplier"
        v-permission="['GET /admin/supplier/list']"
        >查询</el-button
      >
      <el-button
        type="primary"
        @click="$router.push({ path: '/po/supplierEdit' })"
        v-permission="['GET /admin/supplier/create']"
        >新增</el-button
      >
    </el-form>

    <el-table
      :data="list"
      style="width: 100%"
      border
      :row-style="{ height: '1px' }"
      :cell-style="{ padding: '5px' }"
    >
      <el-table-column
        align="center"
        label="序号"
        width="70"
        type="index"
      ></el-table-column>
      <el-table-column label="名称" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.categoryIds" :key="item">{{categorys[item]}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="图片" width="132" align="center">
        <template slot-scope="scope">
          <img style="width: 100px; height: 100px" :src="scope.row.picUrl" />
        </template>
      </el-table-column> -->
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 0 ? "暂停" : "正常" }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['GET /admin/supplier/detail']"
            type="primary"
            size="mini"
            @click="
              $router.push({ path: '/po/supplierEdit', query: scope.row })
            "
            >编辑</el-button
          >
          <el-button
            v-permission="['GET /admin/supplier/delete']"
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
      :page.sync="params.page"
      :limit.sync="params.limit"
      @pagination="listSupplier"
    />
  </div>
</template>

<script>
import path from "path";
import { formatTime, formatDate } from "@/utils";
import { listSupplier, deleteSupplier } from "@/api/supplier";
import Pagination from "@/components/Pagination";
import { listCatL1 } from "@/api/category";

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      params: {
        name: "",
        mobile: "",
        page: 1,
        limit: 10,
      },
      total: 0,
      categorys: {}
    };
  },
  created() {
    this.listSupplier();
    listCatL1().then((res) => {
      // this.categorys = res.data.data.list.map(m => {m.value: m.label})
      let categorys = {};
      res.data.data.list.forEach(e => {
        categorys[e.value] = e.label;
      })
      this.categorys = categorys;
    });
  },
  methods: {
    async listSupplier() {
      const res = await listSupplier(this.params);
      this.list = res.data.data.list;
    },
    handleDelete(row) {
      deleteSupplier({id: row.id}).then((res) => {
        this.listSupplier();
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
