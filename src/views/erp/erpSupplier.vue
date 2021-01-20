<template>
  <div class="app-container">
    <el-form :inline="true" :model="supplierVo" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="supplierVo.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="supplierVo.phone" placeholder="电话"></el-input>
      </el-form-item>
      <el-button type="primary" @click="initSupplier" v-permission="['GET /admin/supplier/list']">查询</el-button>
      <el-button type="primary" @click="$router.push({ path: '/po/supplierEdit' })" v-permission="['GET /admin/supplier/create']">新增</el-button>
    </el-form>

    <el-table v-loading="listLoading" :data="list" style="width: 100%" border :row-style="{ height: '1px' }" :cell-style="{ padding: '5px' }">
      <el-table-column align="center" label="序号" width="70" type="index" prop="id"></el-table-column>
      <el-table-column label="名称" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="联系人" align="center">
        <template slot-scope="scope">{{ scope.row.contacts }}</template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.enable === 0 ? "启用" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/supplier/detail']" type="primary" size="mini" @click="$router.push({ path: '/po/supplierEdit', query: scope.row })">编辑</el-button>
          <el-button v-permission="['GET /admin/supplier/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="params.page" :limit.sync="params.limit" @pagination="initSupplier"/>
  </div>
</template>

<script>
  import path from "path";
  import {formatTime, formatDate} from "@/utils";
  import {listSupplier, deleteSupplier} from "@/api/erp/supplier";
  import Pagination from "@/components/Pagination";
  import {listCatL1} from "@/api/category";

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
        supplierVo: {
          id: undefined
        },
        total: 0,
        categorys: {}
      };
    },
    created() {
      this.initSupplier();
    },
    methods: {
      initSupplier() {
        this.listLoading = true
        listSupplier(this.supplierVo, this.params.page, this.params.limit).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          debugger
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
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
