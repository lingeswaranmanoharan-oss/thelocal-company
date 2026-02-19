import { TableSkeletonRows } from "../../../../components/Table/TableSkeletonRows/TableSkeletonRows"
import { Button } from "../../../../components/Button/Button"
import { Icon } from '@iconify/react';

const PayslipTable = ({
    payslips = [],
    isLoading = false,
    onEdit,
    onView
}) => {

    if (payslips.length === 0 && !isLoading) {
        return (
            <div className="bg-white p-10 text-center">
                No Payslips Found
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="bg-white shadow-sm border-t border-b border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">

                        {/* HEADER */}
                        <thead className="bg-[#e5e7eb] border-b border-gray-200">
                            <tr>
                                <th className="sticky left-0 z-10 bg-[#e5e7eb] px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">
                                    Employee Name
                                </th>

                                <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">
                                    Employee ID
                                </th>

                                <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">
                                    Department
                                </th>

                                <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">
                                    Month
                                </th>

                                <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">
                                    Net Salary
                                </th>

                                <th className="px-4 py-2 text-right text-[10px] font-medium text-gray-500 uppercase">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <TableSkeletonRows rows={10} columns={6} />
                            ) : (
                                payslips.map((p) => (
                                    <tr key={p.id}>

                                        <td className="sticky left-0 bg-white px-4 py-2 text-xs">
                                            {p.employeeName || '--'}
                                        </td>

                                        <td className="px-4 py-2 text-xs">
                                            {p.employeeId || '--'}
                                        </td>

                                        <td className="px-4 py-2 text-xs">
                                            {p.department || '--'}
                                        </td>

                                        <td className="px-4 py-2 text-xs">
                                            {p.month || '--'}
                                        </td>

                                        <td className="px-4 py-2 text-xs">
                                            {p.netSalary || '--'}
                                        </td>

                                        <td className="px-4 py-2 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit?.(p)}
                                                type="button"
                                            >
                                                <Icon icon="mdi:pencil-outline" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onView?.(p)}
                                                type="button"
                                            >
                                                <Icon icon="mdi:eye-outline" />
                                            </Button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default PayslipTable
