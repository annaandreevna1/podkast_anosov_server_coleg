import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Play,
  Clock,
  Star,
  LogOut,
  User,
  MessageSquare,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAverageRating } from "../utils/ratings";
import heroImage from "../../imports/ChatGPT_Image_7_maya_2026_g__20_14_16-1.png";
import backgroundImage from "../../imports/maxresdefault.jpg";
import podcastImage1 from "../../imports/__________________.png";
import podcastImage2 from "../../imports/_____________.png";
import podkast3 from "../../imports/podkast3.png";

const podcasts = [
  {
    id: "1",
    title: "Литературные предпочтения молодежи",
    host: "Горьянова Татьяна, Ю-81",
    description:
      "Что читает молодежь сегодня? Исследуем последние тренды",
    duration: "12 мин",
    image: podcastImage1,
  },
  {
    id: "2",
    title: "История создания книги «Памяти погибших на СВО»",
    host: "Павлова Анна и Гутис Виолета, ИС-61",
    description: "— книга, которая появилась в нашем колледже. Как возникла идея? Кто работал над её созданием? Какие истории в неё вошли?",
    duration: "26 мин",
    image: podcastImage2,
  },
  {
    id: "3",
    title: "История возникноваения группы КВН",
    host: "Павлова Анна, ИС-61",
    description: "Студенческая шутка, которая переросла в легенду. В этом выпуске — вся подноготная создания команды КВН: от первой неудачной репризы до сцены в Сочи. ",
    duration: "31 мин",
    image: podkast3,
  },
];

export default function HomePage() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [podcastRatings, setPodcastRatings] = useState<Record<string, { average: number; count: number }>>({});

  useEffect(() => {
    const loadRatings = async () => {
      const ratings: Record<string, { average: number; count: number }> = {};

      for (const podcast of podcasts) {
        const rating = await getAverageRating(podcast.id);
        ratings[podcast.id] = rating;
      }

      setPodcastRatings(ratings);
    };

    loadRatings();
  }, []);

  return (
    <div className="min-h-screen relative" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-black/75"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:py-16 sm:px-6 lg:px-8">
        {/* Mobile & Desktop Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {isAuthenticated && currentUser?.isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm sm:text-base"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Админ-панель</span>
                <span className="sm:hidden">Админ</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base max-w-[160px] sm:max-w-none">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">{currentUser?.fullName}</span>
                  {currentUser?.isAdmin && (
                    <span className="ml-1 sm:ml-2 bg-amber-500 text-white text-xs px-1 sm:px-2 py-1 rounded flex-shrink-0">
                      Админ
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Выйти</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm sm:text-base"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Section with Image */}
        <div className="relative mb-12 sm:mb-20 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Left - Text */}
          <div className="relative z-10 w-full lg:max-w-2xl text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 sm:mb-6 leading-tight italic" style={{ transform: 'rotate(-3deg)' }}>
              <span className="inline-block text-white" style={{ textShadow: '2px 2px 0px rgba(251, 146, 60, 0.3), 4px 4px 0px rgba(251, 146, 60, 0.3)' }}>
                ПОДКАСТЫ
              </span>
              <br />
              <span className="inline-block text-white" style={{ fontSize: '1.1em', letterSpacing: '-0.02em', textShadow: '2px 2px 0px rgba(251, 146, 60, 0.4), 3px 3px 0px rgba(251, 146, 60, 0.4)' }}>
                АНОСОВЕЦ
              </span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-purple-200 mb-6 sm:mb-8 px-4 lg:px-0">
              Голоса коллектива. Истории, которые вдохновляют
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0">
              <a
                href="#podcasts"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-xl hover:shadow-lg hover:shadow-amber-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                Смотреть подкасты
              </a>
              {isAuthenticated && !currentUser?.isAdmin && (
                <Link
                  to="/feedback"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all border border-white/10 flex items-center justify-center gap-2 text-base sm:text-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  Оставить отзыв
                </Link>
              )}
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative flex-shrink-0 w-full lg:w-[55%] lg:-ml-[10%] max-w-md lg:max-w-none mx-auto lg:mx-0">
            <img
              src={heroImage}
              alt="Подкасты"
              className="w-full h-auto"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(251, 146, 60, 0.6)) drop-shadow(0 0 40px rgba(245, 158, 11, 0.4))'
              }}
            />
          </div>
        </div>

        {/* Podcasts Section */}
        <div id="podcasts" className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Наши подкасты
            </h2>
            <p className="text-lg sm:text-xl text-purple-200">
              Откройте для себя удивительные истории и беседы
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          {podcasts.map((podcast) => (
            <Link
              key={podcast.id}
              to={`/podcast/${podcast.id}`}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20">
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <img
                    src={podcast.image}
                    alt={podcast.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm mb-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{podcast.duration}</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {podcastRatings[podcast.id]
                            ? podcastRatings[podcast.id].average
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4 sm:p-6">
                      <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl text-white mb-2">
                    {podcast.title}
                  </h2>
                  <p className="text-purple-200 text-xs sm:text-sm mb-3">
                    Ведущий: {podcast.host}
                  </p>
                  <p className="text-purple-100/80 text-xs sm:text-sm line-clamp-2">
                    {podcast.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}