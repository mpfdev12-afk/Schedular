import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Community.scss';

export default function CommunityWelcome() {
    const navigate = useNavigate();

    return (
        <div className="community-welcome-container">
            <div className="welcome-glass-card">
                <h1>Community Circles</h1>
                <p className="welcome-subtitle">A safe, upvote-free sanctuary to discuss Mental, Physical, and Financial wellbeing.</p>
                
                <div className="features-grid">
                    <div className="feature">
                        <h3>🙏 No-Clout Engagement</h3>
                        <p>No algorithms. No upvotes. Just supportive emojis and real advice.</p>
                    </div>
                    <div className="feature">
                        <h3>🛡️ Anonymous Posting</h3>
                        <p>Ask vulnerable questions without revealing your identity to peers.</p>
                    </div>
                    <div className="feature">
                        <h3>🩺 Advisor Verified</h3>
                        <p>Get answers highlighted by certified professionals in the community.</p>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="primary-btn" onClick={() => navigate('/user/login')}>Login to Join</button>
                    <button className="secondary-btn" onClick={() => navigate('/user/register')}>Create Account</button>
                </div>
            </div>
        </div>
    );
}
