import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const LogicTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      text: "Если все вороны черные, а эта птица черная, то она ворона?",
      options: [
          "Да.",
          "Нет.",
          "Недостаточно информации.",
          "Возможно."
      ]
  },
  {
      text: "Продолжите последовательность: 2, 4, 8, 16, ...",
      options: [
          "18.",
          "24.",
          "32.",
          "64."
      ]
  },
  {
      text: "Если сегодня понедельник, то какой день будет через 25 дней?",
      options: [
          "Вторник.",
          "Среда.",
          "Четверг.",
          "Пятница."
      ]
  },
  {
      text: "У Маши есть три корзины: в одной яблоки, в другой апельсины, а в третьей — и яблоки, и апельсины. На каждой корзине есть надпись, но все надписи неправильные. Надпись на первой корзине: 'Яблоки'. На второй: 'Апельсины'. На третьей: 'Яблоки и апельсины'. Что лежит в третьей корзине?",
      options: [
          "Яблоки.",
          "Апельсины.",
          "Яблоки и апельсины.",
          "Ничего."
      ]
  },
  {
      text: "Если все тигры — кошки, а некоторые кошки — полосатые, то какие из утверждений верны?",
      options: [
          "Все тигры полосатые.",
          "Некоторые тигры полосатые.",
          "Ни один тигр не полосатый.",
          "Некоторые полосатые — тигры."
      ]
  },
  {
      text: "Продолжите последовательность: А, В, Г, Д, ...",
      options: [
          "Е.",
          "Ж.",
          "З.",
          "И."
      ]
  },
  {
      text: "Если 3 человека могут построить дом за 6 дней, то сколько дней понадобится 6 человекам?",
      options: [
          "3 дня.",
          "6 дней.",
          "12 дней.",
          "18 дней."
      ]
  },
  {
      text: "Что легче: килограмм пуха или килограмм железа?",
      options: [
          "Килограмм пуха.",
          "Килограмм железа.",
          "Они весят одинаково.",
          "Зависит от объема."
      ]
  },
  {
      text: "Если на дереве сидят 5 птиц, и 3 из них улетают, сколько птиц останется?",
      options: [
          "2.",
          "3.",
          "5.",
          "Ни одной."
      ]
  },
  {
      text: "Какое число должно быть следующим в последовательности: 1, 1, 2, 3, 5, 8, ...?",
      options: [
          "10.",
          "12.",
          "13.",
          "15."
      ]
  },
  {
      text: "Если все розы — цветы, а некоторые цветы быстро вянут, то какие из утверждений верны?",
      options: [
          "Все розы быстро вянут.",
          "Некоторые розы быстро вянут.",
          "Ни одна роза не вянет.",
          "Некоторые цветы, которые быстро вянут, — розы."
      ]
  },
  {
      text: "Если 5 машин производят 5 деталей за 5 минут, то сколько деталей произведут 100 машин за 100 минут?",
      options: [
          "100.",
          "500.",
          "1000.",
          "2000."
      ]
  },
  {
      text: "Что будет следующим в последовательности: круг, квадрат, треугольник, ...?",
      options: [
          "Прямоугольник.",
          "Ромб.",
          "Пятиугольник.",
          "Овал."
      ]
  },
  {
      text: "Если у вас есть две монеты на общую сумму 15 рублей, и одна из них не пятирублевая, то какие это монеты?",
      options: [
          "5 и 10 рублей.",
          "1 и 14 рублей.",
          "2 и 13 рублей.",
          "7 и 8 рублей."
      ]
  },
  {
      text: "Если все книги на полке — учебники, а некоторые учебники — новые, то какие из утверждений верны?",
      options: [
          "Все книги новые.",
          "Некоторые книги новые.",
          "Ни одна книга не новая.",
          "Некоторые новые книги — учебники."
      ]
  }
  ];

  const handleAnswerChange = (value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestion] = value + 1;
      return newAnswers;
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    if (answers.some((answer) => answer === null)) {
      alert("Пожалуйста, ответьте на все вопросы!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const score = answers.reduce((sum, answer) => sum + answer, 0);
      setTotalScore(score);
      setIsLoading(false);
    }, 1000);
  };

  const getResultText = () => {
    if (totalScore <= 5) return "Вам стоит потренировать логическое мышление.";
    if (totalScore <= 10) return "У вас хорошие логические способности.";
    return "Вы отлично справляетесь с логическими задачами!";
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold text-center mb-6">Тест на логическое мышление</h1>

      <div className="relative pt-1 mb-4">
        <div className="overflow-hidden h-4 mb-2 text-xs flex rounded bg-gray-700">
          <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
        </div>
        <p className="text-sm text-gray-400">Вопрос {currentQuestion + 1} из {questions.length}</p>
      </div>

      <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <p className="font-semibold flex items-center text-lg">
          <FaQuestionCircle className="text-blue-500 mr-2" /> {questions[currentQuestion].text}
        </p>
        {questions[currentQuestion].options.map((option, index) => (
          <label key={index} className="block mt-3 cursor-pointer">
            <input
              type="radio"
              name={`question-${currentQuestion}`}
              value={index}
              checked={answers[currentQuestion] === index + 1}
              onChange={() => handleAnswerChange(index)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={prevQuestion} disabled={currentQuestion === 0} className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50">Назад</button>
        <button onClick={nextQuestion} disabled={currentQuestion === questions.length - 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Далее</button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <button onClick={calculateScore} className="w-full bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg mt-4">Рассчитать результат</button>
        )}
      </div>

      {totalScore !== null && (
        <div className={`mt-6 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold">Результат:</h2>
          <p className="text-xl">{getResultText()}</p>
          <Link to="/" className="flex items-center z-10"><button className="w-full bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg mt-4">Выйти на главную</button></Link>
        </div>
      )}
    </div>
  );
};

export default LogicTest;