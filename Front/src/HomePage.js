"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaVk } from "react-icons/fa"

const HomePage = ({ darkMode, isAuthenticated, onAuthModalOpen }) => {
  const testItems = [
    { img: "/images/Test9.png", title: "Нарциссический опросник личности", link: "/narcissist-test" },
    { img: "/images/Test1.png", title: "Шкала сонливости Эпворта", link: "/epworth-sleepiness-scale" },
    { img: "/images/Test2.png", title: "Шкала тревоги Бека", link: "/becks-anxiety-scale" },
    { img: "/images/Test3.png", title: "Насколько прочны ваши отношения?", link: "/attitude-test" },
    { img: "/images/Test4.png", title: "Тест на проф.ориентацию", link: "/career-test" },
    { img: "/images/Test5.png", title: "Лабиринт разума", link: "/mind-maze-test" },
    { img: "/images/Test6.png", title: "Тест на креативность", link: "/creativity-test" },
    { img: "/images/Test7.png", title: "Тест на знание флагов", link: "/flags-test" },
    { img: "/images/Test8.png", title: "Насколько развита твоя интуиция?", link: "/intuition-test" },
    { img: "/images/Test10.png", title: "Тест на память", link: "/memory-test" },
  ]

  const handleTestClick = (e, link) => {
    if (!isAuthenticated) {
      e.preventDefault()
      onAuthModalOpen() 
      return false
    }
    return true
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  }

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Красивая замена белому промежутку - анимированные частицы */}
      <motion.div
        variants={fadeIn}
        className={`relative h-24 overflow-hidden ${darkMode ? "bg-gray-800" : "bg-indigo-50"}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
              className={`absolute rounded-full ${darkMode ? "bg-indigo-400/70" : "bg-indigo-500/70"}`}
              style={{
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5 }}
          className={`absolute bottom-0 h-1 w-full ${
            darkMode
              ? "bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
              : "bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
          }`}
        />
      </motion.div>

      {/* Герой-секция */}
      <motion.section
        variants={fadeIn}
        className={`w-full py-24 relative overflow-hidden ${
          darkMode
            ? "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800"
            : "bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-500"
        } text-center`}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className={`absolute rounded-full ${darkMode ? "bg-indigo-500/20" : "bg-white/20"}`}
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.h2
            variants={slideUp}
            className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight ${
              darkMode ? "text-white drop-shadow-[0_2px_10px_rgba(129,140,248,0.6)]" : "text-white"
            }`}
          >
            Откройте себя с помощью наших тестов!
          </motion.h2>

          <motion.p
            variants={slideUp}
            transition={{ delay: 0.2 }}
            className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto ${
              darkMode ? "text-indigo-200" : "text-indigo-100"
            }`}
          >
            Увлекательные тесты на любые темы: личность, знания, логика и многое другое
          </motion.p>

          <motion.div variants={slideUp} transition={{ delay: 0.4, type: "spring" }}>
            <Link
              to="/tests"
              className={`inline-flex items-center px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                darkMode
                  ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-violet-500/30"
                  : "bg-white hover:bg-gray-50 text-violet-600 shadow-lg hover:shadow-xl"
              } transform hover:-translate-y-1`}
            >
              Все тесты
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Основная сетка тестов */}
      <motion.main variants={fadeIn} transition={{ delay: 0.5 }} className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
        >
          {testItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }}>
              <Link
                to={item.link}
                onClick={(e) => handleTestClick(e, item.link)}
                className={`group relative block h-full rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.img || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      darkMode ? "from-gray-900/80 via-gray-900/30" : "from-gray-900/60 via-gray-900/10"
                    } to-transparent`}
                  ></div>
                </div>
                <div className="p-5">
                  <h3
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    } group-hover:text-indigo-500 transition-colors`}
                  >
                    {item.title}
                  </h3>
                  <button
                    className={`mt-4 w-full py-3 rounded-lg font-medium transition-all ${
                      darkMode
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/30"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg"
                    } transform hover:scale-[1.02]`}
                  >
                    Пройти тест
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>

      {/* Футер с усиленным эффектом стекла */}
      <motion.footer
        variants={fadeIn}
        transition={{ delay: 0.7 }}
        className={`w-full py-16 ${
          darkMode
            ? "bg-gray-800/80 backdrop-blur-lg border-t border-gray-700/50 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.3)]"
            : "bg-white/95 backdrop-blur-xl border-t border-white/30 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.1)]"
        }`}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={containerVariants} className="flex flex-col items-center">
            <motion.h3
              variants={itemVariants}
              className={`text-3xl font-bold mb-6 ${
                darkMode ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.4)]" : "text-indigo-600"
              }`}
            >
              Хотите больше тестов?
            </motion.h3>
            <motion.p
              variants={itemVariants}
              transition={{ delay: 0.1 }}
              className={`text-xl mb-8 max-w-md ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Присоединяйтесь к нашей группе ВКонтакте!
            </motion.p>

            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.2 }}
              className="flex justify-center space-x-6 mb-10"
            >
              {["🤔", "😍", "🧠", "🎯"].map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.3,
                  }}
                >
                  <motion.span
                    initial={{ y: 0, rotate: 0 }}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3 + 0.6,
                    }}
                    className="text-4xl inline-block"
                  >
                    {emoji}
                  </motion.span>
                </motion.span>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} transition={{ delay: 0.3 }} className="w-full max-w-md mx-auto">
              <a
                href="https://vk.com/club230652004"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg hover:shadow-lg"
                } transform hover:-translate-y-1`}
              >
                ВКонтакте
                <FaVk className="h-5 w-5 ml-2" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  )
}

export default HomePage