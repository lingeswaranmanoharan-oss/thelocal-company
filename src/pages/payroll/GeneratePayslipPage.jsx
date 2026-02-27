import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb"
import GeneratePayslip from "../../features/payroll/components/generate-payslip/GeneratePayslip"
import useBreadcrumbs from "../../hooks/useBreadCrumbs";
import { icons } from "../../Utils/constants";

const GeneratePayslipPage = () => {
    const { employeeId } = useParams();

    useBreadcrumbs([
        {
            icon: icons.payroll,
            path: '/payroll/upload-excel',
        },
        {
            label: 'Payslip',
            path: '/payroll/pay-slip',
        },
        {
            label: 'Generate Payslip',
            path: '/payroll/generate-payslip',
        },
    ]);
    return (
        <div>
            <Breadcrumb />
            <GeneratePayslip employeeId={employeeId} />
        </div>
    )
}

export default GeneratePayslipPage