import api from '../api.js';
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TestLayout from "./TestLayout.js";
import { toast } from "react-toastify";

const AnxietyTest = ({ darkMode }) => {
  const location = useLocation();
  const slug = location.pathname.split("/")[1]; // Получаем slug из пути, например, "anxiety-test"
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [totalScore, setTotalScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState({
    text: "",
    description: "",
  });
  const [testDescription, setTestDescription] = useState("");

  const api = axios.create({
    baseURL: typeof window !== "undefined" && window.location.hostname !== "localhost" 
  ? "https://testiki-33ur.onrender.com" 
  : "http://localhost:8080",
    withCredentials: true,
    timeout: 10000,
  })


  useEffect(() => {
    if (!slug) {
      navigate("/tests");
      return;
    }

    const fetchTest = async () => {
      try {
        const response = await api.get(`/tests/${slug}`);
        if (!response.data.test) {
          throw new Error("Test data is empty");
        }
        setTest(response.data.test);
        setTestDescription(response.data.test.description || "");
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Не удалось загрузить тест");
        toast.error("Не удалось загрузить тест");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [slug, navigate]);

  const questions = test?.questions || [];

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 400);
  };

  const calculateScore = () => {
  if (Object.keys(answers).length !== questions.length) {
    toast.warning("Пожалуйста, ответьте на все вопросы");
    return;
  }

  setIsSubmitting(true);

  try {
    if (!test?.scoring_rules) {
      throw new Error("Правила оценки не найдены");
    }

    let scoringData = test.scoring_rules;
    if (typeof scoringData === "string") {
      scoringData = JSON.parse(scoringData);
    }

    if (!scoringData?.scoring?.ranges) {
      throw new Error("Некорректные правила оценки");
    }

    // 1. Находим максимально возможный балл
    const maxScore = questions.length * 
      Math.max(...currentQuestionData.options.map((_, i) => i + 1));

    // 2. Подсчет сырых баллов
    let total = 0;
    Object.values(answers).forEach((answer) => {
      total += answer;
    });

    // 3. Конвертация в проценты
    const percentageScore = Math.round((total / maxScore) * 100);

    // 4. Находим соответствующую интерпретацию
    const matchedRange = scoringData.scoring.ranges.find(
      (range) => percentageScore >= (range.min || 0) && percentageScore <= range.max
    ) || {};

    setTotalScore(percentageScore); // Теперь храним проценты
    setResultData({
      text: matchedRange.text || `Результат: ${percentageScore}%`,
      description: matchedRange.description || "",
    });

    return saveTestResult(percentageScore, matchedRange.text);
  } catch (err) {
    console.error("Ошибка расчета:", err);
    setResultData({
      text: "Ошибка расчета",
      description: err.message,
    });
    toast.error("Ошибка при расчете результата");
    throw err;
  } finally {
    setIsSubmitting(false);
  }
};

  const saveTestResult = async (score, resultText) => {
    try {
      const payload = {
        test_slug: slug,
        test_name: test.title,
        score: score || 0,
        result_text: resultText || "Результат не определен",
        answers: answers,
      };

      // Упрощенный запрос - куки отправляются автоматически
      await api.post("/test-result", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Результат сохранен!");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      
      // Улучшенная обработка ошибок
      if (error.response?.status === 401) {
        toast.error("Сессия истекла. Пожалуйста, войдите снова.");
        // Можно перенаправить на страницу входа
        // navigate('/login');
      } else {
        toast.error(error.response?.data?.error || "Ошибка сохранения");
      }
      throw error;
    }
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            darkMode ? "border-blue-400" : "border-blue-500"
          }`}
        ></div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-screen p-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">
          {error ? "Ошибка" : "Тест не найден"}
        </h2>
        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {error || "Запрошенный тест не существует"}
        </p>
        <button
          onClick={() => navigate("/tests")}
          className={`px-6 py-3 rounded-lg ${
            darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          Вернуться к тестам
        </button>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <TestLayout
      darkMode={darkMode}
      title={test.title}
      description={testDescription}
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      onPrev={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
      onNext={() => {
        if (answers[currentQuestionData.id] !== undefined) {
          setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1));
        } else {
          toast.warning("Пожалуйста, выберите ответ");
        }
      }}
      onSubmit={calculateScore}
      isSubmitting={isSubmitting}
      canSubmit={Object.keys(answers).length === questions.length}
      showResults={totalScore !== null}
      results={
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-blue-50"
            }`}
          >
            <p className="text-xl font-semibold mb-2">{resultData.text}</p>
            {resultData.description && (
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {resultData.description}
              </p>
            )}
          </div>
        </div>
      }
      onHome={() => navigate("/")}
      currentQuestionData={currentQuestionData}
      answers={answers}
      handleAnswerChange={handleAnswerChange}
      isLoading={loading}
      error={error}
    />
  );
};

export default AnxietyTest;