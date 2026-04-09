import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchDataFromApi, sendDataToapi, updateDatatoapi, deleteDataFromApi } from '../../utils/api';
import { toast } from 'react-toastify';
import EditPostModal from '../../components/EditPostModal/EditPostModal';
import './PostDetail.scss';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const role = useSelector(state => state.role);
    
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyBody, setReplyBody] = useState("");
    const [replyingAsAnon, setReplyingAsAnon] = useState(false);
    
    // Owner Controls
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchPostData();
    }, [id]);

    const fetchPostData = () => {
        setLoading(true);
        fetchDataFromApi(`/community/posts/${id}`)
            .then(res => {
                setPost(res.data.post);
                setReplies(res.data.replies);
            })
            .catch(err => {
                toast.error("Error loading post");
                navigate('/community');
            })
            .finally(() => setLoading(false));
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if(!replyBody.trim()) return;

        try {
            const res = await sendDataToapi(`/community/posts/${id}/reply`, {
                body: replyBody,
                isAnonymous: replyingAsAnon
            }, 'application/json');
            if(res.data && res.data.success) {
                toast.success("Reply added");
                setReplyBody("");
                fetchPostData();
            }
        } catch(err) {
            toast.error("Failed to add reply");
        }
    };

    const handleReaction = async (emoji) => {
        try {
            await sendDataToapi(`/community/posts/${id}/react`, { emoji }, 'application/json');
            fetchPostData(); // refresh reactions
        } catch(err) {
            toast.error("Failed to react");
        }
    };

    const handleAdminModerate = async (status) => {
        if(!window.confirm(`Are you sure you want to change this post status to ${status}?`)) return;
        try {
            await updateDatatoapi(`/community/moderate/${id}`, { status }, 'application/json');
            toast.info(`Post marked as ${status}`);
            if(status === 'deleted' || status === 'hidden') {
                navigate('/community');
            }
        } catch(err) {
            toast.error("Moderation failed");
        }
    };

    const handleOwnerDelete = async () => {
        if(!window.confirm("Are you sure you want to permanently delete your post?")) return;
        try {
            const res = await deleteDataFromApi(`/community/posts/owner/${id}`);
            if(res.data && res.data.success) {
                toast.success("Your post has been deleted");
                navigate('/community');
            }
        } catch (err) {
            toast.error("Failed to delete post");
        }
    };

    if (loading) return <div className="loading-state">Loading sanctuary...</div>;
    if (!post) return <div className="empty-state">Post not found.</div>;

    // Tally reactions cleanly
    const reactCounts = post.reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="post-detail-container">
            <button className="back-btn" onClick={() => navigate('/community')}>← Back to Circles</button>

            {/* Admin Controls */}
            {user?.isAdmin && (
                <div className="admin-controls">
                    <span className="admin-badge">Admin View</span>
                    <button onClick={() => handleAdminModerate('hidden')}>Hide Post</button>
                    <button onClick={() => handleAdminModerate('deleted')} className="danger">Delete Post</button>
                </div>
            )}
            
            {/* Owner Controls */}
            {user && post && post.authorId?._id === user._id && !user.isAdmin && (
                <div className="admin-controls" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                    <span className="admin-badge" style={{ color: '#4f46e5' }}>You Own This Post</span>
                    <button onClick={() => setShowEditModal(true)} style={{ borderColor: '#c7d2fe', color: '#4f46e5' }}>Edit</button>
                    <button onClick={handleOwnerDelete} className="danger">Delete</button>
                </div>
            )}

            <div className="main-post">
                <div className="post-header">
                    <span className="domain-tag">{post.domain}</span>
                    <span className="author">Posted by: {post.isAnonymous ? "Anonymous Seeker" : (post.authorId?.fullname || "User")}</span>
                </div>
                <h1>{post.title}</h1>
                <p className="post-body">{post.body}</p>

                <div className="reactions-box">
                    <button className="react-btn" onClick={() => handleReaction('🙏')}>
                        🙏 {reactCounts['🙏'] || 0} Respect
                    </button>
                    <button className="react-btn" onClick={() => handleReaction('🤝')}>
                        🤝 {reactCounts['🤝'] || 0} Relate
                    </button>
                    <button className="react-btn" onClick={() => handleReaction('❤️')}>
                        ❤️ {reactCounts['❤️'] || 0} Support
                    </button>
                </div>
            </div>

            <div className="replies-section">
                <h2>{replies.length} Replies</h2>
                
                {replies.map(reply => (
                    <div key={reply._id} className={`reply-card ${reply.authorModel === 'Advisor' ? 'advisor-verified' : ''}`}>
                        {reply.authorModel === 'Advisor' && (
                            <div className="advisor-badge">✨ Advisor Verified</div>
                        )}
                        <p>{reply.body}</p>
                        <span className="reply-author">
                            — {reply.isAnonymous ? "Anonymous" : (reply.authorId?.fullname || "User")}
                        </span>
                    </div>
                ))}
            </div>

            <div className="reply-form-container">
                <form onSubmit={handleReplySubmit}>
                    <textarea 
                        placeholder="Offer your support or guidance..." 
                        rows="4" 
                        value={replyBody}
                        onChange={e => setReplyBody(e.target.value)}
                        required 
                    />
                    
                    <div className="form-actions">
                        {role !== 'advisor' && (
                            <label className="anon-label">
                                <input 
                                    type="checkbox" 
                                    checked={replyingAsAnon} 
                                    onChange={e => setReplyingAsAnon(e.target.checked)} 
                                />
                                Reply Anonymously
                            </label>
                        )}
                        <button type="submit" className="submit-reply">Post Reply</button>
                    </div>
                </form>
            </div>

            <EditPostModal 
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                post={post}
                onPostUpdated={(updatedPost) => {
                    setPost(updatedPost);
                }}
            />
        </div>
    );
}
