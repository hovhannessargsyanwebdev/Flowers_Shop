import React, { useState,  useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Subheader.css";
import noImages from "../images/no-image.jpg";
import chevronDown from "../images/icons/chevron-double-down.svg";
import { HeaderHeightContext } from './Layout';

function SubheaderLinksToCatalog({ dropdownData, closeModal }) {
  const [openIndexes, setOpenIndexes] = useState({}); 
  const listRefs = useRef({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const headerHeight = React.useContext(HeaderHeightContext);

  const ScrollToReadyFlowers = () => {
    const title = document.querySelector(".title-ready-flowers");    
    if (title) {
      const y = title.getBoundingClientRect().top + window.pageYOffset - document.querySelector("header").getBoundingClientRect().height;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }


  const toggleList = (index) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index], 
    }));
  };

  const handleLinkClick = (url) => {
    if (closeModal) closeModal();
    navigate(url, { state: { fromSubheader: true, headerHeight } }); 
  };

  if (!dropdownData || !dropdownData.categories) {
    return null;
  }

  return (
    <div className="subheader-links-to-catalog container-size">
      <h4
        className="subheader-links-to-catalog-text"
        onClick={ScrollToReadyFlowers}
      >
        Готовые букеты, собранные сегодня
      </h4>
      <div className="subheader-links-to-catalog-content">
        {dropdownData.categories.map((item, index) => (
          <div className="subheader-links-catalog-item" key={index}>
            {item.img_url ? (
              <div className="subheader-links-catalog-img-wrapp">
                <img
                  className="subheader-links-catalog-img"
                  src={`${item.img_url}`}
                  alt=""
                />
              </div>
            ) : (
              <img
                className="subheader-links-catalog-img"
                src={noImages}
                alt=""
              />
            )}
            <div className="subheader-links-catalog-list-wrapp">
              <h5>{item.groupName}</h5>
              <ul
                ref={(ref) => listRefs.current[index] = ref}
                className={`subheader-links-catalog-list ${
                  openIndexes[index] ? "open" : ""
                } ${isMobile ? "mobile" : ""}`}
              >
                {item.childCategories.map((category, index) => (
                  <li key={index}>
                    <Link
                      className="subheader-links-catalog-list-link"
                      to={category.url}
                      state={{ fromSubheaderLink: true, headerHeight: headerHeight }} 
                      onClick={() => {handleLinkClick(category.url)}}
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <p>{item.description}</p>
              {item.childCategories.length > 3 && (
                <button
                  className={`dropwodn-links-btn-toggle ${openIndexes[index] ? "open" : ""}`}
                  onClick={() => toggleList(index)}
                >
                  <img
                    className={`dropwodn-links-btn-toggle-img ${openIndexes[index] ? "rotated" : ""}`}
                    src={chevronDown}
                    alt=""
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubheaderLinksToCatalog;