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
    const [filterMode, setFilterMode] = useState('all'); // all, following
    const [searchQuery, setSearchQuery] = useState('');
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
        let url = `/community/posts?domain=${domainFilter}`;
        if(filterMode === 'following') url += `&filter=following`;
        if(searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

        fetchDataFromApi(url)
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
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="Search sanctuary..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <h2>Circles</h2>
                <ul>
                    <li className={domainFilter === 'all' && filterMode === 'all' ? 'active' : ''} onClick={() => { setDomainFilter('all'); setFilterMode('all'); }}>All Circles</li>
                    <li className={filterMode === 'following' ? 'active' : ''} onClick={() => setFilterMode('following')}>⭐ My Followed Tags</li>
                    <li className={domainFilter === 'mental' && filterMode === 'all' ? 'active' : ''} onClick={() => { setDomainFilter('mental'); setFilterMode('all'); }}>🧠 Mental Sanctuary</li>
                    <li className={domainFilter === 'physical' && filterMode === 'all' ? 'active' : ''} onClick={() => { setDomainFilter('physical'); setFilterMode('all'); }}>💪 Physical Grounding</li>
                    <li className={domainFilter === 'financial' && filterMode === 'all' ? 'active' : ''} onClick={() => { setDomainFilter('financial'); setFilterMode('all'); }}>💸 Financial Clarity</li>
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
                            <div key={post._id} className={`post-card ${post.authorModel === 'Advisor' ? 'advisor-verified' : ''}`} onClick={() => navigate(`/community/post/${post._id}`)}>
                                {post.authorModel === 'Advisor' && (
                                    <div className="card-advisor-badge">✨ Advisor Verified</div>
                                )}
                                <h3>{post.title}</h3>
                                <p className="preview">{post.body.replace(/<[^>]+>/g, '').substring(0, 150)}...</p>
                                
                                {post.tags && post.tags.length > 0 && (
                                    <div className="post-tags-readonly">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="tag-chip">#{tag}</span>
                                        ))}
                                    </div>
                                )}

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
