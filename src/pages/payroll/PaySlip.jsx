import PayslipTable from "../../features/payroll/components/pay-slip/PayslipTable"
import { useState, useEffect } from "react";

const PaySlip = () => {

    const [payslips, setPayslips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setPayslips([
                {
                    id: 1,
                    employeeName: "Arun Kumar",
                    employeeId: "EMP101",
                    department: "IT",
                    month: "Jan 2026",
                    netSalary: "₹45,000",
                }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="p-6">
            <PayslipTable
                payslips={payslips}
                isLoading={isLoading}
                onEdit={(p) => console.log("Edit", p)}
                onView={(p) => console.log("View", p)}
            />
        </div>
    )
}

export default PaySlip
