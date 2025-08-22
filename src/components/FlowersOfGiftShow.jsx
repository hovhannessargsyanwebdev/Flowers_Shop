import ProductCard from "./action/calculation-product-logic/ProductCard";

import "../styles/action-styles/ButtonOrder.css";
import "../styles/action-styles/ButtonFastOrder.css";
import "../styles/action-styles/ButtonLoadingMore.css";

export const FlowersOfGiftShow = ({ data, countClick, rezerv, idSlug, getBackProductId, isRerenderForLike }) => {
  const LoadMoreCards = () => countClick();

  const classNames = {
    cardSubtitle: "card-subtitle",
    cardImg: "card-img",
    heartSvg: "heart-svg",
    cardFastOrderBtn: "card-fast-order-wrapp",
    cardRating: "card-rating",
    cardRatingText: "card-rating-text",
    cardArticul: "card-articul",
  };

  return (
    <div className="Cards-wrapp container-size">
      <h3>Витрина цветов и подарков</h3>
      <div className="main-page_third-cards-group">
        {data.length && data.length > 0 ? (
          data.map((cardItems) => {
            return (
              <ProductCard
                isRerenderForLike={isRerenderForLike}
                idSlug={idSlug}
                getBackProductId={getBackProductId}
                // key={`podarkov_${cardItems.id}`}
                key={`podarkov_${isRerenderForLike}_${cardItems.id}`}
                card={cardItems}
                classNames={classNames}
                isMainPage={true}
              />
            );
          })
        ) : (
          <div
            style={{
              position: "absolute",
              fontSize: "22px",
              fontWeight: 'bold',
            }}>
            Загрузка  ...
          </div>
        )}
      </div>
      {data.length > 0 ? (
        <button className="btn-load-more" onClick={LoadMoreCards}>
          Загрузить ещё
        </button>
      ) : null}
    </div>
  );
};
