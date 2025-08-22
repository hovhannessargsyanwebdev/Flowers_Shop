function ProductCalculate({
  setProductPrice,
  productPrice,
  price,
  setQuantity,
  quantity,
  className,
  calcHandler,
  isCalcBasketCard,
  index,
  items,
  setItems,
  updateTotalPrice,
  isFlowersOfDay,
  isProductDetails,
}) {
  const handleQuantityChange  = (e, action) => {
    e.preventDefault();
    // setProductPrice(price * quantity)
    if (isCalcBasketCard) {
      calcHandler({
        action,
        currentQuantity: quantity,
        currentPrice: productPrice,
        basePrice: price,
        setItems,
        index,
        updateTotalPrice,
        items,
      });
    } else {
      calcHandler({
        action,
        currentQuantity: quantity,
        currentPrice: productPrice,
        basePrice: price,
        setQuantity,
        setProductPrice,
      });
    }
  };
  
  return (
    <div className={`card-calculate ${className ? className : ""}`}>
      {isProductDetails ? (
        <div className="p-relative">
          <span className="card-price">{productPrice / 100}₽</span>
          <p className="text-about-price">*Цена с доставкой по Москве</p>
        </div>
      ) : (
        <span className="card-price">{productPrice / 100}₽</span>
      )}

      <div
        className="quantity-controls"
        style={{
          backgroundColor: "#f6f6f6",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ...(isFlowersOfDay && { minWidth: "105px" }),
          ...(isProductDetails && { maxWidth: "105px", width: "100%" }),
        }}
      >
        <button
          data-calc="subtract"
          onClick={(e) => handleQuantityChange (e, "subtract")}
          disabled={isCalcBasketCard && quantity <= 1}
        >
          -
        </button>
        <span
          contenteditable="true"
          className="quantity"
          tabIndex={0}>{quantity}
        </span>
        <button data-calc="addit" onClick={(e) => handleQuantityChange (e, "addit")}>
          +
        </button>
      </div>

    </div>
  );
}

export default ProductCalculate;
