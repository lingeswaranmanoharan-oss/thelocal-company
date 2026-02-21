import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import UploadPayslip from "../../features/payroll/components/upload-payslip/UploadPayslip";
import useBreadcrumbs from "../../hooks/useBreadCrumbs";
import { icons } from "../../Utils/constants";

const UploadPayslipPage = () => {

    useBreadcrumbs([
        {
            icon: icons.payroll,
            path: '/payroll/upload-excel',
        },
        {
            label: 'Upload Payslip',
            path: '/payroll/upload-payslip',
        },
    ]);

    return (
        <div>
            <Breadcrumb />
            <UploadPayslip />
        </div>
    )
}

export default UploadPayslipPage;