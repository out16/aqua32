const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/', // Caminho base para produção e desenvolvimento
  outputDir: 'dist', // Pasta de saída do build
  assetsDir: 'static', // Pasta para assets (opcional)
  indexPath: 'index.html', // Arquivo principal (opcional)
});