import Form from "react-bootstrap/Form";
import { mainLinksFooter } from "../data";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Contacts from "./Contacts";

import telephoneIcon from "../images/icons/telephone-fill.svg";
import { useState } from "react";
import envelope from "../images/icons/envelope.svg";
import geoAltFill from "../images/icons/geo-alt-fill.svg";
import fileEarmarkArrowDown from "../images/icons/file-earmark-arrow-down.svg";
import whatsapp from "../images/icons/whatsapp.svg";
import payment from "../images/icons/payment.svg";
import "../styles/Footer.css";

function Footer() {
  const [modalShowContacts, setModalShowContacts] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-wrapp">
        <div className="footer-links-wrapp">
          <ul className="footer-links-group">
            {mainLinksFooter.map((link, index) =>
              index < 4 ? (
                <li key={link.id}>
                  <Link
                    to={{ pathname: link.path }}
                    state={{
                      fromFooterCatalog: index === 1,
                      fromFooter: true,
                      isReviewsAboutProduct: true,                   
                    }}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ) : null
            )}
          </ul>

          <ul className="footer-links-group">
            {mainLinksFooter.map((link, index) =>
              index >= 4 ? (
                <li key={link.id}>
                  <Link
                    to={{ pathname: link.path }}
                    state={{
                      fromFooter: true,
                      isReviewsAboutProduct: true
                    }}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </div>

        <div className="footer-about-contacts">
          <div className="footer-contacts">
            <button
              style={{ backgroundColor: "transparent" }}
              onClick={() => setModalShowContacts(true)}
            >
              <img src={telephoneIcon} alt="" />
              {`<?php echo $phone;?>`}
            </button>
          </div>          

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

          <div className="footer-contacts">
            <a href="mailto:<?php echo $email; ?>">
              <img src={envelope} alt="envelope" />
              {`<?php echo $email;?>`}
            </a>
          </div>

          <div className="footer-contacts">
            <div style={{display: "inline-block"}}>
              <img src={geoAltFill} alt="geo-alt-fill" />
              {`<?php echo $adress;?>`}
            </div>
          </div>
        </div>

        <div className="footer-form-group">
          <Form.Control type="text" placeholder="подписка на рассълку" />

          <a href="/images/myw3schoolsimage.jpg" download>
            <img
              className="footer-download-icon"
              src={fileEarmarkArrowDown}
              alt=""
              width="104"
              height="142"
            />
            Пользовательское соглашение
          </a>
        </div>
      </div>

      <div className="footer-last-child-wrapp">
        <div className="footer-messengers">
        <a
          // href={`https://t.me/<?php echo $telegram; ?>?text=${encodeURIComponent('<?php echo $telegramMessage; ?>')}`}
          // href={`https://t.me/$<?php echo $telegram; ?>`}
          href={`https://t.me/<?php echo $telegram; ?>`}
          className="contacts-link"
          target="_blank"
          rel="noreferrer"
          >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#fff"
            className="bi bi-telegram"
            viewBox="0 0 16 16"
           >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
            </svg>
          </a>

          <a
             href={`https://wa.me/<?php echo $whatsapp; ?>?text=${encodeURIComponent(
              "<?php echo $whatsappMessage; ?>"
            )}`}
            className="contacts-link"
            target="_blank"
            rel="noreferrer"
          >
            <img src={whatsapp} alt="whatsapp" />
          </a>
        </div>

        <p className="footer-copyright-text">
          {new Date().getFullYear()} © Лепесток - Лучший цветочный выбор в
          Москве
        </p>
        <div className="d-flex jc-sb p-relative">
          <img src={payment} alt="payment" className="footer-banks-img" />
        </div>
      </div>
    </footer>
  );
}
export default Footer;
