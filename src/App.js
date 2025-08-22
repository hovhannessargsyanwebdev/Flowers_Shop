import React, { useEffect, useState, useRef } from 'react'; 
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './components/MainPage';
import Layout from '../src/components/Layout';
import ProductDetails from './components/ProductDetails';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import Header from '../src/components/Header';
import Reviews from './components/Reviews';
import WishListPage from './components/wish-list/WishListPage';
import BasketPage from './components/basket/BasketPage';
import Map from '../src/components/Map';
import Footer from '../src/components/Footer';
import DefaultComponent from './components/DefaultComponent';
import { useScrollingToTop } from './action';

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [backProductId, setBackProductId] = useState(null)
  const [catalogData, setCatalogData] = useState([]);
  const [firstGroup, setFirstGroup] = useState([]);
  const [secondGroup, setSecondGroup] = useState([]);
  const [thirdGroup, setThirdGroup] = useState([]);
  let secondGroupReserv = useRef([]);
  let thirdGroupReserv = useRef([]);
  let catalogDataReserv = useRef([]);
  const location = useLocation();
  const state = location.state;
  const idSlug = location.state?.idSlug;
  const backgroundLocation = location.state?.backgroundLocation;
  const appHistory = useRef([]);
  const [isRerenderForLike, setIsRerenderForLike] = useState(0)

  const headerProps = {onHeaderHeightChange: (height) => setHeaderHeight(height)};

  const getBackProductId = (props) => setBackProductId(props)

  useScrollingToTop()

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        const height = header.offsetHeight;
        setHeaderHeight(height);        
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    const handleHeaderHeightChange = (height) => setHeaderHeight(height);
  })

  useEffect(() => {
    const current = location.pathname + location.search;    
    const previous = sessionStorage.getItem("currentUrl");

    if (current !== previous) {
      sessionStorage.setItem("previousUrl", previous);
      sessionStorage.setItem("currentUrl", current);
    }

    appHistory.current.push(location.pathname);
  }, [location]);

  useEffect(() => {
    setIsRerenderForLike( isRerenderForLike + 1)
  }, [backProductId, catalogData]);
  
  return (
    <>
      <Header {...headerProps} />         
      <Routes>
          <Route path="/" element={<Layout headerHeight={headerHeight} />}>
            <Route index element={
              <MainPage
                isRerenderForLike={isRerenderForLike}
                backProductId={backProductId}
                catalogData={catalogData}
                setCatalogData={setCatalogData}
                firstGroup={firstGroup}
                secondGroup={secondGroup}
                thirdGroup={thirdGroup}
                setFirstGroup={setFirstGroup}
                setSecondGroup={setSecondGroup}
                setThirdGroup={setThirdGroup}
                secondGroupReserv={secondGroupReserv}
                thirdGroupReserv={thirdGroupReserv}
                catalogDataReserv={catalogDataReserv}
               />}
              />
            <Route path="catalog" element={
              <MainPage
                isRerenderForLike={isRerenderForLike}
                backProductId={backProductId}
                catalogData={catalogData}
                setCatalogData={setCatalogData}
                firstGroup={firstGroup}
                secondGroup={secondGroup}
                thirdGroup={thirdGroup}
                setFirstGroup={setFirstGroup}
                setSecondGroup={setSecondGroup}
                setThirdGroup={setThirdGroup}
                secondGroupReserv={secondGroupReserv}
                thirdGroupReserv={thirdGroupReserv}
                catalogDataReserv={catalogDataReserv}
              />}
            />
            <Route path="catalog?:get" element={
              <MainPage
                isRerenderForLike={isRerenderForLike} 
                backProductId={backProductId}
                catalogData={catalogData}
                setCatalogData={setCatalogData}
                firstGroup={firstGroup}
                secondGroup={secondGroup}
                thirdGroup={thirdGroup}
                setFirstGroup={setFirstGroup}
                setSecondGroup={setSecondGroup}
                setThirdGroup={setThirdGroup}
                secondGroupReserv={secondGroupReserv}
                thirdGroupReserv={thirdGroupReserv}
                catalogDataReserv={catalogDataReserv}
              />}
            />
            <Route path="catalog/:cat" element={
              <MainPage
                isRerenderForLike={isRerenderForLike}
                backProductId={backProductId}
                catalogData={catalogData}
                setCatalogData={setCatalogData}
                firstGroup={firstGroup}
                secondGroup={secondGroup}
                thirdGroup={thirdGroup}
                setFirstGroup={setFirstGroup}
                setSecondGroup={setSecondGroup}
                setThirdGroup={setThirdGroup} 
                secondGroupReserv={secondGroupReserv}
                thirdGroupReserv={thirdGroupReserv}
                catalogDataReserv={catalogDataReserv}
              />}
            />
            <Route path="catalog/:cat?:get" element={
              <MainPage
                isRerenderForLike={isRerenderForLike}
                backProductId={backProductId}
                catalogData={catalogData}
                setCatalogData={setCatalogData}
                firstGroup={firstGroup}
                secondGroup={secondGroup}
                thirdGroup={thirdGroup}
                setFirstGroup={setFirstGroup}
                setSecondGroup={setSecondGroup}
                setThirdGroup={setThirdGroup}
                secondGroupReserv={secondGroupReserv}
                thirdGroupReserv={thirdGroupReserv}
              catalogDataReserv={catalogDataReserv}
              />}
            />
            {state?.backgroundLocation && (
            <Route path="catalog/:cat?:get" element={
            <MainPage
              isRerenderForLike={isRerenderForLike}
              backProductId={backProductId}
              catalogData={catalogData}
              setCatalogData={setCatalogData}
              firstGroup={firstGroup}
              secondGroup={secondGroup}
              thirdGroup={thirdGroup}
              setFirstGroup={setFirstGroup}
              setSecondGroup={setSecondGroup}
              setThirdGroup={setThirdGroup}
              secondGroupReserv={secondGroupReserv}
              thirdGroupReserv={thirdGroupReserv}
              catalogDataReserv={catalogDataReserv}
            />}
            />
            )}
            {!state?.backgroundLocation && (
            <Route  path="catalog/:cat/:product_slug" element={<ProductDetails appHistory={appHistory} getBackProductId={getBackProductId} /> }/>
            )}
        
            <Route path="catalog/:cat/:product_slug" element={
              <MainPage
                isRerenderForLike={isRerenderForLike}
                backProductId={backProductId}
                catalogData={catalogData}
                setCatalogData={setCatalogData}
                firstGroup={firstGroup}
                secondGroup={secondGroup}
                thirdGroup={thirdGroup}
                setFirstGroup={setFirstGroup}
                setSecondGroup={setSecondGroup}
                setThirdGroup={setThirdGroup}
                secondGroupReserv={secondGroupReserv}
                thirdGroupReserv={thirdGroupReserv}
                catalogDataReserv={catalogDataReserv}
              />}
            />
            <Route path="wish-list-page" element={<WishListPage />} />
            <Route path="/basket-page" element={<BasketPage />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="*" element={<DefaultComponent />} />
          </Route>
      </Routes> 
        
      {state?.backgroundLocation && (
        <Routes>
          <Route path="catalog/:cat/:product_slug"
            element={
              <ProductDetailsModal
                headerHeight={headerHeight}
                getBackProductId={getBackProductId}
                idSlug={idSlug}
                isInProductDetailsModal={true}
                catalogData={catalogData}
                setCatalogData={setCatalogData}
                firstGroup={firstGroup}
                secondGroup={secondGroup}
                thirdGroup={thirdGroup}
                setFirstGroup={setFirstGroup}
                setSecondGroup={setSecondGroup}
                setThirdGroup={setThirdGroup}
                secondGroupReserv={secondGroupReserv}
                thirdGroupReserv={thirdGroupReserv}
                catalogDataReserv={catalogDataReserv}
              />
            }
          />  
        </Routes>
      )} 
        <Map />
        <Footer />
      {/* </BrowserRouter> */} 
    </>
  );
}

export default App;
