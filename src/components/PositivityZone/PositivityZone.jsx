import React from 'react';
import './PositivityZone.scss';

export const PositivityZone = ({ image, category, title, description, author, avatar, time }) => {
  return (
    <div className="blog-card">
      <img src={image} alt={title} className="blog-image" />
      <div className="blog-content">
        <span className="blog-category">{category}</span>
        <h3 className="blog-title">{title}</h3>
        <p className="blog-description">{description}</p>
        <div className="blog-footer">
          <img src={avatar} alt={author} className="author-avatar" />
          <div className="author-info">
            <span className="author-name">{author}</span>
            <span className="read-time">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositivityZone;
