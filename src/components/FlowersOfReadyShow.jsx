import "../styles/action-styles/ButtonOrder.css";
import "../styles/action-styles/ButtonFastOrder.css";
import "../styles/action-styles/ButtonLoadingMore.css";
import ProductCard from "./action/calculation-product-logic/ProductCard";
import { useEffect } from 'react'

export const FlowersOfReadyShow = ({
  isRerenderForLike,
  idSlug,
  getBackProductId,
  data,
  isMoreProduct,
  countClick,
  rezerv,
  isCatalogPage,
  getCardPositionForScroll,
  clickFromMainPageCard,
}) => {
  const classNames = {
    cardSubtitle: "card-subtitle",
    cardImg: "card-img",
    heartSvg: "heart-svg",
    cardFastOrderBtn: "card-fast-order-items",
    cardRating: "card-rating",
    cardRatingText: "card-rating-text",
    cardArticul: "card-articul",
  };

  const LoadMoreCards = () => countClick();
  if (!isCatalogPage) {

    return (
      <div className="Cards-wrapp container-size">
        <h3 className="title-ready-flowers">Витрина готовых букетов</h3>
        <div className="main-page_second-cards-group">
          {data && data.length > 0 ? (
            data.map((cardItems, index) => {
              return (
                <ProductCard
                  isRerenderForLike={isRerenderForLike}
                  idSlug={idSlug}
                  getBackProductId={getBackProductId}
                  // key={index}
                  key={`gotovy_buket_${isRerenderForLike}_${cardItems.id}`}
                  
                  card={cardItems}
                  classNames={classNames}
                  isMainPage={true}
                  getCardPositionForScroll={getCardPositionForScroll}
                  clickFromMainPageCard={true}
                />
              );
            })
          ) : (
            <div
              style={{
                position: "absolute",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              Загрузка ...
            </div>
          )}
        </div>

        {rezerv.current && rezerv.current.length > 0 && data.length > 0 && (
          <button className="btn-load-more" onClick={LoadMoreCards}>
            Загрузить ещё
          </button>
        )}
      </div>
    );
  } else {
    return (
      <div className="Cards-wrapp container-size">
        <h3 className="title-ready-flowers">Каталог товаров</h3>
        <div className="main-page_second-cards-group">
          {data && data.length > 0 ? (
            data.map((cardItems, index) => {
              return (
                <ProductCard
                  isRerenderForLike={isRerenderForLike}
                  idSlug={idSlug}
                  // key={`${cardItems.id}_${index}`}
                  key={`gotovy_buket_${isRerenderForLike}_${cardItems.id}`}
                  card={cardItems}
                  classNames={classNames}
                  isMainPage={false}
                  isCatalogPage={true}
                  getCardPositionForScroll={getCardPositionForScroll}
                  clickFromMainPageCard={true}
                />
              );
            })
          ) : data && data.length === 0 && data.status !== "no status" ? (
            <div
              style={{
                textAlign: "right",
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "30px",
                marginBottom: "20px",
              }}
            >
              Товар не найден
            </div>
          ) : (
            <div
              style={{
                textAlign: "right",
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "30px",
                marginBottom: "20px",
              }}
            >
              Загрузка ...
            </div>
          )}
        </div>
        {rezerv.current && rezerv.current.length > 0 && data.length > 0 && (
          <button className="btn-load-more" onClick={LoadMoreCards}>
            Загрузить ещё
          </button>
        )}
      </div>
    );
  }
};
