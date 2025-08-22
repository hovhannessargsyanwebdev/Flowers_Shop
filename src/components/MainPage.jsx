import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import HomePage from "./HomePage";
import { Catalog } from "./Catalog";
import Subheader from "./SubHeader";
import { useScrollingToTop } from "../action";

const MainPage = ({
  isRerenderForLike,
  backProductId,
  catalogData,
  setCatalogData,
  firstGroup,
  secondGroup,
  thirdGroup,
  secondGroupReserv,
  thirdGroupReserv,
  catalogDataReserv,
  setFirstGroup,
  setSecondGroup,
  setThirdGroup,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [rangeValues, setRangeValues] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [isHomePage, setIsHomePage] = useState(true);

  const [filteredData, setFilteredData] = useState({});
  const [dropdownData, setDropdownData] = useState([]);

  const [dataMetaTitle, setDataMetaTitle] = useState("");
  const [dataMetaDescription, setDataMetaDescription] = useState("");
  const [dataMetaKeyword, setDataMetaKeyword] = useState("");

  const [isMoreProduct, setIsMoreProduct] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [isError, setIsError] = useState(null);
  const navigate = useNavigate();
  const [isRenderMain, setIsRenderMain] = useState(false);
  const { cat } = useParams();
  const location = useLocation();

  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentCardUrl, setCurrentCardUrl] = useState("");
  const [countClickForBug, seCountClickForBug] = useState(0);
  const [locationPathname, setLocationPathname] = useState(location.pathname);
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(location.search)
  );
  const urlSearchParams = useRef(searchParams);

  let countClickSecondGroup = useRef(1);
  let countClickThirdGroup = useRef(1);
  let countClickCatalog = useRef(1);

  const [subheaderHeight, setSubheaderHeight] = useState(0);
  const backgroundLocation = location.state?.backgroundLocation;

  // useScrollingToTop();

  const hash = location.hash;

  const hashWithoutPound = hash.substring(1);

  const handleSubheaderHeightChange = (height) => setSubheaderHeight(height);

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const fetchData = async (type, count) => {
    try {
      const readyShowResponse = await axios.post(
        "/api/homepage.php",
        {
          type: type,
          count: count,
          withCredentials: true,
        }
      );
      if (type === "readyshow") {
        secondGroupReserv.current = readyShowResponse.data.gotoviBuket;
        countClickSecondGroup.current = countClickSecondGroup.current + 1;
      } else if (type === "giftshow") {
        thirdGroupReserv.current = readyShowResponse.data.podarkov;
        countClickThirdGroup.current = countClickThirdGroup.current + 1;
      }
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };

  const fetchCatalogData = async (count) => {
    if (countClickForBug !== count) seCountClickForBug(count);
    else {
      return;
    }
    try {
      const searchString = location.search || "?";
      const pathCondition =
        location.pathname === "/catalog" || location.pathname === "/catalog/";

      await axios
        .get(
          `/api/catalog.php${searchString}${
            searchString === "?" ? "" : "&"
          }${
            pathCondition
              ? ""
              : location.pathname !== "" && location.pathname !== "/"
              ? `url=${location.pathname}&`
              : ""
          }count=${count}`
        )
        .then((readyProducts) => {
          if (
            Array.isArray(readyProducts.data.products) &&
            readyProducts.data.products.length > 0
          ) {
            catalogDataReserv.current = readyProducts.data.products;
            countClickCatalog.current = count + 1;

            // setIsMoreProduct(readyProducts.data.products.length > 0);
          } else {
          }
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        });
    } catch (error) {
      console.error("An unexpected error occurred", error);
    }
  };

  const getNewCards = async (data, type, add = 1) => {
    if (type === "readyshow") {
      if (add === 1) setSecondGroup([...data, ...secondGroupReserv.current]);
      fetchData(type, countClickSecondGroup.current);
    } else {
      if (add === 1) setThirdGroup([...data, ...thirdGroupReserv.current]);
      fetchData(type, countClickThirdGroup.current);
    }
  };

  const getSearchParams = () => {
    let params = new URLSearchParams(location.search);
    let searchParams = {};
    params.forEach((value, key) => {
      if (searchParams[key]) {
        searchParams[key].push(value);
      } else {
        searchParams[key] = [value];
      }
    });
    urlSearchParams.current = searchParams;
  };

  const filter = (e, firstRequest = 0) => {
    e.preventDefault();
    let formdata = new FormData(document.querySelector('[name="filter"]'));
    let formdataString = new URLSearchParams(formdata).toString();
    const regex = /%5B(\d*)%5D/g;
    formdataString = formdataString.replace(regex, "[$1]");

    let url =
      "/api/catalog.php?" +
      (location.pathname === "/catalog" ||
      location.pathname === "/catalog/" ||
      location.pathname === "/"
        ? ""
        : "url=" + location.pathname + "&") +
      formdataString;

    if (location.pathname === "" || location.pathname === "/") {
      navigate(`/catalog/?` + formdataString);
    } else {
      navigate(`?` + formdataString);
    }

    return axios
      .get(url)
      .then((resolve) => {
        if (
          Array.isArray(resolve.data.products) &&
          resolve.data.products.length > 0
        ) {
          setCatalogData(resolve.data.products);
          // setIsRenderMain(!isRenderMain);
          if (firstRequest === 1) {
            fetchCatalogData(1);
          }
          return resolve.data.products;
        } else {
          return [];
        }
      })
      .catch((error) => {
        return [];
      });
  };

  const getSearchParamsOnLoad = (params) => {
    const searchParamsObject = {};
    params.forEach((value, key) => {
      if (searchParamsObject[key]) {
        searchParamsObject[key].push(value);
      } else {
        searchParamsObject[key] = [value];
      }
    });
    urlSearchParams.current = searchParamsObject;
  };

  useLayoutEffect(() => {
    const images = document.querySelectorAll("img");
    const totalImages = images.length;

    if (totalImages === 0) {
      return;
    }

    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount += 1;
      if (loadedCount === totalImages) {
        setScrollPosition(1);
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
        img.addEventListener("error", handleImageLoad);
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
  }, [catalogData]);

  useEffect(() => {
    if (backProductId) {
      let currentCardId = `#${backProductId}`;

      if (document.querySelector(currentCardId)) {
        let position =
          window.scrollY +
          document.querySelector(currentCardId).getBoundingClientRect().top -
          document.querySelector("header").offsetHeight;

        window.scrollTo({
          top: position,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  }, [scrollPosition, location.state?.backgroundLocation]);

  useEffect(() => {
    let urlArray = [];
    const url = sessionStorage.getItem("currentUrl");
    if (url) {
      const urlParts = url.split("/").filter(Boolean);
      urlArray = urlParts.map((part) => part + "/");
    }

    let cardsLength = document.querySelectorAll(".catalog-page div.card");
    if (cardsLength.length === 0)
      cardsLength = document.querySelectorAll(".main-page div.card");

    if (
      !backgroundLocation &&
      (cardsLength.length < 1 ||
        urlArray.length !== 3 ||
        urlArray[0] !== "catalog/")
    ) {
      setIsRenderMain(!isRenderMain);
    }
  }, [cat, navigate, isHomePage, location.pathname, location.search]);

  useEffect(() => {
    let splitParams = location.pathname.split("/");
    if (splitParams.length < 4) {
      setSearchParams(new URLSearchParams(location.search));
      getSearchParamsOnLoad(new URLSearchParams(location.search));

      if (location.pathname === "" || location.pathname === "/") {
        axios
          .get("/api/homepage.php?type=main")
          .then((response) => {
            const parsedData = response.data;
            setFirstGroup(parsedData.buketDnya);
            setSecondGroup(parsedData.gotoviBuket);
            setThirdGroup(parsedData.podarkov);

            setDataMetaTitle(parsedData.meta_title);
            setDataMetaDescription(parsedData.meta_description);
            setDataMetaKeyword(parsedData.meta_keyword);
          })
          .catch((error) => {
            console.log(error);
          });

        getNewCards(secondGroup, "readyshow", 0);
        getNewCards(thirdGroup, "giftshow", 0);

        axios
          .get("/api/catalog.php?type=main")
          .then((response) => {
            setFilteredData(response.data.products);
            setCatalogData(response.data.products);
            setDropdownData(response.data);

            if (typeof response.data.filterProperties !== "undefined")
              setRangeValues([
                Number(response.data.filterProperties[0].minPrice) / 100,
                Number(response.data.filterProperties[0].maxPrice) / 100,
              ]);
          })
          .catch((error) => console.log(error));

        setIsHomePage(true);
        setLoading(true);
      } else {
        let urlPathName =
          (location.search !== "" ? location.search + "&" : "?") +
          ("url=" + location.pathname + "&") +
          "type=main";

        if (
          location.pathname === "/catalog" ||
          location.pathname === "/catalog/"
        ) {
          urlPathName =
            (location.search === "" ? "?" : location.search + "&") +
            "type=main";
        }

        axios
          .get("/api/catalog.php" + urlPathName)
          .then((resolve) => {
            if (resolve) {
              setCatalogData(resolve.data.products);
              setFilteredData(resolve.data);
              setDropdownData(resolve.data);

              setDataMetaTitle(resolve.data.meta_title);
              setDataMetaDescription(resolve.data.meta_description);
              setDataMetaKeyword(resolve.data.meta_keyword);

              if (typeof resolve.data.filterProperties[0] !== "undefined")
                setRangeValues([
                  typeof urlSearchParams.current.min_price !== "undefined"
                    ? Number(urlSearchParams.current.min_price[0])
                    : Number(resolve.data.filterProperties[0].minPrice) / 100,
                  typeof urlSearchParams.current.max_price !== "undefined"
                    ? Number(urlSearchParams.current.max_price[0])
                    : Number(resolve.data.filterProperties[0].maxPrice) / 100,
                ]);
            }
            setIsHomePage(false);
            setLoading(true);

            fetchCatalogData(1);
          })
          .catch((error) => setIsError(false));
      }
    }
  }, [isRenderMain]);

  const getCardPositionForScroll = (e) => {
    const element = e.target.closest(".card");

    if (element) {
      const rect = element.getBoundingClientRect();
      setScrollPosition(window.scrollY + rect.top);
      setCurrentCardUrl(element.querySelector("a")?.getAttribute("href"));
    }
    navigate(currentCardUrl, {
      state: { scrollPosition, clickFromMainPageCard: true },
    });
  };

  if (!loading) {
    return (
      <div className="container-size">
        <div className="loading-animation">
          <div className="spinner"></div>
          <div
            style={{
              marginTop: "50px",
              padding: "20px",
              textAlign: "center",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Subheader
        isDropdownPriceOpen={activeDropdown === "price"}
        setIsDropdownPriceOpen={() => handleDropdownToggle("price")}
        isDropdownCheckboxesOpen={activeDropdown === "checkboxes"}
        setIsDropdownCheckboxesOpen={() => handleDropdownToggle("checkboxes")}
        isDropdownLastCheckboxesOpen={activeDropdown === "lastCheckboxes"}
        setIsDropdownLastCheckboxesOpen={() =>
          handleDropdownToggle("lastCheckboxes")
        }
        rangeValues={rangeValues}
        setRangeValues={setRangeValues}
        dropdownData={dropdownData}
        filteredData={filteredData}
        filter={filter}
        urlSearchParams={urlSearchParams}
        setIsRenderMain={setIsRenderMain}
        isRenderMain={isRenderMain}
        catalogDataReserv={catalogDataReserv}
        seCountClickForBug={seCountClickForBug}
      />

      {isHomePage ? (
        <HomePage
          dataMetaTitle={dataMetaTitle}
          dataMetaDescription={dataMetaDescription}
          dataMetaKeyword={dataMetaKeyword}
          isRerenderForLike={isRerenderForLike}
          backProductId={backProductId}
          rangeValues={rangeValues}
          setRangeValues={setRangeValues}
          firstGroup={firstGroup}
          secondGroup={secondGroup}
          thirdGroup={thirdGroup}
          dropdownData={dropdownData}
          // filteredData={filteredData}
          // filter={filter}
          urlSearchParams={urlSearchParams}
          isLoad={isLoad}
          setIsLoad={setIsLoad}
          getNewCards={getNewCards}
          secondGroupReserv={secondGroupReserv}
          thirdGroupReserv={thirdGroupReserv}
          getCardPositionForScroll={getCardPositionForScroll}
          clickFromMainPageCard={true}
          scrollPosition={scrollPosition}
        />
      ) : (
        <Catalog
          dataMetaTitle={dataMetaTitle}
          dataMetaDescription={dataMetaDescription}
          dataMetaKeyword={dataMetaKeyword}
          isRerenderForLike={isRerenderForLike}
          idSlug="cutProduct"
          backProductId={backProductId}
          rangeValues={rangeValues}
          setRangeValues={setRangeValues}
          isDropdownCheckboxesOpen={activeDropdown === "checkboxes"}
          setIsDropdownCheckboxesOpen={() => handleDropdownToggle("checkboxes")}
          catalogData={catalogData}
          setCatalogData={setCatalogData}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          countClickCatalog={countClickCatalog}
          fetchCatalogData={fetchCatalogData}
          catalogDataReserv={catalogDataReserv}
          filter={filter}
          urlSearchParams={urlSearchParams}
          isLoad={isLoad}
          isMoreProduct={isMoreProduct}
          setIsLoad={setIsLoad}
          isError={isError}
          setIsError={setIsError}
          locationPathname={locationPathname}
          clickFromMainPageCard={true}
        />
      )}
    </div>
  );
};

export default MainPage;
