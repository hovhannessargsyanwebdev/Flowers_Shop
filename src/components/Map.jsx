import { useLocation } from "react-router-dom";
import '../styles/Map.css'

function Map() {
  const location = useLocation();
  
  return (
    location.pathname === '/contacts' ? (
    <div className='map-wrapp container-size'>
      <iframe src="<?php echo $map; ?>" width="100%" height="400" style={{ border: "0" }} title="Map Display"></iframe>
    </div>
  ) : null
  )
}
export default Map



