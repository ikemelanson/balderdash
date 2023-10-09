<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  name: "alertComponent",
  props: {
    message: String,
  },
};
</script>
