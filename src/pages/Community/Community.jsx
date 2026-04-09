import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDataFromApi, deleteDataFromApi } from '../../utils/api';
import CreatePostModal from '../../components/CreatePostModal/CreatePostModal';
import EditPostModal from '../../components/EditPostModal/EditPostModal';
import { toast } from 'react-toastify';
import './Community.scss';

export default function Community() {
    const user = useSelector((state) => state.user);
    const role = useSelector((state) => state.role);
    const navigate = useNavigate();
    
    const [posts, setPosts] = useState([]);
    const [domainFilter, setDomainFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const [editModalPost, setEditModalPost] = useState(null);

    // Auth Guard
    useEffect(() => {
        if (!user || (!user._id && !user.advisorId)) {
            navigate("/community/welcome");
        }
    }, [user, navigate]);

    useEffect(() => {
        setLoading(true);
        fetchDataFromApi(`/community/posts?domain=${domainFilter}`)
            .then(res => {
                setPosts(res?.data || []);
            })
            .catch(err => console.error("Error fetching posts:", err))
            .finally(() => setLoading(false));
    }, [domainFilter]);

    const handleDeletePost = async (e, postId) => {
        e.stopPropagation();
        if(!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await deleteDataFromApi(`/community/posts/owner/${postId}`);
            if(res.data && res.data.success) {
                toast.success("Post deleted");
                setPosts(posts.filter(p => p._id !== postId));
            }
        } catch (err) {
            toast.error("Failed to delete post");
        }
    };

    return (
        <div className="community-feed-container">
            <aside className="community-sidebar">
                <h2>Circles</h2>
                <ul>
                    <li className={domainFilter === 'all' ? 'active' : ''} onClick={() => setDomainFilter('all')}>All Circles</li>
                    <li className={domainFilter === 'mental' ? 'active' : ''} onClick={() => setDomainFilter('mental')}>🧠 Mental Sanctuary</li>
                    <li className={domainFilter === 'physical' ? 'active' : ''} onClick={() => setDomainFilter('physical')}>💪 Physical Grounding</li>
                    <li className={domainFilter === 'financial' ? 'active' : ''} onClick={() => setDomainFilter('financial')}>💸 Financial Clarity</li>
                </ul>
                <button className="create-post-btn" onClick={() => setShowModal(true)}>
                    + New Post
                </button>
            </aside>

            <main className="feed-main">
                <header>
                    <h1>{domainFilter === 'all' ? 'Community Feed' : `${domainFilter.charAt(0).toUpperCase() + domainFilter.slice(1)} Circle`}</h1>
                </header>

                {loading ? (
                    <div className="loading-state">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="empty-state">No posts in this circle yet. Be the first!</div>
                ) : (
                    <div className="post-list">
                        {posts.map(post => (
                            <div key={post._id} className="post-card" onClick={() => navigate(`/community/post/${post._id}`)}>
                                <h3>{post.title}</h3>
                                <p className="preview">{post.body.substring(0, 150)}...</p>
                                <div className="post-meta">
                                    <span className="author">By: {post.isAnonymous ? "Anonymous Seeker" : (post.authorId?.fullname || "User")}</span>
                                    
                                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                                        {user && post.authorId?._id === user._id && (
                                            <>
                                                <button 
                                                    className="owner-btn edit-btn" 
                                                    onClick={(e) => { e.stopPropagation(); setEditModalPost(post); }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="owner-btn delete-btn" 
                                                    onClick={(e) => handleDeletePost(e, post._id)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                        <span className="domain-tag">{post.domain}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <CreatePostModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                onPostCreated={(newPost) => setPosts([newPost, ...posts])}
            />

            <EditPostModal 
                isOpen={!!editModalPost}
                onClose={() => setEditModalPost(null)}
                post={editModalPost}
                onPostUpdated={(updatedPost) => {
                    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
                }}
            />
        </div>
    );
}
