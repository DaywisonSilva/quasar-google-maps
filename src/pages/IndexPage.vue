<template>
  <div ref="mapRef" class="container"></div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const mapRef = ref();

    onMounted(() => {
      new google.maps.Map(mapRef.value as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    });

    return { mapRef };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 50px);
}
</style>
