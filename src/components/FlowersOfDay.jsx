import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {useEffect} from 'react'

import "swiper/css";
import "swiper/css/navigation";
import "../styles/Swiper.css";
import "../styles/action-styles/ButtonOrder.css";
import "../styles/action-styles/ButtonFastOrder.css";
import ProductCard from "./action/calculation-product-logic/ProductCard";

export const FlowersOfDay = ({ data, idSlug, clickFromMainPageCard, getBackProductId, isRerenderForLike }) => {
  const classNames = {
    cardSubtitle: "card-subtitle",
    cardImg: "card-img",
    heartSvg: "card-heart-svg",
    cardFastOrderBtn: "card-fast-order-wrapp",
    cardRating: "card-rating",
    cardRatingText: "card-rating-text",
    cardArticul: "card-articul",
  };

  return (
    <div className="Cards-wrapp container-size">
      <h3>Букет дня</h3>
      <div className="main-page_first-cards-group">
        {data.length > 2 ? (
          <Swiper
            loop={true}
            className="mySwiper first-swiper-group"
            spaceBetween={5}
            modules={[Navigation]}
            breakpoints={{
              0: {
                slidesPerView: 2,
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next-flowers",
            }}
          >
            {data.map((cardItems) => (
              // <SwiperSlide key={`buketDnya_${cardItems.id}`}>
              <SwiperSlide key={`buketDnya_${isRerenderForLike}_${cardItems.id}`}>
                <ProductCard
                  isRerenderForLike={isRerenderForLike}
                  idSlug={idSlug}
                  card={cardItems}
                  classNames={classNames}
                  isMainPage={true}
                  isFlowersOfDay={true}
                  clickFromMainPageCard={clickFromMainPageCard}
                />
              </SwiperSlide>
            ))}
            <div className="swiper-button-next-flowers swiper-button-next"></div>
          </Swiper>
        ) : (
          <>
          {data.map((cardItems) => (
            <ProductCard
              isRerenderForLike={isRerenderForLike}
              idSlug={idSlug}
              // getBackProductId={getBackProductId}
              key={`buketDnya_${isRerenderForLike}_${cardItems.id}`}
              // key={cardItems.id}
              getBackProductId={getBackProductId}            
              card={cardItems}
              classNames={classNames}
              isMainPage={true}
              isFlowersOfDay={true}
            />
          ))}
        </>
        )}
      </div>
    </div>
  );
};
