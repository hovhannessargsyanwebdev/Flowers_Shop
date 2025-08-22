import { useMediaQuery } from "react-responsive";
import ProductDetails from './ProductDetails'

export const ProductDetailsModal = ({
    headerHeight, getBackProductId, idSlug, isInProductDetailsModal,
  catalogData, setCatalogData, firstGroup, secondGroup, thirdGroup,
  setFirstGroup, setSecondGroup, setThirdGroup, secondGroupReserv,
  thirdGroupReserv, catalogDataReserv
}) => {  
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  return (
    // <div className='product-details-modal' style={{paddingTop: `${headerHeight + 20}px`}}>
    <div className='product-details-modal'>
      <style>
        {`.main-page, .catalog-page, .sub-header, .sub-header-mobile { display: none; }`}
        {isInProductDetailsModal && `
          .header-dropdown-btn-mobile {
            transform: translate(0px, -65px) !important; 
          }
        `}
        {`.product-page {margin-top: 50px !important}`}

        {!isMobile && `
          .subheader-links-to-catalog { display: none; }
        `}
      </style>
        < ProductDetails
          getBackProductId={getBackProductId}
          idSlug={idSlug}
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
    </div>
  )
}