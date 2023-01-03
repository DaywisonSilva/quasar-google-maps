import { boot } from 'quasar/wrappers';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  window.google = null!;
  // something to do
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${apiKey}&language=pt-BR`;

  document.head.appendChild(script);
});
