import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { Link } from "react-router-dom";
import { handleAddToBasket } from "../../../action.js";

import "../../../styles/action-styles/Modal.css";
import "../../../styles/action-styles/ButtonOrder.css";

function ButtonOrder({ card, resetQuantity }) {
  const [modalShow, setModalShow] = useState(false);
  const [isResolveRequest, setIsResolveRequest] = useState(false);
  const [showPopupResolveRequest, setShowPopupResolveRequest] = useState(false);
  const [showPopupRejectRequest, setShowPopupRejectRequest] = useState(false);

  const handleOrderClick = (e) => {
    setModalShow(true);
    const form = e.currentTarget.closest("form");
    let currentQuantity = 1;
    if (form) {
      const q = form.querySelector(".quantity");
      if (q) currentQuantity = parseInt(q.innerText);
    }
    handleAddToBasket({
      id: card.id,
      e,
      quantity: currentQuantity,
      onSuccess: () => {
        setShowPopupRejectRequest(false);
        setIsResolveRequest(true);
        setShowPopupResolveRequest(true);
        setModalShow(true);
      },
      onError: () => {
        setShowPopupRejectRequest(true);
        setIsResolveRequest(false);
        setModalShow(true);
      },
    });
  };

  return (
    <div className="btn-order-wrapp">
      <button className="btn-order" onClick={handleOrderClick}>
        ЗАКАЗАТЬ
      </button>
      {isResolveRequest && (
        <Modal
          size="lg"
          show={modalShow}
          onHide={() => setModalShow(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="modal-order-wrapp"
        >
          <Modal.Header className="p-relative" closeButton></Modal.Header>
          <Modal.Body>
            <button
              className="modal-order-btn"
              onClick={() => setModalShow(false)}
              variant="-*"
            >
              Продолжить
            </button>
            <Link to={"/basket-page"}>
              <button variant="-*" className="modal-order-btn">
                Перейти к оформлению заказа
              </button>
            </Link>
          </Modal.Body>
          {showPopupResolveRequest && (
            <div className="popup-resolve-notification">
              Товар добавлен в корзину
            </div>
          )}
        </Modal>
      )}

      {showPopupRejectRequest && (
        <Modal
          size="lg"
          show={modalShow}
          onHide={() => setModalShow(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="modal-order-wrapp"
        >
          <Modal.Header className="p-relative" closeButton></Modal.Header>
          <Modal.Body>
            <div className="popup-rejet-notification">Ошибка при отправке</div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
export default ButtonOrder;
