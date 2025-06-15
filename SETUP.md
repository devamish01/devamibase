# Davami eCommerce Platform - Setup Instructions

## 🚀 Complete Full-Stack Setup

This is a production-ready eCommerce platform with React frontend and Node.js backend.

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 🔧 Backend Setup

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**

   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/davami
   JWT_SECRET=your-super-secret-jwt-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

5. **Start MongoDB** (if using local instance)

6. **Seed the database with sample data:**

   ```bash
   npm run seed
   ```

7. **Start the backend server:**

   ```bash
   npm run dev
   ```

   The API will be available at: `http://localhost:5000`

### 🎨 Frontend Setup

1. **Navigate to project root:**

   ```bash
   cd ..
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Create frontend environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Configure frontend environment variables:**

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

5. **Start the frontend development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:5173`

### 📦 Database Seeding

The seed script creates:

- 6 sample products with images and details
- Default admin user: `admin@davami.com` / `admin123`

### 🔐 Default Login Credentials

**Admin Access:**

- Email: `admin@davami.com`
- Password: `admin123`

**For Testing:**

- Create new user accounts via registration
- Use demo payment flow (no real charges)

### 🎯 Available Features

#### Frontend Features:

- ✅ Beautiful responsive homepage with hero section
- ✅ Product catalog with search and filtering
- ✅ Product detail pages with image carousels
- ✅ User authentication (login/register)
- ✅ Shopping cart functionality
- ✅ Secure checkout process
- ✅ User profile management
- ✅ Order history and tracking
- ✅ Admin panel for product management

#### Backend Features:

- ✅ Complete REST API with authentication
- ✅ JWT-based security
- ✅ MongoDB database integration
- ✅ Shopping cart and order management
- ✅ Payment processing (Stripe integration)
- ✅ File upload for product images
- ✅ Admin panel APIs
- ✅ Order management and status tracking

### 🛒 Usage Guide

1. **Browse Products**: Visit homepage to see product catalog
2. **Search & Filter**: Use search bar and category filters
3. **Add to Cart**: Click cart icon on product cards
4. **Checkout**: Complete purchase with shipping details
5. **Admin Panel**: Access at `/admin` with admin credentials
6. **Manage Products**: Add/edit/delete products via admin panel

### 🔧 Development Scripts

**Frontend:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Type checking

**Backend:**

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### 🚀 Production Deployment

#### Backend Deployment:

1. Set production environment variables
2. Use process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

#### Frontend Deployment:

1. Build the frontend: `npm run build`
2. Deploy to static hosting (Vercel, Netlify)
3. Update API_URL to production backend

### 🔗 API Endpoints

**Authentication:**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Products:**

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)

**Cart:**

- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item

**Orders:**

- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders

**Admin:**

- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders

### 💳 Payment Integration

The platform includes Stripe integration for secure payments:

- Test mode by default
- Complete checkout flow
- Order confirmation and tracking
- Payment status management

### 🎨 Customization

The platform is fully customizable:

- **Design System**: Update `tailwind.config.ts` for colors/themes
- **Branding**: Update logos and brand elements
- **Products**: Manage via admin panel
- **Content**: Update pages and components

### 🐛 Troubleshooting

**Common Issues:**

1. **MongoDB Connection Error:**

   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **API Connection Error:**

   - Verify backend server is running on port 5000
   - Check VITE_API_URL in frontend `.env`

3. **Authentication Issues:**
   - Clear browser storage
   - Check JWT_SECRET configuration

### 📞 Support

This is a complete, production-ready eCommerce platform with:

- Modern React frontend with TypeScript
- Secure Node.js/Express backend
- MongoDB database
- Stripe payment integration
- Admin panel for content management
- Responsive design
- SEO-friendly structure

Perfect for digital product sales, services, or any eCommerce needs!
