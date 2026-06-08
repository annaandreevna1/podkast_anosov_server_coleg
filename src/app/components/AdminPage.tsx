import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import backgroundImage from "../../imports/maxresdefault.jpg";
import {
  ArrowLeft,
  Star,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Users,
  MessageSquare,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAllFeedback, getFeedbackStats, deleteFeedback, type Feedback } from "../utils/feedback";

export default function AdminPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    withProblems: 0,
    withoutProblems: 0,
  });

  useEffect(() => {
    const loadFeedback = async () => {
      if (!isAuthenticated || !currentUser?.isAdmin) {
        navigate("/");
        return;
      }

      const allFeedback = await getAllFeedback();
      allFeedback.sort((a, b) => b.timestamp - a.timestamp);
      setFeedback(allFeedback);

      const feedbackStats = await getFeedbackStats();
      setStats(feedbackStats);
    };

    loadFeedback();
  }, [currentUser, isAuthenticated, navigate]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen relative px-4 py-8" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-black/75"></div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Назад к подкастам
          </Link>

          <Link
            to="/analytics"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            Отчет об эффективности
          </Link>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-2">Панель администратора</h1>
          <p className="text-purple-200 text-sm sm:text-base">Отзывы пользователей о работе системы</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <h3 className="text-purple-200 text-xs sm:text-sm">Всего отзывов</h3>
            </div>
            <p className="text-2xl sm:text-3xl text-white">{stats.total}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              <h3 className="text-purple-200 text-xs sm:text-sm">Средняя оценка</h3>
            </div>
            <p className="text-2xl sm:text-3xl text-white">
              {stats.averageRating > 0 ? stats.averageRating : "—"}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              <h3 className="text-purple-200 text-xs sm:text-sm">С проблемами</h3>
            </div>
            <p className="text-2xl sm:text-3xl text-white">{stats.withProblems}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              <h3 className="text-purple-200 text-xs sm:text-sm">Без проблем</h3>
            </div>
            <p className="text-2xl sm:text-3xl text-white">{stats.withoutProblems}</p>
          </div>
        </div>

        {/* Список отзывов */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
            Все отзывы
          </h2>

          {feedback.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300 mx-auto mb-4" />
              <p className="text-purple-200 text-base sm:text-lg">
                Пока нет отзывов от пользователей
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10"
                >
                  {/* Заголовок отзыва */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl text-white mb-1">{item.userName}</h3>
                      <p className="text-purple-300 text-xs sm:text-sm">{item.userEmail}</p>
                      <p className="text-purple-400 text-xs mt-1">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              star <= item.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-purple-300"
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={async () => {
                          if (!confirm("Удалить этот отзыв?")) return;
                          const result = await deleteFeedback(item.id);
                          if (result.success) {
                            setFeedback((prev) => prev.filter((f) => f.id !== item.id));
                            setStats((prev) => ({
                              ...prev,
                              total: prev.total - 1,
                              withProblems: item.hasProblems ? prev.withProblems - 1 : prev.withProblems,
                              withoutProblems: !item.hasProblems ? prev.withoutProblems - 1 : prev.withoutProblems,
                            }));
                          } else {
                            alert("Не удалось удалить отзыв");
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex-shrink-0"
                        title="Удалить отзыв"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Проблемы */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {item.hasProblems ? (
                        <>
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                          <h4 className="text-purple-200 text-sm sm:text-base">Проблемы:</h4>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                          <h4 className="text-purple-200 text-sm sm:text-base">Проблем не обнаружено</h4>
                        </>
                      )}
                    </div>
                    {item.hasProblems && item.problems && (
                      <p className="text-white bg-white/5 rounded-lg p-3 ml-0 sm:ml-7 text-sm sm:text-base">
                        {item.problems}
                      </p>
                    )}
                  </div>

                  {/* Рекомендации */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      <h4 className="text-purple-200 text-sm sm:text-base">Рекомендации:</h4>
                    </div>
                    <p className="text-white bg-white/5 rounded-lg p-3 ml-0 sm:ml-7 text-sm sm:text-base">
                      {item.recommendations}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}