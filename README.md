# goodSharing Web App

A React web application for sharing items within your community. Built with Vite and plain JavaScript (no TypeScript).

## 🚀 Features

- **Authentication**: Login and signup functionality
- **Browse Posts**: View all items shared by community members  
- **Post Details**: See complete information about shared items
- **Create Posts**: Share your own items with the community
- **Drawer Navigation**: Easy access via hamburger menu
- **Light Sky Blue Theme**: Clean and modern UI

## 📱 Screens

1. **Login/Signup** - User authentication with tabs
2. **Posts List** - Browse all available items with grid layout
3. **Post Detail** - View full item details
4. **Create Post** - Share new items with form

## 🛠️ Tech Stack

- **React** 18.3
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **JavaScript** - No TypeScript, kept simple!
- **CSS** - Plain CSS modules

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Color Theme

Light sky blue theme:
- Primary: `#0ea5e9` (Sky Blue)
- Background: `#e0f2fe` (Light Sky Blue)
- Text: `#0c4a6e` (Dark Blue)
- Card: `#ffffff` (White)
- Border: `#bae6fd` (Light Blue)

## 🔐 Authentication

Currently uses **mock authentication** with localStorage:
- Any email/password combination works
- User data is stored locally
- In production, replace with your GraphQL backend API

## 🔄 Backend Integration

When ready to connect to your GraphQL backend:

1. Install Apollo Client: `npm install @apollo/client graphql`
2. Replace mock auth in `src/contexts/AuthContext.jsx`
3. Replace mock posts with GraphQL queries
4. Add proper error handling

## 📂 Project Structure

```
src/
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
├── index.css            # Global styles
├── contexts/
│   └── AuthContext.jsx  # Authentication context
├── data/
│   └── mockPosts.js     # Mock data
└── pages/
    ├── LoginPage.jsx
    ├── PostsListPage.jsx
    ├── PostDetailPage.jsx
    └── CreatePostPage.jsx
```

## 💾 Saving for Free Account

Since you're on a free account, here's how to save this:

**Option 1 - GitHub (Recommended):**
```bash
git init
git add .
git commit -m "Initial commit - goodSharing web app"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

**Option 2 - Download Files:**
- Copy all files to your local machine
- Maintain the folder structure
- Zip and save to cloud storage

## 🚀 Next Steps

- [ ] Connect to GraphQL backend
- [ ] Add image upload functionality
- [ ] Add real-time notifications
- [ ] Add user profiles
- [ ] Deploy to Vercel/Netlify

---

**Made for the goodSharing platform**
