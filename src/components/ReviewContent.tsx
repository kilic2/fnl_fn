import { useParams, useNavigate } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import { HiArrowLeft, HiClock } from "react-icons/hi";
import { useState, useEffect } from "react";
import { api } from "../helper/api";
import type { Review } from "../types/profile";

interface ReviewContentProps {
    user: {
        isLoggedIn: boolean;
        id: number | null;
        name: string;
        pp: string;
    };
}

export default function ReviewContent({ user }: ReviewContentProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    // Commenting disabled

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const reviewResponse = await api.get(`/review/${id}`);
                const reviewData = reviewResponse.data;

                // Do not fetch or display comments
                setReview({
                    ...reviewData,
                    date: new Date(reviewData.date),
                    comments: []
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Comment submission disabled

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="animate-pulse">
                    <p className="text-gray-500 text-lg">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <Card className="max-w-md">
                    <div className="text-center">
                        <p className="text-gray-500 text-lg mb-4">İçerik bulunamadı</p>
                        <Button color="gray" onClick={() => navigate('/')}>
                            Ana Sayfaya Dön
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">

                <Button
                    color="light"
                    onClick={() => navigate(-1)}
                    className="shadow-sm hover:shadow-md transition-shadow"
                >
                    <HiArrowLeft className="mr-2 h-5 w-5" />
                    Geri Dön
                </Button>

                <Card className="overflow-hidden shadow-lg border-0">
                    <img
                        src={review.img}
                        alt={review.title}
                        className="w-full h-96 object-cover rounded-lg mb-6"
                    />

                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-6 pb-6 border-b">
                        <div className="flex items-center gap-2">
                            <HiClock className="h-4 w-4" />
                            <span>{review.date.toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        {review.title}
                    </h1>

                    <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p className="whitespace-pre-line text-justify">
                            {review.desc}
                        </p>
                    </div>
                </Card>

                <Card className="shadow-md border-0">
                    <div className="py-8 text-center text-gray-600">Yorumlar devre dışı bırakıldı.</div>
                </Card>

            </div>
        </div>
    );
}
