import api from './api.js';
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const EmailVerificationPage = ({ darkMode }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("");

  const api = axios.create({
    baseURL: typeof window !== "undefined" && window.location.hostname !== "localhost" 
  ? "https://testiki-33ur.onrender.com" 
  : "http://localhost:8080",
    withCredentials: false, 
  });

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Недействительная ссылка подтверждения");
        return;
      }

      try {
        const response = await api.post("/auth/verify-email", { token });
        
        if (response.status === 200) {
          setStatus("success");
          setMessage("Ваш email успешно подтвержден!");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.error || "Ошибка при подтверждении email");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleContinue = () => {
    navigate("/");
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? "bg-gradient-to-br from-violet-500 to-violet-950" : "bg-gradient-to-br from-neutral-50 to-neutral-100"
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center"
      >
        {/* Иконка в зависимости от статуса */}
        <div className="mb-6">
          {status === "loading" && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          )}
          {status === "success" && (
            <div className="text-green-500 text-6xl">✓</div>
          )}
          {status === "error" && (
            <div className="text-red-500 text-6xl">✗</div>
          )}
        </div>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold mb-4">
          {status === "loading" && "Подтверждаем email..."}
          {status === "success" && "Email подтвержден!"}
          {status === "error" && "Ошибка подтверждения"}
        </h2>

        {/* Описание */}
        <p className="text-gray-600 mb-6">
          {status === "loading" && "Пожалуйста, подождите..."}
          {status === "success" && "Теперь вы можете войти в свой аккаунт"}
          {status === "error" && "Не удалось подтвердить ваш email адрес"}
        </p>

        {/* Сообщение */}
        <div className={`p-3 rounded-lg mb-6 ${
          status === "success" ? "bg-green-50 text-green-700" : 
          status === "error" ? "bg-red-50 text-red-700" : 
          "bg-blue-50 text-blue-700"
        }`}>
          {message}
        </div>

        {/* Кнопка */}
        {status !== "loading" && (
          <button
            onClick={handleContinue}
            className={`w-full py-3 rounded-lg text-white font-medium ${
              status === "success" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
            } transition-colors`}
          >
            {status === "success" ? "Войти в аккаунт" : "Вернуться на главную"}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;