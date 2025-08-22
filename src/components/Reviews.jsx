import "../styles/Reviews.css";
import "../styles/Swiper.css";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Modal from "react-bootstrap/Modal";
import "swiper/css";
import "swiper/css/navigation";

import ReviewCard from "../components/ReviewCard";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import starIcon from "../images/icons/star-fill.svg";
import { useScrollingToTop } from "../action";

function Reviews({
  textTitle,
  isReviewsAboutUs,
  isReviewsAboutProduct,
  className,
}) {
  const location = useLocation();
  const [popupMessage, setPopupMessage] = useState("");
  const [rating, setRating] = useState(null);
  // const [showReviewsSection, setShowReviewsSection] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useScrollingToTop();

  const formik = useFormik({
    initialValues: {
      name: "",
      message: "",
      phone: "",
      file: [],
      rating: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Введите ваше имя"),
      phone: Yup.string()
        .required("Введите ваш номер телефона")
        .matches(/^\d+$/, "Только цифры"),
      rating: Yup.number().min(1, "Обязательно").required("Обязательно"),
      file: Yup.array().of(Yup.mixed()).min(1, "Обязательно"),
    }),
    onSubmit: (values, { resetForm }) => {
      formik.setTouched({
        name: true,
        phone: true,
        message: true,
        file: true,
        rating: true,
      });

      if (!formik.isValid) {
        return;
      }

      setPopupMessage("Отправка...");
      setShowPopup(true);

      const formData = new FormData();
      formData.append("rating", rating || 0);
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("message", values.message);
      formData.append("url", location.pathname);

      if (values.file && values.file.length > 0) {
        values.file.forEach((file) => {
          formData.append("files[]", file);
        });
      }

      axios
        .post("/api/product.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setPopupMessage("Комментарий отправлен");
          setTimeout(() => {
            setShowPopup(false);
            setIsModalVisible(false);
            resetForm();
            setRating(null);
          }, 1200);
        })
        .catch((error) => {
          setPopupMessage("Комментарий не отправлен");
          setTimeout(() => {
            setShowPopup(false);
            setIsModalVisible(false);
          }, 2000);
        });
    },
  });

  const title = textTitle || "Отзывы";
  const isReviewsProduct =
    location.state?.isReviewsAboutProduct ?? isReviewsAboutProduct;
  const isReviewsUs = location.state?.isReviewsAboutUs ?? isReviewsAboutUs;
  const isReviewsFromHeader = location.state?.isReviewsFromHeader;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "/api/comments.php?url=" + window.location.pathname
        );
        setReviewsData(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [isReviewsUs, isReviewsProduct]);

  return isReviewsUs ? (
    <div className="reviews-main-page">
      <div className="reviews-title-wrapp">
        <h3 className="reviews-title">{title}</h3>
        <div>
          <a href="/">отзывы в Яндексе</a>
          <a href="/">Отзывы в Гугл</a>
        </div>
      </div>

      <div className="review-bg">
        <div className="review-position-btn-wrapp">
          <div className="Cards-wrapp container-size">
            <div className="review-cards-wrapp">
              <Swiper
                loop={true}
                className="mySwiper review-swiper"
                slidesPerView={1}
                spaceBetween={5}
                modules={[Navigation]}
                breakpoints={{
                  510: {
                    // slidesPerView: reviewsData.length < 2 ? 1 : 2,
                    slidesPerView: 2,
                  },
                  768: {
                    // slidesPerView: reviewsData.length < 2 ? 1 : 3,
                    slidesPerView: 3,
                  },
                }}
                navigation={{
                  nextEl: ".swiper-button-next-reviews",
                  prevEl: ".swiper-button-prev-reviews",
                }}
              >
                {reviewsData &&
                  Array.isArray(reviewsData) &&
                  reviewsData.length > 0 &&
                  reviewsData.map((review, index) => (
                    <SwiperSlide key={review.id || index}>
                      <ReviewCard
                        reviews={review}
                        isReviewsAboutUs={isReviewsUs}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
              <div className="swiper-button-next-reviews swiper-button-next"></div>
              <div className="swiper-button-prev-reviews swiper-button-prev"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : isReviewsProduct ? (
    <div className="container-size reviews">
      {isReviewsFromHeader && (
        <Helmet>
          <title>
            {!!reviewsData.meta_title ? reviewsData.meta_title : "Отзывы"}
          </title>
          <meta name="description" content={reviewsData.meta_description} />
          <meta name="keywords" content={reviewsData.meta_keyword} />
        </Helmet>
      )}

      <h3 className="reviews-title">{title}</h3>
      <h4 className="reviews-subtitle">
        {reviewsData && reviewsData.length > 0
          ? "Фото букета от клиентов"
          : "Отзывов нет"}
      </h4>
      <div className="review-swiper-photos-wrapp">
        <Swiper
          loop={true}
          className="mySwiper review-swiper-photos"
          spaceBetween={15}
          slidesPerView={2}
          modules={[Navigation]}
          breakpoints={{
            510: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            992: {
              slidesPerView: 6,
              spaceBetween: 5,
            },
            1200: { slidesPerView: 7 },
          }}
          navigation={{
            nextEl: ".swiper-button-next-photos",
          }}
        >
          {reviewsData &&
            Array.isArray(reviewsData) &&
            reviewsData.length > 0 &&
            reviewsData.map((item) => {
              return item.images.map((imgLink, index) => {
                return (
                  <SwiperSlide key={index}>
                    <img
                      className="review-swiper-photos-img"
                      src={imgLink.toString()}
                      alt=""
                    />
                  </SwiperSlide>
                );
              });
            })}
        </Swiper>
        <div className="swiper-button-next-photos swiper-button-next"></div>
      </div>

      {reviewsData &&
        Array.isArray(reviewsData) &&
        reviewsData.length > 0 &&
        reviewsData.map((review, index) => (
          <ReviewCard
            key={review.id || index}
            reviews={review}
            isReviewsAboutProduct={isReviewsProduct}
          />
        ))}
      {isReviewsAboutProduct && (
        <>
          <div>
            <button
              className="review-answer-user-btn"
              onClick={() => setIsModalVisible(true)}
            >
              Оставить отзывы
            </button>
          </div>

          <Modal
            size="md"
            show={isModalVisible}
            onHide={() => setIsModalVisible(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal-fast-order-wrapp reviews-comment-modal"
          >
            <form onSubmit={formik.handleSubmit}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <div className="d-flex jc-sb ai-c mb-3 px-3">
                  <label className="modal-review-text-label">
                    Ваше сообщение
                  </label>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <img
                        key={star}
                        src={starIcon}
                        alt={`star-${star}`}
                        className={`star-icon ${
                          star <= rating ? "active" : ""
                        }`}
                        onClick={() => {
                          setRating(star);
                          formik.setFieldValue("rating", star);
                          formik.setFieldTouched("rating", true, false);
                          if (formik.errors.rating) {
                            delete formik.errors.rating;
                          }
                        }}
                        style={{
                          cursor: "pointer",
                          opacity: star <= rating ? 1 : 0.3,
                        }}
                      />
                    ))}
                    {formik.touched.rating && formik.errors.rating ? (
                      <div className="text-danger">{formik.errors.rating}</div>
                    ) : null}
                  </div>
                </div>

                <div className="review-name-input-wrapp">
                  <input
                    type="text"
                    name="name"
                    className={`modal-fast-order-input ${
                      formik.touched.name && formik.errors.name
                        ? "border-danger"
                        : ""
                    }`}
                    placeholder="Ваше имя"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-danger">{formik.errors.name}</div>
                  ) : null}
                </div>

                <div className="review-name-input-wrapp">
                  <input
                    type="text"
                    name="phone"
                    className={`modal-fast-order-input ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-danger"
                        : ""
                    }`}
                    placeholder="Ваш номер телефона"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-danger">{formik.errors.phone}</div>
                  ) : null}
                </div>

                <textarea
                  name="message"
                  className="modal-fast-order-input"
                  placeholder="Ваше сообщение"
                  rows="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                />

                <div className="file-upload-wrapper">
                  <label
                    htmlFor="file-upload"
                    className={`file-upload-label ${
                      formik.touched.file && formik.errors.file
                        ? "border-danger"
                        : ""
                    }`}
                  >
                    Выбрать файлы
                  </label>
                  <input
                    name="file"
                    className="file-upload-input"
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.currentTarget.files);
                      formik.setFieldValue("file", files);
                    }}
                  />
                  {formik.values.file && formik.values.file.length > 0 && (
                    <div className="file-upload-selected">
                      <p>{`Выбрано файлов: ${formik.values.file.length}`}</p>
                    </div>
                  )}
                  {formik.touched.file && formik.errors.file ? (
                    <div className="text-danger">{formik.errors.file}</div>
                  ) : null}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button type="submit" className="fast-order-submit-btn">
                  Отправить
                </button>
                {showPopup && (
                  <div
                    className={`popup-notification ${
                      popupMessage === "Комментарий не отправлен"
                        ? "text-danger"
                        : ""
                    }`}
                    style={{
                      position: "absolute",
                      width: "60%",
                      textAlign: "center",
                      fontSize: "22px",
                      fontWeight: "bold",
                      margin: "auto",
                      transform: "translate(-65%, -2px)",
                    }}
                  >
                    {popupMessage}
                  </div>
                )}
              </Modal.Footer>
            </form>
          </Modal>
        </>
      )}
    </div>
  ) : null;
}

export default Reviews;
