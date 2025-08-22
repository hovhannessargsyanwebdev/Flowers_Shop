import "../../styles/action-styles/FilterDropdownHeader.css";
import { useState, useEffect } from "react";
import { NotificationPopUp } from "../../components/action/NotificationPopUp";

const DropdownPrice = ({
  rangMinMax,
  noSubmit,
  filter,
  isDropdownOpen,
  setIsDropdownOpen,
  rangeValues,
  setRangeValues,
  catalogDataReserv,
  seCountClickForBug
}) => {
  const [filterNotificationMessage, setFilterNotificationMessage] =
    useState(null);

  const [defaultMinMax] = useState({
    minPrice: rangMinMax?.minPrice,
    maxPrice: rangMinMax?.maxPrice,
  });

  const minPrice = rangMinMax?.minPrice || defaultMinMax.minPrice;
  const maxPrice = rangMinMax?.maxPrice || defaultMinMax.maxPrice;

  useEffect(() => {
    if (filterNotificationMessage) {
      const timer = setTimeout(() => setFilterNotificationMessage(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [filterNotificationMessage]);

  if (!minPrice || !maxPrice) return null;

  const handleRangeChange = (values) => {
    catalogDataReserv.current = []
    seCountClickForBug(0)
    
    if (values[0] > values[1]) values[0] = values[1];
    if (values[1] < values[0]) values[1] = values[0];
    setRangeValues(values);
  };

  const handleInputChange = (index, event) => {
    const newValue =
      event.target.value === "" ? "" : parseInt(event.target.value, 10);

    const newRangeValues = [...rangeValues];
    newRangeValues[index] = newValue;

    if (newValue !== "" && !isNaN(newValue)) {
      if (index === 0 && newRangeValues[0] > newRangeValues[1]) {
        newRangeValues[0] = newRangeValues[1];
      } else if (index === 1 && newRangeValues[1] < newRangeValues[0]) {
        newRangeValues[1] = newRangeValues[0];
      }
    }

    setRangeValues(newRangeValues);
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("min_price", rangeValues[0]);
    formData.append("max_price", rangeValues[1]);

    setFilterNotificationMessage("Поиск ...");

    filter(e, formData)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFilterNotificationMessage("Фильтр успешно применен!");
        } else {
          setFilterNotificationMessage(
            "Товаров не найдено. Попробуйте изменить запрос."
          );
        }
      })
      .catch((error) => {
        setFilterNotificationMessage(
          "Произошла ошибка: " + (error?.message || "Неизвестная ошибка")
        );
        console.error("Error in DropdownPrice filter:", error);
      });
  };

  return (
    <div className="dropdown-price">
      <h5>Сортировка по цене</h5>
      <button
        className="dropdown-btn"
        onClick={(e) => {
          e.preventDefault();
          noSubmit(e);
          setIsDropdownOpen();
        }}
      >
        Цена
        {isDropdownOpen ? (
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "11px",
              width: "87%",
              fontSize: "19px",
              color: "#bfbebe",
              fontWeight: "401",
            }}
          >
            . . . . . . . . . . . . .
          </div>
        ) : null}
        <span className="vertical-line">|</span>
        {!isDropdownOpen ? (
          <span className="dropdown-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-down"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
              />
            </svg>
          </span>
        ) : null}
      </button>
      <div className="dropdown-rang-input-wrapp">
        {filterNotificationMessage && (
          <NotificationPopUp message={filterNotificationMessage} />
        )}
      </div>
      {isDropdownOpen ? (
        <div className="dropdown-price-content" style={{ display: "block" }}>
          <div className="price-inputs">
            <span className="input-text">от</span>
            <input
              type="number"
              value={rangeValues[0]}
              name="min_price"
              onChange={(e) => handleInputChange(0, e)}
              min={rangMinMax.minPrice / 100}
              max={rangMinMax.maxPrice / 100}
              className="price-input"
            />
            <span className="input-text input-text-max-rang">до</span>
            <input
              type="number"
              name="max_price"
              value={rangeValues[1]}
              onChange={(e) => handleInputChange(1, e)}
              min={rangMinMax.minPrice / 100}
              max={rangMinMax.maxPrice / 100}
              className="price-input"
            />
          </div>
          <div className="range-sliders-container">
            <input
              type="range"
              value={rangeValues[0]}
              onChange={(e) =>
                handleRangeChange([Number(e.target.value), rangeValues[1]])
              }
              min={rangMinMax.minPrice / 100}
              max={rangMinMax.maxPrice / 100}
              className="price-range-slider min-slider"
            />
            <input
              type="range"
              value={rangeValues[1]}
              onChange={(e) =>
                handleRangeChange([rangeValues[0], Number(e.target.value)])
              }
              min={rangMinMax.minPrice / 100}
              max={rangMinMax.maxPrice / 100}
              className="price-range-slider max-slider"
            />
          </div>
          <button
            className="dropdown-price-filter-btn"
            onClick={handleApplyFilter}
          >
            Применить
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default DropdownPrice;
