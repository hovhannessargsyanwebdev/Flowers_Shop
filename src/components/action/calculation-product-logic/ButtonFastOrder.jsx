import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../../styles/action-styles/ButtonFastOrder.css";
import "../../../styles/action-styles/Modal.css";
import axios from "axios";
import { useDisableZoomOnInputFocus} from "../../../action";

function ButtonFastOrder({ text, cardId }) {
  const [modalShow, setModalShow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [name, setName] = useState("");

  useDisableZoomOnInputFocus();

  const cleanPhoneNumber = (value) => {
    if (!value) return '';
    let cleaned = value.replace(/\s/g, '');
    if (cleaned.startsWith('+')) {
      return cleaned.substring(1);
    }
    return cleaned;
  };

  const initialValues = { phone: "" };

  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("номер телефона обязательно")
      .test(
        'is-phone-valid',
        'только цифры и/или плюс в начале, пробелы допустимы',
        value => {
          if (!value) return false;
          const cleaned = cleanPhoneNumber(value);
          return /^\d*$/.test(cleaned);
        }
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setPopupMessage("Отправка ..."); 
      setShowPopup(true); 

      const formData = {
        name: name,
        phone: values.phone.replace(/\s/g, ''), 
        id: cardId,
      };
      const urlEncodedData = new URLSearchParams(formData).toString();

      axios
        .post("/api/fastorder.php", urlEncodedData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((resolve) => {
          setPopupMessage("Номер отправлен"); 
          setTimeout(() => {
            setModalShow(false);
            setShowPopup(false);
            resetForm();
            setName("");
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          setPopupMessage("Ошибка отправки"); 
          setTimeout(() => {
            setModalShow(false);
            setShowPopup(false);
            resetForm();
            setName("");
          }, 1000);
        });
    },
  });

  const handleSubmit = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    formik.handleSubmit(event);
  };


  return (
    <>
      <button className="btn-fast-order" onClick={() => setModalShow(true)}>
        {text}
      </button>
      <Modal
        size="md"
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal-fast-order-wrapp"
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <label className="modal-fast-order-text">Мы Вам позвоним </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              name="name"
              className="modal-fast-order-input"
              placeholder="Ваше имя"
            />
            <input
              onChange={(e) => {
                const value = e.target.value;
                const onlyNumbers = value.replace(/\D/g, "");
                if (value !== onlyNumbers) {
                  formik.setFieldError("phone", "только цифры");
                } else {
                  formik.setFieldError("phone", undefined);
                }
                formik.setFieldValue("phone", onlyNumbers);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              type="tel"
              name="phone"
              className={`modal-fast-order-input ${
                formik.errors.phone && formik.touched.phone ? "input-error" : ""
              }`}
              placeholder="Ваш номер телефона"
            />
            {formik.errors.phone && formik.touched.phone ? (
              <div className="error-message">{formik.errors.phone}</div>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="fast-order-submit-btn"
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              Отправить номер
            </button>

            {showPopup && (
              <div
                className={
                  popupMessage.includes("Ошибка")
                    ? "popup-notification text-danger"
                    : "popup-notification"
                }
                style={{
                  position: "absolute",
                  width: "60%",
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: "bold",
                  margin: "auto",
                  transform: "translate(-65%, -2px)",
                }}
              >
                {popupMessage}
              </div>
            )}
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default ButtonFastOrder;