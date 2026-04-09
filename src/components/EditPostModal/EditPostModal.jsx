import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { updateDatatoapi } from '../../utils/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
// We reuse the existing styles from CreatePostModal for consistency
import '../CreatePostModal/CreatePostModal.scss';

export default function EditPostModal({ isOpen, onClose, post, onPostUpdated }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Tagging Engine
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (post) {
            setTitle(post.title || "");
            setBody(post.body || "");
            setTags(post.tags || []);
        }
    }, [post]);

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
            const res = await updateDatatoapi(`/community/posts/owner/${post._id}`, {
                title, body, tags
            }, 'application/json');
            
            if (res.data && res.data.success) {
                toast.success("Post updated successfully!");
                onPostUpdated(res.data.data);
                onClose();
            }
        } catch (error) {
            toast.error("Failed to update post");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !post) return null;

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
                    <h2>Edit Your Post</h2>
                    <p className="modal-sub">Update your thoughts while maintaining your chosen privacy settings.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Domain</label>
                            <input type="text" value={post.domain} disabled style={{opacity: 0.7}} />
                        </div>
                        
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                placeholder="Edit title..." 
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
                                placeholder="Edit your thoughts..."
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
                            <p className="hint-text">Your updated tags.</p>
                        </div>
                        
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
