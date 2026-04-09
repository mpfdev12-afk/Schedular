import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { sendDataToapi } from '../../utils/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './CreatePostModal.scss';

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [domain, setDomain] = useState("mental");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Tagging Engine
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    const handleTagInput = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const cleanTag = tagInput.trim().toLowerCase();
            if (cleanTag && tags.length < 5 && !tags.includes(cleanTag)) {
                setTags([...tags, cleanTag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title.trim() || !body.trim()){
            return toast.warn("Title and body are required");
        }
        
        setLoading(true);
        try {
            const res = await sendDataToapi("/community/posts", {
                title, body, domain, isAnonymous, tags
            }, 'application/json');
            // result.data is the actual API response wrapper { success, data, message }
            if (res.data && res.data.success) {
                toast.success("Post created successfully!");
                onPostCreated(res.data.data);
                setTitle("");
                setBody("");
                setTags([]);
                onClose();
            }
        } catch (error) {
            toast.error("Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <AnimatePresence>
                <motion.div 
                    className="create-post-modal"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={e => e.stopPropagation()}
                >
                    <button className="close-btn" onClick={onClose}>×</button>
                    <h2>Share with the Circle</h2>
                    <p className="modal-sub">This is a safe space. No upvotes, just support.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Circle Domain</label>
                            <select value={domain} onChange={e => setDomain(e.target.value)}>
                                <option value="mental">🧠 Mental Sanctuary</option>
                                <option value="physical">💪 Physical Grounding</option>
                                <option value="financial">💸 Financial Clarity</option>
                                <option value="positivity">🌈 Positivity Zone</option>
                            </select>
                        </div>

                        {domain === 'positivity' && (
                            <div className="gamification-banner" style={{
                                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(245, 158, 11, 0.05))',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                color: '#b45309',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span>🌟</span>
                                <span>Posts in this zone that receive <strong>3+ ❤️</strong> from the community will be permanently featured on the Global Dashboard!</span>
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label>What's on your mind?</label>
                            <input 
                                type="text" 
                                placeholder="Give your post a title..." 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                maxLength={100}
                                required
                            />
                        </div>
                        
                        <div className="form-group quill-editor-group">
                            <ReactQuill 
                                theme="snow"
                                value={body}
                                onChange={setBody}
                                placeholder="Share your thoughts, ask a question, or look for guidance..."
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Tags (Optional, Max 5)</label>
                            <div className="tags-input-container">
                                <div className="tags-list">
                                    {tags.map(tag => (
                                        <span key={tag} className="tag-pill">
                                            #{tag} <button type="button" onClick={() => removeTag(tag)}>×</button>
                                        </span>
                                    ))}
                                </div>
                                <input 
                                    type="text" 
                                    placeholder={tags.length < 5 ? "Type a tag and press Enter..." : "Tag limit reached (5)"}
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInput}
                                    disabled={tags.length >= 5}
                                />
                            </div>
                            <p className="hint-text">Use tags like 'anxiety', 'workout', 'budgeting'</p>
                        </div>
                        
                        <div className="privacy-toggle">
                            <label className="toggle-label">
                                <input 
                                    type="checkbox" 
                                    checked={isAnonymous}
                                    onChange={e => setIsAnonymous(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                                <strong>Post Anonymously</strong>
                                <span className="hint">Hide your identity from peers</span>
                            </label>
                        </div>
                        
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Posting..." : "Share with Circle"}
                        </button>
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
