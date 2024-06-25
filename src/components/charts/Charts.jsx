import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { GetDashboard } from "../../utils/FetchChartDashboard";
import { Oval } from "react-loader-spinner";

const Chart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GetDashboard()
      .then((res) => {
        const { label, jumlah, jumlahkeluar } = res.data.surat_per_hari;
        const transformedData = label.map((day, index) => ({
          name: day,
          letters: parseInt(jumlah[index], 10),
          lettersOut: parseInt(jumlahkeluar[index], 10)
        }));
        setData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="col-span-3 p-1 max-h-[360px]">
      <p className="text-xl font-semibold leading-[30px]">Statistik</p>
      <div className="flex justify-between">
        <p className="text-sm text-[#777980]">Persuratan dalam seminggu</p>
        <div className="flex gap-4">
          <div className="flex gap-[6px]">
            <div className="w-3 h-3 rounded-full bg-secondary my-auto" />
            <p className="text-xs font-medium text-[#667085] my-auto">
              Surat Masuk
            </p>
          </div>
          <div className="flex gap-[6px]">
            <div className="w-3 h-3 rounded-full bg-tertiary my-auto" />
            <p className="text-xs font-medium text-[#667085] my-auto">
              Surat keluar
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="flex justify-center items-center"
          style={{ height: "50vh" }}
        >
          <Oval
            visible={true}
            height="50"
            width="50"
            color="#3B6F9E"
            secondaryColor="#9CA3AF"
            ariaLabel="oval-loading"
          />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 25, right: 45, left: 10, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="letters"
              stroke="#3B6F9E"
              name="Surat Masuk"
            />
            <Line
              type="monotone"
              dataKey="lettersOut"
              stroke="#FFA500"
              name="Surat Keluar"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;
