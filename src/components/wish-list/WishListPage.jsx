import WishListItem from "./WishListItem";
import { useState, useEffect } from "react";
import axios from "axios";
import { useScrollingToTop } from "../../action";
const WishListPage = () => {
  const [newWishList, setNewWishList] = useState([]);

  useScrollingToTop()

  useEffect(() => {
    axios
      .get("/api/wishlist.php")
      .then((resolve) => {
        setNewWishList(resolve.data);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlistCount", newWishList.length.toString());
    window.dispatchEvent(new Event("storage"));
  }, [newWishList]);

  const handleRemoveItem = (id) => {
    setNewWishList((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="wish-list-page container-size">
      <h2 className="wish-list-page-title">Избранное</h2>
      {newWishList.length > 0 ? (
        newWishList.map((item) => (
          <WishListItem
            key={`whishlist_${item.id}`}
            wishListItem={item}
            onRemove={handleRemoveItem}
          />
        ))
      ) : (
        <p
          style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}
        >
          Товары в списке желаний отсутствуют
        </p>
      )}
    </div>
  );
};
export default WishListPage;
