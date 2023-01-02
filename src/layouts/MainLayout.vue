<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img :src="quasarLogo" />
          </q-avatar>
          Quasar + Google Maps
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      behavior="desktop"
    >
      <!-- drawer content -->
      <q-tabs vertical inline-label active-color="primary" align="left">
        <q-route-tab icon="map" label="padrão" to="/" exact />
        <q-route-tab
          icon="style"
          label="estilo customizado"
          to="/map-custom-style"
          exact
        />
        <q-route-tab
          icon="directions_walk"
          label="StreetView"
          to="/streetview"
          exact
        />
        <q-route-tab
          icon="alt_route"
          label="Directions"
          to="/directions"
          exact
        />
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animated fadeInLeft slow">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import quasarLogo from 'assets/images/quasar-maps-logo.svg';

export default defineComponent({
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      quasarLogo,
    };
  },
});
</script>
