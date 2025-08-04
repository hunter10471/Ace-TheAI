import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { FeedbackEntry } from "@/lib/types";
import Button from "@/components/small/Button/Button";
import TagPill from "@/components/small/TagPill/TagPill";

interface FeedbackCardProps {
    feedback: FeedbackEntry;
    onExpand: (feedback: FeedbackEntry) => void;
}

export default function FeedbackCard({
    feedback,
    onExpand,
}: FeedbackCardProps) {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) =>
            i < rating ? (
                <IoIosStar key={i} className="w-4 h-4 text-[#FFB61D]" />
            ) : (
                <IoIosStarOutline
                    key={i}
                    className="w-4 h-4 text-[#2D2D2D] opacity-70"
                />
            )
        );
    };

    return (
        <div className="flex flex-col justify-between bg-white rounded-2xl border border-black p-4 h-80">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">{feedback.date}</span>
                <TagPill type="category" value={feedback.category} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {feedback.title}
            </h3>

            <div className="flex items-center mb-3">
                {renderStars(feedback.rating)}
            </div>

            <div className="mb-4 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Summary
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {feedback.summary}
                </p>
            </div>

            <Button
                text="Expand"
                type="primary"
                htmlButtonType="button"
                action={() => onExpand(feedback)}
            />
        </div>
    );
}
