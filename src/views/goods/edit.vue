<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px">
        <el-row>
          <el-col>
            <el-form-item label="标题" prop="title">
              <el-input v-model="goods.title" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="副标题" prop="subtitle">
              <el-input v-model="goods.subtitle" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上架类型" prop="saleType">
              <el-select v-model="goods.saleType" placeholder="请选择">
                <el-option
                  v-for="item in onlineOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物品类型">
              <el-select
                v-model="goods.acStatus"
                placeholder="请选择物品类型"
                @change="handleLimit"
              >
                <el-option
                  v-for="item in presellOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属品牌商">
              <el-select v-model="goods.brandId">
                <el-option
                  v-for="item in brandList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="线上分类"
              prop="goodsCategoryId"
              v-show="goods.saleType != 2"
            >
              <el-cascader
                :options="categoryList"
                :props="props"
                v-model="goodsCategoryIds"
                expand-trigger="hover"
                clearable
                @change="handleGoodsCategoryChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="线下分类"
              prop="categoryId"
              v-show="goods.saleType != 1"
            >
              <el-cascader
                :options="categoryList"
                v-model="categoryIds"
                expand-trigger="hover"
                clearable
                @change="handleCategoryChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="线上名称"
              v-show="goods.saleType != 2"
              prop="onlineName"
            >
              <el-input v-model="goods.onlineName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="线上售价"
              v-show="goods.saleType != 2"
              prop="onlinePrice"
            >
              <el-input
                v-model="goods.onlinePrice"
                placeholder="0.00"
                @input="
                  val => {
                    goods.onlinePrice = val
                      .replace(/[^0-9.]/g, '')
                      .replace('.', '#*')
                      .replace(/\./g, '')
                      .replace('#*', '.');
                  }
                "
                v-bind:disabled="goods.acStatus === 98 || goods.acStatus === 99"
              >
                <template slot="append"
                  >元</template
                >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="商品单位"
              v-show="goods.saleType != 2"
              prop="unit"
            >
              <el-input v-model="goods.unit" @input="handleUnit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="线下名称"
              v-show="goods.saleType != 1"
              prop="offlineName"
            >
              <el-input v-model="goods.offlineName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="线下价格"
              v-show="goods.saleType != 1"
              prop="offlinePrice"
            >
              <el-input
                v-model="goods.offlinePrice"
                placeholder="0.00"
                @input="
                  val => {
                    goods.offlinePrice = val
                      .replace(/[^0-9.]/g, '')
                      .replace('.', '#*')
                      .replace(/\./g, '')
                      .replace('#*', '.');
                  }
                "
                v-bind:disabled="goods.acStatus === 98 || goods.acStatus === 99"
              >
                <template slot="append"
                  >元</template
                >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="线下规格"
              v-show="goods.saleType != 1"
              prop="offlineSpec"
            >
              <el-input v-model="goods.offlineSpec" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="商品单位"
              v-show="goods.saleType != 1"
              prop="unit"
            >
              <el-input v-model="goods.unit" @input="handleUnit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--<el-col :span="8">
            <el-form-item label="关键字">
              <el-tag v-for="tag in keywords" :key="tag" closable type="primary" @close="handleClose(tag)">
                {{ tag }}
              </el-tag>
              <el-input v-if="newKeywordVisible" ref="newKeywordInput" v-model="newKeyword" class="input-new-keyword"
                        @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"/>
              <el-button v-else class="button-new-keyword" type="primary" @click="showInput">+ 增加</el-button>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="专柜价格" prop="counterPrice">
              <el-input
                v-model="goods.counterPrice"
                placeholder="0.00"
                @input="
                  val => {
                    goods.counterPrice = val
                      .replace(/[^0-9.]/g, '')
                      .replace('.', '#*')
                      .replace(/\./g, '')
                      .replace('#*', '.');
                  }
                "
                v-bind:disabled="goods.acStatus === 98 || goods.acStatus === 99"
              >
                <template slot="append"
                  >元</template
                >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工位" prop="stationId">
              <el-select v-model="goods.stationId" placeholder="请选择工位">
                <el-option
                  v-for="type in stationOption"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="限时特惠" prop="isChoice">
              <el-radio-group
                size="mini"
                v-model="goods.isChoice"
                v-bind:disabled="goods.acStatus === 98 || goods.acStatus === 99"
              >
                <el-radio :label="false">普通</el-radio>
                <el-radio :label="true">特惠</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="限购数量"
              v-show="goods.isChoice === true"
              prop="limit"
            >
              <el-input-number
                size="small"
                :min="1"
                v-model="goods.limit"
                v-bind:disabled="goods.acStatus === 98 || goods.acStatus === 99"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否新品" prop="isNew">
              <el-radio-group v-model="goods.isNew">
                <el-radio :label="true">新品</el-radio>
                <el-radio :label="false">非新品</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否推荐" prop="isHot">
              <el-radio-group v-model="goods.isHot">
                <el-radio :label="false">不推荐</el-radio>
                <el-radio :label="true">推荐</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否在售" prop="isOnSale">
              <el-radio-group v-model="goods.isOnSale">
                <el-radio :label="true">在售</el-radio>
                <el-radio :label="false">未售</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否报货" prop="isCargo">
              <el-radio-group v-model="goods.isCargo">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="报货规格"
              v-show="goods.isCargo === true"
              prop="cargoSpec"
            >
              <el-input v-model="goods.cargoSpec" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="报货说明"
              v-show="goods.isCargo === true"
              prop="cargoRemark"
            >
              <el-input v-model="goods.cargoRemark" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品图片">
              <el-upload
                :headers="headers"
                :action="uploadPath"
                :show-file-list="false"
                :on-success="uploadPicUrl"
                class="avatar-uploader"
                accept=".jpg,.jpeg,.png,.gif"
              >
                <img v-if="goods.picUrl" :src="goods.picUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="宣传画廊">
              <el-upload
                :action="uploadPath"
                :headers="headers"
                :limit="5"
                :file-list="galleryFileList"
                :on-exceed="uploadOverrun"
                :on-success="handleGalleryUrl"
                :on-remove="handleRemove"
                multiple
                accept=".jpg,.jpeg,.png,.gif"
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="分享图片">
              <div class="share-dom" id="share-dom">
                <img class="goods-image" :src="goodsImage" />
                <div class="tips">
                  <div class="main">
                    <span class="price">{{ goodsOnlinePrice }}</span>
                    <span class="original-price">{{ goodsCounterPrice }}</span>
                    <span class="specification">{{
                      goodsSpecification ? `(${goodsSpecification})` : null
                    }}</span>
                  </div>
                  <div class="desc">
                    {{ goodsSubtitle }}
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
            placeholder="请输入小区名称"
          >
            <el-option
              v-for="item in communityList"
              :key="item.communityId"
              :label="item.communityName"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品简介">
          <el-input v-model="goods.brief" />
        </el-form-item>
        <el-form-item label="商品详细介绍">
          <editor :init="editorInit" v-model="goods.detail" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <h3>商品规格</h3>
      <!--<el-button :plain="true" type="primary" @click="handleSpecificationShow">添加</el-button>-->
      <el-table :data="specifications">
        <el-table-column property="specification" label="规格名" />
        <el-table-column property="value" label="规格值">
          <template slot-scope="scope">
            <el-tag type="primary">
              {{ scope.row.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="picUrl" label="规格图片">
          <template slot-scope="scope">
            <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="40" />
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
              type="primary"
              size="mini"
              @click="handleSpecificationUpdateShow(scope.row)"
              >編輯</el-button
            >
            <!--<el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="specVisiable" title="设置规格">
        <el-form
          ref="specForm"
          :rules="rules"
          :model="specForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="规格名" prop="specification">
            <el-input v-model="specForm.specification" />
          </el-form-item>
          <el-form-item label="规格值" prop="value">
            <el-input v-model="specForm.value" />
          </el-form-item>
          <el-form-item label="规格图片" prop="picUrl">
            <el-upload
              :headers="headers"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="uploadSpecPicUrl"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif"
            >
              <img
                v-if="specForm.picUrl"
                :src="specForm.picUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specVisiable = false">取消</el-button>
          <!--<el-button type="primary" @click="handleSpecificationAdd">确定</el-button>-->
          <el-button type="primary" @click="handleSpecificationUpdate"
            >确定</el-button
          >
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
        <el-table-column
          property="productSn"
          width="150"
          label="货品规格编号"
        />
        <el-table-column property="unit" width="100" label="货品单位" />
        <el-table-column property="value" width="100" label="单位数值" />
        <el-table-column property="price" width="100" label="货品售价(元)" />
        <el-table-column property="inPrice" width="100" label="入库价格(元)" />
        <el-table-column property="outPrice" width="100" label="出库售价(元)" />
        <el-table-column property="leftNum" width="100" label="剩余库存" />
        <el-table-column property="sellNum" width="100" label="卖出数量" />
        <el-table-column property="url" width="100" label="货品图片">
          <template slot-scope="scope">
            <img v-if="scope.row.url" :src="scope.row.url" width="40" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="100"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleProductShow(scope.row)"
              >设置</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="productVisiable" title="设置货品">
        <el-form
          ref="productForm"
          :model="productForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="货品规格列" prop="specifications">
            <el-tag v-for="tag in productForm.specifications" :key="tag">
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item label="货品规格编号" prop="productSn">
            <el-input v-model="productForm.productSn" />
          </el-form-item>
          <el-form-item label="货品单位" prop="unit">
            <el-input v-model="productForm.unit" />
          </el-form-item>
          <el-form-item label="单位数值" prop="value">
            <el-input v-model="productForm.value" />
          </el-form-item>
          <el-form-item label="货品售价" prop="price">
            <el-input v-model="productForm.price" />
          </el-form-item>
          <el-form-item label="入库价格" prop="price">
            <el-input v-model="productForm.inPrice" />
          </el-form-item>
          <el-form-item label="出库价格" prop="price">
            <el-input v-model="productForm.outPrice" />
          </el-form-item>
          <el-form-item label="剩余库存" prop="leftNum">
            <span>{{ productForm.leftNum }}</span>
          </el-form-item>
          <el-form-item label="已售数量" prop="sellNum">
            <span>{{ productForm.sellNum }}</span>
          </el-form-item>
          <el-form-item label="设置库存" prop="number">
            <el-input-number v-model="productForm.number" :min="0" />
          </el-form-item>
          <el-form-item label="货品图片" prop="url">
            <el-upload
              :action="uploadPath"
              :show-file-list="false"
              :headers="headers"
              :on-success="uploadProductUrl"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif"
            >
              <img
                v-if="productForm.url"
                :src="productForm.url"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="productVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleProductEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <!--    <el-card class="box-card">
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
        </el-card>-->

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        v-permission="['POST /admin/goods/update']"
        type="primary"
        @click="submitEditForm('goods')"
        >更新商品
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  detailGoods,
  editGoods,
  listCatAndBrand,
  getStationList
} from "@/api/goods";
import { createStorage, uploadPath } from "@/api/storage";
import generateSharingGraph from "@/utils/generateSharingGraph";
import { listCommunity } from "@/api/community";
import Editor from "@tinymce/tinymce-vue";
import { MessageBox } from "element-ui";
import { getToken } from "@/utils/auth";
import ElInputNumber from "../../../node_modules/element-ui/packages/input-number/src/input-number.vue";

export default {
  name: "GoodsEdit",
  components: {
    ElInputNumber,
    Editor
  },
  data() {
    return {
      props: { multiple: true },
      presellOptions: [
        {
          label: "正常物品",
          value: 0
        },
        {
          label: "预售物品",
          value: 1
        },
        {
          label: "限时特价物品",
          value: 2
        },
        {
          label: "大件商品",
          value: 4
        },
        {
          label: "赠送物品",
          value: 98
        },
        {
          value: 99,
          label: "买即送物品"
        }
      ],
      onlineOptions: [
        {
          value: 1,
          label: "线上"
        },
        {
          value: 2,
          label: "线下"
        },
        {
          value: 3,
          label: "线上&线下"
        }
      ],
      listQuery: {
        isOnSale: "",
        acStatus: undefined,
        saleType: undefined,
        categoryId: undefined,
        brandId: undefined,
        page: 1,
        limit: 20,
        goodsSn: undefined,
        name: undefined,
        sort: "add_time",
        order: "desc"
      },
      stationOption: [],
      communityLoading: false,
      communityList: [],
      uploadPath,
      newKeywordVisible: false,
      newKeyword: "",
      keywords: [],
      galleryFileList: [],
      categoryList: [],
      goodsCategoryIdList: [],
      brandList: [],
      categoryIds: [],
      goodsCategoryIds: [],
      communities: [],
      goods: { gallery: [], unit: "克" },
      blobUrl: null,
      specVisiable: false,
      specForm: { specification: "", value: "", picUrl: "" },
      specifications: [{ specification: "规格", value: "标准", picUrl: "" }],
      productVisiable: false,
      unitList: ["克", "个", "箱", "件", "盒", "份", "瓶", "袋", "桶"],
      productForm: {
        id: 0,
        specifications: [],
        price: 0.0,
        leftNum: 0,
        sellNum: 0,
        number: 0,
        url: "",
        unit: "克",
        value: 0
      },
      products: [
        {
          id: 0,
          specifications: ["标准"],
          price: 0.0,
          number: 0,
          url: "",
          productSn: 1,
          unit: "克",
          value: 0
        }
      ],
      attributeVisiable: false,
      attributeForm: { attribute: "", value: "" },
      attributes: [],
      rebateVisiable: false,
      rebateForm: { orders: "", value: "" },
      rebates: [],
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        saleType: [
          { required: true, message: "上架类型不能为空", trigger: "blur" }
        ],
        acStatus: [
          { required: true, message: "销售类型不能为空", trigger: "blur" }
        ],
        // limit: [{required: true, message: '限购数量不能为空', trigger: 'blur'}],
        //          categoryId: [{ required: true,type: 'number',  message: '物品种类不能为空', trigger: 'blur' }],
        counterPrice: [
          { required: true, message: "专柜价格不能为空", trigger: "blur" }
        ]
      },
      editorInit: {
        language: "zh_CN",
        convert_urls: false,
        plugins: [
          "advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount"
        ],
        toolbar: [
          "searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample",
          "hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen"
        ],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData();
          formData.append("file", blobInfo.blob());
          createStorage(formData)
            .then(res => {
              success(res.data.data.url);
            })
            .catch(() => {
              failure("上传失败，请重新上传");
            });
        }
      }
    };
  },
  computed: {
    headers() {
      return {
        "X-Wali-Token": getToken()
      };
    },
    goodsImage() {
      return this.blobUrl || this.goods.picUrl || null;
    },
    goodsOnlinePrice() {
      return this.goods.onlinePrice || null;
    },
    goodsCounterPrice() {
      return this.goods.counterPrice || null;
    },
    goodsSpecification() {
      return this.specifications[0].value || null;
    },
    goodsSubtitle() {
      return this.goods.subtitle || null;
    }
  },
  created() {
    this.init(), this.getStationList();
  },
  methods: {
    init: function() {
      if (this.$route.query.id == null) {
        return;
      }

      this.listQuery = this.$route.query.listQuery;

      const goodsId = this.$route.query.id;
      detailGoods(goodsId).then(response => {
        let list = [];
        if (response.data.data.communities[0].communityName === "全平台") {
          list = [];
        } else {
          list = response.data.data.communities;
        }
        // for (let idx in response.data.data.communities) {
        //   list.push({ communityId: response.data.data.communities[idx].communityId, communityName: response.data.data.communities[idx].communityName })
        // }
        this.communityList = list;
        this.communities = list;
        this.goods = response.data.data.goods;
        this.specifications = response.data.data.specifications;
        this.products = response.data.data.products;
        this.rebates = response.data.data.rebates;
        this.attributes = response.data.data.attributes;
        this.categoryIds = response.data.data.categoryIds;
        this.goodsCategoryIds = response.data.data.goodsCategoryIds;
        this.galleryFileList = [];
        for (var i = 0; i < this.goods.gallery.length; i++) {
          this.galleryFileList.push({
            url: this.goods.gallery[i]
          });
        }
        const keywords = response.data.data.goods.keywords;
        if (keywords !== null) {
          this.keywords = keywords.split(",");
        }
      });

      listCatAndBrand().then(response => {
        this.categoryList = response.data.data.categoryList;
        this.goodsCategoryIdList = response.data.data.categoryList;
        this.brandList = response.data.data.brandList;
      });
    },
    getStationList: function() {
      getStationList().then(response => {
        this.stationOption = response.data.data;
      });
    },
    communityMethod(query) {
      if (query !== "") {
        this.communityLoading = true;
        listCommunity({
          name: query,
          page: 1,
          limit: 20
        })
          .then(response => {
            const list = [];
            for (const idx in response.data.data.list) {
              list.push({
                communityId: response.data.data.list[idx].id,
                communityName: response.data.data.list[idx].name
              });
            }
            this.communityList = list;
            this.communityLoading = false;
          })
          .catch(() => {
            this.communityList = [];
            this.communityLoading = false;
          });
      } else {
        this.communityList = [];
      }
    },
    handleLimit(value) {
      if (value === 2) {
        this.goods.isChoice = true;
      } else if (value === 99 || value === 98) {
        this.goods.isChoice = true;
        (this.goods.limit = 1),
          (this.goods.onlinePrice = 0.0),
          (this.goods.offlinePrice = 0.0),
          (this.goods.counterPrice = 0.0);
      }
    },
    handleUnit(value) {
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i];
        v.unit = value;
      }
    },
    handleCategoryChange(value) {
      this.goods.categoryId = value[value.length - 1];
    },
    handleGoodsCategoryChange(value) {
      this.goodsCategoryIds = value;
    },
    handleCancel: function() {
      this.$router.push({
        path: "/goods/list",
        query: { listQuery: this.listQuery }
      });
    },
    submitEditForm(formName) {
      let _this = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (
            (this.goods.isChoice ||
              this.goods.acStatus === 2 ||
              this.goods.acStatus == 98 ||
              this.goods.acStatus == 99) &&
            (this.goods.limit === undefined || this.goods.limit === "")
          ) {
            this.$message.error("限购物品的限购数量必填！！");
            return false;
          }
          //线上物品校验
          if (this.goods.saleType != 2) {
            if (
              this.goods.onlineName === undefined ||
              this.goods.onlineName === ""
            ) {
              this.$message.error("线上名称未填！！");
              return false;
            }
            if (
              this.goods.onlinePrice === undefined ||
              this.goods.onlinePrice === ""
            ) {
              this.$message.error("线上售价未填！！");
              return false;
            }
            if (
              this.goodsCategoryIds === undefined ||
              this.goodsCategoryIds === "" ||
              this.goodsCategoryIds.length === 0
            ) {
              this.$message.error("线上种类未选！！");
              return false;
            }
          }
          //线下物品校验
          if (this.goods.saleType != 1) {
            if (
              this.goods.offlineName === undefined ||
              this.goods.offlineName === ""
            ) {
              this.$message.error("线下物品名称未填！！");
              return false;
            }
            if (
              this.goods.offlinePrice === undefined ||
              this.goods.offlinePrice === ""
            ) {
              this.$message.error("线下物品价格未填！！");
              return false;
            }
            if (
              this.goods.categoryId === undefined ||
              this.goods.categoryId === ""
            ) {
              this.$message.error("线下种类未选！！");
              return false;
            }
            if (
              this.goods.categoryId === undefined ||
              this.goods.categoryId === ""
            ) {
              this.$message.error("请选择物品种类！！");
              return false;
            }
            if (this.goods.saleType == 2) {
              //一维数组转二维数组
              this.goodsCategoryIds = [];
              this.goodsCategoryIds.push(this.categoryIds);
            }
            debugger;
          }

          for (var i = 0; i < this.products.length; i++) {
            const v = this.products[i];
            if (v.number === undefined || v.number < 0) {
              this.$message.error("货品库存异常！！");
              return false;
            }
          }

          let response = {};
          if (this.goods.saleType != 2) {
            //处理生成图片
            if (!_this.goodsImage) {
              _this.$message({
                type: "warning",
                message: "商品图片不能为空"
              });
              return;
            }

            if (!_this.goodsOnlinePrice) {
              _this.$message({
                type: "warning",
                message: "线上售价不能为空"
              });
              return;
            }

            if (!_this.goodsCounterPrice) {
              _this.$message({
                type: "warning",
                message: "专柜价格不能为空"
              });
              return;
            }

            response = await generateSharingGraph.call(
              _this,
              _this.goods.picUrl,
              _this.goods.shareUrl,
              "share-dom",
              "blobUrl"
            );
            if (!response.status) {
              this.$message({
                type: "warning",
                message: "生成分享图片失败"
              });
              return;
            }
          }

          const finalGoods = {
            communities: this.communities,
            goods: {
              ...this.goods,
              shareUrl: this.goods.saleType != 2 ? response.data : null
            },
            specifications: this.specifications,
            products: this.products,
            rebates: this.rebates,
            attributes: this.attributes,
            goodsCategoryIds: this.goodsCategoryIds
          };

          editGoods(finalGoods)
            .then(response => {
              this.$notify.success({
                title: "成功",
                message: "更新成功"
              });
              this.$router.push({
                path: "/goods/list",
                query: { listQuery: this.listQuery }
              });
            })
            .catch(response => {
              MessageBox.alert("业务错误：" + response.data.errmsg, "警告", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleEdit: function() {
      let validateRes = false;
      this.$refs.goods.validate(valid => {
        validateRes = valid;
      });
      if (!validateRes) {
        return;
      }
      if (
        this.goods.isChoice &&
        (this.goods.limit === undefined || this.goods.limit === "")
      ) {
        this.$message.error("请填写限购数量");
        return false;
      }
      const finalGoods = {
        communities: this.communities,
        goods: this.goods,
        specifications: this.specifications,
        products: this.products,
        rebates: this.rebates,
        attributes: this.attributes,
        goodsCategoryIds: this.goodsCategoryIds
      };
      editGoods(finalGoods)
        .then(response => {
          this.$notify.success({
            title: "成功",
            message: "更新成功"
          });
          this.$router.push({ path: "/goods/list" });
        })
        .catch(response => {
          MessageBox.alert("业务错误：" + response.data.errmsg, "警告", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1);
      this.goods.keywords = this.keywords.toString();
    },
    showInput() {
      this.newKeywordVisible = true;
      this.$nextTick(_ => {
        this.$refs.newKeywordInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      const newKeyword = this.newKeyword;
      if (newKeyword) {
        this.keywords.push(newKeyword);
        this.goods.keywords = this.keywords.toString();
      }
      this.newKeywordVisible = false;
      this.newKeyword = "";
    },
    uploadPicUrl: function(response) {
      this.goods.picUrl = response.data.url;
    },
    uploadOverrun: function() {
      this.$message({
        type: "error",
        message: "上传文件个数超出限制!最多上传5张图片!"
      });
    },
    handleGalleryUrl(response, file, fileList) {
      if (response.errno === 0) {
        this.goods.gallery.push(response.data.url);
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.goods.gallery.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
        var url;
        if (file.response === undefined) {
          url = file.url;
        } else {
          url = file.response.data.url;
        }

        if (this.goods.gallery[i] === url) {
          this.goods.gallery.splice(i, 1);
        }
      }
    },
    specChanged: function(label) {
      if (label === false) {
        this.specifications = [
          { specification: "规格", value: "标准", picUrl: "" }
        ];
        this.products = [
          {
            id: 0,
            specifications: ["标准"],
            price: 0.0,
            number: 0,
            url: "",
            productSn: 1,
            unit: "克",
            value: 0
          }
        ];
      } else {
        this.specifications = [];
        this.products = [];
      }
    },
    uploadSpecPicUrl: function(response) {
      this.specForm.picUrl = response.data.url;
    },
    handleSpecificationShow() {
      this.specForm = { specification: "", value: "", picUrl: "" };
      this.specVisiable = true;
    },
    handleSpecificationAdd() {
      var index = this.specifications.length - 1;
      for (var i = 0; i < this.specifications.length; i++) {
        const v = this.specifications[i];
        if (v.specification === this.specForm.specification) {
          index = i;
        }
      }

      this.specifications.splice(index + 1, 0, this.specForm);
      this.specVisiable = false;

      this.specToProduct();
    },
    handleSpecificationUpdate() {
      this.specifications = [];
      this.specifications.push(this.specForm);
      this.specVisiable = false;
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i];
        v.specifications = [];
        v.specifications.push(this.specForm.value);
      }
    },
    handleSpecificationUpdateShow(row) {
      this.specForm = Object.assign({}, row);
      this.specVisiable = true;
    },
    handleSpecificationDelete(row) {
      const index = this.specifications.indexOf(row);
      this.specifications.splice(index, 1);
      this.specToProduct();
    },
    specToProduct() {
      if (this.specifications.length === 0) {
        return;
      }
      // 根据specifications创建临时规格列表
      var specValues = [];
      var spec = this.specifications[0].specification;
      var values = [];
      values.push(0);

      for (var i = 1; i < this.specifications.length; i++) {
        const aspec = this.specifications[i].specification;

        if (aspec === spec) {
          values.push(i);
        } else {
          specValues.push(values);
          spec = aspec;
          values = [];
          values.push(i);
        }
      }
      specValues.push(values);

      // 根据临时规格列表生产货品规格
      // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
      var productsIndex = 0;
      var products = [];
      var combination = [];
      var n = specValues.length;
      for (var s = 0; s < n; s++) {
        combination[s] = 0;
      }
      var index = 0;
      var isContinue = false;
      do {
        var specifications = [];
        for (var x = 0; x < n; x++) {
          var z = specValues[x][combination[x]];
          specifications.push(this.specifications[z].value);
        }
        products[productsIndex] = {
          id: productsIndex,
          specifications: specifications,
          price: 0.0,
          number: 0,
          url: "",
          productSn: (productsIndex + 1).toString(),
          unit: "克",
          value: 0
        };
        productsIndex++;

        index++;
        combination[n - 1] = index;
        for (var j = n - 1; j >= 0; j--) {
          if (combination[j] >= specValues[j].length) {
            combination[j] = 0;
            index = 0;
            if (j - 1 >= 0) {
              combination[j - 1] = combination[j - 1] + 1;
            }
          }
        }
        isContinue = false;
        for (var p = 0; p < n; p++) {
          if (combination[p] !== 0) {
            isContinue = true;
          }
        }
      } while (isContinue);

      this.products = products;
    },
    handleProductShow(row) {
      this.productForm = Object.assign({}, row);
      this.productVisiable = true;
    },
    uploadProductUrl: function(response) {
      this.productForm.url = response.data.url;
    },
    handleProductEdit() {
      if (
        this.productForm.number === undefined ||
        this.productForm.number < 0
      ) {
        this.$message({
          type: "warning",
          message: "货品库存异常！"
        });
        return false;
      }

      let idx = 0;
      const productSn = [];
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i];
        if (v.id === this.productForm.id) {
          idx = i;
        } else {
          productSn.push(v.productSn);
        }
      }
      if (productSn.indexOf(this.productForm.productSn) > -1) {
        this.$message({
          type: "warning",
          message: "货品规格编号已经存在"
        });
        return false;
      }
      this.products.splice(idx, 1, this.productForm);
      // for (var i = 0; i < this.products.length; i++) {
      //   const v = this.products[i]
      //   if (v.id === this.productForm.id) {
      //     this.products.splice(i, 1, this.productForm)
      //     break
      //   }
      // }
      this.productVisiable = false;
    },
    handleAttributeShow() {
      this.attributeForm = {};
      this.attributeVisiable = true;
    },
    handleAttributeAdd() {
      this.attributes.unshift(this.attributeForm);
      this.attributeVisiable = false;
    },
    handleAttributeDelete(row) {
      const index = this.attributes.indexOf(row);
      this.attributes.splice(index, 1);
    },
    handleRebateShow() {
      this.rebateForm = {};
      this.rebateVisiable = true;
    },
    handleRebateAdd() {
      this.rebates.unshift(this.rebateForm);
      this.rebateVisiable = false;
    },
    handleRebateDelete(row) {
      const index = this.rebates.indexOf(row);
      this.rebates.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
$theme-color: #80ba64;
$dark-color: #d3d3d3;

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

.share-dom {
  display: inline-block;
  position: relative;
  width: 500px;
  height: 400px;
  .goods-image {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
  }
  .tips {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    // min-height: 80px;
    background-color: rgba($color: #000000, $alpha: 0.5);
    padding: 10px 10px 5px;
    box-sizing: border-box;
    .main {
      display: flex;
      height: 50px;
      // line-height: 50px;
      align-items: baseline;
      overflow: hidden;
      text-overflow: ellipsis;
      span + span {
        margin-left: 10px;
      }

      .price {
        font-size: 50px;
        color: $theme-color;
      }

      .original-price {
        font-size: 30px;
        color: $dark-color;
        text-decoration: line-through;
      }

      .specification {
        font-size: 40px;
        color: white;
      }
    }

    .desc {
      line-height: 30px;
      font-size: 20px;
      color: white;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-align: left;
    }
  }
}
</style>
