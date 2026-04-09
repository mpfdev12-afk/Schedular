import React, { useState, useEffect } from "react";
import { PositivityZone } from "../../components/PositivityZone/PositivityZone";
import { News } from "../../data/News";
import { FaArrowDown } from "react-icons/fa";
import { fetchDataFromApi } from "../../utils/api";
export const Positivity = () =>{
    const [trendingPosts, setTrendingPosts] = useState([]);
    
    useEffect(() => {
        fetchDataFromApi("/community/posts/trending-positivity")
            .then(res => {
                if(res.data) setTrendingPosts(res.data);
            })
            .catch(err => console.log("Failed to load global positivity", err));
    }, []);

    const scrollToPositivity = () => {
    const section = document.getElementById("positivity-start");
    if (section) section.scrollIntoView({ behavior: "smooth" });
    };
    return(
        <>
        <div className="positivity">

          <div id="positivity-start" className="positivity-heading">
            <h1 className="main-title">Positivity Zone 🌈</h1>
            <p className="sub-title">
              A space to uplift your spirit, inspire your thoughts, and brighten your day.
            </p>
          </div>
        
          <div className="scroll-icon" onClick={scrollToPositivity}>
            <FaArrowDown />
          </div>
        </div>
        
        
        
        
              <div className="positivity-zone-section">
                {trendingPosts.length > 0 ? trendingPosts.map((post, index) => (
                  <div key={post._id} onClick={() => window.location.href=`/community/post/${post._id}`} style={{cursor: 'pointer'}}>
                    <PositivityZone
                        image={post.authorId?.profilepic || "https://img.freepik.com/premium-photo/3d-avatar-boy-character_113255-94034.jpg"}
                        category="Positivity"
                        title={post.title}
                        description={post.body.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'}
                        author={post.authorId?.fullname || "Anonymous"}
                        avatar={post.authorId?.profilepic || "https://img.freepik.com/premium-photo/3d-avatar-boy-character_113255-94034.jpg"}
                        time={new Date(post.createdAt).toLocaleDateString()}
                    />
                  </div>
                )) : (
                    <p style={{textAlign: 'center', opacity: 0.7, width: "100%", padding: "40px"}}>No trending posts yet. Be the first to spread positivity!</p>
                )}
              </div>
        
              <div className="positivity-heading" style={{marginTop: '40px', marginBottom: '20px'}}>
                <h1 className="main-title">Latest Articles</h1>
              </div>
        
              <div className="positivity-zone-section">
                {News.map((item, index) => (
                  <PositivityZone
                    key={index}
                    image={item.image}
                    category={item.category}
                    title={item.title}
                    description={item.description}
                    author={item.author}
                    avatar={item.avatar}
                    time={item.time}
                  />
                ))}
              </div>
        </>
    )
}