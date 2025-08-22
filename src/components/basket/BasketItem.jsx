import { Card } from "react-bootstrap";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { calcHandler } from "../../action";
import ProductCalculate from "../action/calculation-product-logic/ProductCalculate";
import trashSvg from "../../images/icons/delete-button.png";

const BasketItem = ({ basketItem, onUpdate, onRemove }) => {
  const [quantity, setQuantity] = useState(basketItem.count);
  const [isLoading, setIsLoading] = useState(false);
  const [productPrice, setProductPrice] = useState(Number(basketItem.price)); 

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    const newPrice = basketItem.price * newQuantity;
    setProductPrice(newPrice);
    onUpdate(basketItem.id, { count: newQuantity, price: basketItem.price });
  };

  const deleteFromBasket = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          action: "removefromcart",
        }),
      });

      const data = await response.json();
      if (data.status === "Ok") {
        const addToCart = parseInt(localStorage.getItem("addToCart") || 0);
        localStorage.setItem("addToCart", (addToCart - 1).toString());
        window.dispatchEvent(new Event("storage"));
        onRemove(id);
      }
    } catch (error) {
      console.error("Ошибка при удалении из корзины:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="basket-card">
      <Card data-id={basketItem.id}>
        <div className="basket-card-image-wrapper">
          <Link to={basketItem.url}>
            <Card.Img
              className="basket-card-img"
              variant="top"
              src={basketItem.img}
            />
          </Link>
        </div>
        <Card.Body className="basket-card-body">
          <div className="basket-card-info">
            <div className="basket-card_calculate-wrapp">
              <ProductCalculate
                productPrice={productPrice}
                setProductPrice={setProductPrice}
                price={basketItem.price}
                quantity={quantity}
                setQuantity={(newQuantity) => handleQuantityChange(newQuantity)}
                calcHandler={calcHandler}
              />
              <div className="basket-card-btn-group">
                <button
                  onClick={() => deleteFromBasket(basketItem.id)}
                  disabled={isLoading}
                  className="card_trash-btn"
                >
                  <img
                    src={trashSvg}
                    alt="trash icon"
                    className="basket-card_trash-btn-svg"
                  />
                  Удалить
                </button>
              </div>
            </div>
            <span className="basket-card-delivery-text">
              *Цена с доставкой по Москве
            </span>
            <Link className="basket-card-title-link" to={basketItem.url}>
              <Card.Title>{basketItem.title}</Card.Title>
            </Link>
          </div>
        </Card.Body>
        <Form className="basket-card-textarea-wrapp">
          <Form.Label className="label-text-title">Текст в открытку</Form.Label>
          <Form.Control as="textarea" />
        </Form>
      </Card>
    </div>
  );
};

export default BasketItem;
