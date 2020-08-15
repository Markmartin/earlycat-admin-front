<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>线路详情</h3>
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px">
        <el-form-item label="线路名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="dataForm.contact"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="dataForm.phone"/>
        </el-form-item>
        <el-form-item label="线路类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="0">线上</el-radio>
            <el-radio :label="1">线下</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button v-permission="['POST /admin/line/update']" type="primary" @click="handleEdit">更新线路</el-button>
    </div>
  </div>
</template>

<style>

.el-tag + .el-tag {
  margin-left: 10px;
}

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

</style>

<script>
import { detailLine, updateLine } from '@/api/line'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  name: 'LineEdit',
  components: { Editor },
  data() {
    return {
      dataForm: {
        name: '',
        contact: '',
        phone: '',
        type: ''
      },
      rules: {
        name: [{ required: true, message: '线路名称不能为空', trigger: 'blur' }],
        contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    headers() {
      return {
        'X-Wali-Token': getToken()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      if (this.$route.query.id == null) {
        return
      }
      const lineId = this.$route.query.id
      detailLine(lineId).then(response => {
        this.dataForm = response.data.data
      })
    },
    handleCancel: function() {
      this.$router.push({ path: '/line/list' })
    },
    handleEdit: function() {
      if (this.dataForm.name === '') {
        this.$message.error('请填写线路名称')
        return false
      }
      if (this.dataForm.contact === '') {
        this.$message.error('请填写联系人')
        return false
      }
      if (this.dataForm.phone === '') {
        this.$message.error('请填写联系方式')
        return false
      }
      const lineData = {
        id: this.$route.query.id,
        name: this.dataForm.name,
        contact: this.dataForm.contact,
        phone: this.dataForm.phone,
        type: this.dataForm.type
      }
      updateLine(lineData)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '更新成功'
          })
          this.$router.push({ path: '/line/list' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    }
  }
}
</script>
