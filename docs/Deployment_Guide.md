# Deployment Guide
**School Staff Task Management — Adhira International School**
*WebTree IT Solution | Version 1.0 | April 2026*

---

## Prerequisites

| Requirement | Version |
|---|---|
| Ubuntu Linux (VPS) | 22.04 LTS |
| Node.js | 20 LTS |
| MySQL | 8.0 |
| Redis | 7+ |
| Nginx | Latest stable |
| PM2 | Latest |
| Git | 2+ |

---

## 1. Server Provisioning

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL 8
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server

# Install Nginx
sudo apt install -y nginx
sudo systemctl enable nginx

# Install PM2 globally
sudo npm install -g pm2
```

---

## 2. MySQL Setup

```sql
-- Run as MySQL root
CREATE DATABASE school_taskdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'school_user'@'localhost' IDENTIFIED BY 'StrongPassword!';
GRANT ALL PRIVILEGES ON school_taskdb.* TO 'school_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Application Deployment

```bash
# Clone the repository
git clone https://github.com/your-org/school-task-management.git /var/www/school-task
cd /var/www/school-task

# --- Backend ---
cd backend
npm install --production
cp .env.example .env
# Edit .env with production values:
nano .env

# Run database migrations
npx sequelize-cli db:migrate

# Seed initial admin data
npx ts-node seeders/adminSeed.ts

# --- Frontend ---
cd ../frontend
npm install
npm run build
# Copy dist/ to backend/public/ for static serving
cp -r dist/* ../backend/public/
```

---

## 4. PM2 Process Management

```bash
cd /var/www/school-task/backend

# Start application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list to restart on reboot
pm2 save
pm2 startup

# Useful PM2 commands
pm2 status           # View running processes
pm2 logs school-task # View application logs
pm2 restart school-task
pm2 stop school-task
```

---

## 5. Nginx Configuration

Copy the project's `nginx.conf` or create `/etc/nginx/sites-available/school-task`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/school-task /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 6. SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Certbot auto-renews. Verify with:
sudo certbot renew --dry-run
```

---

## 7. Automated Database Backups

The project includes `scripts/backup.sh`. Set up a daily cron:

```bash
crontab -e
# Add:
0 2 * * * /var/www/school-task/scripts/backup.sh >> /var/log/school-task-backup.log 2>&1
```

---

## 8. Environment Variables Checklist

Before go-live, ensure all `.env` values are set:

- [ ] `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` (strong random strings)
- [ ] `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (for email alerts)
- [ ] `FRONTEND_URL` (your production domain)
- [ ] `REDIS_HOST`, `REDIS_PORT`
- [ ] `NODE_ENV=production`

---

## 9. Post-Deployment Checks

```bash
# Health check
curl https://yourdomain.com/api/health

# Check PM2 logs for errors
pm2 logs school-task --lines 50

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## 10. Docker (Optional — Phase 2)

A `docker-compose.yml` is included in the project root. To run via Docker:

```bash
docker-compose up -d
```

This starts the backend, MySQL, and Redis containers. Nginx must still be configured on the host for SSL termination.

---

*WebTree IT Solution — hr@webtreeitsolution.com*
