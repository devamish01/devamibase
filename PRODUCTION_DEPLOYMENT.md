# 🚀 Davami eCommerce - Production Deployment Guide

This guide will help you deploy your Davami eCommerce platform to production with a live backend API.

## 📋 Overview

Your Davami project consists of:

- **Frontend**: React/TypeScript SPA (currently running)
- **Backend**: Node.js/Express API server (in `/server` folder)
- **Database**: MongoDB for data persistence
- **File Storage**: Local/cloud storage for product images

## 🛠️ Step 1: Backend Setup & API Configuration

### 1.1 Enable Backend Mode

First, let's configure your frontend to use the backend API:

```bash
# In your project root, create/update the .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 1.2 Start the Backend Server Locally

```bash
# Navigate to server directory
cd server

# Install dependencies (if not already done)
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

**Server .env configuration:**

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:8080

# Database
MONGODB_URI=mongodb://localhost:27017/davami
# Or use MongoDB Atlas for cloud database:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/davami

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 1.3 Start the Backend

```bash
# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

## 🌐 Step 2: Production Deployment Options

### Option A: Deploy to Vercel + Railway (Recommended)

#### Frontend Deployment (Vercel)

1. **Prepare for deployment:**

```bash
# In project root, create production .env
echo "VITE_API_URL=https://your-backend-domain.railway.app/api" > .env.production
```

2. **Deploy to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set build command: npm run build
# - Set output directory: dist
```

#### Backend Deployment (Railway)

1. **Create Railway account:** https://railway.app

2. **Deploy backend:**

```bash
# In server directory
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

3. **Configure environment variables in Railway dashboard:**

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/davami
JWT_SECRET=your-production-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_stripe_live_key
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Option B: Deploy to Netlify + Heroku

#### Frontend (Netlify)

1. **Connect GitHub repository to Netlify**
2. **Set build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Add environment variables:**
   - `VITE_API_URL=https://your-backend-app.herokuapp.com/api`

#### Backend (Heroku)

1. **Create Heroku app:**

```bash
# In server directory
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-production-jwt-secret
```

2. **Deploy:**

```bash
git subtree push --prefix server heroku main
```

### Option C: Full VPS Deployment (DigitalOcean/AWS)

#### Server Setup

1. **Create a VPS (Ubuntu 20.04+)**

2. **Install Node.js and MongoDB:**

```bash
# SSH into your server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

3. **Deploy your application:**

```bash
# Clone your repository
git clone https://github.com/yourusername/davami-ecommerce.git
cd davami-ecommerce

# Setup backend
cd server
npm install --production
npm run seed

# Install PM2 for process management
npm install -g pm2

# Start the backend
pm2 start server.js --name "davami-backend"
pm2 startup
pm2 save
```

4. **Setup Nginx reverse proxy:**

```bash
sudo apt install nginx

# Create nginx configuration
sudo nano /etc/nginx/sites-available/davami
```

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/davami;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Build and deploy frontend:**

```bash
# Build frontend
npm run build

# Copy to nginx directory
sudo cp -r dist/* /var/www/davami/

# Enable site
sudo ln -s /etc/nginx/sites-available/davami /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔐 Step 3: Database Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create account:** https://www.mongodb.com/atlas
2. **Create cluster and get connection string**
3. **Update MONGODB_URI in your environment variables**

### Option B: Local MongoDB

```bash
# Install MongoDB locally
# Ubuntu/Debian:
sudo apt update
sudo apt install mongodb

# macOS:
brew install mongodb/brew/mongodb-community

# Start MongoDB
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

## 🎨 Step 4: Frontend Configuration

Update your frontend to use the backend API:

```typescript
// In src/lib/api.ts - already configured to detect backend availability
// When backend is running, click "Check Again" in the demo notification
```

### Production Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

## 💳 Step 5: Payment Setup (Stripe)

1. **Create Stripe account:** https://stripe.com
2. **Get API keys from Stripe Dashboard**
3. **Update environment variables:**
   - Backend: `STRIPE_SECRET_KEY`
   - Frontend: `VITE_STRIPE_PUBLISHABLE_KEY`

## 📧 Step 6: Email Configuration (Optional)

For order confirmations and contact forms:

```env
# Add to server .env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🔒 Step 7: SSL Certificate (Production)

### For VPS Deployment:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### For Cloud Platforms:

- Vercel/Netlify: SSL included automatically
- Railway/Heroku: SSL included automatically

## 🚀 Step 8: Enable Backend Mode

Once your backend is deployed and running:

1. **Visit your frontend application**
2. **Click "Check Again" in the demo notification**
3. **The app will switch to backend mode automatically**

## 📊 Step 9: Monitoring & Maintenance

### Set up monitoring:

```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-server-monit
```

### Regular maintenance:

- Monitor server resources
- Backup database regularly
- Update dependencies
- Monitor error logs

## 🧪 Step 10: Testing Your Production Setup

### Test checklist:

- [ ] Frontend loads correctly
- [ ] Products display from database
- [ ] User registration/login works
- [ ] Cart functionality works
- [ ] Order placement works
- [ ] Admin panel accessible
- [ ] File uploads work
- [ ] Payment processing works

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors:**

```javascript
// In server/server.js, update CORS config:
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:8080",
    credentials: true,
  }),
);
```

2. **Environment Variables Not Loading:**

```bash
# Verify .env files exist and are properly formatted
# Check that environment variables are set in deployment platform
```

3. **Database Connection Issues:**

```bash
# Check MongoDB connection string
# Verify IP whitelist in MongoDB Atlas
# Check firewall settings
```

## 📈 Performance Optimization

### Frontend:

- Enable build optimizations
- Use CDN for static assets
- Implement caching strategies

### Backend:

- Implement Redis for caching
- Optimize database queries
- Use compression middleware

## 🎯 Quick Start Commands

```bash
# Start development environment
npm run dev                    # Frontend
cd server && npm run dev      # Backend

# Build for production
npm run build                 # Frontend
cd server && npm start        # Backend production

# Deploy to cloud platforms
vercel                        # Frontend to Vercel
railway up                    # Backend to Railway
```

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Check server logs for backend issues
3. Verify environment variables are set correctly
4. Test API endpoints directly using tools like Postman

Your Davami eCommerce platform is now ready for production! 🎉
