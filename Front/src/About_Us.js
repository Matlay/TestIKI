import React from "react";
import { FaVk, FaTelegram, FaGithub, FaCode, FaUsers, FaLightbulb } from "react-icons/fa";
import { motion } from "framer-motion";

const About_Us = ({ darkMode }) => {
  const developers = [
    {
      name: "Александр Матлай",
      role: "Frontend разработчик",
      vk: "https://vk.com/luna016",
      photo: "https://res.cloudinary.com/dbynlpzwa/image/upload/v1748366330/9b3eefbd-0ab5-4f61-ac65-3f4fa8268322.png"
    },
    {
      name: "Александр Платонов",
      role: "UX/UI дизайнер",
      vk: "https://vk.com/platonich24",
      photo: "https://res.cloudinary.com/dbynlpzwa/image/upload/v1748366443/cc3dc3ee-e930-4a2c-b40c-20ebbd5f5aac.png"
    },
    {
      name: "Георгий Тумашов",
      role: "Backend разработчик",
      vk: "https://vk.com/chizkeikk",
      photo: "https://res.cloudinary.com/dbynlpzwa/image/upload/v1748366368/b2c35871-a21a-436f-a097-2f4e867afedd.png"
    },
    {
      name: "Илья Нефёдов",
      role: "Контент-менеджер",
      vk: "https://vk.com/lightzee",
      photo: "https://res.cloudinary.com/dbynlpzwa/image/upload/v1748366502/1af90247-fb4f-4da9-a621-c993c45bf96c.png"
    }
  ];

  const features = [
    {
      icon: <FaCode className="text-3xl mb-3" />,
      title: "Современные технологии",
      description: "Используем React, Node.js и другие передовые технологии"
    },
    {
      icon: <FaUsers className="text-3xl mb-3" />,
      title: "Ориентированность на пользователя",
      description: "Тесты разработаны с учетом удобства и доступности"
    },
    {
      icon: <FaLightbulb className="text-3xl mb-3" />,
      title: "Инновационные решения",
      description: "Постоянно улучшаем платформу и добавляем новые функции"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Заголовок с анимацией */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">О нашей команде</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Мы создаем образовательные тесты, которые помогают людям узнавать новое и развиваться
          </p>
        </motion.div>

        {/* Блок с преимуществами */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-xl text-center ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}
            >
              <div className={`inline-block p-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-100"} text-blue-500`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Команда разработчиков */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Наша команда</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developers.map((dev, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img 
                  src={dev.photo} 
                  alt={dev.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{dev.name}</h3>
                  <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{dev.role}</p>
                  <a
                    href={dev.vk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 rounded-lg ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                  >
                    <FaVk className="mr-2" /> ВКонтакте
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About_Us;