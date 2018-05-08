/* eslint-disable */
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireMobX = require('react-app-rewire-mobx');

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  config = rewireLess.withLoaderOptions({
    modifyVars: { '@primary-color': '#25476a' },
  })(config, env);
  config = injectBabelPlugin('babel-plugin-styled-components', config);
  config = rewireMobX(config, env);
  return config;
};
