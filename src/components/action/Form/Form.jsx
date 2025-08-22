import { useFormik } from "formik";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import { useDisableZoomOnInputFocus } from "../../../action";
import Modal from "react-bootstrap/Modal";
import "../../../styles/action-styles/Modal.css";
import "../../../styles/Form.css";

const Form = ({ totalPrice, products, onOrderSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [orderConfirmationText, setOrderConfirmationText] = useState("");

  useDisableZoomOnInputFocus();

  const initialValues = {
    promocod: "",
    recipientType: ["Другой получатель"],
    name: "",
    phone: "",
    isKnowAddres: ["Я знаю адрес"],
    deliveryAddress: "",
    recipientName: "",
    date: "",
    recipientPhone: "",
    comment: "",
    email: "",
    paymentCheckBoxes: [],
  };

  const cleanPhoneNumber = (value) => {
    if (!value) return "";
    let cleaned = value.replace(/\s/g, "");
    if (cleaned.startsWith("+")) {
      return cleaned.substring(1);
    }
    return cleaned;
  };

  const validationSchema = Yup.object({
    // name: Yup.string().required("Обязательное поле"),
    name: Yup.string()
    .required("Обязательное поле")
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, "только буквы"),
    
    phone: Yup.string()
      .required("Обязательное поле")
      .test("is-phone-valid", "только цифры", (value) => {
        if (!value) return false;
        const cleaned = cleanPhoneNumber(value);
        return /^\d*$/.test(cleaned);
      }),
    // recipientName: Yup.string().notRequired(),
    recipientName: Yup.string()
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, "только буквы")
    .notRequired(),

    recipientPhone: Yup.string().test(
      "is-numeric-or-empty",
      "только цифры",
      (value) => {
        if (!value) return true;
        const cleaned = cleanPhoneNumber(value);
        return /^\d*$/.test(cleaned);
      }
    ),
    deliveryAddress: Yup.string().notRequired(),
    email: Yup.string().test(
      "is-email-valid-or-empty",
      "Отсутствует '@'",
      (value) => {
        if (!value) return true;
        return value.includes("@");
      }
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        let productsData = [];
        document.querySelectorAll(".card").forEach((item) => {
          productsData[productsData.length] = {
            id: item.getAttribute("data-id"),
            count: item.querySelector("span.quantity").innerText,
            text: item.querySelector("textarea").value,
          };
        });

        values.products = productsData;

        if (!values.date) {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split("T")[0];
          values.date = formattedDate;
        }

        const submittedValues = { ...values };

        submittedValues.phone = submittedValues.phone.replace(/\s/g, "");
        submittedValues.recipientPhone = submittedValues.recipientPhone.replace(
          /\s/g,
          ""
        );

        if (!submittedValues.recipientType.includes("Другой получатель")) {
          submittedValues.recipientName = "";
          submittedValues.recipientPhone = "";
          submittedValues.isKnowAddres = ["Я знаю адрес"];
        }
        if (
          submittedValues.recipientType.includes("Другой получатель") &&
          submittedValues.isKnowAddres.includes("Я не знаю адрес")
        ) {
          submittedValues.deliveryAddress = "";
        }
        if (
          submittedValues.recipientType.includes("Я получу сам(а)") ||
          submittedValues.recipientType.includes("Самовывоз из магазина")
        ) {
          submittedValues.recipientName = "";
          submittedValues.recipientPhone = "";
          submittedValues.isKnowAddres = ["Я знаю адрес"];
        }
        if (submittedValues.recipientType.includes("Самовывоз из магазина")) {
          submittedValues.deliveryAddress = "";
        }

        setModalMessage("Отправка...");
        setShowModal(true);

        const response = await axios.post(
          "/api/cartorder.php",
          JSON.stringify(submittedValues, null, 2),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        let orderNumber;
        if (response.data && response.data.status === "Ok") {
          setModalMessage("Покупка завершена");
          orderNumber = response.data.orderId;

          setOrderConfirmationText(
            `Дорогой клиент, спасибо большое за ваш заказ! Номер вашего заказа <strong>${orderNumber}</strong>,
            через несколько минут мы начнем его обработку и свяжемся с вами через WhatsApp или Telegram,
            в крайний случай позвоним по телефону. Мы проверим все детали по заказу и выставим счет на оплату. Пожалуйста, ожидайте нашего ответа.`
          );
        } else {
          setModalMessage(
            "Ошибка отправки: " +
              (response.data?.message || "Неизвестная ошибка")
          );
          setOrderConfirmationText(
            "Дорогой клиент, произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз."
          );
        }
      } catch (error) {
        console.error(
          "Ошибка при отправке формы:",
          error.response ? error.response.data : error.message
        );
        setModalMessage("Не отправлена");
        setShowModal(true);
      }
    },
  });

  const handleCloseModal = () => {
    setShowModal(false);

    formik.resetForm();

    document
      .querySelectorAll(
        ".form-floating-input input, .form-floating-input textarea"
      )
      .forEach((el) => {
        el.classList.remove("focused");
        el.classList.remove("error-input");
        el.classList.remove("success-input");
      });
    document.querySelectorAll(".error").forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    document.querySelectorAll(".form-contact-input").forEach((el) => {
      el.classList.remove("error-input");
      el.classList.remove("success-input");
    });

    setModalMessage("");
    setOrderConfirmationText("");

    if (typeof onOrderSuccess === "function") {
      onOrderSuccess();
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const phoneInputRef = useRef(null);
  const deliveryAddressInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const recipientNameInputRef = useRef(null);
  const recipientPhoneInputRef = useRef(null);
  const commentInputRef = useRef(null);

  useEffect(() => {
    const inputsToCheck = [
      { ref: phoneInputRef, value: formik.values.phone },
      { ref: deliveryAddressInputRef, value: formik.values.deliveryAddress },
      { ref: emailInputRef, value: formik.values.email },
      { ref: dateInputRef, value: formik.values.date },
      { ref: recipientNameInputRef, value: formik.values.recipientName },
      { ref: recipientPhoneInputRef, value: formik.values.recipientPhone },
      { ref: commentInputRef, value: formik.values.comment },
    ];

    inputsToCheck.forEach(({ ref, value }) => {
      if (ref.current && value) {
        ref.current.parentNode.classList.add("focused");
      } else if (ref.current && !value) {
        ref.current.parentNode.classList.remove("focused");
      }
    });
  }, [
    formik.values.phone,
    formik.values.deliveryAddress,
    formik.values.email,
    formik.values.date,
    formik.values.recipientName,
    formik.values.recipientPhone,
    formik.values.comment,
  ]);

  const recipientType = [
    "Другой получатель",
    "Я получу сам(а)",
    "Самовывоз из магазина",
  ];

  const isKnowAddres = ["Я знаю адрес", "Я не знаю адрес"];
  const paymentCheckBoxes = ["Оплата по QR-коду по СБП", "Оплата переводом"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await formik.validateForm();

    formik.setTouched(
      {
        name: true,
        phone: true,
        recipientPhone: true,
        email: true,
      },
      false
    );

    const filteredErrors = {};
    for (const key in errors) {
      if (key === "recipientPhone" && !formik.values.recipientPhone) {
        continue;
      }
      if (key === "email" && !formik.values.email) {
        continue;
      }
      filteredErrors[key] = errors[key];
    }

    if (Object.keys(filteredErrors).length > 0) {
      const firstErrorField = Object.keys(filteredErrors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    } else {
      formik.submitForm();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="main-form">
          <div className="promocode-wrapp">
            <label className="promocode-label" htmlFor="promocod">
              ПРОМОКОД:
              <input
                className="promocode-input"
                type="text"
                name="promocod"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.promocod}
              />
            </label>
            {!!totalPrice && (
              <p className="total-price-text">
                ИТОГО:
                <span className="total-price">{totalPrice} ₽</span>
              </p>
            )}
          </div>

          <div className="recipient-type-wrapp">
            <h4 className="form-order-title">Оформление Заказа</h4>
            <p className="recipient-type-text">Кто получит заказ:</p>
            <div className="recipient-type">
              {recipientType.map((option) => (
                <div key={option}>
                  <label>
                    <input
                      type="radio"
                      name="recipientType"
                      value={option}
                      onChange={(e) => {
                        formik.setFieldValue("recipientType", [option]);
                        if (
                          option === "Я получу сам(а)" ||
                          option === "Самовывоз из магазина"
                        ) {
                          formik.setFieldValue("recipientName", "");
                          formik.setFieldValue("recipientPhone", "");
                          formik.setFieldValue("isKnowAddres", [
                            "Я знаю адрес",
                          ]);
                          if (option === "Самовывоз из магазина") {
                            formik.setFieldValue("deliveryAddress", "");
                          }
                        }
                      }}
                      onBlur={formik.handleBlur}
                      checked={formik.values.recipientType.includes(option)}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="label-conact-text">Ваши контактные данные:</div>
            <div className="form-contact-section">
              <div className="form-contact-input-wrapp">
                <div className="form-floating-input">
                  <input
                    className={`form-contact-input form-input ${
                      formik.touched.name &&
                      !formik.errors.name &&
                      formik.values.name
                        ? "success-input"
                        : formik.touched.name && formik.errors.name
                        ? "error-input"
                        : ""
                    }`}
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onFocus={(e) =>
                      e.target.parentNode.classList.add("focused")
                    }
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.parentNode.classList.remove("focused");
                      }
                      formik.handleBlur(e);
                    }}
                  />
                  <label className="form-label">Ваше имя *</label>
                  {formik.touched.name && formik.errors.name ? (
                    <div className="error">{formik.errors.name}</div>
                  ) : null}
                </div>
              </div>

              <div className="form-contact-input-wrapp">
                <div className="form-floating-input">
                  <input
                    ref={phoneInputRef}
                    className={`form-contact-input form-input ${
                      formik.touched.phone &&
                      !formik.errors.phone &&
                      formik.values.phone
                        ? "success-input"
                        : formik.touched.phone && formik.errors.phone
                        ? "error-input"
                        : ""
                    }`}
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onFocus={(e) =>
                      e.target.parentNode.classList.add("focused")
                    }
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.parentNode.classList.remove("focused");
                      }
                      formik.handleBlur(e);
                    }}
                  />
                  <label className="form-label">Ваш телефон *</label>
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="error">{formik.errors.phone}</div>
                  ) : null}
                  <span className="form-contact-input-text-sm">
                    для связи через WhatsApp
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section-details">
            <div className="addres-text-title">Детали доставки</div>

            {formik.values.recipientType.includes("Другой получатель") ? (
              <>
                <div className="address-choice">
                  {isKnowAddres.map((addres, index) => (
                    <label key={index} className="label-addres-text">
                      <input
                        type="radio"
                        name="isKnowAddres"
                        value={addres}
                        onChange={() => {
                          formik.setFieldValue("isKnowAddres", [addres]);
                          if (addres === "Я не знаю адрес") {
                            formik.setFieldValue("deliveryAddress", "");
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.isKnowAddres.includes(addres)}
                      />
                      {addres}
                    </label>
                  ))}
                </div>

                <div className="form-contact-input-wrapp">
                  <div className="form-floating-input">
                    <input
                      ref={recipientNameInputRef}
                      className={`form-contact-input form-input ${
                        formik.touched.recipientName &&
                        !formik.errors.recipientName &&
                        formik.values.recipientName
                          ? "success-input"
                          : ""
                      }`}
                      type="text"
                      name="recipientName"
                      value={formik.values.recipientName}
                      onChange={formik.handleChange}
                      onFocus={(e) =>
                        e.target.parentNode.classList.add("focused")
                      }
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.parentNode.classList.remove("focused");
                        }
                        formik.handleBlur(e);
                      }}
                    />
                    <label className="form-label">Имя получателя</label>
                  </div>
                </div>

                <div className="form-contact-input-wrapp">
                  <div className="form-floating-input">
                    <input
                      ref={recipientPhoneInputRef}
                      className={`form-contact-input form-input ${
                        formik.touched.recipientPhone &&
                        !formik.errors.recipientPhone &&
                        formik.values.recipientPhone
                          ? "success-input"
                          : formik.touched.recipientPhone &&
                            formik.errors.recipientPhone
                          ? "error-input"
                          : ""
                      }`}
                      type="tel"
                      name="recipientPhone"
                      value={formik.values.recipientPhone}
                      onChange={formik.handleChange}
                      onFocus={(e) =>
                        e.target.parentNode.classList.add("focused")
                      }
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.parentNode.classList.remove("focused");
                        }
                        formik.handleBlur(e);
                      }}
                    />
                    <label className="form-label">Телефон получателя</label>
                    {formik.touched.recipientPhone &&
                    formik.errors.recipientPhone ? (
                      <div className="error">
                        {formik.errors.recipientPhone}
                      </div>
                    ) : null}
                  </div>
                </div>

                {formik.values.isKnowAddres.includes("Я знаю адрес") && (
                  <div className="form-contact-input-wrapp">
                    <div className="form-floating-input">
                      <input
                        ref={deliveryAddressInputRef}
                        className={`form-contact-input form-input ${
                          formik.touched.deliveryAddress &&
                          !formik.errors.deliveryAddress &&
                          formik.values.deliveryAddress
                            ? "success-input"
                            : ""
                        }`}
                        type="text"
                        name="deliveryAddress"
                        value={formik.values.deliveryAddress}
                        onChange={formik.handleChange}
                        onFocus={(e) =>
                          e.target.parentNode.classList.add("focused")
                        }
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.parentNode.classList.remove("focused");
                          }
                          formik.handleBlur(e);
                        }}
                      />
                      <label className="form-label">Адрес доставки</label>
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {formik.values.recipientType.includes("Я получу сам(а)") && (
              <div className="form-contact-input-wrapp">
                <div className="form-floating-input">
                  <input
                    ref={deliveryAddressInputRef}
                    className={`form-contact-input form-input ${
                      formik.touched.deliveryAddress &&
                      !formik.errors.deliveryAddress &&
                      formik.values.deliveryAddress
                        ? "success-input"
                        : ""
                    }`}
                    type="text"
                    name="deliveryAddress"
                    value={formik.values.deliveryAddress}
                    onChange={formik.handleChange}
                    onFocus={(e) =>
                      e.target.parentNode.classList.add("focused")
                    }
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.parentNode.classList.remove("focused");
                      }
                      formik.handleBlur(e);
                    }}
                  />
                  <label className="form-label">Адрес доставки</label>
                </div>
              </div>
            )}
          </div>

          <div className="form-contact-input-wrapp">
            <div className="form-floating-input">
              <input
                ref={dateInputRef}
                className={`form-contact-input form-input ${
                  formik.touched.date &&
                  !formik.errors.date &&
                  formik.values.date
                    ? "success-input"
                    : ""
                }`}
                type="text"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onFocus={(e) => e.target.parentNode.classList.add("focused")}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.parentNode.classList.remove("focused");
                  }
                  formik.handleBlur(e);
                }}
              />
              <label className="form-label">
                {formik.values.recipientType.includes("Самовывоз из магазина")
                  ? "Дата и время самовывоза"
                  : "Дата и время доставки"}
              </label>
            </div>
          </div>

          <div className="form-contact-input-wrapp">
            <div className="form-floating-input">
              <textarea
                ref={commentInputRef}
                className={`form-contact-input form-input ${
                  formik.touched.comment &&
                  !formik.errors.comment &&
                  formik.values.comment
                    ? "success-input"
                    : ""
                }`}
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                onFocus={(e) => e.target.parentNode.classList.add("focused")}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.parentNode.classList.remove("focused");
                  }
                  formik.handleBlur(e);
                }}
              />
              <label className="form-label">Комментарий к заказу:</label>
            </div>
          </div>

          <div className="form-contact-input-wrapp">
            <div className="form-floating-input">
              <input
                ref={emailInputRef}
                className={`form-contact-input form-input ${
                  formik.touched.email &&
                  !formik.errors.email &&
                  formik.values.email
                    ? "success-input"
                    : formik.touched.email && formik.errors.email
                    ? "error-input"
                    : ""
                }`}
                type="text"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onFocus={(e) => e.target.parentNode.classList.add("focused")}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.parentNode.classList.remove("focused");
                  }
                  formik.handleBlur(e);
                }}
              />
              <label className="form-label">E-mail (электронная почта)</label>
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>

          <span className="form-email-input-text-sm">
            получить уведомление о завершении заказа
          </span>

          <div className="payment-title">
            Предварительная стоимость без промокода:
          </div>
          {!!totalPrice && (
            <p className="total-price-text-bottom">
              ИТОГО:
              <span className="total-price-bottom">{totalPrice} ₽</span>
            </p>
          )}
          <label className="payment-label" htmlFor="">
            Оплата:
          </label>
          <div className="checkbox-payment-container">
            {paymentCheckBoxes.map((option) => (
              <div key={option}>
                <label className="checkbox-payment-label">
                  <input
                    type="checkbox"
                    name="paymentCheckBoxes"
                    value={option}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.paymentCheckBoxes.includes(option)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>

          <button type="submit" className="submit no-hover">
            Завершить оформление заказа
          </button>
        </div>
      </form>

      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Статус заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            fontWeight: "401",
            fontSize: "20px",
          }}
        >
          {orderConfirmationText && (
            <p dangerouslySetInnerHTML={{ __html: orderConfirmationText }}></p>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            flexFlow: "row",
            flexWrap: "noWrap",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontWeight: "401",
              fontSize: "20px",
            }}
          >
            {modalMessage}
          </span>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Form;
