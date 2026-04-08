"use client"
import { FaTimes } from "react-icons/fa"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"

const Sidebar = ({ onClose, isOpen, darkMode, isAuthenticated, onAuthModalOpen }) => {
  const navigate = useNavigate()

  const handleTestsClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault()
      onClose() 
      onAuthModalOpen() 
    } else {
      onClose() 
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`w-64 h-full rounded-e-2xl p-6 flex flex-col justify-between transition-colors duration-300 ${
          darkMode ? "bg-gradient-to-br from-slate-900 to-slate-700" : "bg-gradient-to-br from-indigo-500 to-indigo-300"
        }`}
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Кнопка закрытия меню */}
        <div className="cursor-pointer" onClick={onClose}>
          <FaTimes size={30} className="text-white" />
        </div>

        {/* Основное содержимое бокового меню */}
        <div className="flex-grow mt-10">
          <ul className="space-y-4 text-white">
            <li>
              <Link to="/" onClick={onClose} className="hover:text-gray-400 transition">
                Главная
              </Link>
            </li>
            <li>
              <Link
                to={isAuthenticated ? "/tests" : "#"}
                onClick={handleTestsClick}
                className="hover:text-gray-400 transition"
              >
                Тесты
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={onClose} className="hover:text-gray-400 transition">
                Мой профиль
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={onClose} className="hover:text-gray-400 transition">
                О нас
              </Link>
            </li>
          </ul>
        </div>

        {/* Информация ниже */}
        <div className="mt-10 text-sm text-white">
          <p>© 2025 Все права защищены</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Sidebar
