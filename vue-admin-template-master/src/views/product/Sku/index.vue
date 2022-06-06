<template>
  <div>
    <!-- 表格 -->
    <el-table :data="records" style="width: 100%" border>
      <el-table-column
        type="index"
        label="序号"
        width="80"
        :index="index"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            v-if="row.isSale == 1"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="skuDelete(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :total="total"
      layout="prev,pager,next,jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 10px"
          >
            {{ attr.attrId }}-{{ attr.valueId }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="450px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 当前页
      page: 1,
      // 当前页展示几条数据
      limit: 10,
      // 存储sku列表
      records: [],
      // 存储分页器一共展示的数据
      total: 0,
      // 存储sku信息
      skuInfo: {},
      // 抽屉显示初始值
      show: false,
    };
  },
  // 组件挂在完毕
  mounted() {
    this.getSkuList();
  },
  methods: {
    // 获取sku列表数据
    async getSkuList() {
      // 解构出默认参数
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 改变当前页码数
    handleCurrentChange(pager) {
      // console.log(pager);
      this.page = pager;
      this.getSkuList();
    },
    //改变当前分页器默认一页所展示的数据
    handleSizeChange(limit) {
      // console.log(limit);
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async cancel(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    // 下架
    async sale(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    edit() {
      this.$message("正在开发中");
    },
    // 获取sku详情
    async getSkuInfo(sku) {
      // 展示抽屉
      this.show = true;
      let result = await this.$API.sku.reqSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
    // 删除sku
    async skuDelete(sku) {
      try {
        let result = await this.$API.sku.reqSkuDelete(sku.id);

        this.$message({ type: "success", message: "删除成功" });
        this.getSkuList();
      } catch (error) {}
    },
  },
  computed: {
    // 使索引按总数一个一个来
    // 每一页只算起始index
    index() {
      // 等差数列An=A1+(n-1)d
      return 1 + (this.page - 1) * this.limit;
    },
  },
};
</script>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>