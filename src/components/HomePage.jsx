import { FlowersOfDay } from "./FlowersOfDay";
import { FlowersOfReadyShow } from "./FlowersOfReadyShow";
import { FlowersOfGiftShow } from "./FlowersOfGiftShow";
import Reviews from "./Reviews";
import { Helmet } from "react-helmet-async";
// import { useScrollingToTop } from '../action';
// import { useLocation } from 'react-router-dom';

function HomePage({
  dataMetaTitle,
  dataMetaDescription,
  dataMetaKeyword,
  isRerenderForLike,
  firstGroup,
  secondGroup,
  thirdGroup,
  getNewCards,
  secondGroupReserv,
  thirdGroupReserv,
  clickFromMainPageCard,
  getCardPositionForScroll,
  scrollPosition,
  getBackProductId,
}) {


  return (
    <div className="main-page">
      <Helmet>
        <title>{dataMetaTitle}</title>
        <meta name="description" content={dataMetaDescription} />
        <meta name="keywords" content={dataMetaKeyword} />
      </Helmet>
    
      <FlowersOfDay
        getBackProductId={getBackProductId}
        isRerenderForLike={isRerenderForLike}
        idSlug="dayprod"
        data={firstGroup}
        clickFromMainPageCard={clickFromMainPageCard}
        getCardPositionForScroll={getCardPositionForScroll}
      />

      <FlowersOfReadyShow
        isRerenderForLike={isRerenderForLike}
        idSlug="readyprod"
        getBackProductId={getBackProductId}
        data={secondGroup}
        rezerv={secondGroupReserv.current}
        countClick={() => getNewCards(secondGroup, "readyshow")}
        getCardPositionForScroll={getCardPositionForScroll}
        clickFromMainPageCard={clickFromMainPageCard}
      />
      <FlowersOfGiftShow
        isRerenderForLike={isRerenderForLike}
        idSlug="giftprod"
        getBackProductId={getBackProductId}
        data={thirdGroup}
        rezerv={thirdGroupReserv.current}
        countClick={() => getNewCards(thirdGroup, "giftshow")}
        getCardPositionForScroll={getCardPositionForScroll}
        clickFromMainPageCard={clickFromMainPageCard}
      />
      <Reviews textTitle="О нас пишут" isReviewsAboutUs={true} />
    </div>
  );
}

export default HomePage;
