import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/mockPosts';
import './CreatePostPage.css';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !category || !location) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert('Your post has been created and shared with the community!');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="create-page">
      <header className="create-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back
        </button>
        <h1>Create New Post</h1>
      </header>

      <div className="create-content">
        <div className="create-intro">
          <h2>Create New Post</h2>
          <p>Share an item with your community</p>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          <h3>Item Details</h3>

          <div className="form-group">
            <label>
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Children's Books Collection"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Category <span className="required">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Description <span className="required">*</span>
            </label>
            <textarea
              placeholder="Describe the item, its condition, and any other relevant details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              required
            />
            <span className="hint">
              Be detailed! Include condition, size, age, etc.
            </span>
          </div>

          <div className="form-group">
            <label>
              Location <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Downtown, Main Street"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <span className="hint">
              General area is fine - don't share your exact address
            </span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
