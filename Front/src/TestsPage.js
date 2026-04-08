import api from './api.js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaClock, FaQuestionCircle, FaUserLock, FaFilter } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import axios from 'axios';
import { toast } from 'react-toastify';

const TestsPage = ({ darkMode, isAuthenticated }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get("/tests")
        if (!response.data.tests) {
          throw new Error("No tests found in response")
        }
        setTests(response.data.tests)
      } catch (err) {
        console.error("Error fetching tests:", err)
        let errorMessage = "Не удалось загрузить тесты"
        if (err.response?.status === 404) {
          errorMessage = "Маршрут /tests не найден на сервере"
        } else if (err.response?.status === 401) {
          errorMessage = "Необходима авторизация для просмотра тестов"
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error
        } else {
          errorMessage += `: ${err.message}`
        }
        setError(errorMessage)
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: darkMode ? "dark" : "light",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTests();
  }, [darkMode]);

  const filteredTests = tests.filter(test => {
    const title = test.title || '';
    const description = test.description || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(tests.map(test => test.category).filter(Boolean))];

  const handleTestClick = (test, e) => {
    // Проверяем, был ли клик по иконке замка
    if (e.target.closest('.lock-icon')) {
      return;
    }
    
    if (!isAuthenticated) {
      toast.info('Для прохождения тестов необходимо войти в систему', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? 'dark' : 'light',
      });
      return;
    }
    navigate(`/${test.slug}`);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div 
          key={index}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="animate-pulse">
            <div className={`h-6 w-3/4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 mt-4 w-full rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 mt-2 w-5/6 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className="flex mt-6 gap-2">
              <div className={`h-6 w-20 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-6 w-20 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className={`h-10 w-64 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} mb-8 animate-pulse`}></div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className={`relative flex-grow ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm h-12 animate-pulse`}></div>
              <div className={`w-48 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg h-12 animate-pulse`}></div>
            </div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl max-w-md w-full`}>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600'} mb-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Ошибка загрузки</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-md hover:shadow-lg`}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Доступные тесты
            </h1>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}
            >
              <FaFilter className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <span>Фильтры</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className={`relative flex-grow ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm transition-all duration-200 focus-within:shadow-md`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <input
                type="text"
                placeholder="Поиск тестов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 rounded-xl border-0 focus:ring-2 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400 focus:ring-indigo-500' : 'bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-400'} transition-all duration-200`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <IoMdClose className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} />
                </button>
              )}
            </div>
            
            <div className={`hidden md:block w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-0 focus:ring-2 ${darkMode ? 'bg-gray-800 text-white focus:ring-indigo-500' : 'bg-white text-gray-900 focus:ring-indigo-400'} transition-all duration-200`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Все категории' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile filter panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className={`md:hidden mb-6 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Фильтры</h3>
                    <button onClick={() => setIsFilterOpen(false)}>
                      <IoMdClose className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </button>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-0 focus:ring-2 ${darkMode ? 'bg-gray-700 text-white focus:ring-indigo-500' : 'bg-gray-100 text-gray-900 focus:ring-indigo-400'}`}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Все категории' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {filteredTests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`p-8 text-center rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'} mb-4`}>
              <FaSearch className="text-2xl" />
            </div>
            <h3 className="text-xl font-medium mb-2">Тесты не найдены</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchTerm.trim() ? 'Попробуйте изменить параметры поиска' : 'Нет доступных тестов'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              Сбросить фильтры
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {filteredTests.map((test) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  whileHover={{ y: -3 }}
                  onClick={(e) => handleTestClick(test, e)}
                  className={`p-6 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'} ${!isAuthenticated ? 'opacity-90' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold line-clamp-2">{test.title}</h2>
                    {!isAuthenticated && (
                      <FaUserLock className={`lock-icon text-sm mt-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    )}
                  </div>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                    {test.description || 'Описание отсутствует'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-indigo-900/30 text-indigo-200' : 'bg-indigo-100 text-indigo-800'}`}>
                      {test.category || 'Без категории'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${darkMode ? 'bg-purple-900/30 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                      <FaQuestionCircle className="mr-1" /> {test.questions?.length || 0}
                    </span>
                    {test.time_limit > 0 && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${darkMode ? 'bg-emerald-900/30 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}>
                        <FaClock className="mr-1" /> {test.time_limit} мин
                      </span>
                    )}
                  </div>
                  {!isAuthenticated && (
                    <div className={`mt-4 p-3 rounded-lg text-sm flex items-center ${darkMode ? 'bg-gray-700/50 text-yellow-300' : 'bg-gray-100 text-yellow-700'}`}>
                      <FaUserLock className="mr-2 flex-shrink-0" /> 
                      <span>Войдите для прохождения</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsPage;