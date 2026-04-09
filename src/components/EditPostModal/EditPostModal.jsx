import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { updateDatatoapi } from '../../utils/api';
// We reuse the existing styles from CreatePostModal for consistency
import '../CreatePostModal/CreatePostModal.scss';

export default function EditPostModal({ isOpen, onClose, post, onPostUpdated }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (post) {
            setTitle(post.title || "");
            setBody(post.body || "");
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title.trim() || !body.trim()){
            return toast.warn("Title and body are required");
        }
        
        setLoading(true);
        try {
            const res = await updateDatatoapi(`/community/posts/owner/${post._id}`, {
                title, body
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
                        
                        <div className="form-group">
                            <textarea 
                                placeholder="Edit your thoughts..."
                                rows="5"
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                required
                            />
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
