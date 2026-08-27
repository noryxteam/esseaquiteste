module.exports = {
  apps: [
    {
      name: "norax-api",
      cwd: "/var/www/norax/backend",
      script: "node_modules/.bin/tsx",
      args: "src/server.ts",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "norax-web",
      cwd: "/var/www/norax",
      script: "node_modules/.bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
