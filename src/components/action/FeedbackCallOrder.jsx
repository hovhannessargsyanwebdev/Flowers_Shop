import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../styles/action-styles/ButtonFastOrder.css";
import axios from "axios";

function FeedbackCallOrder({ text }) {
  const [isCallOrderShow, setisCallOrderShow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [name, setName] = useState("");

  const initialValues = { phone: "" };

  const validationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^[0-9]+$/, "только цифры")
      .required("Заполните поле корректно"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setPopupMessage("Отправка ..."); 
      setShowPopup(true); 
      const formData = {
        name: name,
        phone: values.phone,
      };
      const urlEncodedData = new URLSearchParams(formData).toString();
      
      axios.post('/api/phoneme.php', urlEncodedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(resolve => {
        setPopupMessage("Номер отправлен");
        setShowPopup(true);
        setTimeout(() => {
          setisCallOrderShow(false);
          setShowPopup(false);
          resetForm();
          setName("");
        }, 10000);     
      })
      .catch(err => {
        console.log(err);
        setPopupMessage("Ошибка отправки");
        setShowPopup(true);
        setTimeout(() => {
          setisCallOrderShow(false);
          setShowPopup(false);
          resetForm();
          setName("");
        }, 10000);
      });
    },
    cast: false,
  });

  const handleSubmit = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    formik.handleSubmit(event);
  };

  return (
    <>
    {text && (
      <button className="btn-fast-order" onClick={() => setisCallOrderShow(true)}>
      {text}
    </button>
    )}
      
      <Modal
        size="md"
        show={isCallOrderShow}
        onHide={() => setisCallOrderShow(false)}
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
              onChange={formik.handleChange}
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
                className={popupMessage.includes("Ошибка") ? "popup-notification text-danger" : "popup-notification"}
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

export default FeedbackCallOrder;