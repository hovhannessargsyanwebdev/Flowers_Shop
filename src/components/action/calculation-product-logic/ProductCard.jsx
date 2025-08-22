import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ButtonOrder from "./ButtonOrder";
import ButtonFastOrder from "./ButtonFastOrder";
import { handleAddToBasket } from "../../../action";
import { NotificationPopUp } from "../../action/NotificationPopUp";
import Card from "react-bootstrap/Card";

import "../../../styles/Cards.css";
import NoImage from "../../../images/no-image.jpg";

function ProductCard({
  isRerenderForLike,
  idSlug,
  getBackProductId,
  card,
  classNames,
  isMainPage,
  isCatalogPage,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(card.liked == 1 ? true : false);
  const cardPrice = +card.price;

  const [productPrice, setProductPrice] = useState(cardPrice);
  const [quantity, setQuantity] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  const resetQuantity = () => {
    setQuantity(1);
    setProductPrice(cardPrice);
  };

  const addWishlist = async (id) => {
    let type = "remove";
    if (!isLiked) {
      type = "add";
    }

    fetch("/api/wishlist.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: +id,
        action: type,
      }),
    })
      .then((resolve) => resolve.json())
      .then((response) => {
        if (response.status === "Ok") {
          if (!isLiked) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }

          let wishListQuantity = parseInt(
            window.localStorage.getItem("wishlistCount")
          );

          if (!wishListQuantity) wishListQuantity = 0;
          window.localStorage.setItem(
            "wishlistCount",
            (wishListQuantity + 1 * (!isLiked ? 1 : -1)).toString()
          );
          window.dispatchEvent(new Event("storage"));
        } else {
          console.log("else problem");
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  useEffect(() => {
    let newArr = card   
    if (!!card.newLiked) {
      if (card.newLiked == 1) {
        setIsLiked(1)
      }
      else {
        setIsLiked(0)
      }
      delete newArr.newLiked
      card = newArr   
    }
    
  }, [isRerenderForLike])
  

  const handleAddToBasketClick = async (e) => {
    const response = await handleAddToBasket({ id: card.id, e });

    if (response && response.status === "Ok") {
      setNotificationMessage("Товар успешно добавлен в корзину!");
    } else {
      setNotificationMessage(
        (response && response.message) ||
          "Произошла ошибка при добавлении товара."
      );
    }
    setShowAddProductPopup(true);

    setTimeout(() => setShowAddProductPopup(false), 2000);
  };

  return (
    <>
      {isMainPage || isCatalogPage ? (
        <Card id={`${idSlug}_${card.id}`}>
          <Link
            className={classNames.cardImgBtn}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              display: "block",
            }}
            state={{
              idSlug: idSlug,
              backgroundLocation: location,
            }}
            to={{ pathname: card.url }}
            title={card.title} 
          >
            <Card.Img
              className={classNames.cardImg}
              variant="top"
              src={typeof card.mane_image === "string" ? card.mane_image : NoImage}
            />
          </Link>

          <form
            onClick={(e) => e.preventDefault()}
            action="/api/card.php"
            method="post"
            id={`add_cart_form_${card.id}`}
            className={`add_cart_form add_cart_form_${card.id} d-flex jc-sb`}
          >
            <input type="hidden" name="id" value={card.id} />

            <button onClick={() => addWishlist(card.id, "add")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                className={`card-heart-icon ${
                  isLiked ? "card-heart-icon-liked" : ""
                }`}
                viewBox="0 0 16 16"
              >
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </button>

            <Card.Body>
              <Link
                state={{ idSlug: idSlug }}
                to={{ pathname: card.url }}
                title={card.title}
              >
                <Card.Title className={classNames.cardSubtitle}>
                  <div> {card.title} </div>
                </Card.Title>
              </Link>
              <div className="d-flex ai-c jc-sb w-100">
                <input type="hidden" name="id" value={card.id} />
                <span className="card-price">{productPrice / 100}₽</span>

                <ButtonOrder
                  card={card}
                  variant="-*"
                  setModalShow={setModalShow}
                  modalShow={modalShow}
                  width="100%"
                  resetQuantity={resetQuantity}
                />
              </div>

              <div className={classNames.cardFastOrderBtn}>
                <ButtonFastOrder
                  text="Быстрый заказ"
                  cardId={card.id}
                  isPhoneMe={true}
                />
                <div className={classNames.cardRating}>
                  <Link
                    className="cart-rating-link"
                    to={{ pathname: card.url }}
                    state={{
                      isReviewsAboutProduct: true,
                      textTitle: "Отзывы",
                    }}
                    title={card.title}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-star"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                    </svg>
                    <span className={classNames.cardRatingText}>
                      {card.rating}
                    </span>
                  </Link>
                </div>
              </div>

              <p className="card-text-delivery">
                Бесплатная доставка в {`<?php echo $city_name_pred; ?>`}
              </p>
              <span className={classNames.cardArticul}>
                Артикул: {card.articul}
              </span>
            </Card.Body>
          </form>
        </Card>
      ) : (
        <div>
          <p className={classNames.addMoreTitle}> {card.title} </p>
          <Card className={classNames.productCard}>
            <Card.Img
              variant="top"
              className={classNames.cardImg}
              src={
                typeof card.img === "string" ? card.img : NoImage
                // card.img && /^https?:\/\//i.test(card.img) ? card.img : NoImage
              }
            />
            <Card.Body>
              <Card.Text className={classNames.cardTitle}>
                {card.title}
              </Card.Text>
              <Card.Text className={classNames.productCardPrice}>
                {cardPrice} ₽
              </Card.Text>
              <button
                className={classNames.productCardBtnAdd}
                onClick={(e) => handleAddToBasketClick({ id: card.id, e })}
              >
                Добавить
              </button>

              {showAddProductPopup && (
                <NotificationPopUp message={notificationMessage} />
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
}

export default ProductCard;
