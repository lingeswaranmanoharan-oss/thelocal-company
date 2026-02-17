import SalaryComponentForm from '../../../features/masters/components/salary-component/SalaryComponentForm';
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import { icons } from '../../../Utils/constants';

const SalaryComponentFormPage = () => {

    useBreadcrumbs([
        {
            icon: icons.masters,
            path: '/masters/employement-types',
        },
        {
            label: 'Salary Component',
            path: '/salary-component/add-salary-component',
        },
    ]);

    return (
        <div className="p-5">
            <Breadcrumb />
            <SalaryComponentForm />
        </div>
    );
};

export default SalaryComponentFormPage;