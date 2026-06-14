import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Star,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  saveRating,
  getUserRating,
  getAverageRating,
} from "../utils/ratings";
import {
  addPodcastReview,
  getPodcastReviews,
  hasUserReviewedPodcast,
  deletePodcastReview,
  type PodcastReview,
} from "../utils/podcastReviews";
import backgroundImage from "../../imports/maxresdefault.jpg";
import podcastImage1 from "../../imports/__________________.png";
import podcastImage2 from "../../imports/_____________.png";
import podkast3 from "../../imports/podkast3.png";

const podcastsData = [
  {
    id: "1",
    title: "Литературные предпочтения молодежи",
    host: "Горьянова Татьяна, Ю-81",
    description:
      "Что читает молодежь сегодня? Исследуем последние тренды",
    fullDescription:
      "Тема этого выпуска — литературные предпочтения молодежи. Вместе с учителями мы обсудим актуальные тренды, популярные жанры и то, что сегодня в моде у молодого поколения",
    duration: "12 мин",
    publishDate: "23 февраля 2026",
    image: podcastImage1,
    videoUrl:
      "https://vm-ftp.anosov.ru/vm/%D0%9F%D0%BE%D0%B4%D0%BA%D0%B0%D1%81%D1%82%D1%8B_%D0%90%D0%BD%D0%BE%D1%81%D0%BE%D0%B2%D0%B5%D1%86/%D0%9F%D0%BE%D0%B4%D0%BA%D0%B0%D1%81%D1%821/video/index.html",
    videoType: "vm-fb",
  },
  {
    id: "2",
    title: "История создания книги «Памяти погибших на СВО»",
    host: "Павлова Анна и Гутис Виолета, ИС-61",
    description: "— книга, которая появилась в нашем колледже. Как возникла идея? Кто работал над её созданием? Какие истории в неё вошли?",
    fullDescription: "— книга, которая появилась в нашем колледже. Как возникла идея? Кто работал над её созданием? Какие истории в неё вошли?",
    duration: "26 мин",
    publishDate: "28 мая 2026",
    image: podcastImage2,
    videoUrl: "https://kinescope.io/vA6UUdAycKob1HVjQi5jzG",
    videoType: "kinescope.io",
  },
  {
    id: "3",
    title: "История возникноваения группы КВН",
    host: "Павлова Анна, ИС-61",
    description: "Студенческая шутка, которая переросла в легенду. В этом выпуске — вся подноготная создания команды КВН: от первой неудачной репризы до сцены в Сочи. ",
    fullDescription: "Студенческая шутка, которая переросла в легенду. В этом выпуске — вся подноготная создания команды КВН: от первой неудачной репризы до сцены в Сочи. ",
    duration: "31 мин",
    publishDate: "14 июня 2026",
    image: podkast3,
    videoUrl: "https://kinescope.io/dGAyv1x7JUENZXd6QATYpP",
    videoType: "kinescope.io",
  },
];

export default function PodcastDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const podcast = podcastsData.find((p) => p.id === id);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [averageRating, setAverageRating] = useState({
    average: 0,
    count: 0,
  });

  // Review state
  const [reviews, setReviews] = useState<PodcastReview[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredReviewRating, setHoveredReviewRating] =
    useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (id && currentUser) {
        const savedRating = await getUserRating(
          currentUser.id,
          id,
        );
        if (savedRating !== null) {
          setUserRating(savedRating);
          setHasRated(true);
        }

        const reviewed = await hasUserReviewedPodcast(
          currentUser.id,
          id,
        );
        setHasReviewed(reviewed);
      }

      if (id) {
        const avgRating = await getAverageRating(id);
        setAverageRating(avgRating);

        const podcastReviews = await getPodcastReviews(id);
        setReviews(podcastReviews);
      }
    };

    loadData();
  }, [id, currentUser]);

  if (!podcast) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 text-white text-2xl">
          Подкаст не найден
        </div>
      </div>
    );
  }

  const handleRating = async (rating: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (currentUser && id) {
      console.log(`Setting user rating to ${rating}`);
      setUserRating(rating);
      setHasRated(true);

      const result = await saveRating(currentUser.id, id, rating);
      console.log('Save rating result:', result);

      if (result.success) {
        const avgRating = await getAverageRating(id);
        console.log('New average rating:', avgRating);
        setAverageRating(avgRating);
      } else {
        alert(`Ошибка сохранения рейтинга: ${result.message}`);
      }
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !id) return;

    if (!reviewText.trim()) {
      alert("Пожалуйста, напишите отзыв");
      return;
    }

    const result = await addPodcastReview(
      currentUser.id,
      currentUser.fullName,
      id,
      reviewText,
      0,
    );

    if (result.success) {
      alert("Спасибо за ваш комментарий!");
      setHasReviewed(true);
      setShowReviewForm(false);
      setReviewText("");
      setReviewRating(0);

      // Reload reviews
      const podcastReviews = await getPodcastReviews(id);
      setReviews(podcastReviews);
    } else {
      alert(result.message);
    }
  };

  const formatReviewDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen relative" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-black/75"></div>
      <div className="relative z-10">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-6 sm:mb-8 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Назад к подкастам
        </Link>

        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
          <div className="aspect-video w-full bg-black">
            {podcast.videoType === "mp4" ? (
              // HTML5 видео плеер для .mp4 файлов
              <video
                className="w-full h-full"
                controls
                src={podcast.videoUrl}
              >
                Ваш браузер не поддерживает видео тег.
              </video>
            ) : (
              // iframe для YouTube и Vimeo
              <iframe
                className="w-full h-full"
                src={podcast.videoUrl}
                title={podcast.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
              <div className="w-full sm:w-48 lg:w-48 flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={podcast.image}
                  alt={podcast.title}
                  className="w-full max-w-xs sm:max-w-none mx-auto rounded-lg shadow-lg"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-4">
                  {podcast.title}
                </h1>

                <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 text-sm sm:text-base">
                  <div className="flex items-center gap-2 text-purple-200">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">{podcast.host}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-200">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">{podcast.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-200">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">{podcast.publishDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-lg sm:text-xl">
                      {averageRating.average || 0}
                    </span>
                  </div>
                  <span className="text-purple-200 text-sm sm:text-base">
                    ({averageRating.count}{" "}
                    {averageRating.count === 1
                      ? "оценка"
                      : averageRating.count >= 2 &&
                          averageRating.count <= 4
                        ? "оценки"
                        : "оценок"}
                    )
                  </span>
                </div>

                <p className="text-purple-100 mb-4 text-sm sm:text-base">
                  {podcast.fullDescription}
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
              <h2 className="text-xl sm:text-2xl text-white mb-4">
                {isAuthenticated
                  ? "Оцените этот подкаст"
                  : "Войдите, чтобы оценить подкаст"}
              </h2>
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() =>
                          setHoveredRating(star)
                        }
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${
                            star <=
                            (hoveredRating || userRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-purple-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {hasRated && (
                    <span className="text-green-300 text-sm sm:text-lg">
                      Спасибо за оценку! Вы поставили{" "}
                      {userRating}{" "}
                      {userRating === 1
                        ? "звезду"
                        : userRating >= 2 && userRating <= 4
                          ? "звезды"
                          : "звезд"}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-center"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl text-center"
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl text-white flex items-center gap-2 sm:gap-3">
                  <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
                  Комментарии ({reviews.length})
                </h2>
                {isAuthenticated && !hasReviewed && !currentUser?.isAdmin && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm sm:text-base w-full sm:w-auto"
                  >
                    {showReviewForm ? "Отменить" : "Написать комментарий"}
                  </button>
                )}
              </div>

              {/* Comment Form */}
              {isAuthenticated && !hasReviewed && !currentUser?.isAdmin && showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-white/5 rounded-xl p-4 sm:p-6 mb-6"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="reviewText"
                      className="block text-xs sm:text-sm text-purple-200 mb-2"
                    >
                      Ваш комментарий
                    </label>
                    <textarea
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors min-h-[120px] text-sm sm:text-base"
                      placeholder="Напишите ваш комментарий к подкасту..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm sm:text-base"
                  >
                    Отправить комментарий
                  </button>
                </form>
              )}

              {hasReviewed && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                  <p className="text-green-300 text-sm sm:text-base">
                    Вы уже оставили комментарий к этому подкасту. Спасибо!
                  </p>
                </div>
              )}

              {!isAuthenticated && (
                <div className="bg-white/5 rounded-xl p-4 sm:p-6 text-center mb-6">
                  <p className="text-purple-200 mb-4 text-sm sm:text-base">
                    Войдите, чтобы оставить комментарий
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link
                      to="/login"
                      className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm sm:text-base"
                    >
                      Войти
                    </Link>
                    <Link
                      to="/register"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      Регистрация
                    </Link>
                  </div>
                </div>
              )}

              {/* Comments List */}
              {reviews.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300 mx-auto mb-4" />
                  <p className="text-purple-200 text-base sm:text-lg">
                    Пока нет комментариев. Станьте первым!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-base sm:text-lg text-white mb-1">
                            {review.userName}
                          </h3>
                          <p className="text-amber-400 text-xs sm:text-sm">
                            {formatReviewDate(review.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {currentUser?.isAdmin && (
                            <button
                              onClick={async () => {
                                if (!confirm("Удалить этот комментарий?")) return;
                                const result = await deletePodcastReview(review.id);
                                if (result.success) {
                                  setReviews((prev) => prev.filter((r) => r.id !== review.id));
                                } else {
                                  alert("Не удалось удалить комментарий");
                                }
                              }}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              title="Удалить комментарий"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-white text-sm sm:text-base">
                        {review.reviewText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}