// ProductDetails.jsx
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Modal from "react-bootstrap/Modal";
import DOMPurify from "dompurify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMediaQuery } from "react-responsive";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import ButtonOrder from "./action/calculation-product-logic/ButtonOrder";
import ButtonFastOrder from "./action/calculation-product-logic/ButtonFastOrder";
import { NotificationPopUp } from "./action/NotificationPopUp";
import AddMoreProductCards from "../components/AddMoreProductCards";
import Contacts from "./Contacts";
import Reviews from "../components/Reviews";
import starIcon from "../images/icons/star-fill.svg";
import shareForward from "../images/icons/share-solid.svg";
import ChevronDownIcon from "../images/icons/chevron-double-down.svg";
import NoImage from "../images/no-image.jpg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "../styles/Cards.css";
import "../styles/action-styles/ButtonOrder.css";
import "../styles/Swiper.css";
import "../styles/ProductDetails.css";

function useWindowResize() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
}

export default function ProductDetails({
  appHistory,
  getBackProductId,
  idSlug,
  catalogData,
  setCatalogData,
  firstGroup,
  secondGroup,
  thirdGroup,
  setFirstGroup,
  setSecondGroup,
  setThirdGroup,
  secondGroupReserv,
  thirdGroupReserv,
  catalogDataReserv,
}) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [error, setError] = useState(null);
  const reviewsSectionRef = useRef(null);

  const handleScrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [productPrice, setProductPrice] = useState(0);
  const [cardPrice, setCardPrice] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const windowWidth = useWindowResize();
  const isMobile = useMediaQuery({ minWidth: 768 });

  useEffect(() => {
    axios
      .get(`/api/product.php?url=${window.location.pathname}`)
      .then((response) => {
        const responseData = response.data;
        setData({
          ...responseData,
          images: responseData.images || [],
        });
        if (responseData.liked === 1) {
          setIsLiked(true);
        }
        const price = +responseData.price;
        setCardPrice(price);
        setProductPrice(price);
        const index = responseData.images.findIndex(
          (img) => img === responseData.mane_image
        );
        setActiveSlideIndex(index !== -1 ? index : 0);
        setIsBeginning(index === 0);
        setIsEnd(index === responseData.images.length - 1);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const changeStatesLiked = (id, liked) => {
    let currentArray1 = [];
    let currentArray2 = [];
    let currentArray3 = [];
    let currentArray4 = [];
    let currentArray5 = [];
    let currentArray6 = [];
    let currentArray7 = [];
    let a = 0;
    if (catalogData) {
      catalogData.forEach((item) => {
        if (item.id === id) {
          item.liked = liked;
          item.newLiked = `_${liked}`;
          a = 1;
        }
        currentArray1.push(item);
      });
      if (a === 1) setCatalogData(currentArray1);
    }

    if (firstGroup) {
      firstGroup.forEach((item) => {
        if (item.id === id) {
          item.liked = liked;
          item.newLiked = liked;
          a = 2;
        }
        currentArray2.push(item);
      });
      if (a === 2) setFirstGroup(currentArray2);
    }

    if (secondGroup) {
      secondGroup.forEach((item) => {
        if (item.id === id) {
          item.liked = liked;
          item.newLiked = liked;
          a = 3;
        }
        currentArray3.push(item);
      });
      if (a === 3) setSecondGroup(currentArray3);
    }

    if (thirdGroup) {
      thirdGroup.forEach((item) => {
        if (item.id === id) {
          item.liked = liked;
          item.newLiked = liked;
          a = 4;
        }
        currentArray4.push(item);
      });
      if (a === 4) setThirdGroup(currentArray4);
    }

    if (secondGroupReserv) {
      secondGroupReserv.current.forEach((item) => {
        if (item.id === id) {
          item.liked = liked;
          item.newLiked = liked;
        }
        currentArray5.push(item);
      });
      secondGroupReserv.current = currentArray5;
    }

    if (thirdGroupReserv) {
      thirdGroupReserv.current.forEach((item) => {
        if (item.id === id) {
          item.liked = liked;
          item.newLiked = liked;
        }
        currentArray6.push(item);
      });
      thirdGroupReserv.current = currentArray6;
    }

    if (catalogDataReserv) {
      catalogDataReserv.current.forEach((item) => {
        if (item.id === id) {
          item.liked = liked;
          item.newLiked = liked;
        }
        currentArray7.push(item);
      });
      catalogDataReserv.current = currentArray7;
    }
  };

  const addWishlist = async (id) => {
    const action = isLiked ? "remove" : "add";

    fetch("/api/wishlist.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, action }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "Ok") {
          setIsLiked(!isLiked);
          changeStatesLiked(id, isLiked ? 0 : 1);
          
          let wishListQuantity = parseInt(
            window.localStorage.getItem("wishlistCount")
          );

          if (!wishListQuantity) wishListQuantity = 0;
          window.localStorage.setItem(
            "wishlistCount",
            (wishListQuantity + 1 * (!isLiked ? 1 : -1)).toString()
          );
          window.dispatchEvent(new Event("storage"));
   
        }
      })
      .catch((error) => console.error(error));
  };

  const handleShareClick = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setShowCopyPopup(true);
      setTimeout(() => setShowCopyPopup(false), 1200);
    });
  };

  const handleGoBack = (id) => {
    if (window.history.length > 1) {
      
      getBackProductId(`${idSlug}_${id}`);
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (!data) return null;

  return (
    <div className="product-page">
      <Helmet>
        <title>{data.meta_title}</title>
        <meta name="description" content={data.meta_description} />
        <meta name="keywords" content={data.meta_keyword} />
      </Helmet>

      <div className="bg-color-grey">
        <div className="product-page-container">
          <div className="product-page_swiper-wrapp">
            <Swiper
              spaceBetween={5}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2"
              initialSlide={activeSlideIndex}
              onSlideChange={(swiper) => {
                setActiveSlideIndex(swiper.activeIndex);
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onReachBeginning={() => setIsBeginning(true)}
              onReachEnd={() => setIsEnd(true)}
              watchSlidesProgress={true}
              navigation={{
                nextEl: ".swiper-button-next-main",
                prevEl: ".swiper-button-prev-main",
              }}
            >
              {(data.images && data.images.length > 0
                ? data.images
                : [NoImage]
              ).map((imgLink, index) => (
                <SwiperSlide key={index}>
                  <button
                    className="go-back-btn"
                    onClick={() => handleGoBack(data.id)}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleGoBack(data.id);
                    }}
                    tabIndex={0}
                  >
                    x
                  </button>
                  <button
                    onClick={() => addWishlist(data.id)}
                    className="wishlist-btn-mobile-size"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="45"
                      className={`card-heart-icon ${
                        isLiked ? "card-heart-icon-liked" : ""
                      }`}
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    </svg>
                  </button>
                  <img
                    src={typeof imgLink === "string" ? imgLink : NoImage}
                    alt={`${data.title}`}
                    style={{ fontSize: "14px", textAlign: "left" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            {isMobile && (
              <div className="thumbs-swiper-nav">
                <button
                  className="swiper-button-prev-thumbs swiper-button-prev-main"
                  tabIndex={0}
                >
                  <img
                    src={ChevronDownIcon}
                    alt="prev"
                    style={{ transform: "rotate(90deg)" }}
                  />
                </button>
                <button
                  className="swiper-button-next-thumbs swiper-button-next-main"
                  tabIndex={0}
                >
                  <img
                    src={ChevronDownIcon}
                    alt="next"
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </button>
              </div>
            )}
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              navigation={{
                nextEl: ".swiper-button-next-thumbs",
                prevEl: ".swiper-button-prev-thumbs",
              }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
              {data.images && data.images.length > 0
                ? data.images.map((imgLink, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <img
                          src={typeof imgLink === "string" ? imgLink : NoImage}
                          alt={`${data.title}`}
                          style={{ fontSize: "14px", textAlign: "left" }}
                          className={
                            index === activeSlideIndex
                              ? "thumb-image-active"
                              : "thumb-image-inactive"
                          }
                        />
                      </SwiperSlide>
                    );
                  })
                : null}
            </Swiper>
          </div>

          <div className="product-page-content">
            <div className="d-flex jc-sb">
              <h1 className="card-title">{data.title}</h1>
              <div className="card-contact-favorit-group desktop-size">
                <button
                  className="card-contact-wrapp"
                  onClick={() => setModalShow(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#000"
                    className="bi bi-telephone-fill card-contact-icon"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                    />
                  </svg>
                  <span className="card-contact-text">Контакты</span>
                </button>

                <Modal
                  className="header-modal-wrapp"
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  size="lg"
                  centered
                >
                  <Modal.Body>
                    <Contacts />
                  </Modal.Body>
                </Modal>

                {windowWidth <= 768 ? (
                  <div className="card-share">
                    <button
                      className="card-share-link-mobile-size"
                      onClick={handleShareClick}
                    >
                      Поделиться
                      <svg
                        className="card-share-link-icon-mobile-size"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill="#000"
                      >
                        <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                      </svg>
                    </button>
                    {showCopyPopup && (
                      <NotificationPopUp message="Ссылка скопирована" />
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => addWishlist(data.id)}
                    className="card-favorites-wrapp"
                  >
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
                    <span className="card-favorit-text">Избранное</span>
                  </button>
                )}
              </div>
            </div>

            <p
              className="card-description"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data.text),
              }}
            />
            <p className="card-articul">Артикул: {data.articul}</p>

            <div className="card-rating-wrapp">
              <img className="card-rating-icon" src={starIcon} alt="" />
              <span className="card-rating-text"> {data.rating} </span>
            </div>

            <button
              type="button"
              className="card-review-link"
              style={{ cursor: "pointer" }}
              onClick={handleScrollToReviews}
            >
              Посмотреть отзывы или оставить свой
            </button>
            <form
              onClick={(e) => e.preventDefault()}
              action="/api/card.php"
              method="post"
              id={`add_cart_form_${data.id}`}
              className={`add_cart_form add_cart_form_${data.id} d-flex jc-sb`}
            >
              <div className="card-calculate-wrapp">
                <span className="card-price">{productPrice / 100}₽</span>
                <ButtonOrder
                  card={data}
                  variant="-*"
                  setModalShow={setModalShow}
                  modalShow={modalShow}
                />
              </div>
            </form>

            <p className="card-delivery-text"> *Цена с доставкой в {`<?php echo $city_name_pred; ?>`}</p>
            
            <ButtonFastOrder text="Оформить быстрый заказ" />

            {windowWidth > 768 && (
              <div className="card-share">
                <button className="card-share-link" onClick={handleShareClick}>
                  Поделиться
                  <img className="card-share-icon" src={shareForward} alt="" />
                </button>

                {showCopyPopup && (
                  <NotificationPopUp message="Ссылка скопирована" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AddMoreProductCards moreProduct={data.relations} isMainPage={false} />

      <div ref={reviewsSectionRef}>
        <Reviews textTitle="Отзывы" isReviewsAboutProduct={true} />
      </div>
    </div>
  );
}
