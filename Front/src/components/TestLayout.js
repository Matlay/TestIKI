import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaQuestionCircle } from "react-icons/fa";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";

const AnswerCard = ({
  option,
  isSelected,
  onSelect,
  darkMode = false,
  disabled = false,
}) => (
  <motion.button
    onClick={onSelect}
    disabled={disabled}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    className={`p-6 text-base sm:text-lg rounded-xl border transition-all duration-200 text-left ${
      isSelected
        ? "bg-blue-500 text-white border-blue-600 shadow-lg"
        : darkMode
        ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
        : "bg-gray-100 border-gray-300 text-black hover:bg-gray-200"
    } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
  >
    {option}
  </motion.button>
);

const TestLayout = ({
  title = "Тест",
  description = "",
  currentQuestion = 0,
  totalQuestions = 0,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting = false,
  canSubmit = false,
  showResults = false,
  results = null,
  currentQuestionData = null,
  answers = {},
  handleAnswerChange = () => {},
  isLoading = false,
  error = null,
  darkMode = false,
}) => {
  const progress = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (totalQuestions > 0 && currentQuestion >= 0 && currentQuestion < totalQuestions) {
      const newProgress = ((currentQuestion + 1) / totalQuestions) * 100;
      progress.set(newProgress);
    } else {
      progress.set(0);
    }
  }, [currentQuestion, totalQuestions, progress]);

  useEffect(() => {
    setImageError(false);
  }, [currentQuestion]);

  const handleAnswerSelection = (questionId, option) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const optionIndex = currentQuestionData.options.indexOf(option);
    if (optionIndex === -1) {
      console.warn(`Option not found: ${option}`, currentQuestionData.options);
      setIsTransitioning(false);
      return;
    }
    handleAnswerChange(questionId, optionIndex);

    timerRef.current = setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        onNext();
      }
      setIsTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleImageError = () => {
    console.error(`Failed to load image: ${currentQuestionData?.image}`);
    setImageError(true);
  };

  if (isLoading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${
            darkMode ? "border-blue-400" : "border-blue-500"
          }`}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col justify-center items-center min-h-screen p-4 ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className={`p-6 rounded-lg shadow-sm max-w-md text-center ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-xl font-medium mb-4 ${
              darkMode ? "text-red-400" : "text-red-500"
            }`}
          >
            Ошибка
          </h2>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-lg ${
              darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestionData || totalQuestions === 0) {
    return (
      <div
        className={`flex flex-col justify-center items-center min-h-screen p-4 ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className={`p-6 rounded-lg shadow-sm max-w-md text-center ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-xl font-medium mb-4 ${darkMode ? "text-white" : "text-black"}`}
          >
            Данные теста не загружены
          </h2>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Пожалуйста, попробуйте снова или вернитесь к списку тестов.
          </p>
          <button
            onClick={() => (window.location.href = "/tests")}
            className={`px-4 py-2 rounded-lg ${
              darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            Вернуться к тестам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto p-4 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>

      {description && (
        <p className={`text-center mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
      )}

      <div className="relative pt-1 mb-6">
        <div
          className={`overflow-hidden h-3 mb-2 text-xs flex rounded-full ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          <motion.div
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 rounded-full"
            style={{ width: `${progress.get()}%`, minWidth: "5%" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress.get()}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.4 }}
          />
        </div>
        <p className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Вопрос {currentQuestion + 1} из {totalQuestions}
        </p>
      </div>

      {showResults ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Результат теста</h2>
            {results}
          </div>
          <div className="mt-6 flex justify-center">
            <Link to="/">
              <button
                className={`px-5 py-3 ${
                  darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                } text-white font-semibold rounded-xl shadow-md transition-all duration-200 text-base`}
              >
                Выйти на главную
              </button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              {currentQuestionData.image && !imageError && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={currentQuestionData.image}
                    alt="Флаг"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                    onError={handleImageError}
                  />
                </div>
              )}
              <p className="font-semibold flex items-center text-lg mb-4">
                <FaQuestionCircle className="text-blue-500 mr-2" />
                {currentQuestionData.text}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestionData.options?.map((option, index) => (
                  <AnswerCard
                    key={index}
                    option={option}
                    isSelected={answers[currentQuestionData.id] === index}
                    onSelect={() => handleAnswerSelection(currentQuestionData.id, option)}
                    darkMode={darkMode}
                    disabled={isTransitioning}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <button
              onClick={onPrev}
              disabled={currentQuestion === 0 || isTransitioning}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center ${
                darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-400 hover:bg-gray-500"
              } text-white ${
                currentQuestion === 0 || isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FaArrowLeft className="mr-2" /> Назад
            </button>

            {currentQuestion < totalQuestions - 1 ? (
              <button
                onClick={onNext}
                disabled={answers[currentQuestionData.id] === undefined || isTransitioning}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center ${
                  darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                } text-white ${
                  answers[currentQuestionData.id] === undefined || isTransitioning
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Далее <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={isSubmitting || !canSubmit || isTransitioning}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isSubmitting || !canSubmit || isTransitioning
                    ? darkMode
                      ? "bg-gray-600"
                      : "bg-gray-400"
                    : darkMode
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-500 hover:bg-green-600"
                } text-white flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Отправка...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" /> Завершить
                  </>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TestLayout;