<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>采购单号：{{ details.po.poSn }}</span>
      </div>
      <p>供应商：{{ details.po.brandName }}</p>
      <p>订单开始时间：{{ details.po.orderStartTime }}</p>
      <p>订单截止时间：{{ details.po.orderEndTime }}</p>
      <p>创建时间：{{ details.po.addTime }}</p>
      <el-table :data="details.poGoods" style="width: 100%">
        <el-table-column prop="goodsName" label="商品名称"/>
        <el-table-column prop="unit" label="单位"/>
        <el-table-column prop="price" label="上次采购价"/>
        <el-table-column prop="value" label="预计采购量"/>
        <el-table-column prop="actualPrice" label="本次采购价"/>
        <el-table-column prop="actualValue" label="实际采购量"/>
        <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleSet(scope.row,scope.$index)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 设置对话框 -->
    <el-dialog :visible.sync="setDialogVisible" title="设置">
      <el-form label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="setData.goodsName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="setData.unit" :disabled="true"/>
        </el-form-item>
        <el-form-item label="上次采购价">
          <el-input v-model="setData.price" :disabled="true"/>
        </el-form-item>
        <el-form-item label="预计采购量">
          <el-input v-model="setData.value" :disabled="true"/>
        </el-form-item>
        <el-form-item label="本次采购价">
          <el-input v-model="setData.actualPrice" />
        </el-form-item>
        <el-form-item label="实际采购量">
          <el-input v-model="setData.actualValue"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取消</el-button>
        <el-button v-permission="['POST /admin/po/goods/edit']" type="primary" @click="confirmSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
p{margin-bottom: 10px;}
</style>
<script>
import { poDetail, poEdit } from '@/api/po'
export default {
  data() {
    return {
      setDialogVisible: false,
      setData: {},
      setIdx: 0,
      details: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.$route.query.id == null) {
        return
      }
      const id = this.$route.query.id
      poDetail({ id: id }).then(response => {
        this.details = response.data.data
      })
    },
    handleSet(row, index) {
      this.setIdx = index
      this.setData = Object.assign({}, row)
      this.setDialogVisible = true
    },
    confirmSave() {
      poEdit({ id: this.setData.id, actualPrice: this.setData.actualPrice, actualValue: this.setData.actualValue }).then(response => {
        this.details.poGoods.splice(this.setIdx, 1, this.setData)
        this.setDialogVisible = false
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    }
  }
}
</script>
