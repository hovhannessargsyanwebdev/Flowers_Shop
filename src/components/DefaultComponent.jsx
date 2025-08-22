import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useScrollingToTop } from "../action";

function DefaultComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const location = useLocation();

  useScrollingToTop();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    axios
      .get("/api/pages.php?url=" + window.location.pathname.toString())
      .then((resolve) => {
        if (resolve.data.status !== 0 && resolve.data.status !== "No") {
          setIsLoading(false);
          setData(resolve.data);
        } else {
          setData(null);
          setError(
            "Не удалось получить контент для страницы или API вернуло некорректный статус."
          );
          setIsLoading(true);
          console.warn(
            "API вернуло данные, но статус не 'успех':",
            resolve.data
          );
        }
      })
      .catch((error) => {
        setError("Произошла ошибка при загрузке данных.");
        setData(null);
        console.error("Ошибка при загрузке данных:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.pathname]);

  return (
    <div className="container-size">
      {isLoading && (
        <div
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Загрузка...
        </div>
      )}

      {error && (
        <div
          style={{
            textAlign: "center",
            minHeight: "300px",
            margin: "15px auto",
            fontWeight: "401",
          }}
        >
          <h1>Ошибка</h1>
          <p>{error}</p>
        </div>
      )}

      {data && (
        <div>
          <Helmet>
            <title>{data.meta_title}</title>
            <meta name="description" content={data.meta_description} />
            <meta name="keywords" content={data.meta_keyword} />
          </Helmet>

          <h1>{data.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: data.text }} />
        </div>
      )}
    </div>
  );
}

export default DefaultComponent;
