# E-Commerce Marketplace

A modern, full-featured e-commerce marketplace built with React, TypeScript, and HeroUI. This application provides a complete online shopping experience with user authentication, product management, shopping cart functionality, order processing, and an admin dashboard.

## 🚀 Features

### For Customers
- **Homepage** - Featured products and promotional content
- **Shop** - Browse products with filtering and search
- **Product Details** - Detailed product information with images
- **Shopping Cart** - Add/remove items and manage quantities
- **User Authentication** - Register, login, and password recovery
- **Order Management** - View order history and track orders
- **User Profile** - Manage personal information and preferences
- **Blog** - Read articles and stay updated
- **Contact** - Get in touch with customer support

### For Administrators
- **Dashboard** - Overview of sales, orders, and analytics
- **Product Management** - Add, edit, and manage products
- **Category Management** - Organize products by categories
- **Order Management** - Process and track customer orders
- **User Management** - Manage customer accounts
- **Blog Management** - Create and manage blog content
- **Promotional Carousel** - Manage homepage promotional content
- **Reports** - Generate sales and analytics reports
- **Settings** - Configure system settings

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: HeroUI v2
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React & Iconify
- **Animations**: Framer Motion
- **Code Quality**: ESLint, Prettier

## 📦 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm, yarn, pnpm, or bun

### Clone the repository
```bash
git clone <repository-url>
cd ecommerce
```

### Install dependencies
```bash
npm install
```

### Setup pnpm (if using pnpm)
If you are using `pnpm`, add the following to your `.npmrc` file:
```bash
public-hoist-pattern[]=*@heroui/*
```

Then run `pnpm install` again.

## 🚀 Development

### Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Lint and fix code
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── api/              # API service functions
├── components/       # Reusable UI components
│   ├── admin/       # Admin-specific components
│   └── common/      # Shared components
├── config/          # Configuration files
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── layouts/         # Layout components
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   ├── auth/        # Authentication pages
│   └── user/        # User-facing pages
├── styles/          # Global styles
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
└── provider.tsx     # Context providers
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory and add your configuration:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_APP_NAME=E-Commerce Marketplace
```

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configuration in `tailwind.config.js`.

## 🚀 Deployment

### Vercel (Recommended)
The project includes a `vercel.json` configuration file for easy deployment on Vercel.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
You can deploy to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint and fix code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [HeroUI](https://heroui.com) for the beautiful UI components
- [Vite](https://vitejs.dev) for the fast build tool
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [React](https://reactjs.org) for the amazing frontend library
