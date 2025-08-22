import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Form from "../action/Form/Form";
import BasketItem from "./BasketItem";
import "../../styles/Basket.css";
import "../../styles/action-styles/Modal.css";

const BasketPage = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchBasketItems = useCallback(() => {
    axios
      .get("/api/cart.php")
      .then((resolve) => {
        setBasketItems(resolve.data);
      })
      .catch((error) => {
        console.log(error);
        setBasketItems([]);
      });
  }, []);

  useEffect(() => {
    fetchBasketItems();
  }, [fetchBasketItems]);

  useEffect(() => {
    if (Array.isArray(basketItems)) {
      const calculatedTotal =
        basketItems.reduce(
          (sum, item) => sum + item.price * (item.count || 1),
          0
        ) / 100;
      setTotalPrice(calculatedTotal);

      const basketTotalCount = basketItems.reduce(
        (sum, item) => sum + (item.count || 1),
        0
      );

      localStorage.setItem("addToCart", basketTotalCount.toString());
      window.dispatchEvent(new Event("storage"));
    }
  }, [basketItems]);

  const handleRemoveItem = (id) => {
    setBasketItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id, updatedItem) => {
    setBasketItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      );
      return newItems;
    });
  };

  return (
    <div className="basket-page container-size">
      <h2 className="basket-page-title">Корзина и оформление заказа</h2>
      {basketItems.length > 0 ? (
        <>
          {basketItems.map((item, index) => (
            <BasketItem
              key={index}
              basketItem={item}
              onUpdate={handleUpdateItem}
              onRemove={handleRemoveItem}
            />
          ))}
          <Form
            totalPrice={totalPrice}
            products={basketItems}
            onOrderSuccess={fetchBasketItems}
          />
        </>
      ) : (
        <p
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
            marginTop: "35px",
          }}
        >
          Ваша корзина пуста
        </p>
      )}
    </div>
  );
};

export default BasketPage;
