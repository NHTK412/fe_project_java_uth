import React from "react";

const QuickLinkCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  gradient,
}) => {
  const gradientClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${gradientClasses[gradient]} rounded-lg shadow p-6 text-white cursor-pointer hover:shadow-lg transition`}
    >
      <Icon size={32} className="mb-3" />
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-sm opacity-90 mt-2">{description}</p>
      <p className="text-2xl font-bold mt-3">→</p>
    </div>
  );
};

export default QuickLinkCard;
