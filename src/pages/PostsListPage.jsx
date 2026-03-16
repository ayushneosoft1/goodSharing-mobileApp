import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockPosts } from '../data/mockPosts';
import './PostsListPage.css';

export default function PostsListPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="posts-page">
      <header className="header">
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="header-title">goodSharing</h1>
      </header>

      {menuOpen && (
        <div className="drawer-overlay" onClick={() => setMenuOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>📦 goodSharing</h2>
              <p>Share what you have, find what you need</p>
            </div>

            <div className="user-info">
              <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
              <div>
                <div className="user-name">{user?.name}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            </div>

            <nav className="drawer-menu">
              <button onClick={() => { setMenuOpen(false); navigate('/'); }}>
                📋 Browse Posts
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/create'); }}>
                ➕ Create Post
              </button>
            </nav>

            <div className="drawer-footer">
              <button onClick={logout} className="logout-btn">🚪 Logout</button>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        <div className="page-header">
          <h2 className="page-title">Available Items</h2>
          <p className="page-subtitle">Browse items shared by community members</p>
        </div>

        <div className="posts-grid">
          {mockPosts.map((post) => (
            <Link to={`/posts/${post.id}`} key={post.id} className="post-card">
              <img src={post.imageUrl} alt={post.title} className="post-image" />
              <div className="post-content">
                <div className="post-header">
                  <h3 className="post-title">{post.title}</h3>
                  <span className="badge">{post.category}</span>
                </div>
                <p className="post-description">{post.description}</p>
                <div className="post-meta">
                  <div className="meta-item">👤 {post.owner.name}</div>
                  <div className="meta-item">📍 {post.location}</div>
                  <div className="meta-item">🕒 {formatDate(post.createdAt)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Link to="/create" className="fab">
        + Create Post
      </Link>
    </div>
  );
}
