import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../../hooks/use-theme";
import { useEffect, useState } from "react";
import { overviewData } from "../../constants";


export const CustomChart = ({title, data}) => {
    const { theme } = useTheme();
    const [chartData, setChartData] = useState([]);

    useEffect(() => { 
        // console.log("data: ", data);
        data.map((item) => {
            const newData = {
                name: "Nito",
                total: item.result[0].Nito,

            }
            setChartData((prev) => [...prev, newData]);
        })
    }, [data]);
    
    return (
        <div className="card">
            <div className="card-header">
                <p className="card-title">{title}</p>
            </div>
            <div className="card-body min-h-[400px] p-0">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <Tooltip cursor={false} formatter={(value) => `$${value}`} />

                        <XAxis dataKey="name" strokeWidth={0} stroke={theme === "light" ? "#475569" : "#94a3b8"} tickMargin={6} />

                        <YAxis
                            dataKey="total"
                            strokeWidth={0}
                            stroke={theme === "light" ? "#475569" : "#94a3b8"}
                            tickFormatter={(value) => `$${value}`}
                            tickMargin={6}
                        />

                        <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
