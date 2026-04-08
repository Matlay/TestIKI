import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const LoveTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      text: "Как часто вы думаете о человеке, который вам нравится?",
      options: [
        "Постоянно, он(а) не выходит у меня из головы.",
        "Часто, но не все время.",
        "Иногда, когда что-то напоминает о нем(ней).",
        "Редко, только в конкретных ситуациях."
      ]
    },
    {
      text: "Как вы себя чувствуете, когда видите этого человека?",
      options: [
        "У меня учащается сердцебиение, и я теряю дар речи.",
        "Я чувствую себя счастливым(ой) и взволнованным(ой).",
        "Мне приятно, но я остаюсь спокойным(ой).",
        "Ничего особенного, просто нормальное общение."
      ]
    },
    {
      text: "Как вы реагируете на сообщения от этого человека?",
      options: [
        "Отвечаю сразу, даже если занят(а).",
        "Отвечаю быстро, но стараюсь не казаться слишком навязчивым(ой).",
        "Отвечаю, когда есть время.",
        "Отвечаю, если это важно."
      ]
    },
    {
      text: "Как вы относитесь к его(ее) недостаткам?",
      options: [
        "Они кажутся мне милыми и незначительными.",
        "Я их замечаю, но они меня не беспокоят.",
        "Иногда они раздражают, но я стараюсь не обращать внимания.",
        "Они меня сильно беспокоят."
      ]
    },
    {
      text: "Как вы планируете свое время, если знаете, что увидите этого человека?",
      options: [
        "Стараюсь освободить весь день, чтобы провести с ним(ней) больше времени.",
        "Планирую встречу заранее и с нетерпением жду.",
        "Если получится встретиться — хорошо, если нет — тоже нормально.",
        "Не планирую ничего особенного."
      ]
    },
    {
      text: "Как вы относитесь к его(ее) интересам и увлечениям?",
      options: [
        "Я стараюсь узнать о них как можно больше и разделить их.",
        "Мне интересно, но я не всегда вникаю.",
        "Иногда интересно, иногда нет.",
        "Меня это не особо волнует."
      ]
    },
    {
      text: "Как вы себя чувствуете, когда этот человек рядом с кем-то другим?",
      options: [
        "Я ревную и чувствую себя некомфортно.",
        "Мне немного неприятно, но я стараюсь не показывать.",
        "Мне все равно, я спокоен(а).",
        "Я даже не замечаю."
      ]
    },
    {
      text: "Как вы относитесь к его(ее) мнению?",
      options: [
        "Его(ее) мнение для меня очень важно, я всегда его(ее) слушаю.",
        "Я учитываю его(ее) мнение, но не всегда соглашаюсь.",
        "Иногда прислушиваюсь, иногда нет.",
        "Мне все равно."
      ]
    },
    {
      text: "Как вы себя чувствуете, когда этот человек улыбается вам?",
      options: [
        "Я чувствую себя на седьмом небе от счастья.",
        "Мне становится тепло и приятно.",
        "Мне приятно, но я не придаю этому большого значения.",
        "Ничего особенного."
      ]
    },
    {
      text: "Как вы относитесь к его(ее) друзьям и близким?",
      options: [
        "Я стараюсь понравиться им и стать частью его(ее) круга.",
        "Мне интересно познакомиться с ними, но без фанатизма.",
        "Я общаюсь с ними, если это необходимо.",
        "Меня это не интересует."
      ]
    },
    {
      text: "Как вы относитесь к его(ее) прошлому?",
      options: [
        "Мне интересно все, что связано с ним(ней).",
        "Я спрашиваю, но не углубляюсь.",
        "Иногда интересно, иногда нет.",
        "Меня это не волнует."
      ]
    },
    {
      text: "Как вы себя чувствуете, когда этот человек грустит?",
      options: [
        "Я стараюсь сделать все, чтобы его(ее) поддержать.",
        "Мне неприятно, и я пытаюсь помочь.",
        "Я сочувствую, но не всегда знаю, как помочь.",
        "Меня это не особо трогает."
      ]
    },
    {
      text: "Как вы относитесь к его(ее) успехам?",
      options: [
        "Я горжусь им(ей) и радуюсь за него(нее).",
        "Мне приятно, и я поздравляю его(ее).",
        "Иногда радуюсь, иногда нет.",
        "Меня это не волнует."
      ]
    },
    {
      text: "Как вы относитесь к его(ее) недостаткам?",
      options: [
        "Они кажутся мне милыми и незначительными.",
        "Я их замечаю, но они меня не беспокоят.",
        "Иногда они раздражают, но я стараюсь не обращать внимания.",
        "Они меня сильно беспокоят."
      ]
    },
    {
      text: "Как вы представляете ваше будущее с этим человеком?",
      options: [
        "Я часто мечтаю о нашем будущем вместе.",
        "Иногда думаю об этом, но без фанатизма.",
        "Редко задумываюсь об этом.",
        "Я не думаю об этом."
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
      if (totalScore <= 15) return "Вы не испытываете сильных чувств к этому человеку. Возможно, это просто симпатия или дружба.";
      if (totalScore <= 30) return "Вы испытываете симпатию и интерес, но это еще не глубокая влюбленность.";
      if (totalScore <= 45) return "Вы явно влюблены! Ваши чувства сильны, и вы думаете об этом человеке постоянно.";
      return "Вы безумно влюблены! Этот человек занимает все ваши мысли, и вы готовы(а) на многое ради него(нее).";
    };
  
    return (
      <div className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <h1 className="text-3xl font-bold text-center mb-6">Тест на влюбленность</h1>
  
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
  
  export default LoveTest;