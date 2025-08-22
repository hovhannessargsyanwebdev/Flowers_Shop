import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import DOMPurify from "dompurify";
import "../styles/Cards.css";
import starIcon from "../images/icons/star-fill.svg";

function ReviewCard({ reviews, isReviewsAboutUs, isReviewsAboutProduct, itemNumber }) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  let newRating = [];

  for (let i = 0; i < reviews.rating; i++) {
    newRating.push(
      <img className="review-star-icon" src={starIcon} alt="star" key={i} />
    );
  }

  const toggleAnswer = () => setIsAnswerVisible((prev) => !prev)

  if (isReviewsAboutUs) {
    return (
      <Card className={`review-card`}>
        <Card.Body>
          <div className="d-flex jc-sb ai-c">
            <Card.Text className="review-date">{reviews.date}</Card.Text>
            <div>{newRating.map((item) => item)}</div>
          </div>
          <Card.Text className="review-user-name">{reviews.userName}</Card.Text>
          <Card.Text className="review-text">{reviews.review}</Card.Text>
        </Card.Body>
      </Card>
    );
  } else if (isReviewsAboutProduct) {
    return (
      <Card
        className={
          itemNumber ? `review-card review-card-${itemNumber}` : "review-card"
        }
      >
        <Card.Body>
          <div className="d-flex jc-sb ai-c">
            <Card.Text className="review-date-text"> {reviews.date} </Card.Text>
            <Card.Text className="review-rating-icons">
              {newRating.map((item) => item)}{" "}
            </Card.Text>
          </div>
          <Card.Text className="review-username">{reviews.userName}</Card.Text>
          <Card.Text className="review-username-review">
            {reviews.review}
          </Card.Text>

          <Card.Text className="review-admin-text">
            Ответ Администратора
          </Card.Text>
          <div className="review-admin-answer-wrapp">
            <div>
              {reviews.admin ? (
                <>
                  <button
                    className="review-show-answer"
                    onClick={toggleAnswer}
                  >
                    {isAnswerVisible ? "Скрыть ответ" : "Посмотреть ответ"}
                  </button>
                  <div
                    className={`review-answer-admin ${
                      isAnswerVisible ? "open" : ""
                    }`}
                  >
                    {isAnswerVisible && (
                      <p
                        className="review-text-admin"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(reviews.admin),
                        }}
                      />
                    )}
                  </div>
                </>
              ) : (
                <p className="review-no-answer">Пусто</p>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default ReviewCard;