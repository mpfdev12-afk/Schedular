import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { sendDataToapi } from '../../utils/api';
import './CreatePostModal.scss';

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [domain, setDomain] = useState("mental");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title.trim() || !body.trim()){
            return toast.warn("Title and body are required");
        }
        
        setLoading(true);
        try {
            const res = await sendDataToapi("/community/posts", {
                title, body, domain, isAnonymous
            }, 'application/json');
            // result.data is the actual API response wrapper { success, data, message }
            if (res.data && res.data.success) {
                toast.success("Post created successfully!");
                onPostCreated(res.data.data);
                setTitle("");
                setBody("");
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
                            </select>
                        </div>
                        
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
                        
                        <div className="form-group">
                            <textarea 
                                placeholder="Share your thoughts, ask a question, or look for guidance..."
                                rows="5"
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                required
                            />
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
