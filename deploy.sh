#!/bin/bash
# ComiAI 服务器部署脚本
# 用法：scp 到服务器后，bash deploy.sh

set -e

APP_DIR="/opt/comiai"
NODE_VERSION="20"

echo "=== 1. 安装 Node.js ==="
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
  apt-get install -y nodejs
fi
echo "Node: $(node -v)"

echo "=== 2. 安装 PM2 ==="
npm install -g pm2 2>/dev/null || true

echo "=== 3. 安装 Nginx ==="
apt-get install -y nginx

echo "=== 4. 创建应用目录 ==="
mkdir -p $APP_DIR
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' . $APP_DIR/

echo "=== 5. 安装依赖并构建 ==="
cd $APP_DIR
npm install
npm run build

echo "=== 6. 配置 PM2 ==="
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'comiai',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '--experimental-strip-types',
    env: {
      NODE_ENV: 'production',
      SERVER_PORT: 3001,
    },
    watch: false,
    instances: 1,
    restart_delay: 3000,
  }]
};
EOF

pm2 delete comiai 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup | tail -1 | bash || true

echo "=== 7. 配置 Nginx ==="
# 替换下面的 YOUR_DOMAIN 为你的实际域名或 IP
DOMAIN=${1:-"_"}

cat > /etc/nginx/sites-available/comiai << EOF
server {
    listen 80;
    server_name $DOMAIN;

    client_max_body_size 20M;

    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:3001;
    }

    location / {
        root $APP_DIR/dist;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/comiai /etc/nginx/sites-enabled/comiai
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "=== 部署完成 ==="
echo "访问地址: http://$DOMAIN"
echo "PM2 状态: pm2 status"
echo "查看日志: pm2 logs comiai"
