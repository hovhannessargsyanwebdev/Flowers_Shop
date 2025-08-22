import { useState, useEffect } from "react";
import { NotificationPopUp } from "../../components/action/NotificationPopUp";

const DropdownLastCheckboxes = ({
  checkBoxData,
  filter,
  urlSearchParams,
  isDropdownOpen,
  setIsDropdownOpen,
  catalogDataReserv,
  seCountClickForBug
}) => {
  const [checkedItems, setCheckedItems] = useState(() => {
    const initialChecked = {};
    if (urlSearchParams.current) {
      for (const key in urlSearchParams.current) {
        if (Array.isArray(urlSearchParams.current[key])) {
          urlSearchParams.current[key].forEach((value) => {
            initialChecked[`${key}-${value}`] = true;
          });
        } else {
          initialChecked[`${key}-${urlSearchParams.current[key]}`] = true;
        }
      }
    }
    return initialChecked;
  });

  const [filterNotificationMessage, setFilterNotificationMessage] =
    useState(null);

  useEffect(() => {
    if (filterNotificationMessage) {
      const timer = setTimeout(() => setFilterNotificationMessage(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [filterNotificationMessage]);

  const handleCheckboxChange = (e) => {
    catalogDataReserv.current = []
    seCountClickForBug(0)
    
    const { name, value, checked } = e.target;
    const key = `${name}-${value}`;

    setCheckedItems((prev) => {
      const newCheckedItems = {
        ...prev,
        [key]: checked,
      };

      const activeCountBefore = Object.values(prev).filter(Boolean).length;
      const activeCountAfter =
        Object.values(newCheckedItems).filter(Boolean).length;

      const formData = new FormData();
      Object.keys(newCheckedItems).forEach((checkedKey) => {
        if (newCheckedItems[checkedKey]) {
          const [paramName, paramValue] = checkedKey.split("-");
          formData.append(paramName, paramValue);
        }
      });

      // Условия для показа "Поиск ..."
      let shouldShowNotification = false;
      if (activeCountAfter < 2) {
        if (!prev[key] && checked) {
          shouldShowNotification = true;
        }
      } else if (activeCountAfter >= 2) {
        shouldShowNotification = true;
      }

      if (shouldShowNotification) {
        setFilterNotificationMessage("Поиск ...");
      }

      filter(e, formData)
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
          console.error("Error in DropdownLastCheckboxes filter:", error);
        });

      return newCheckedItems;
    });
  };

  return (
    <div className="dropdown-last-checkbox">
      <h5>Готовые букеты и с быстрой доставкой</h5>
      <button
        className="dropdown-btn"
        onClick={(e) => {
          setIsDropdownOpen(!isDropdownOpen);
          e.preventDefault();
        }}
      >
        Готовые букеты
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
      {filterNotificationMessage && (
        <NotificationPopUp message={filterNotificationMessage} />
      )}

      <div
        className="dropdown-last-checkbox-content"
        style={{ display: isDropdownOpen ? "block" : "none" }}
      >
        <ul>
          {checkBoxData.map((checkbox, index) => {
            const key = `${checkbox.name}-${checkbox.value}`;
            const isChecked = !!checkedItems[key];
            return (
              <li className="dropdown_checkbox" key={index}>
                <input
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  id={`consistlast_${checkbox.name}_${checkbox.value}`}
                  name={checkbox.name}
                  value={checkbox.value}
                  checked={isChecked}
                />
                <label
                  htmlFor={`consistlast_${checkbox.name}_${checkbox.value}`}
                >
                  {checkbox.title}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DropdownLastCheckboxes;
