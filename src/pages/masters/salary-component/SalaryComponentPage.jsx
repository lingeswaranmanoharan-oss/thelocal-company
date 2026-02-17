import SalaryComponentList from "../../../features/masters/components/salary-component/SalaryComponentList"
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import { icons } from '../../../Utils/constants';
import { Button } from "../../../components/Button/Button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const SalaryComponentListPage = () => {

    const navigate = useNavigate();

    useBreadcrumbs([
        {
            icon: icons.masters,
            path: '/masters/employement-types',
        },
        {
            label: 'Salary Component',
            path: '/salary-component',
        },
    ]);

    const handleAddSalaryComponent = () => {
       navigate('/masters/salary-component/add-salary-component');
    };

    return (
        <div className="p-6">
            <div className='flex justify-between items-center mb-3'>
                <Breadcrumb />
                <Button type='button' className='text-sm' variant='primary'
                    onClick={handleAddSalaryComponent}>
                    <Icon icon="ic:baseline-plus" className="w-5 h-5" />
                    Add Salary Component</Button>
            </div>
            <div className="shadow-[0_1px_1px_#0003]">
                <SalaryComponentList />
            </div>

        </div>
    )
}

export default SalaryComponentListPage