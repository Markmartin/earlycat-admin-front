<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="stockInfo" :rules="rules" :model="stockInfo" label-width="150px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="展示图片">
              <el-upload
                :headers="headers"
                :action="uploadPath"
                :show-file-list="false"
                :on-success="uploadPicUrl"
                class="avatar-uploader"
                accept=".jpg,.jpeg,.png,.gif">
                <img v-if="stockInfo.picUrl" :src="stockInfo.picUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分享图片">
              <el-upload
                :headers="headers"
                :action="uploadPath"
                :show-file-list="false"
                :on-success="uploadPicUrl"
                class="avatar-uploader"
                accept=".jpg,.jpeg,.png,.gif">
                <img v-if="stockInfo.picUrl" :src="stockInfo.shareUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="12">
            <el-form-item label="小程序标题" prop="title">
              <el-input v-model="stockInfo.title"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小程序副标题" prop="subtitle">
              <el-input v-model="stockInfo.subtitle"/>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="8">
            <el-form-item label="线上名称" prop="onlineName">
              <el-input v-model="stockInfo.onlineName"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线上售价" prop="onlinePrice">
              <el-input v-model="stockInfo.onlinePrice" placeholder="0.00">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="线上销量" prop="onlineSales">
              <el-input v-model="stockInfo.onlineSales"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="线上规格" prop="onlineSpec">
              <el-input v-model="stockInfo.onlineSpec"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="线下名称" prop="offlineName">
              <el-input v-model="stockInfo.offlineName"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线下价格" prop="offlinePrice">
              <el-input v-model="stockInfo.offlinePrice" placeholder="0.00">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="线下销量" prop="offlineSales">
              <el-input v-model="stockInfo.offlineSales"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="线下规格" prop="offlineSpec">
              <el-input v-model="stockInfo.offlineSpec"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="专柜价格" prop="counterPrice">
              <el-input v-model="stockInfo.counterPrice" placeholder="0.00">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="stockInfo.unit"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="销售方式" prop="saleType">
              <el-input v-model="stockInfo.saleType"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="货号" prop="itemNo">
              <el-input v-model="stockInfo.naitemNome"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="入库价格" prop="inPrice">
              <el-input v-model="stockInfo.inPrice" placeholder="0.00">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库价格" prop="outPrice">
              <el-input v-model="stockInfo.outPrice" placeholder="0.00">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存" prop="stock">
              <el-input v-model="stockInfo.stock"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="上架类型" prop="onSaleType">
              <el-select v-model="stockInfo.onSaleType" placeholder="请选择">
                <el-option :label="小程序上线" value="1">小程序上线</el-option>
                <el-option :label="微菜场上线" value="2">微菜场上线</el-option>
                <el-option :label="小程序/微菜场上线" value="3">上线（小程序/微菜场）</el-option>
                <el-option :label="下线" value="4">下线</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否热卖" prop="isHot">
              <el-radio-group v-model="stockInfo.isHot">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="是否新品" prop="isNew">
              <el-radio-group v-model="stockInfo.isNew">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

          </el-col>
        </el-row>


        <el-row>
          <el-col :span="8">
            <el-form-item label="是否报货" prop="isCargo">
              <el-radio-group v-model="stockInfo.isCargo">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报货规格" prop="cargoSpec">
              <el-input v-model="stockInfo.cargoSpec"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报货说明" prop="cargoRemark">
              <el-input v-model="stockInfo.cargoRemark"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="stockInfo.sort"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否不限购" prop="isNotLimit">
              <el-input v-model="stockInfo.isNotLimit"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="限购数量" prop="limitNum">
              <el-input v-model="stockInfo.limitNum"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="工位" prop="station">
              <el-input v-model="stockInfo.station"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="所属分类">
          <el-cascader :options="categoryList" v-model="categoryId" expand-trigger="hover"
                       @change="handleCategoryChange"/>
        </el-form-item>

        <el-form-item label="所属品牌商">
          <el-select v-model="stockInfo.brandId">
            <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="所属小区">
          <el-select
            v-model="communities"
            :remote-method="communityMethod"
            :loading="communityLoading"
            value-key="communityId"
            class="filter-item"
            multiple
            clearable
            filterable
            remote
            reserve-keyword
            style="width:100%;"
            placeholder="请输入小区名称">
            <el-option
              v-for="item in communityList"
              :key="item.communityId"
              :label="item.communityName"
              :value="item"/>
          </el-select>
        </el-form-item>

        <el-form-item label="商品简介">
          <el-input v-model="stockInfo.brief"/>
        </el-form-item>

        <el-form-item label="商品详细介绍">
          <editor :init="editorInit" v-model="stockInfo.detail"/>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <h3>商品规格</h3>
      <el-button :plain="true" type="primary" @click="handleSpecificationShow">添加</el-button>

      <el-table :data="specifications">
        <el-table-column property="specification" label="规格名"/>
        <el-table-column property="value" label="规格值">
          <template slot-scope="scope">
            <el-tag type="primary">
              {{ scope.row.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="picUrl" label="规格图片">
          <template slot-scope="scope">
            <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="40">
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="specVisiable" title="设置规格">
        <el-form ref="specForm" :rules="rules" :model="specForm" status-icon label-position="left" label-width="100px"
                 style="width: 400px; margin-left:50px;">
          <el-form-item label="规格名" prop="specification">
            <el-input v-model="specForm.specification"/>
          </el-form-item>
          <el-form-item label="规格值" prop="value">
            <el-input v-model="specForm.value"/>
          </el-form-item>
          <el-form-item label="规格图片" prop="picUrl">
            <el-upload
              :headers="headers"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="uploadSpecPicUrl"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif">
              <img v-if="specForm.picUrl" :src="specForm.picUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleSpecificationAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <el-card class="box-card">
      <h3>商品库存</h3>
      <el-table :data="products">
        <el-table-column property="value" label="货品规格">
          <template slot-scope="scope">
            <el-tag v-for="tag in scope.row.specifications" :key="tag">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="productSn" width="150" label="货品规格编号"/>
        <el-table-column property="unit" width="100" label="货品单位"/>
        <el-table-column property="value" width="100" label="单位数值"/>
        <el-table-column property="price" width="100" label="货品售价"/>
        <el-table-column property="number" width="100" label="货品数量"/>
        <el-table-column property="url" width="100" label="货品图片">
          <template slot-scope="scope">
            <img v-if="scope.row.url" :src="scope.row.url" width="40">
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleProductShow(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="productVisiable" title="设置货品">
        <el-form ref="productForm" :model="productForm" status-icon label-position="left" label-width="100px"
                 style="width: 400px; margin-left:50px;">
          <el-form-item label="货品规格列" prop="specifications">
            <el-tag v-for="tag in productForm.specifications" :key="tag">
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item label="货品规格编号" prop="productSn">
            <el-input v-model="productForm.productSn"/>
          </el-form-item>
          <el-form-item label="货品单位" prop="unit">
            <el-select v-model="productForm.unit" placeholder="请选择">
              <el-option v-for="(item, index) in unitList" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="单位数值" prop="value">
            <el-input v-model="productForm.value"/>
          </el-form-item>
          <el-form-item label="货品售价" prop="price">
            <el-input v-model="productForm.price"/>
          </el-form-item>
          <el-form-item label="货品数量" prop="number">
            <el-input v-model="productForm.number"/>
          </el-form-item>
          <el-form-item label="货品图片" prop="url">
            <el-upload
              :headers="headers"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="uploadProductUrl"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif">
              <img v-if="productForm.url" :src="productForm.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="productVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleProductEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <el-card class="box-card">
      <h3>商品参数</h3>
      <el-button :plain="true" type="primary" @click="handleAttributeShow">添加</el-button>
      <el-table :data="attributes">
        <el-table-column property="attribute" label="商品参数名称"/>
        <el-table-column property="value" label="商品参数值"/>
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="attributeVisiable" title="设置商品参数">
        <el-form ref="attributeForm" :model="attributeForm" status-icon label-position="left" label-width="100px"
                 style="width: 400px; margin-left:50px;">
          <el-form-item label="商品参数名称" prop="attribute">
            <el-input v-model="attributeForm.attribute"/>
          </el-form-item>
          <el-form-item label="商品参数值" prop="value">
            <el-input v-model="attributeForm.value"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleAttributeAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <el-card class="box-card">
      <h3>商品返券</h3>
      <el-button :plain="true" type="primary" @click="handleRebateShow">添加</el-button>
      <el-table :data="rebates">
        <el-table-column property="orders" label="订单数量"/>
        <el-table-column property="value" label="返券额度"/>
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleRebateDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="rebateVisiable" title="设置商品返券">
        <el-form ref="rebateForm" :model="rebateForm" status-icon label-position="left" label-width="100px"
                 style="width: 400px; margin-left:50px;">
          <el-form-item label="订单数量" prop="attribute">
            <el-input v-model="rebateForm.orders"/>
          </el-form-item>
          <el-form-item label="返券额度" prop="value">
            <el-input v-model="rebateForm.value"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="rebateVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleRebateAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button v-permission="['POST /admin/goods/update']" type="primary" @click="handleEdit">更新商品</el-button>
    </div>

  </div>
</template>

<style>
  .el-card {
    margin-bottom: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
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
  import { detailGoods, editGoods, listCatAndBrand, detailStockInfo } from '@/api/stockInfo'
  import { createStorage, uploadPath } from '@/api/storage'
  import { listCommunity } from '@/api/community'
  import Editor from '@tinymce/tinymce-vue'
  import { MessageBox } from 'element-ui'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'StockInfoEdit',
    components: { Editor },
    onlineOptions: [{
      value: '小程序上线 of',
      label: '1'
    }, {
      value: '微菜场上线 fo',
      label: '3'
    }, {
      value: '小程序&微菜场上线 oo',
      label: '2'
    }, {
      value: '下线 ff',
      label: '4'

    }],
    data() {
      return {
        communityLoading: false,
        communityList: [],
        uploadPath,
        newKeywordVisible: false,
        newKeyword: '',
        keywords: [],
        galleryFileList: [],
        categoryList: [],
        brandList: [],
        categoryIds: [],
        communities: [],
        goods: { gallery: [], unit: '克' },
        stockInfo: [],
        specVisiable: false,
        specForm: { specification: '', value: '', picUrl: '' },
        specifications: [{ specification: '规格', value: '标准', picUrl: '' }],
        productVisiable: false,
        unitList: ['克', '个', '箱', '件', '盒', '份', '瓶', '袋', '桶'],
        productForm: { id: 0, specifications: [], price: 0.00, number: 0, url: '', unit: '克', value: 0 },
        products: [{
          id: 0,
          specifications: ['标准'],
          price: 0.00,
          number: 0,
          url: '',
          productSn: 1,
          unit: '克',
          value: 0
        }],
        attributeVisiable: false,
        attributeForm: { attribute: '', value: '' },
        attributes: [],
        rebateVisiable: false,
        rebateForm: { orders: '', value: '' },
        rebates: [],
        rules: {
          goodsSn: [
            { required: true, message: '商品编号不能为空', trigger: 'blur' }
          ],
          name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
        },
        editorInit: {
          language: 'zh_CN',
          convert_urls: false,
          plugins: [
            'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
          ],
          toolbar: [
            'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
            'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
          ],
          images_upload_handler: function(blobInfo, success, failure) {
            const formData = new FormData()
            formData.append('file', blobInfo.blob())
            createStorage(formData)
              .then(res => {
                success(res.data.data.url)
              })
              .catch(() => {
                failure('上传失败，请重新上传')
              })
          }
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

        const stockInfoId = this.$route.query.id

        detailStockInfo(stockInfoId).then(response => {
          this.stockInfo = response.data.data
        })

        listCatAndBrand().then(response => {
          this.categoryList = response.data.data.categoryList
          this.brandList = response.data.data.brandList
        })
      },

      communityMethod(query) {
        if (query !== '') {
          this.communityLoading = true
          listCommunity({
            name: query,
            page: 1,
            limit: 20
          }).then(response => {
            const list = []
            for (const idx in response.data.data.list) {
              list.push({
                communityId: response.data.data.list[idx].id,
                communityName: response.data.data.list[idx].name
              })
            }
            this.communityList = list
            this.communityLoading = false
          }).catch(() => {
            this.communityList = []
            this.communityLoading = false
          })
        } else {
          this.communityList = []
        }
      },
      handleCategoryChange(value) {
        this.stockInfo.categoryId = value[value.length - 1]
      },
      handleCancel: function() {
        this.$router.push({ path: '/goods/list' })
      },
      handleEdit: function() {
        if (this.stockInfo.isChoice && (this.stockInfo.limit === undefined || this.stockInfo.limit === '')) {
          this.$message.error('请填写限购数量')
          return false
        }
        const finalGoods = {
          communities: this.communities,
          goods: this.goods,
          specifications: this.specifications,
          products: this.products,
          rebates: this.rebates,
          attributes: this.attributes
        }
        editGoods(finalGoods)
          .then(response => {
            this.$notify.success({
              title: '成功',
              message: '创建成功'
            })
            this.$router.push({ path: '/goods/list' })
          })
          .catch(response => {
            MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
              confirmButtonText: '确定',
              type: 'error'
            })
          })
      },
      handleClose(tag) {
        this.keywords.splice(this.keywords.indexOf(tag), 1)
        this.stockInfo.keywords = this.keywords.toString()
      },
      showInput() {
        this.newKeywordVisible = true
        this.$nextTick(_ => {
          this.$refs.newKeywordInput.$refs.input.focus()
        })
      },
      handleInputConfirm() {
        const newKeyword = this.newKeyword
        if (newKeyword) {
          this.keywords.push(newKeyword)
          this.stockInfo.keywords = this.keywords.toString()
        }
        this.newKeywordVisible = false
        this.newKeyword = ''
      },
      uploadPicUrl: function(response) {
        this.stockInfo.picUrl = response.data.url
      },
      uploadOverrun: function() {
        this.$message({
          type: 'error',
          message: '上传文件个数超出限制!最多上传5张图片!'
        })
      },
      handleGalleryUrl(response, file, fileList) {
        if (response.errno === 0) {
          this.stockInfo.gallery.push(response.data.url)
        }
      },
      handleRemove: function(file, fileList) {
        for (var i = 0; i < this.stockInfo.gallery.length; i++) {
          // 这里存在两种情况
          // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
          //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
          // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
          var url
          if (file.response === undefined) {
            url = file.url
          } else {
            url = file.response.data.url
          }

          if (this.stockInfo.gallery[i] === url) {
            this.stockInfo.gallery.splice(i, 1)
          }
        }
      },
      specChanged: function(label) {
        if (label === false) {
          this.specifications = [
            { specification: '规格', value: '标准', picUrl: '' }
          ]
          this.products = [
            { id: 0, specifications: ['标准'], price: 0.0, number: 0, url: '', productSn: 1, unit: '克', value: 0 }
          ]
        } else {
          this.specifications = []
          this.products = []
        }
      },
      uploadSpecPicUrl: function(response) {
        this.specForm.picUrl = response.data.url
      },
      handleSpecificationShow() {
        this.specForm = { specification: '', value: '', picUrl: '' }
        this.specVisiable = true
      },
      handleSpecificationAdd() {
        var index = this.specifications.length - 1
        for (var i = 0; i < this.specifications.length; i++) {
          const v = this.specifications[i]
          if (v.specification === this.specForm.specification) {
            index = i
          }
        }

        this.specifications.splice(index + 1, 0, this.specForm)
        this.specVisiable = false

        this.specToProduct()
      },
      handleSpecificationDelete(row) {
        const index = this.specifications.indexOf(row)
        this.specifications.splice(index, 1)
        this.specToProduct()
      },
      specToProduct() {
        if (this.specifications.length === 0) {
          return
        }
        // 根据specifications创建临时规格列表
        var specValues = []
        var spec = this.specifications[0].specification
        var values = []
        values.push(0)

        for (var i = 1; i < this.specifications.length; i++) {
          const aspec = this.specifications[i].specification

          if (aspec === spec) {
            values.push(i)
          } else {
            specValues.push(values)
            spec = aspec
            values = []
            values.push(i)
          }
        }
        specValues.push(values)

        // 根据临时规格列表生产货品规格
        // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
        var productsIndex = 0
        var products = []
        var combination = []
        var n = specValues.length
        for (var s = 0; s < n; s++) {
          combination[s] = 0
        }
        var index = 0
        var isContinue = false
        do {
          var specifications = []
          for (var x = 0; x < n; x++) {
            var z = specValues[x][combination[x]]
            specifications.push(this.specifications[z].value)
          }
          products[productsIndex] = {
            id: productsIndex,
            specifications: specifications,
            price: 0.0,
            number: 0,
            url: '',
            productSn: (productsIndex + 1).toString(),
            unit: '克',
            value: 0
          }
          productsIndex++

          index++
          combination[n - 1] = index
          for (var j = n - 1; j >= 0; j--) {
            if (combination[j] >= specValues[j].length) {
              combination[j] = 0
              index = 0
              if (j - 1 >= 0) {
                combination[j - 1] = combination[j - 1] + 1
              }
            }
          }
          isContinue = false
          for (var p = 0; p < n; p++) {
            if (combination[p] !== 0) {
              isContinue = true
            }
          }
        } while (isContinue)

        this.products = products
      },
      handleProductShow(row) {
        this.productForm = Object.assign({}, row)
        this.productVisiable = true
      },
      uploadProductUrl: function(response) {
        this.productForm.url = response.data.url
      },
      handleProductEdit() {
        let idx = 0
        const productSn = []
        for (var i = 0; i < this.products.length; i++) {
          const v = this.products[i]
          if (v.id === this.productForm.id) {
            idx = i
          } else {
            productSn.push(v.productSn)
          }
        }
        if (productSn.indexOf(this.productForm.productSn) > -1) {
          this.$message({
            type: 'warning',
            message: '货品规格编号已经存在'
          })
          return false
        }
        this.products.splice(idx, 1, this.productForm)
        // for (var i = 0; i < this.products.length; i++) {
        //   const v = this.products[i]
        //   if (v.id === this.productForm.id) {
        //     this.products.splice(i, 1, this.productForm)
        //     break
        //   }
        // }
        this.productVisiable = false
      },
      handleAttributeShow() {
        this.attributeForm = {}
        this.attributeVisiable = true
      },
      handleAttributeAdd() {
        this.attributes.unshift(this.attributeForm)
        this.attributeVisiable = false
      },
      handleAttributeDelete(row) {
        const index = this.attributes.indexOf(row)
        this.attributes.splice(index, 1)
      },
      handleRebateShow() {
        this.rebateForm = {}
        this.rebateVisiable = true
      },
      handleRebateAdd() {
        this.rebates.unshift(this.rebateForm)
        this.rebateVisiable = false
      },
      handleRebateDelete(row) {
        const index = this.rebates.indexOf(row)
        this.rebates.splice(index, 1)
      }
    }
  }
</script>
