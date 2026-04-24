"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ExternalLink, CheckCircle2, MessageSquare, ArrowLeft } from "lucide-react";

type Step = "rating" | "feedback" | "google" | "done";

export default function ReviewPage() {
  const [step, setStep] = useState<Step>("rating");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const storeName = "田中ラーメン新宿店";
  const googleUrl = "#";

  const starLabels = ["", "とても不満", "不満", "普通", "満足", "とても満足"];

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    if (rating >= 4) {
      setStep("google");
    } else {
      setStep("feedback");
    }
  };

  const handleFeedbackSubmit = () => {
    setSubmitted(true);
    setStep("done");
  };

  const handleGoogleRedirect = () => {
    window.open(googleUrl, "_blank");
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-7 h-7 text-white fill-white" />
            </div>
            <h1 className="text-white font-bold text-xl">{storeName}</h1>
            <p className="text-indigo-200 text-sm mt-1">ご来店ありがとうございます</p>
          </div>

          <div className="p-6">
            {/* Rating step */}
            {step === "rating" && (
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">本日のご満足度は？</h2>
                  <p className="text-sm text-gray-500 mt-1">星をタップして評価してください</p>
                </div>

                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => handleRatingSelect(star)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-12 h-12 transition-colors ${
                          star <= (hoveredStar || selectedRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {hoveredStar > 0 && (
                  <p className="text-sm font-medium text-indigo-600">
                    {starLabels[hoveredStar]}
                  </p>
                )}

                <p className="text-xs text-gray-400">
                  ご回答は匿名で収集されます
                </p>
              </div>
            )}

            {/* Feedback step (1-3 stars) */}
            {step === "feedback" && (
              <div className="space-y-5">
                <button
                  onClick={() => setStep("rating")}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="w-3 h-3" />
                  戻る
                </button>

                <div className="text-center">
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-7 h-7 ${
                          s <= selectedRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    ご意見をお聞かせください
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    改善のため、詳しいご意見をお寄せください
                  </p>
                </div>

                <div className="bg-orange-50 rounded-2xl p-4 flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-700">
                    貴重なご意見をありがとうございます。改善のためにお聞かせください。
                    スタッフが確認し、より良いサービスを提供できるよう努めます。
                  </p>
                </div>

                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="ご不満な点、改善してほしい点などをご記入ください..."
                  className="border-gray-200 rounded-2xl resize-none text-sm"
                  rows={4}
                />

                <Button
                  onClick={handleFeedbackSubmit}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-2xl h-12 text-sm font-semibold"
                  disabled={feedback.trim().length === 0}
                >
                  ご意見を送信する
                </Button>
              </div>
            )}

            {/* Google redirect step (4-5 stars) */}
            {step === "google" && (
              <div className="space-y-5 text-center">
                <button
                  onClick={() => setStep("rating")}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mx-auto"
                >
                  <ArrowLeft className="w-3 h-3" />
                  戻る
                </button>

                <div>
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-7 h-7 ${
                          s <= selectedRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    ありがとうございます！
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {starLabels[selectedRating]}とのこと、大変嬉しいです！
                  </p>
                </div>

                <div className="bg-green-50 rounded-2xl p-4">
                  <p className="text-sm text-green-700">
                    ご満足いただけて嬉しいです！
                    Googleレビューに感想を残していただけると、スタッフの励みになります。
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleGoogleRedirect}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-2xl h-12 text-sm font-semibold gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Googleレビューを書く
                  </Button>
                  <button
                    onClick={() => setStep("done")}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 py-2"
                  >
                    今回はスキップ
                  </button>
                </div>
              </div>
            )}

            {/* Done step */}
            {step === "done" && (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    ありがとうございました！
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {submitted
                      ? "ご意見を受け付けました。改善に活かしてまいります。"
                      : "またのご来店をお待ちしております。"}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-2xl p-4 text-sm text-indigo-700">
                  またのご来店をスタッフ一同お待ちしております！
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by <span className="font-medium text-indigo-400">ホシコミ</span>
        </p>
      </div>
    </div>
  );
}
