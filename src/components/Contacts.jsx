import React from "react";
import klipartz from "../images/icons/klipartz.png";
import Whatsup from "../images/icons/Whatsup.svg";
import Telegram from "../images/icons/Telegram.svg";

function Contacts() {
  const whatsappMessage = "Здравствуйте, у меня вопрос по вашим услугам.";

  return (
    <div className="container-size contacts-wrapp">
      <h4 className="contacts-title">Телефоны</h4>
      <ul className="contacts-item-list">
        <li className="contacts-item">
          <a
            href={`tel:<?php echo $phone; ?>`}
            className="contacts-link"
            style={{
              backgroundColor: "transparent",
              pointerEvents: "pointer",
            }}
          >
            <img src={klipartz} alt="" />
            <div className="contacts-text-wrapp">
              <p
                className="contacts-text-lg"
                // dangerouslySetInnerHTML={{ __html: "<!-- PHP_BLOCK_START -->phone<!-- PHP_BLOCK_END -->"}}
              >
                {`<?php echo $phone;?>`}
              </p>
              <p className="contacts-text-sm">Для звонков</p>
            </div>
          </a>
        </li>

        <li className="contacts-item">
          <a
            // $whatsappMessage
            // $telegramMessage
            // href={`https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`}

            href={`https://wa.me/<?php echo $whatsapp; ?>?text=${encodeURIComponent(
              "<?php echo $whatsappMessage; ?>"
            )}`}
            className="contacts-link"
            target="_blank"
            rel="noreferrer"
          >
            <img src={Whatsup} alt="" />
            <div className="contacts-text-wrapp">
              <p className="contacts-text-lg">WhatsApp</p>
              <p className="contacts-text-sm">Напишите на WhatsApp </p>
            </div>
          </a>
        </li>

        <li className="contacts-item">
          <a
            // href={`https://t.me/${telegramUsername}`}
            href={`https://t.me/<?php echo $telegram; ?>`}
            className="contacts-link"
            target="_blank"
            rel="noreferrer"
          >
            <img src={Telegram} alt="" />
            <div className="contacts-text-wrapp">
              <p className="contacts-text-lg">Telegram</p>
              <p className="contacts-text-sm">Написать в Telegram</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}
export default Contacts;
