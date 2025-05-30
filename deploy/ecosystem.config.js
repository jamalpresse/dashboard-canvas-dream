
module.exports = {
  apps: [{
    name: 'dash-ihata',
    script: 'npx',
    args: 'serve -s dist -l 3001',
    cwd: '/var/www/dash-ihata',
    instances: 2,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/dash-ihata-error.log',
    out_file: '/var/log/pm2/dash-ihata-out.log',
    log_file: '/var/log/pm2/dash-ihata-combined.log',
    time: true
  }]
};
