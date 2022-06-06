<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg
        t="1654085472038"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2441"
        width="16"
        height="16"
      >
        <path
          d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m0-64A448 448 0 1 0 512 64a448 448 0 0 0 0 896zM512 192a32 32 0 0 1 32 32v384a32 32 0 0 1-64 0v-384A32 32 0 0 1 512 192z m0 640a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"
          fill="#8D8D8D"
          p-id="2442"
        ></path>
      </svg>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "count"],
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}
.card-content {
  font-size: 30px;
  padding: 10px 0px;
}
.card-charts {
  height: 50px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>