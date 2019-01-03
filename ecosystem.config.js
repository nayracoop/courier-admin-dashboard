module.exports = {
  apps : [
    {
      name      : 'CourierDashboard',
      script    : './server.js',
      watch     : true,
      instances : 4,
      exec_mode : 'cluster',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]
};
