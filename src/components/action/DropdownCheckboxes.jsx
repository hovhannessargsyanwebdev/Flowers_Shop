import { useState, useEffect } from "react";
import { NotificationPopUp } from "../../components/action/NotificationPopUp";
import { useDisableZoomOnInputFocus } from "../../action";
import "../../styles/action-styles/FilterDropdownHeader.css";

const DropdownCheckboxes = ({
  checkBoxData,
  filter,
  noSubmit,
  urlSearchParams,
  isDropdownOpen,
  setIsDropdownOpen,
  catalogDataReserv,
  seCountClickForBug
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(checkBoxData);
  const [checkedItems, setCheckedItems] = useState(() => {
    const initialChecked = {};
    if (urlSearchParams.current && urlSearchParams.current["consist[]"]) {
      const checkedValues = Array.isArray(urlSearchParams.current["consist[]"])
        ? urlSearchParams.current["consist[]"]
        : [urlSearchParams.current["consist[]"]];
      checkedValues.forEach((id) => {
        initialChecked[id] = true;
      });
    }
    checkBoxData.forEach((item) => {
      if (!initialChecked[item.id]) {
        initialChecked[item.id] = false;
      }
    });
    return initialChecked;
  });
  const [filterNotificationMessage, setFilterNotificationMessage] =
    useState(null);

  useDisableZoomOnInputFocus();

  const handleSearchCheckbox = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredCategories = checkBoxData.filter((category) =>
      category.title.toLowerCase().includes(query)
    );

    setFilteredData(filteredCategories);
  };

  useEffect(() => {
    if (filterNotificationMessage) {
      const timer = setTimeout(() => setFilterNotificationMessage(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [filterNotificationMessage]);

  const handleCheckboxChange = (e, id) => {
    catalogDataReserv.current = []
    seCountClickForBug(0)
    const isChecked = e.target.checked;

    const activeCountBefore =
      Object.values(checkedItems).filter(Boolean).length;

    const newCheckedItems = {
      ...checkedItems,
      [id]: isChecked,
    };

    const activeCountAfter =
      Object.values(newCheckedItems).filter(Boolean).length;

    setCheckedItems(newCheckedItems);

    const formData = new FormData();
    Object.keys(newCheckedItems).forEach((key) => {
      if (newCheckedItems[key]) {
        formData.append("consist[]", key);
      }
    });
    if (Object.values(newCheckedItems).every((value) => !value)) {
      formData.delete("consist[]");
    }

    if (
      (activeCountAfter < 2 && !checkedItems[id] && isChecked) ||
      activeCountAfter >= 2
    ) {
      setFilterNotificationMessage("Поиск ...");
    }

    filter(e, 1)
      .then((data) => {        
        if (activeCountAfter > 0) {
          if (Array.isArray(data) && data.length > 0) {
            setFilterNotificationMessage("Фильтр успешно применен!");
          } else if (Array.isArray(data) && data.length === 0) {
            setFilterNotificationMessage(
              "Товаров не найдено. Попробуйте изменить запрос."
            );
          } else {
            setFilterNotificationMessage("Фильтр применен.");
          }
        } else {
          setFilterNotificationMessage(null);
        }
      })
      .catch((error) => {
        if (activeCountAfter > 0) {
          setFilterNotificationMessage(
            "Произошла ошибка: " + (error?.message || "Неизвестная ошибка")
          );
        }
      });
  };

  return (
    <div className="dropdown-checkbox">
      <h5>Выберите цветы в букете</h5>
      <button
        className="dropdown-btn"
        onClick={(e) => {
          e.preventDefault();
          noSubmit(e);
          setIsDropdownOpen();
        }}
      >
        Цветы в составе
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
            . . . . . . . . . . . . . . . . .
          </div>
        ) : (
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
        )}
        <span className="vertical-line">|</span>
      </button>

      {filterNotificationMessage && (
        <NotificationPopUp message={filterNotificationMessage} />
      )}
      <div
        className="dropdown-checkbox-content"
        style={{ display: !isDropdownOpen ? "none" : "block" }}
      >
        <div className="dropdown-search-wrapp">
          <div className="dropdown-search-input-wrapp">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#888383"
              className="search-icon bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            <input
              className="dropdown-search"
              type="text"
              placeholder="Поиск по цветам"
              value={searchQuery}
              onChange={handleSearchCheckbox}
            />
          </div>
        </div>

        <ul className="dropdown-checkbox-wrapp">
          {filteredData.map((category, index) => {
            const isChecked = !!checkedItems[category.id];
            return (
              <li className="dropdown_checkbox" key={index}>
                <input
                  type="checkbox"
                  id={`consist_${category.id}`}
                  value={category.id}
                  name={`consist[]`}
                  onChange={(e) => handleCheckboxChange(e, category.id)}
                  checked={isChecked}
                />
                <label htmlFor={`consist_${category.id}`}>
                  {category.title}
                </label>
              </li>
            );
          })}
        </ul>

        <p className="dropdown-filter-text-sm">
          * выбранные помечаются галочкой, при желании галочку можно убрать
        </p>
      </div>
    </div>
  );
};

export default DropdownCheckboxes;
