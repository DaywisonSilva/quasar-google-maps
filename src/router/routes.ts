import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/AppMap.vue') },
      {
        path: 'map-custom-style',
        name: 'MapCustomStyle',
        component: () => import('src/pages/AppMapCustomStyle.vue'),
      },
      {
        path: 'streetview',
        name: 'StreetView',
        component: () => import('src/pages/AppStreetView.vue'),
      },
      {
        path: 'directions',
        name: 'directions',
        component: () => import('src/pages/AppMapDirections.vue'),
      },
      {
        path: 'marker',
        name: 'marker',
        component: () => import('src/pages/AppMapCustomMarker.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
