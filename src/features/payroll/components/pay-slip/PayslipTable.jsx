import { TableSkeletonRows } from "../../../../components/Table/TableSkeletonRows/TableSkeletonRows";
import { Button } from "../../../../components/Button/Button";
import { Icon } from "@iconify/react";

const PayslipTable = ({ payslips = [], isLoading = false }) => {

    if (!isLoading && payslips.length === 0) {
        return <div className="bg-white p-10 text-center">No Payslips Found</div>;
    }

    return (
        <div className="w-full bg-white border rounded-md">
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-sm font-semibold text-gray-800">
                    Employee Salary List
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead className="bg-gray-200 text-gray-600 uppercase">
                        <tr>
                            <th className="px-3 py-2">
                                <input type="checkbox" />
                            </th>
                            <th className="px-3 py-2 text-left">Emp ID</th>
                            <th className="px-3 py-2 text-left">Name</th>
                            <th className="px-3 py-2 text-left">contact</th>
                            {/* <th className="px-3 py-2 text-left">Designation</th> */}
                            <th className="px-3 py-2 text-left">Joining Date</th>
                            {/* <th className="px-3 py-2 text-left">Salary</th> */}
                            {/* <th className="px-3 py-2 text-right">Payslip</th> */}
                            {/* <th className="px-3 py-2 text-center">Actions</th> */}
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {isLoading ? (
                            <TableSkeletonRows rows={10} columns={9} />
                        ) : (
                            payslips.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-3 py-2">{emp.employeeId}</td>

                                    <td className="px-3 py-2 flex items-center gap-2">
                                        <img
                                            src={emp.avatar || "https://i.pravatar.cc/40"}
                                            className="w-8 h-8 rounded-full"
                                            alt=""
                                        />
                                        <div>
                                            <div className="font-medium text-gray-800">
                                                {emp.employeeName}
                                            </div>
                                            <div className="text-gray-500 text-[10px]">
                                                {emp.department}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-3 py-2">
                                        <div className="text-gray-800">{emp.contact}</div>
                                        <div className="text-[10px] text-gray-500">{emp.email}</div>
                                    </td>

                                    {/* <td className="px-3 py-2">
                                        <select className="border rounded px-2 py-1 text-xs">
                                            <option>{emp.department}</option>
                                            <option>Finance</option>
                                            <option>Developer</option>
                                            <option>Manager</option>
                                        </select>
                                    </td> */}

                                    <td className="px-3 py-2">{emp.joiningDate}</td>
                                    {/* <td className="px-3 py-2 font-medium">{emp.salary}</td> */}
                                    {/* 
                                    <td className="px-3 py-2 text-right">
                                        <Button size="sm" variant="dark">
                                            Generate
                                        </Button>
                                    </td> */}
                                    {/* <td className="px-3 py-2 text-center space-x-2">
                                        <button
                                            onClick={() => onEdit(emp)}
                                            className="text-black"
                                        >
                                            <Icon icon="mdi:pencil" width="18" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(emp.id)}
                                            className="text-black"
                                        >
                                            <Icon icon="mdi:delete" width="18" />
                                        </button>

                                    </td> */}
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};


export default PayslipTable;
