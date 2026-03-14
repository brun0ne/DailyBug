const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

function loadEnvVars() {
  const envFiles = ['.env.local', '.env'];
  const vars = {};
  for (const file of envFiles) {
    const filePath = path.resolve(__dirname, file);
    if (!fs.existsSync(filePath)) continue;
    for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
      const match = line.match(/^\s*(EXPO_PUBLIC_\w+)\s*=\s*(.*)\s*$/);
      if (match) vars[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
  // Also pick up vars already present in process.env (e.g. Cloudflare Pages build env)
  for (const [k, v] of Object.entries(process.env)) {
    if (k.startsWith('EXPO_PUBLIC_')) vars[k] = v;
  }
  return vars;
}

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    crypto: false,
  };

  const expoPublicVars = loadEnvVars();
  const definitions = Object.fromEntries(
    Object.entries(expoPublicVars).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)])
  );
  config.plugins.push(new webpack.DefinePlugin(definitions));

  return config;
};