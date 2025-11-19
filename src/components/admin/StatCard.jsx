import React from "react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  changeType = "positive",
  color = "blue",
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-500",
    purple: "bg-purple-100 text-purple-500",
    pink: "bg-pink-100 text-pink-500",
    green: "bg-green-100 text-green-500",
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {change && (
            <p
              className={`text-sm mt-2 ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}
            >
              {changeType === "positive" ? "↑" : "↓"} {change}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
