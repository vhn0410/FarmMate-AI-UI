import { TrendingUp } from "lucide-react";
import { unit } from "../../constants/unit_measurement";
export const CustomCard = ({ icon, title, value, resultTime }) => {
    return (
        <div className="card">
            <div className="card-header flex flex-row gap-x-5">
                <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                    <img src={icon} alt="Nito" className="h-6 w-6" />
                </div>
                <p className="card-title font-bold">{title}</p>
            </div>
            <div className="card-body min-h-[150px] items-center justify-center gap-y-4 bg-slate-100 transition-colors dark:bg-slate-950">
                <p className="text-3xl font-bold text-blue-900 transition-colors dark:text-slate-50">{value} {unit[title]}</p>
                <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                    {resultTime}
                </span>
            </div>
        </div>
    );
};
