import { useState, useEffect, useLayoutEffect, useRef  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";

export const useScrollingToTop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTabletSize = useMediaQuery({ maxWidth: 1200 });


    const [shouldAttemptScroll, setShouldAttemptScroll] = useState(false);
    const timeoutRef = useRef(null);
    const [retryCount, setRetryCount] = useState(0);
  
    useEffect(() => {
      const {    
        fromHeader,
        clickFromHeaderNavbar,
        fromHeaderCatalog,
        fromHeaderMain,
        fromFooterCatalog,
        fromSubheaderLink,
        scrollAfterSearchInput,
        isReviewsAboutProduct,
        fromSubheader,
        fromFooter
      } = location.state || {};

      const needsScrollAction = clickFromHeaderNavbar || fromHeaderCatalog || fromFooterCatalog ||  fromSubheader || fromSubheaderLink || scrollAfterSearchInput || isReviewsAboutProduct || fromFooter;
      
      // if (fromHeaderMain) {
      //   setShouldAttemptScroll(true);
      //   setRetryCount(0);
      //   console.log('asd');
      // }
      
      if (location.pathname !== '/' && location.pathname  !== '') {
        if (needsScrollAction) {
          setShouldAttemptScroll(true);
          setRetryCount(0); 
        }
        else {
          setShouldAttemptScroll(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setRetryCount(0);
        }
  
      return () => {
        setShouldAttemptScroll(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setRetryCount(0);
      };
    }
  
    }, [location.state, location.pathname]); 
  

    useLayoutEffect(() => {
      if (!shouldAttemptScroll) { return }
  
      const {
        fromHeaderMain,
        fromHeaderLogo,
        fromHeader,
        clickFromHeaderNavbar,
        fromHeaderCatalog,
        fromFooterCatalog,
        fromSubheaderLink,
        scrollAfterSearchInput,
        isReviewsAboutProduct,
        fromSubheader,
        headerHeight,
        fromFooter,
        isMobile,
      } = location.state || {};
  
      let scrollToPosition = 0;
      const headerOffset = 110;
  
      const getAbsoluteTop = (element) => {
        if (!element) return 0;
        return element.getBoundingClientRect().top + window.scrollY;
      };
  
      const offsetHeightCatalogPage = document.querySelector('.catalog-page');
      const reviewsSection = document.querySelector('.reviews');
  
      let targetElementFound = false;
      
      if (fromHeaderCatalog || fromFooterCatalog) {
        scrollToPosition = 240;
        targetElementFound = true; 
      }
      else if (fromSubheader) {
        if (offsetHeightCatalogPage) {
          scrollToPosition = getAbsoluteTop(offsetHeightCatalogPage) - (headerHeight || 0);
          targetElementFound = true;
        }
      }
      else if (fromSubheaderLink || scrollAfterSearchInput) {
        if (offsetHeightCatalogPage) {
          if (fromSubheaderLink) {
            scrollToPosition = getAbsoluteTop(offsetHeightCatalogPage) - (headerHeight - 20 || headerOffset - 20);
          }
          else if (scrollAfterSearchInput) {
            if (isTabletSize) {
              scrollToPosition = getAbsoluteTop(offsetHeightCatalogPage) - (headerHeight - 20 || headerOffset + 125);
            }
            else {
              scrollToPosition = getAbsoluteTop(offsetHeightCatalogPage) - (headerHeight - 20 || headerOffset + 65);
            }
          }
          targetElementFound = true;
        }
      }
      else if (isReviewsAboutProduct) {
        if (reviewsSection) {
          scrollToPosition = getAbsoluteTop(reviewsSection) - headerOffset;
          targetElementFound = true;
        }
      }

      if (isMobile) {
        if (fromHeaderCatalog || fromFooterCatalog) {
          scrollToPosition = 0;
          targetElementFound = true;
        }
    

      //   if (fromHeaderMain) {
      //     console.log('asd');
          
      //     scrollToPosition = 0;
      //     targetElementFound = true;
      //   }
      // }
      // else if (fromHeader || fromHeaderMain  || clickFromHeaderNavbar || fromFooter) {
      //   scrollToPosition = 0;
      //   targetElementFound = true; 
      }  
 
      if (targetElementFound) {
        window.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        });

        setShouldAttemptScroll(false); 
        setRetryCount(0); 
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else if (retryCount < 10) { 
        timeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 50); 
      } else {
        setShouldAttemptScroll(false); 
        setRetryCount(0);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
      }
  
    }, [shouldAttemptScroll, retryCount, location.state, location.pathname, navigate]);
};

export const GetCountFromLocalstorage = () => {
  // written by backend
  let getTotalQuantityr = parseInt(window.localStorage.getItem("addToCart"));

  if (
    typeof getTotalQuantityr == "undefined" ||
    getTotalQuantityr != getTotalQuantityr 
  )
    getTotalQuantityr = 0;
  const [getTotalQuantity, setGetTotalQuantity] = useState(getTotalQuantityr);
  window.addEventListener("storage", function (e) {
    setGetTotalQuantity(parseInt(window.localStorage.getItem("addToCart")));
  });
  return getTotalQuantityr
}

export const GetWishListQuantity = () => {
  let currentTotalQuantity = parseInt(window.localStorage.getItem("wishlistCount"))
  if (!currentTotalQuantity) currentTotalQuantity = 0;

  const [totalQuantity, setTotalQuantity] = useState(currentTotalQuantity);

  window.addEventListener("storage", (e) => {
    setTotalQuantity(parseInt(window.localStorage.getItem("wishlistCount")));
  });

  return currentTotalQuantity
}

export const calcHandler = ({
  action,
  currentQuantity,
  currentPrice,
  basePrice,
  setQuantity,
  setProductPrice,
  setItems,
  index,
  updateTotalPrice,
  items
}) => {
  let newQuantity = Number(document.querySelector(".quantity").textContent);
  let newPrice = currentPrice;

  if (action === "addit") {
    newQuantity += 1;
    newPrice = basePrice * newQuantity;

  } else if (action === "subtract" && currentQuantity > 1) {
    newQuantity -= 1;
    newPrice = basePrice * newQuantity;
  }
  else {
    newPrice = basePrice * newQuantity;
  }

  if (setQuantity && setProductPrice) {
    setQuantity(newQuantity);
    setProductPrice(newPrice);
  }

  if (setItems && index !== undefined) {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity, totalPrice: newPrice } : item
    );

    setItems(updatedItems);

    if (updateTotalPrice) {
      updateTotalPrice(updatedItems);
    }
  }

  return { newQuantity, newPrice };
};

export const handleAddToBasket = async ({
  id,
  e,
  type = "addtocart",
  quantity = 1,
  onSuccess,
  onError,
}) => {
  if (e && e.preventDefault) e.preventDefault();

  try {
    const response = await fetch("/api/cart.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: +id,
        action: type,
        count: quantity,
      }),
    });
    const data = await response.json();

    if (data.status === "Ok") {
      let basketCount = parseInt(window.localStorage.getItem("addToCart"));
      if (typeof basketCount === "undefined" || isNaN(basketCount)) basketCount = 0;
      window.localStorage.setItem(
        "addToCart",
        (basketCount + quantity).toString()
      );
      window.dispatchEvent(new Event("storage"));
    if (onSuccess) onSuccess(data);
    } else {
      if (onError) onError(data);
    }
    return data;
  } catch (error) {
    if (onError) onError(error);
  }
};

export const useDisableZoomOnInputFocus = () => {
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    const originalContent = meta?.getAttribute('content');
    let activeInputsCount = 0;

    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }

    const disableZoom = () => {
      meta.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      );
    };

    const enableZoom = () => {
      if (originalContent) {
        meta.setAttribute('content', originalContent);
      } else {
        meta.remove();
      }
    };

    const isFormElement = (el) => {
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      return ['input', 'textarea', 'select'].includes(tag);
    };

    const handleFocusIn = (e) => {
      if (isFormElement(e.target)) {
        activeInputsCount++;
        if (activeInputsCount === 1) {
          disableZoom();
        }
      }
    };

    const handleFocusOut = (e) => {
      if (isFormElement(e.target)) {
        setTimeout(() => {
          if (!document.activeElement || !isFormElement(document.activeElement)) {
            activeInputsCount = 0;
            enableZoom();
          }
        }, 50);
      }
    };

    document.addEventListener('focusin', handleFocusIn, true);
    document.addEventListener('focusout', handleFocusOut, true);

    return () => {
      document.removeEventListener('focusin', handleFocusIn, true);
      document.removeEventListener('focusout', handleFocusOut, true);
      enableZoom();
    };
  }, []);
}