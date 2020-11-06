<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="名称" prop="adminId">
        <el-select v-model="ruleForm.adminId" filterable placeholder="请输入" @change="checkAdmin">
          <el-option
            v-for="item in admins"
            :key="item.id"
            :label="item.realname"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input
          style="width: 196px"
          v-model="ruleForm.mobile"
          placeholder="请输入电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="负责" prop="mobile">
        <el-select v-model="ruleForm.categoryIds" multiple placeholder="请选择">
          <el-option
            v-for="item in categorys"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { createStorage, uploadPath } from "@/api/storage";
import { save } from "@/api/purchaser";
import { getToken } from "@/utils/auth";
import { listCatL1 } from "@/api/category";
import { listAdmin } from "@/api/admin";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        mobile: "",
        status: "1",
        picUrl: "",
      },
      categorys: [],
      admins: [],
      uploadPath,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择手机号", trigger: "blur" }],
      },
    };
  },
  computed: {
    headers() {
      return {
        "X-Wali-Token": getToken(),
      };
    },
  },
  created() {
    if (this.$route.query.id) {
      this.ruleForm = this.$route.query;
      this.ruleForm.status = this.$route.query.status + "";
    }
    listCatL1().then((res) => {
      this.categorys = res.data.data.list;
    });
    listAdmin({page: 1,limit: 100}).then((res) => {
      this.admins = res.data.data.list;
    });
  },
  methods: {
    checkAdmin(value){
      this.admins.forEach(e => {
        if (e.id === value) {
          this.ruleForm.name = e.realname;
          this.ruleForm.mobile = e.phone;
        }
      })
    },
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          save(this.ruleForm).then((res) => {
            history.back();
          });
        } else {
          return false;
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.picUrl = res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>
<style scoped>
.demo-ruleForm {
  padding-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>>
