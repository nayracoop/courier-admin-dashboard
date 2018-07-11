module.exports = {
  apps : [
    {
      name      : 'CourierDashboard',
      script    : 'serve',
      watch     : true,
      instances : 4,
      exec_mode : 'cluster',
      env: {
        COMMON_VARIABLE: 'true',
        PM2_SERVE_PATH: './dist',
        PM2_SERVE_PORT: 8081
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]
};
