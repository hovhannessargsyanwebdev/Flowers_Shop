import "bootstrap/dist/css/bootstrap.min.css";
import "../styles global/index.css";
import "../../src/styles global/index.css";
import "../styles/Header.css";
import ".././styles/action-styles/Modal.css";
import ".././styles/Basket.css";
import "../styles/Contacts.css";
import searchIconInput from "../images/icons/lupa_w.png";
import searchIconInputBlack from "../images/icons/lupa_b.png";
import heartIcon from "../images/icons/heart.svg";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { mainLinksHeader, headerInfoButton } from "../data";
import {
  useDisableZoomOnInputFocus,
  GetCountFromLocalstorage,
  GetWishListQuantity,
} from "../../src/action";
import FeedbackCallOrder from "./action/FeedbackCallOrder";
import Contacts from "./Contacts";
import { useScrollingToTop } from "../action";

function Header({ onHeaderHeightChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isHomePage = location.pathname === "/";
  const isCatalogPage = location.pathname === "/catalog";
  const [modalShowContacts, setModalShowContacts] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isdropdownFilter, setiIsdropdownFilter] = useState(false);
  useDisableZoomOnInputFocus();

  useScrollingToTop();


  const headerRef = useRef(null);
  const [currentHeaderHeight, setCurrentHeaderHeight] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("search");
    if (value) {
      setSearchInput(decodeURIComponent(value));
    } else {
      setSearchInput("");
    }
  }, [location.search]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const checkDropdownFilter = document.querySelector(
        ".header-dropdown-btn-mobile"
      );
      setiIsdropdownFilter(!!checkDropdownFilter);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const measureHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        if (height !== currentHeaderHeight) {
          setCurrentHeaderHeight(height);
          if (onHeaderHeightChange) {
            onHeaderHeightChange(height);
          }
        }
      }
    };

    measureHeight();
    window.addEventListener("resize", measureHeight);

    let observer;
    if (headerRef.current) {
      observer = new MutationObserver((mutations) => {
        let shouldMeasure = false;
        for (let mutation of mutations) {
          if (mutation.type === "childList" || mutation.type === "attributes") {
            if (
              mutation.target === headerRef.current ||
              headerRef.current.contains(mutation.target)
            ) {
              shouldMeasure = true;
              break;
            }
          }
        }
        if (shouldMeasure) {
          measureHeight();
        }
      });

      observer.observe(headerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    }

    return () => {
      window.removeEventListener("resize", measureHeight);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [currentHeaderHeight, onHeaderHeightChange]);

  const handleSearch = async () => {
    if (searchInput.trim() === "") return;

    try {
      const response = await axios.get(
        `/api/catalog.php?search=${encodeURIComponent(
          searchInput
        )}`
      );

      const newUrl = `/catalog?search=${encodeURIComponent(searchInput)}`;
      setTimeout(() => {
        setSearchInput("");
        setSearchModal(false);
        navigate(newUrl, {
          state: {
            scrollAfterSearchInput: true,
          },
        });
      }, 100);
      console.error(" запроса:", response);
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  };

  // function openWhatsApp() {
  //   const phone = "79161234567";
  //   const message = "Здравствуйте, я хочу узнать подробнее о вашем продукте!";
  //   const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  //   window.open(url, "_blank");
  // }

  return (
    <>
      <header className="header" ref={headerRef}>
        <div
          className={`header-main container-size ${
            isMobile && (isHomePage || isCatalogPage)
              ? "header-main-mobile"
              : ""
          } ${isdropdownFilter ? "mb-30" : ""}`}
        >
          <div className="header-main-contacts">
            <div className="d-flex jc-sb">
              <div className="header-main-contacts-phone">
                <button
                  type="button"
                  style={{ backgroundColor: "transparent" }}
                  onClick={() => setModalShowContacts(true)}
                >
                  <span className="header-main-contacts-phone-link">
                    {`<?php echo $phone;?>`}
                  </span>
                  <span className="header-main-contacts-whatsup-link">
                    Звонки,
                    <span
                      href="https://wa.me/<?php echo $whatsapp; ?>"
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </span>
                    <span> и </span>
                    <span
                      href="https://t.me/<?php echo $telegram; ?>"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Telegram
                    </span>
                  </span>
                </button>
              </div>

              <div className="header-main-work-hours">
                <p className="fsz-19">Каждый день</p>
                <p className="fsz-15">с 7:00 до 00:00</p>
              </div>
            </div>
            <hr className="border-top-1" />
            <div className="text-center">
              <div className="header-main-call-order-text">
                <FeedbackCallOrder text="Заказать звонок" />
                <span className="header-main-call-order-text-sm">
                  (перезвоним за 30 сек.)
                </span>
              </div>
            </div>
          </div>

          <div className="header-main-logo">
            <Link
              to="/"
              className="d-block text-center"
              state={{
                fromHeaderMain: true,
                clickFromHeaderNavbar: true,
                isMobile: isMobile,
              }}
            >
              <img
                className="header-logo"
                src={"<?php echo $logo; ?>"}
                alt=""
              />
            </Link>
            <p className="fsz-15">
              <span className="header-addres-text-mobile">
                {`<?php echo $adress;?>`}
              </span>
            </p>
          </div>

          <div className="header-main-user-wrapp">
            <div className="header-main-info">
              {headerInfoButton.map((link, index) => {
                return (
                  <Link
                    to={`${link.path}`}
                    key={`title_${index}`}
                    state={{ clickFromHeaderNavbar: true, isMobile: isMobile }}
                    onClick={() => {
                      navigate(link.path, {
                        state: {
                          clickFromHeaderNavbar: true,
                          path: link.path,
                          isMobile: isMobile,
                        },
                      });
                    }}
                    className="header-main-info-btn"
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>

            <div className="header-main-icons">
              <Button
                className="header-main-icon-wrapp"
                variant="-*"
                onClick={() => setSearchModal(true)}
              >
                <img
                  className="header-main-icon"
                  src={searchIconInput}
                  alt=""
                />
              </Button>

              <Modal
                size="xl"
                show={searchModal}
                onHide={() => {
                  setSearchModal(false);
                  setSearchInput("");
                }}
                aria-labelledby="example-modal-sizes-title-lg"
                className="modal-search-input"
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <div className="header-search-input-wrapp">
                    <img
                      src={searchIconInputBlack}
                      alt=""
                      className="header-search-input-icon"
                    />
                    <input
                      id="myInput"
                      className="header-search-input"
                      type="text"
                      placeholder="поиск по цветам и букетам"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          document.activeElement.blur();
                          handleSearch();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="header-search-button"
                      onClick={(e) => {
                        e.preventDefault();
                        document.activeElement.blur();
                        handleSearch();
                      }}
                    >
                      Поиск
                    </button>
                  </div>
                </Modal.Body>
              </Modal>

              <button
                type="button"
                className="header-main-icon-btn"
                onClick={() => setModalShowContacts(true)}
              >
                <svg
                  className="header-main-icon bi bi-telephone-fill"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#000"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                  />
                </svg>
              </button>

              <Modal
                className="header-modal-wrapp header-modal-contact-wrapp"
                show={modalShowContacts}
                onHide={() => setModalShowContacts(false)}
                size="lg"
                centered
              >
                <Modal.Body>
                  <Contacts />
                </Modal.Body>
              </Modal>

              <Link
                to="/wish-list-page"
                className="p-relative"
                state={{ freomHeader: true, isMobile: isMobile }}
              >
                <span className="wishlist-count">{GetWishListQuantity()}</span>
                <img className="header-main-icon" src={heartIcon} alt="" />
              </Link>

              <Link
                to="/basket-page"
                className="p-relative"
                state={{ fromHeader: true, isMobile: isMobile }}
              >
                <span className="basket-product-count">
                  {GetCountFromLocalstorage()}
                </span>
                <svg
                  fill="#FF0000"
                  className="header-main-icon"
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="456.000000pt"
                  height="443.000000pt"
                  viewBox="0 0 456.000000 443.000000"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.000000,443.000000) scale(0.100000,-0.100000)"
                    fill="#fff"
                    stroke="none"
                  >
                    <path
                      d="M175 4415 c-5 -2 -22 -6 -37 -9 -63 -14 -128 -103 -128 -176 0 -70
                    54 -145 125 -176 11 -4 130 -10 264 -13 l245 -6 22 -75 c12 -41 129 -433 259
                    -870 130 -437 279 -940 332 -1117 l96 -322 -30 -68 c-56 -124 -68 -171 -68
                    -278 0 -94 2 -105 33 -167 52 -106 142 -170 289 -204 95 -22 219 -21 503 4
                    704 62 1456 105 1800 101 184 -2 212 3 252 47 24 28 37 88 28 129 -9 42 -32
                    70 -75 93 -87 47 -952 13 -2030 -79 -268 -23 -367 -25 -428 -8 -52 13 -87 45
                    -87 76 0 31 20 112 30 118 4 2 326 43 716 90 844 102 1066 129 1279 155 88 11
                    239 29 335 40 195 23 228 31 268 65 44 37 58 82 106 335 25 129 93 483 152
                    785 123 636 130 677 120 728 -7 38 -52 98 -90 120 -16 9 -407 13 -1681 17
                    l-1660 5 -82 273 c-48 161 -92 289 -106 311 -49 73 -61 76 -422 78 -176 1
                    -324 0 -330 -2z m2003 -1342 l-3 -308 -382 -3 -382 -2 -20 67 c-114 381 -161
                    539 -161 546 0 4 214 7 475 7 l475 0 -2 -307z m962 -3 l0 -310 -395 0 -395 0
                    0 310 0 310 395 0 395 0 0 -310z m1000 303 c0 -5 -26 -143 -58 -308 l-58 -300
                    -357 -3 -357 -2 0 310 0 310 415 0 c228 0 415 -3 415 -7z m-1965 -1148 l0
                    -359 -225 -28 c-124 -15 -232 -27 -241 -28 -12 0 -41 87 -127 374 -62 206
                    -112 382 -112 390 0 15 36 16 353 14 l352 -3 0 -360z m965 60 c0 -237 -3 -305
                    -12 -305 -7 0 -178 -20 -380 -45 -203 -25 -375 -45 -383 -45 -13 0 -15 45 -15
                    350 l0 350 395 0 395 0 0 -305z m850 303 c-1 -11 -100 -511 -102 -513 -7 -6
                    -569 -71 -573 -66 -3 2 -5 134 -5 293 l0 288 340 0 c187 0 340 -1 340 -2z"
                    />
                    <path
                      d="M1464 750 c-106 -21 -215 -108 -262 -208 -24 -51 -27 -69 -27 -162 1
                    -126 18 -173 95 -254 70 -74 144 -108 246 -114 145 -8 258 47 336 164 48 71
                    62 120 61 217 0 69 -5 87 -37 152 -78 158 -240 239 -412 205z"
                    />
                    <path
                      d="M3630 749 c-213 -42 -347 -269 -281 -477 55 -171 198 -269 380 -260
                    138 7 252 81 314 207 30 61 32 73 32 166 -1 90 -3 106 -29 157 -52 103 -146
                    179 -255 204 -63 15 -96 16 -161 3z"
                    />
                  </g>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        {!isMobile ? (
          <nav className="nav-nav">
            <ul className="header-nav">
              {mainLinksHeader.map((link, index) => {
                const stateToPass = {
                  fromHeaderMain: index === 0,
                  fromHeaderCatalog: index === 1,
                  isReviewsAboutProduct: index === 3,
                  isReviewsFromHeader: index === 3,
                  fromHeader: true,
                };

                return index === 6 ? null : (
                  <li key={`desktop_${link.id}`}>
                    <Link
                      className="nav-link"
                      to={{ pathname: link.path }}
                      state={stateToPass}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : (
          <ul
            className={`nav-mobile ${
              isMobile && (isHomePage || isCatalogPage) ? "nav-main-mobile" : ""
            } ${isdropdownFilter ? "nav-mobile-translate" : ""}`}
          >
            {mainLinksHeader.map((link, index) => {
              if (
                !isdropdownFilter
                  ? [1, 2, 4, 6].includes(index)
                  : [2, 4, 6].includes(index)
              ) {
                const isActive = location.pathname === link.path;
                return (
                  <li className="nam-mobile-item" key={`mobile_${link.id}`}>
                    <Link
                      className={`nav-mobile_link ${
                        isActive ? "navbar-active-link" : ""
                      }`}
                      to={link.path}
                      state={{
                        clickFromHeaderNavbar: true,
                        isMobile: isMobile,
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        )}
      </header>
    </>
  );
}

export default Header;
