import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import backgroundImage from "../../imports/maxresdefault.jpg";
import {
  ArrowLeft,
  TrendingUp,
  Award,
  Users,
  BarChart3,
  Star,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import {
  getOverallAnalytics,
  getPodcastAnalytics,
  getComparisonChartData,
  getRatingDistributionData,
  getRatingsTrend,
  type PodcastAnalytics,
  type OverallAnalytics,
} from "../utils/analytics";
import { PODCASTS_LIST } from "../utils/podcastsList";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [overallStats, setOverallStats] = useState<OverallAnalytics | null>(null);
  const [podcastsAnalytics, setPodcastsAnalytics] = useState<PodcastAnalytics[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!isAuthenticated || !currentUser?.isAdmin) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const overall = await getOverallAnalytics();
        setOverallStats(overall);

        const podcasts = await Promise.all(PODCASTS_LIST.map((p) => getPodcastAnalytics(p.id)));
        setPodcastsAnalytics(podcasts);

        const comparison = await getComparisonChartData();
        setComparisonData(comparison);

        const distribution = await getRatingDistributionData();
        setDistributionData(distribution);

        const trend = await getRatingsTrend(7);
        setTrendData(trend);
      } catch (err) {
        console.error("Analytics loading error:", err);
        setError("Ошибка загрузки аналитики. Проверьте консоль для подробностей.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [currentUser, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4" style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 text-white text-lg sm:text-2xl">Загрузка аналитики...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4" style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 bg-red-500/10 border border-red-500/20 rounded-xl p-6 sm:p-8 max-w-2xl">
          <h2 className="text-white text-xl sm:text-2xl mb-4">Ошибка загрузки</h2>
          <p className="text-red-300 mb-4 text-sm sm:text-base">{error}</p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Назад к админ-панели
          </Link>
        </div>
      </div>
    );
  }

  if (!overallStats) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4" style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 text-white text-lg sm:text-2xl">Нет данных для отображения</div>
      </div>
    );
  }

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "—";
    const date = new Date(timestamp);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
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
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-6 sm:mb-8 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Назад к админ-панели
        </Link>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-2 flex items-center gap-2 sm:gap-3">
            <Activity className="w-8 h-8 sm:w-10 sm:h-10" />
            Отчет об эффективности подкастов
          </h1>
          <p className="text-purple-200 text-sm sm:text-base">Подробная аналитика рейтингов и взаимодействия</p>
        </div>

        {/* Общая статистика */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <h3 className="text-purple-200 text-xs sm:text-sm">Всего оценок</h3>
            </div>
            <p className="text-2xl sm:text-3xl text-white mb-1">{overallStats.totalRatings}</p>
            <p className="text-xs sm:text-sm text-purple-300">
              на {overallStats.totalPodcasts} подкастах
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              <h3 className="text-purple-200 text-xs sm:text-sm">Средний рейтинг</h3>
            </div>
            <p className="text-2xl sm:text-3xl text-white mb-1">
              {overallStats.averageRating > 0 ? overallStats.averageRating : "—"}
            </p>
            <p className="text-xs sm:text-sm text-purple-300">по всем подкастам</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              <h3 className="text-purple-200 text-xs sm:text-sm">Самый популярный</h3>
            </div>
            {overallStats.mostPopularPodcast ? (
              <>
                <p className="text-lg sm:text-xl text-white mb-1">
                  {overallStats.mostPopularPodcast.title}
                </p>
                <p className="text-xs sm:text-sm text-purple-300">
                  {overallStats.mostPopularPodcast.ratingsCount} оценок
                </p>
              </>
            ) : (
              <p className="text-lg sm:text-xl text-white">Нет данных</p>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              <h3 className="text-purple-200 text-xs sm:text-sm">Высший рейтинг</h3>
            </div>
            {overallStats.highestRatedPodcast ? (
              <>
                <p className="text-lg sm:text-xl text-white mb-1">
                  {overallStats.highestRatedPodcast.title}
                </p>
                <p className="text-xs sm:text-sm text-purple-300">
                  ⭐ {overallStats.highestRatedPodcast.rating}
                </p>
              </>
            ) : (
              <p className="text-lg sm:text-xl text-white">Нет данных</p>
            )}
          </div>
        </div>

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Сравнение подкастов */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-2xl text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
              Сравнение подкастов
            </h2>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                />
                <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 27, 75, 0.95)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <Bar key="bar-rating" dataKey="рейтинг" fill="#8b5cf6" />
                <Bar key="bar-count" dataKey="кол-во оценок" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Распределение оценок */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-2xl text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Star className="w-6 h-6 sm:w-7 sm:h-7" />
              Распределение оценок
            </h2>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ stars, count, percent }) =>
                    count > 0 ? `${stars} (${count})` : null
                  }
                  outerRadius={100}
                  dataKey="count"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`pie-cell-${entry.stars}-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 27, 75, 0.95)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Тренд за последние 7 дней */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
            Тренд за последние 7 дней
          </h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.7)"
                tick={{ fill: "rgba(255,255,255,0.7)" }}
              />
              <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 27, 75, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Line
                key="line-avg"
                type="monotone"
                dataKey="Средний рейтинг"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6" }}
              />
              <Line
                key="line-count"
                type="monotone"
                dataKey="Количество"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Детальная таблица по подкастам */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl text-white mb-4 sm:mb-6">Детальная статистика по подкастам</h2>
          <div className="space-y-4 sm:space-y-6">
            {podcastsAnalytics.map((podcast) => (
              <div
                key={podcast.podcastId}
                className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-2xl text-white mb-1">{podcast.podcastTitle}</h3>
                    <p className="text-purple-300 text-xs sm:text-sm">
                      Последняя оценка: {formatDate(podcast.lastRatingDate)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl sm:text-3xl text-white">{podcast.averageRating}</span>
                    </div>
                    <p className="text-purple-300 text-xs sm:text-sm">
                      {podcast.totalRatings} {podcast.totalRatings === 1 ? "оценка" : "оценок"}
                    </p>
                  </div>
                </div>

                {/* Распределение оценок для этого подкаста */}
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count =
                      podcast.ratingDistribution[stars as keyof typeof podcast.ratingDistribution];
                    const percentage =
                      podcast.totalRatings > 0
                        ? Math.round((count / podcast.totalRatings) * 100)
                        : 0;

                    return (
                      <div key={stars} className="bg-white/5 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center gap-1 mb-1 sm:mb-2">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white text-xs sm:text-sm">{stars}</span>
                        </div>
                        <p className="text-lg sm:text-2xl text-white mb-1">{count}</p>
                        <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 mb-1">
                          <div
                            className="bg-purple-500 h-1.5 sm:h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-purple-300">{percentage}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
