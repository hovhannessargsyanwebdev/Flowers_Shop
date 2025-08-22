import { Card, Modal } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCalculate from "../action/calculation-product-logic/ProductCalculate";
import { calcHandler } from "../../action";
import "../../styles/Basket.css";
import plusSvg from "../../images/icons/plus.svg";
import trashSvg from "../../images/icons/trash(1).svg";

const WishListItem = ({ wishListItem, onRemove }) => {
  const [quantity, setQuantity] = useState(1);
  const [productPrice, setProductPrice] = useState(wishListItem.price);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const addToCart = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/cart.php", {
        id: id,
        count: quantity,
        action: "addtocart",
      });

      if (response.data.status === "Ok") {
        const cartCount = parseInt(localStorage.getItem("addToCart") || 0);
        localStorage.setItem("addToCart", (cartCount + 1).toString());
        window.dispatchEvent(new Event("storage"));

        setModalMessage("Товар успешно добавлен в корзину");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      }
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      setModalMessage("Не удалось добавить товар в корзину");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFromWishlist = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/wishlist.php", {
        id: id,
        action: "remove",
      });

      if (response.data.status === "Ok") {
        const wishlistCount = parseInt(
          localStorage.getItem("wishlistCount") || 0
        );
        localStorage.setItem("wishlistCount", (wishlistCount - 1).toString());
        window.dispatchEvent(new Event("storage"));
        onRemove(id);
      }
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!wishListItem) return null;

  return (
    <div className="wish-list-card">
      {wishListItem && (
        <Card>
          <Link to={wishListItem.url} state={{ productData: wishListItem }}>
            <Card.Img
              className="wish-list-card-img"
              variant="top"
              src={wishListItem.img}
              alt={wishListItem.name}
            />
          </Link>
          <Card.Body>
            <div className="d-flex jc-sa">
              <div className="wish-list-card_calculate-wrapp">
                <ProductCalculate
                  productPrice={productPrice}
                  price={wishListItem.price}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  setProductPrice={setProductPrice}
                  calcHandler={calcHandler}
                />
                <span className="wish-list-card-delivery-text">
                  *Цена с доставкой по Москве
                </span>
              </div>
              <div className="wish-list-card-btn-group">
                <button
                  className="wish-list-card_trash-btn"
                  onClick={() => deleteFromWishlist(wishListItem.id)}
                  disabled={isLoading}
                >
                  <img
                    src={trashSvg}
                    alt="trash icon"
                    className="wish-list-card_trash-btn-svg"
                  />
                  {isLoading ? "Удаление..." : "Удалить"}
                </button>

                <button
                  onClick={() => addToCart(wishListItem.id)}
                  className="wish-list-card_plus-btn"
                  disabled={isLoading}
                >
                  <img
                    className="wish-list-card-plus-svg"
                    src={plusSvg}
                    alt=""
                  />
                  {isLoading ? "Добавление..." : "Добавить в корзину"}
                </button>

                <Modal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  centered
                >
                  <Modal.Body
                    style={{
                      textAlign: "center",
                      fontWeight: "401",
                      padding: "25px",
                      fontSize: "22px",
                    }}
                  >
                    {modalMessage}
                  </Modal.Body>
                </Modal>
              </div>
            </div>
            <Link
              className="wish-list-card-title-link"
              to={wishListItem.url}
              state={{ productData: wishListItem }}
            >
              <Card.Title>{wishListItem.title}</Card.Title>
            </Link>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
export default WishListItem;
