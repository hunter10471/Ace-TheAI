interface TagPillProps {
    type: "category" | "difficulty";
    value: string;
    className?: string;
}

export default function TagPill({ type, value, className = "" }: TagPillProps) {
    const getTagColor = (type: "category" | "difficulty", value: string) => {
        if (type === "category") {
            switch (value.toLowerCase()) {
                case "technical":
                    return "bg-[#F3CD7D] text-[#4A4A4A]";
                case "behavioral":
                    return "bg-[#92C3FA] text-[#4A4A4A]";
                case "situational":
                    return "bg-[#F3AF7D] text-[#4A4A4A]";
                case "mock":
                    return "bg-[#ABF5A4] text-[#4A4A4A]";
                default:
                    return "bg-[#F3CD7D] text-[#4A4A4A]";
            }
        } else {
            switch (value.toLowerCase()) {
                case "novice":
                    return "bg-[#ABF5A4] text-[#4A4A4A]";
                case "advanced":
                    return "bg-[#D1A4F5] text-[#4A4A4A]";
                case "hard":
                    return "bg-[#F5A4A4] text-[#4A4A4A]";
                default:
                    return "bg-[#ABF5A4] text-[#4A4A4A]";
            }
        }
    };

    return (
        <span
            className={`px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm ${getTagColor(
                type,
                value
            )} ${className}`}
        >
            {value}
        </span>
    );
}
