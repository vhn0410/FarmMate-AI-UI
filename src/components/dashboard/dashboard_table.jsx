import { BadgeInfo} from "lucide-react";

export const CustomTable = ({topProducts}) => {
    return (
        <div className="card">
            <div className="card-header">
                <p className="card-title">Monitoring history</p>
            </div>
            <div className="card-body p-0">
                <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                    <table className="table">
                        <thead className="table-header">
                            <tr className="table-row">
                                <th className="table-head">#</th>
                                <th className="table-head">N</th>
                                <th className="table-head">P</th>
                                <th className="table-head">K</th>
                                <th className="table-head">pH</th>
                                <th className="table-head">EC</th>
                                <th className="table-head">temperature</th>
                                <th className="table-head">humidity</th>
                                <th className="table-head flex justify-center items-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="table-body">
                            {topProducts.map((product) => (
                                <tr key={product.number} className="table-row">
                                    <td className="table-cell">{product.number}</td>
                                    <td className="table-cell">${product.price}</td>
                                    <td className="table-cell">${product.price}</td>
                                    <td className="table-cell">${product.price}</td>
                                    <td className="table-cell">${product.price}</td>
                                    <td className="table-cell">${product.price}</td>
                                    <td className="table-cell">${product.price}</td>
                                    <td className="table-cell">${product.price}</td>
                                    
                                    <td className="table-cell">
                                        <div className="flex items-center gap-x-4 justify-center">
                                            <button className="text-blue-500 dark:text-blue-600">
                                                <BadgeInfo size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
