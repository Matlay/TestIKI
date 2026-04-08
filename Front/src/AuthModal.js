import api from './api.js';
import React, { useState, useEffect, useRef } from "react"; // Ensure useRef is imported
import { FaGoogle } from "react-icons/fa";
import { SlSocialVkontakte } from "react-icons/sl";
import { SiTelegram } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null); // Declare recaptchaRef

  const api = axios.create({
    baseURL: typeof window !== "undefined" && window.location.hostname !== "localhost" 
  ? "https://testiki-33ur.onrender.com" 
  : "http://localhost:8080",
    withCredentials: true,
  });

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Пароль должен содержать минимум 8 символов!";
    }
    if (!/[A-Z]/.test(password)) {
      return "Пароль должен содержать хотя бы одну заглавную букву!";
    }
    if (!/[0-9]/.test(password)) {
      return "Пароль должен содержать хотя бы одну цифру!";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Пароль должен содержать хотя бы один специальный символ!";
    }
    return null;
  };

 const handleAuth = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    if (!username || !password) {
        setError("Все поля обязательны для заполнения!");
        setIsLoading(false);
        return;
    }

    if (isRegister) {
        if (!email) {
            setError("Email обязателен!");
            setIsLoading(false);
            return;
        }
        if (!isValidEmail(email)) {
            setError("Неверный формат email!");
            setIsLoading(false);
            return;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Пароли не совпадают!");
            setIsLoading(false);
            return;
        }
    }

    if (showCaptcha && !captchaToken) {
        setError("Пройдите проверку CAPTCHA!");
        setIsLoading(false);
        return;
    }

    const url = isRegister ? "/register" : "/login";
    const data = isRegister
        ? {
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
        }
        : {
            identifier: username,
            password: password,
            captcha_token: captchaToken,
        };

    try {
        const response = await api.post(url, data);

        if (isRegister) {
            alert("Регистрация успешна! Проверьте email для подтверждения аккаунта.");
            setIsRegister(false);
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setAttempts(0);
            setShowCaptcha(false);
            setCaptchaToken(null);
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
        } else {
            if (response.data.user && response.data.user.is_verified === false) {
                setError("Пожалуйста, подтвердите ваш email адрес перед входом в систему");
                setIsLoading(false);
                return;
            }
            
            onLoginSuccess(response.data.user);
            setAttempts(0);
            setShowCaptcha(false);
            setCaptchaToken(null);
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setUsername("");
            setPassword("");
        }
    } catch (error) {
        console.error("Ошибка:", error.response?.data);
        setAttempts((prev) => prev + 1);
        
        if (error.response?.data?.error === "EMAIL_NOT_VERIFIED") {
            setError("Пожалуйста, подтвердите ваш email адрес перед входом в систему");
            setIsLoading(false);
            return;
        }
        
        if (error.response?.data?.captcha_required) {
            setShowCaptcha(true);
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setCaptchaToken(null);
        }
        
        let serverError = error.response?.data?.error || "Ошибка авторизации/регистрации";
        if (error.response?.status === 429) {
            serverError = error.response?.data?.error || "Слишком много попыток входа. Подождите минуту и попробуйте снова.";
        }
        setError(serverError);
    } finally {
        setIsLoading(false);
    }
};

  const handlePasswordReset = async () => {
  if (!email) {
    setError("Введите email!");
    return;
  }
  if (!isValidEmail(email)) {
    setError("Неверный формат email!");
    return;
  }

  setError("");
  setIsLoading(true);
  
  try {
    const response = await api.post("/auth/forgot-password", { email });
    alert("Письмо с инструкциями отправлено на ваш email!");
    setIsForgotPassword(false);
    setEmail("");
  } catch (error) {
    setError(error.response?.data?.error || "Ошибка восстановления пароля");
  } finally {
    setIsLoading(false);
  }
};
  const onCaptchaChange = (token) => {
      if (token) {
          setCaptchaToken(token);
      } else {
          setError("Ошибка загрузки CAPTCHA. Попробуйте обновить страницу.");
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <AnimatePresence>
        <motion.div
          key={isForgotPassword ? "forgot-password-modal" : isRegister ? "register-modal" : "login-modal"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
          className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center absolute"
        >
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {isForgotPassword ? "Восстановление пароля" : isRegister ? "Регистрация" : "Вход"}
          </motion.h2>

          {error && (
            <motion.div
              className="text-red-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p>{error}</p>
            </motion.div>
          )}

          {isForgotPassword ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.input
                type="email"
                placeholder="Введите ваш email"
                className="w-full p-3 mb-3 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.button
                className="bg-teal-500 text-white w-full py-3 rounded-lg mb-3"
                onClick={handlePasswordReset}
                disabled={isLoading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Восстановить пароль
              </motion.button>
              <motion.p
                className="text-blue-500 text-sm cursor-pointer"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError("");
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Вернуться к авторизации
              </motion.p>
            </motion.div>
          ) : (
            <>
              <motion.input
                type="text"
                placeholder={isRegister ? "Логин" : "Логин или Email"}
                className="w-full p-3 mb-3 border rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              {isRegister && (
                <motion.input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 mb-3 border rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
              )}
              <div className="relative mb-3">
                <motion.input
                  type={showPassword ? "text" : "password"}
                  placeholder="Пароль"
                  className="w-full p-3 border rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onCopy={(e) => e.preventDefault()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                >
                  <motion.img
                    src={showPassword ? "eye-open.png" : "eye-closed.png"}
                    alt="Toggle password visibility"
                    className="w-6 h-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.2 }}
                  />
                </span>
              </div>
              {isRegister && (
                <div className="relative mb-5">
                  <motion.input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Повторите пароль"
                    className="w-full p-3 border rounded-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onCopy={(e) => e.preventDefault()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  >
                    <motion.img
                      src={showConfirmPassword ? "eye-open.png" : "eye-closed.png"}
                      alt="Toggle confirm password visibility"
                      className="w-6 h-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.2 }}
                    />
                  </span>
                </div>
              )}
             {showCaptcha && (
              <motion.div
                  className="mb-3 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
              >
                  <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                      onChange={onCaptchaChange}
                      onErrored={() => setError("Ошибка загрузки CAPTCHA. Попробуйте снова.")}
                  />
              </motion.div>
          )}
              <motion.button
                className="bg-gradient-to-br from-indigo-400 to-indigo-500 text-white w-full py-3 rounded-lg mb-3"
                onClick={handleAuth}
                disabled={isLoading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                ) : isRegister ? "Зарегистрироваться" : "Войти"}
              </motion.button>

              <motion.p
                className="text-blue-500 text-sm cursor-pointer mt-6"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                  setUsername("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setCaptchaToken(null);
                  setShowCaptcha(false);
                  if (recaptchaRef.current) {
                    recaptchaRef.current.reset(); // Reset CAPTCHA
                  }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
              </motion.p>

              <motion.p
                className="text-blue-500 text-sm cursor-pointer mt-2"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError("");
                  setEmail("");
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                Забыли пароль?
              </motion.p>
            </>
          )}
          <button className="mt-4 text-red-500 w-full text-lg" onClick={onClose}>
            Закрыть
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthModal;