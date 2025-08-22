import { useLocation } from "react-router-dom";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlowersOfReadyShow } from "./FlowersOfReadyShow";
import { Helmet } from "react-helmet-async";

import "../styles/action-styles/ButtonOrder.css";
import "../styles/action-styles/ButtonFastOrder.css";
import "../styles/action-styles/ButtonLoadingMore.css";
import "../styles/Catalog.css";

export const Catalog = ({
  dataMetaTitle,
  dataMetaDescription,
  dataMetaKeyword,
  isRerenderForLike,
  idSlug,
  backProductId,
  catalogData,
  setCatalogData,
  countClickCatalog,
  fetchCatalogData,
  catalogDataReserv,
  isMoreProduct,
}) => {
  const catalogPageRef = useRef(null);
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0)

  useLayoutEffect(() => {
     const images = document.querySelectorAll('img');
    const totalImages = images.length;

    if (totalImages === 0) { return }

    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount += 1;
      if (loadedCount === totalImages) {
        setScrollPosition(1);
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
        img.addEventListener('error', handleImageLoad);
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };

  },[catalogData])

  useEffect(() => {
    if (location.state?.fromSubheader) {
    return;
  }
    if (backProductId) {
      let currentCardId = `#${backProductId}`

      if ( document.querySelector(currentCardId) ){
      let position =  window.scrollY + document.querySelector(currentCardId).getBoundingClientRect().top - document.querySelector('header').offsetHeight 
      // window.scrollTo({
      //   top: position,
      //   left: 0,
      //   behavior:"smooth"
      // })
    }
  }  
  }, [scrollPosition, location.state?.backgroundLocation])

  useEffect(() => {
    location.state?.fromSubheader && window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.state]);
  

  const updateCatalogData = (newCatalogData) => {
    let prewArr = []
    let newArray = []
    newCatalogData.forEach((item, index) => {
      if (!prewArr.includes(item.id)) {
        prewArr.push(item.id)
        newArray.push(item)
      }
    })
    setCatalogData(newArray);
  }

  const getNewCards = async (data) => {
    updateCatalogData([...catalogData, ...catalogDataReserv.current]);
    await fetchCatalogData(countClickCatalog.current);
  };

  return (
    <div className="catalog-page" ref={catalogPageRef}>
      <Helmet>
        <title>{dataMetaTitle}</title>
        <meta name="description" content={dataMetaDescription} />
        <meta name="keywords" content={dataMetaKeyword} />
      </Helmet>
      
      <FlowersOfReadyShow
        isRerenderForLike={isRerenderForLike}
        idSlug={idSlug}
        isMoreProduct={isMoreProduct}
        data={catalogData}
        rezerv={catalogDataReserv}
        countClick={() => getNewCards(catalogData)}
        isCatalogPage={true}
        clickFromMainPageCard={true}
      />
    </div>
  );
};
