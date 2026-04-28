interface Props {
  label: string;
  value: number | string;
}

export default function MetricsStatCard({ label, value }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold font-serif">{value}</p>
    </div>
  );
}
