import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import DropdownPrice from "../components/action/DropdownPrice";
import Form from "react-bootstrap/Form";
import DropdownCheckboxes from "./action/DropdownCheckboxes";
import DropdownLastCheckboxes from "./action/DropdownLastCheckboxes";
import SubheaderLinksToCatalog from "./SubheaderLinksToCatalog";
import Modal from "react-bootstrap/Modal";

import "../styles/Subheader.css";

function Subheader({
  dropdownData,
  filter,
  urlSearchParams,
  isDropdownPriceOpen,
  setIsDropdownPriceOpen,
  rangeValues,
  setRangeValues,
  isDropdownCheckboxesOpen,
  setIsDropdownCheckboxesOpen,
  isDropdownLastCheckboxesOpen,
  setIsDropdownLastCheckboxesOpen,
  setIsRenderMain,
  isRenderMain,
  catalogDataReserv,
  seCountClickForBug
}) {
  const [isDropdownOpenMobile, setIsDropdownOpenMobile] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const dropdownPriceRef = useRef(null);
  const dropdownCheckboxesRef = useRef(null);
  const dropdownLastCheckboxesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownPriceOpen &&
        dropdownPriceRef.current &&
        !dropdownPriceRef.current.contains(event.target)
      ) {
        setIsDropdownPriceOpen(false);
      }
      if (
        isDropdownCheckboxesOpen &&
        dropdownCheckboxesRef.current &&
        !dropdownCheckboxesRef.current.contains(event.target)
      ) {
        setIsDropdownCheckboxesOpen(false);
      }
      if (
        isDropdownLastCheckboxesOpen &&
        dropdownLastCheckboxesRef.current &&
        !dropdownLastCheckboxesRef.current.contains(event.target)
      ) {
        setIsDropdownLastCheckboxesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isDropdownPriceOpen,
    isDropdownCheckboxesOpen,
    isDropdownLastCheckboxesOpen,
    setIsDropdownPriceOpen,
    setIsDropdownCheckboxesOpen,
    setIsDropdownLastCheckboxesOpen,
    
  ]);

  if (
    !dropdownData ||
    dropdownData.length === 0 ||
    dropdownData.status === "No"
  ) {
    return null;
  }

const noSubmit = (e) => e.preventDefault();

  return (
    <div className="subheader-wrapp">      
      {!isMobile ? (
        <>
          <div className="sub-header">
            {dropdownData.banners &&
              dropdownData.banners.map((item, index) => (
                <div key={index} className="sub-header-item">
                  <Link
                    to={{ pathname: item.link }}
                    state={{ fromHeader: true }}
                  >
                    <img className="subheader-img" src={item.img} alt="" />
                  </Link>
                </div>
              ))}
          </div>

          <Form
            className="sub-header"
            method="GET"
            action={
              "//" +
              window.location.host.toString() +
              window.location.pathname.toString()
            }
            name="filter"
          >
            {dropdownData.filterProperties &&
              dropdownData.filterProperties[0] && (
                <div className="sub-header-item" ref={dropdownPriceRef}>
                  <DropdownPrice
                    rangMinMax={dropdownData.filterProperties[0]}
                    filter={filter}
                    urlSearchParams={urlSearchParams}
                    noSubmit={noSubmit}
                    isDropdownOpen={isDropdownPriceOpen}
                    setIsDropdownOpen={setIsDropdownPriceOpen}
                    rangeValues={rangeValues}
                    setRangeValues={setRangeValues}
                    setIsRenderMain={setIsRenderMain}
                    isRenderMain={isRenderMain}
                    catalogDataReserv={catalogDataReserv}
                    seCountClickForBug={seCountClickForBug}
                  />
                </div>
              )}

            {dropdownData.filterProperties &&
              dropdownData.filterProperties[1] && (
                <div className="sub-header-item" ref={dropdownCheckboxesRef}>
                  <DropdownCheckboxes
                    checkBoxData={dropdownData.filterProperties[1]}
                    filter={filter}
                    urlSearchParams={urlSearchParams}
                    noSubmit={noSubmit}
                    isDropdownOpen={isDropdownCheckboxesOpen}
                    setIsDropdownOpen={setIsDropdownCheckboxesOpen}
                    setIsRenderMain={setIsRenderMain}
                    isRenderMain={isRenderMain}
                    catalogDataReserv={catalogDataReserv}
                    seCountClickForBug={seCountClickForBug}
                  />
                </div>
              )}

            {dropdownData.filterProperties &&
              dropdownData.filterProperties[2] && (
                <div
                  className="sub-header-item"
                  ref={dropdownLastCheckboxesRef}
                >
                  <DropdownLastCheckboxes
                    checkBoxData={dropdownData.filterProperties[2]}
                    filter={filter}
                    urlSearchParams={urlSearchParams}
                    noSubmit={noSubmit}
                    isDropdownOpen={isDropdownLastCheckboxesOpen}
                    setIsDropdownOpen={setIsDropdownLastCheckboxesOpen}
                    setIsRenderMain={setIsRenderMain}
                    isRenderMain={isRenderMain}
                    catalogDataReserv={catalogDataReserv}
                    seCountClickForBug={seCountClickForBug}
                  />
                </div>
              )}
          </Form>

          <SubheaderLinksToCatalog
            dropdownData={dropdownData}
            setIsRenderMain={setIsRenderMain}
            isRenderMain={isRenderMain}
          />
        </>
      ) : (
        <>
          <button
            className="header-dropdown-btn-mobile"
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpenMobile(!isDropdownOpenMobile);
            }}
          >
            Каталог цветов и подарков
            <span className="vertical-line">|</span>
            {!isDropdownOpenMobile ? (
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

          {isDropdownOpenMobile && (
            <Modal
              show={isDropdownOpenMobile}
              onHide={() => setIsDropdownOpenMobile(false)}
              centered
              fullscreen
            >
              <Modal.Header closeButton>
                <Modal.Title>Каталог</Modal.Title>
              </Modal.Header>
              <Modal.Body className="sub-header-mobile-content">
                <Form
                  className="sub-header-mobile-dropdown"
                  method="GET"
                  action={
                    "//" +
                    window.location.host.toString() +
                    window.location.pathname.toString()
                  }
                  name="filter"
                >
                  {dropdownData.filterProperties &&
                    dropdownData.filterProperties[0] && (
                      <div className="sub-header-mobile-dropdown-item">
                        <DropdownPrice
                          rangMinMax={dropdownData.filterProperties[0]}
                          filter={filter}
                          urlSearchParams={urlSearchParams}
                          noSubmit={noSubmit}
                          isDropdownOpen={isDropdownPriceOpen}
                          setIsDropdownOpen={setIsDropdownPriceOpen}
                          rangeValues={rangeValues}
                          setRangeValues={setRangeValues}
                          seCountClickForBug={seCountClickForBug}
                          catalogDataReserv={catalogDataReserv}
                        />
                      </div>
                    )}

                  {dropdownData.filterProperties &&
                    dropdownData.filterProperties[1] && (
                      <div className="sub-header-mobile-dropdown-item">
                        <DropdownCheckboxes
                          checkBoxData={dropdownData.filterProperties[1]}
                          filter={filter}
                          urlSearchParams={urlSearchParams}
                          noSubmit={noSubmit}
                          isDropdownOpen={isDropdownCheckboxesOpen}
                          setIsDropdownOpen={setIsDropdownCheckboxesOpen}
                          seCountClickForBug={seCountClickForBug}
                          catalogDataReserv={catalogDataReserv}
                        />
                      </div>
                    )}

                  {dropdownData.filterProperties &&
                    dropdownData.filterProperties[2] && (
                      <div className="sub-header-mobile-dropdown-item">
                        <DropdownLastCheckboxes
                          checkBoxData={dropdownData.filterProperties[2]}
                          filter={filter}
                          urlSearchParams={urlSearchParams}
                          noSubmit={noSubmit}
                          isDropdownOpen={isDropdownLastCheckboxesOpen}
                          setIsDropdownOpen={setIsDropdownLastCheckboxesOpen}
                          seCountClickForBug={seCountClickForBug}
                          catalogDataReserv={catalogDataReserv}
                        />
                      </div>
                    )}
                </Form>
                <SubheaderLinksToCatalog
                  dropdownData={dropdownData}
                  closeModal={() => setIsDropdownOpenMobile(false)}
                />
              </Modal.Body>
            </Modal>
          )}

          <div className="sub-header-mobile">
            {dropdownData.banners &&
              dropdownData.banners.map(
                (item, index) =>
                  index < 2 && (
                    <div key={index} className="sub-header-item">
                      <Link
                        to={{ pathname: item.link }}
                        state={{ fromHeader: true }}
                      >
                        <img className="subheader-img" src={item.img} alt="" />
                      </Link>
                    </div>
                  )
              )}
          </div>
        </>
      )}
    </div>
  );
}

export default Subheader;