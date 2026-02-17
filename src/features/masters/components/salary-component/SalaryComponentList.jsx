import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSalaryComponent } from "../../services/services";
import { TableLoader } from "../../../../components/Table/Table";
import { Button, EditIconButton } from "../../../../components/Button/Button";
import { Icon } from "@iconify/react";

const SalaryComponentList = () => {
    const navigate = useNavigate();
    const [salaryComponent, setSalaryComponent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSalaryComponent = async () => {
        setIsLoading(true);
        try {
            const response = await getSalaryComponent();
            console.log(response)
            if (response && response.success && response.data) {
                const { data } = response;
                setSalaryComponent(data || []);
            } else {
                setSalaryComponent([]);
            }
        } catch (err) {
            setSalaryComponent([]);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchSalaryComponent();
    }, []);

    return (
        <div className="w-full">
            <div className="bg-white shadow-sm border-t border-b border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#e5e7eb] border-b border-gray-200">
                            <tr>
                                <th className="sticky left-0 z-10 bg-[#e5e7eb] shadow-[2px_0_4px_rgba(0,0,0,0.1)] px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Company Type
                                </th>
                                <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Default Percentage
                                </th>
                                <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Fixed Amount
                                </th>
                                <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Status
                                </th>
                                <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Percentage Based
                                </th>
                                <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Component Name
                                </th>
                                <th className="px-4 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <TableLoader colSpan={7} />
                            ) : !salaryComponent?.length && !isLoading ? (
                                <tr>
                                    <td className="text-xs font-medium text-center h-[50px] text-gray-600" colSpan={7}>No salary component found</td>
                                </tr>
                            ) :
                                (
                                    salaryComponent.map((eachSalary) => (
                                        <tr key={eachSalary.id}>
                                            <td className="sticky left-0 z-10 bg-white shadow-[2px_0_4px_rgba(0,0,0,0.1)] px-4 py-2 whitespace-nowrap">
                                                <span className="text-xs font-medium text-gray-900">{eachSalary.componentType || '--'}</span>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className="text-xs text-gray-600">{eachSalary.defaultPercentage}</span>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className="text-xs text-gray-600">{eachSalary.fixedAmount}</span>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className="text-xs text-gray-600">{eachSalary.active ?? '--'}</span>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className="text-xs text-gray-600">{eachSalary.percentageBased ? 'Yes' : 'No'}</span>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className="text-xs text-gray-600">{eachSalary.componentName}</span>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <EditIconButton requestedPath={`/masters/salary-component/edit-salary-component/${eachSalary.id}`} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SalaryComponentList