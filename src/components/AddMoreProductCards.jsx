import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import React from "react";
import { mainLinksHeader } from "../data";

import "swiper/css";
import "swiper/css/navigation";
import "../styles/AddMoreProductCards.css";
import "../styles/Swiper.css";
import ProductCard from "./action/calculation-product-logic/ProductCard";

export default function AddMoreProductCards({ isMainPage, moreProduct }) {
  const classNames = {
    productCard: "product-card",
    addMoreTitle: "add-more-title",
    cardTitle: "product-card-title",
    cardImg: "add-more-product-swiper-img",
    productCardPrice: "product-card-price",
    productCardBtnAdd: "product-card-btn-add",
  };
  console.log(moreProduct);
  

  return (
    <div className="bg-color-grey">
      <div className="add-more-product container-size">
        <h3 className="more-product-title">Добавить к заказу:</h3>
        <div className="add-more-product-swiper-wrapp">
          <Swiper
            loop={true}
            spaceBetween={5}

            breakpoints={{
              1200: { slidesPerView: 6 },
              768: { slidesPerView: 5 },
              510: { slidesPerView: 4 },
              320: { slidesPerView: 3 },
            }}
            navigation={{
              nextEl: ".more-product-swiper-button-next",
            }}
            className="mySwiper"
            modules={[Navigation]}
          >
            {moreProduct &&
              moreProduct.products.map((card, index) => {
                return (
                  <SwiperSlide key={index}>
                    <ProductCard
                      card={card}
                      isMainPage={isMainPage}
                      classNames={classNames}
                    />
                  </SwiperSlide>
                );
              })}
          </Swiper>
          <div
            className="more-product-swiper-button-next swiper-button-next"
            slot="pagination"
          ></div>
        </div>
        <div className="d-flex jc-sb add-more-about">
          <Link to={mainLinksHeader[4].path} className="add-more-product-btn">
            О доставке
          </Link>
          <Link to={mainLinksHeader[6].path} className="add-more-product-btn">
            О оплате
          </Link>
          <Link to={mainLinksHeader[6].path} className="add-more-product-btn">
            Как оформить заказ
          </Link>
        </div>
      </div>
    </div>
  );
}
