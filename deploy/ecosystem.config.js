module.exports = {
  apps: [
    {
      name: "coconutclash-server",
      script: "dist/index.js",
      cwd: "./server",
      instances: 1, // Colyseus is stateful, so we keep 1 instance by default unless using Redis
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",
      env: {
        NODE_ENV: "production",
        PORT: 2567
      }
    }
  ]
};
