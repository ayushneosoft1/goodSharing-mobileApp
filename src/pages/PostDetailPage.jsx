import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPosts } from '../data/mockPosts';
import './PostDetailPage.css';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="detail-page">
        <div className="error-container">
          <h2>Post Not Found</h2>
          <p>The post you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back
        </button>
        <h1>Post Details</h1>
      </header>

      <div className="detail-content">
        <img src={post.imageUrl} alt={post.title} className="detail-image" />

        <div className="detail-body">
          <div className="title-section">
            <h2 className="detail-title">{post.title}</h2>
            <span className="detail-badge">{post.category}</span>
          </div>

          <div className="info-card">
            <h3>Shared by</h3>
            <div className="owner-info">
              <div className="owner-avatar">{post.owner.name.charAt(0)}</div>
              <div>
                <div className="owner-name">{post.owner.name}</div>
                <div className="info-meta">📍 {post.location}</div>
                <div className="info-meta">🕒 {formatDate(post.createdAt)}</div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>Description</h3>
            <p className="detail-description">{post.description}</p>
          </div>

          <div className="action-buttons">
            <button className="btn-primary">💬 Message Owner</button>
            <button className="btn-secondary">❤️ Show Interest</button>
          </div>

          <div className="tip-card">
            <p>
              💡 <strong>Tip:</strong> When you message the owner, be polite and
              explain why you're interested in this item. Arrange a safe meeting
              place for pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
