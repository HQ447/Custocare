function AnalyticsCard({ label, value }) {
  return (
    <div className="p-4 bg-white rounded shadow-md text-center">
      <p className="text-gray-600">{label}</p>
      <p className="text-2xl font-semibold text-blue-600">{value ?? 0}</p>
    </div>
  );
}

export default AnalyticsCard;
