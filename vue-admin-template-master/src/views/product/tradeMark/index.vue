<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!--
       表格组件 
    data:表格组件将来需要展示的数据---数组类型
    broder:是给表格添加边框
    column属性
    label：显示标题
    width:对应列的宽度
    align:标题的对齐方式
    prop；对应列内容的字段名
    注意1：elementUI当中table组件，展示的数据是以一列一列进行展示数据
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
        :index="index"
      >
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px"
        /></template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器 
      当前第几页、数据总条数、每一页展示条数、连续页码数

      current-page:代表的当前第几页
      total：代表分页器一共需要展示多少条数据
      page-size:代表的是每一页需要展示多少条数据
      page-sizes:代表可以设置每一页展示多少条数据
      layout：可以实现分页器布局
      pager-count:按钮的数量 如果8 9 连续页码为7
      -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :pager-count="7"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next,jumper,->,sizes,total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 
      对话框 
      :visible.sync：控制对话框显示与隐藏

      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
      -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 :model属性，这个属性的作用是把表单的数据收集到哪个对象的身上，将来表单验证，也需要这个属性 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
           以下不能使用v-model，因为不是表单元素
           action:设置图片上传地址
            :on-success可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload：可以在上传图片之前，执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      // 自定义校验规则
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 当前第几页
      page: 1,
      // 当前页展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      //列表展示数据
      list: [],
      // 对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      // 收集品牌信息:对象身上的属性不能瞎写，需要看文档要求
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        // required必须要校验字段（前面五角星）trigger：用户行为设置（事件的设置：blur、change）
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // 自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        // 品牌的logo验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  // 组件挂载完毕发送请求
  mounted() {
    // console.log(this.$API);
    // 获取列表数据的方法
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    // 同时也绑定了改变当前页的事件
    async getPageList() {
      const { page, limit } = this;
      // 获取品牌列表的接口
      // 当你向服务器发请求的时候，这个函数需要带参数，因此在data中初始化两个字段，代表给服务器传递参数
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      // console.log(result);
      if (result.code == 200) {
        // 分别是展示数据总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 改变当前页码数
    handleCurrentChange(pager) {
      // console.log(pager);
      this.page = pager;
      this.getPageList();
    },
    //改变当前分页器默认一页所展示的数据
    handleSizeChange(limit) {
      // console.log(limit);
      this.limit = limit;
      this.getPageList();
    },
    //点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      // row当前用户选中这个品牌信息
      // console.log(row);
      // console.log(...row);
      // 显示对话框
      this.dialogFormVisible = true;
      //将已有的品牌信息赋值给tmForm进行展示.
      // 将服务器返回的品牌信息，直接赋值给了tmForm进行展示，也就是tmForm存储的是服务器返回品牌信息
      // { ...row }深拷贝 es6扩展运算符 加花括号包装对象
      this.tmForm = { ...row };
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res上传成功之后返回前端数据
      // console.log(res);
      //file上传成功之后服务返回前端数据
      // console.log(file);
      // 收集品牌图片数据，因为将来需要带给服务器
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
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
    // 添加按钮（添加品牌|修改品牌）
    addOrUpdateTradMark() {
      // 当全部字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部字段符合条件
        // console.log(success);
        if (success) {
          this.dialogFormVisible = false;
          // 发请求（添加品牌|修改品牌）
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          // console.log(result);
          if (result.code == 200) {
            // 弹出信息：添加品牌成功、修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 添加或者修改品牌成功，需要再次请求品牌列表展示数据
            // 如果添加品牌，跳转最后一页，修改品牌应该留在当前页
            if (this.tmForm.id) {
              this.page;
            } else {
              this.page = Math.ceil((this.total + 1) / this.limit);
              // console.log(this.page);
            }
            this.getPageList();
          }
        } else {
          return false;
        }
      });
    },
    //删除品牌的操作
    deleteTradeMark(row) {
      // console.log(row);
      // 弹框
      this.$confirm(`你确定删除${row.tmName}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当用户点击确定按钮会触发
          // 向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          // 如果删除成功
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 如果当前列表长度小于1.则跳转上一页
            if (this.list.length > 1) {
              this.page = this.page;
            } else {
              this.page = this.page - 1;
            }
            // 再次获得品牌列表数据
            this.getPageList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  // 计算属性不能直接传参
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
</style>
