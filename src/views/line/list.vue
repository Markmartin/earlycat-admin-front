<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入线路名称"/>
      <el-input v-model="listQuery.contact" clearable class="filter-item" style="width: 200px;" placeholder="请输入联系人"/>
      <el-input v-model="listQuery.phone" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>
      <el-select v-model="listQuery.type" clearable style="width: 200px" class="filter-item" placeholder="请选择线路类型">
        <el-option v-for="type in types" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-button v-permission="['GET /admin/line/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/line/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="线路ID" prop="id" sortable/>
      <el-table-column align="center" label="线路名称" min-width="120px" prop="name"/>
      <el-table-column align="center" label="联系人" min-width="120px" prop="contact"/>
      <el-table-column align="center" label="手机号" min-width="120px" prop="phone"/>

      <el-table-column align="center" label="状态" prop="type">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type ? 'success' : 'error' ">{{ scope.row.type ? '线下' : '线上' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" min-width="120px" prop="addTime"/>

      <el-table-column align="center" label="操作" min-width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/line/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/line/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

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
import { listLine, deleteLine } from '@/api/line'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'LineList',
  components: { Pagination },
  data() {
    return {
      types: [
        {
          label: '线上',
          value: 0
        },
        {
          label: '线下',
          value: 1
        }
      ],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        contact: undefined,
        phone: undefined,
        type: undefined,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listLine(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({ path: '/line/create' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/line/edit', query: { id: row.id }})
    },
    handleDelete(row) {
      this.$confirm('确定要删除当前线路吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLine(row)
          .then(response => {
            this.$notify.success({
              title: '成功',
              message: '删除线路成功'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
          .catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
      }).catch(() => {})
    }

  }
}
</script>
