module.exports = {
  render (pageName) {
    const firstUppercase = (str) => {
      return Array.from(str).reduce((str, k, index) => str += (index === 0 ? k.toUpperCase() : k), '');
    };
    return {
      'app.vue': 
`<template>Hello world</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: '${firstUppercase(pageName)}'
});
</script>`,
{{#if ts}}'main.ts'{{else}}'main.js'{{/if}}: 
`import { createApp } from 'vue';
import App from './app.vue';
createApp(App).mount('#${pageName}');`
    };
  }
};