import React from "react";
import { PositivityZone } from "../../components/PositivityZone/PositivityZone";
import { BlogData } from "../../data/BlogData";
import { News } from "../../data/News";
import { FaArrowDown } from "react-icons/fa";
export const Positivity = () =>{
    const scrollToPositivity = () => {
    const section = document.getElementById("positivity-start");
    if (section) section.scrollIntoView({ behavior: "smooth" });
    };
    return(
        <>
        <div className="positivity">
          <div id="positivity-start" className="positivity-heading">
            <u><h1 className="main-title">Positivity Zone</h1></u>
            <p className="sub-title">
              A space to uplift your spirit, inspire your thoughts, and brighten your day 🌈
            </p>
          </div>
        
          <div className="scroll-icon" onClick={scrollToPositivity}>
            <FaArrowDown />
          </div>
        </div>
        
        
        
              <div className="positivity-zone-section">
                {BlogData.map((item, index) => (
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
        
              <div>
                <h1>Articles</h1>
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