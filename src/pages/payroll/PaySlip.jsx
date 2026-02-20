import { useState, useEffect, useRef, useCallback } from "react";
import PayslipTable from "../../features/payroll/components/pay-slip/PayslipTable";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { Pagination } from "../../components/Pagination/Pagination";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import useBreadcrumbs from "../../hooks/useBreadCrumbs";
import { Icon } from "@iconify/react";
import { useSearchParams } from "react-router-dom";
import { ITEMS_PER_PAGE_OPTIONS } from "../../utils/constants";
import { icons } from "../../utils/constants";

const PaySlip = () => {
    useBreadcrumbs([
        {
            icon: icons.payslip,
            label: '',
            path: '/payroll',
        },
        {
            label: "Pay slip",
            path: "/payroll/pay-slip",
        },
    ]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [employeeSearch, setEmployeeSearch] = useState(
        () => searchParams.get("employeeSearch") || ""
    );
    const [currentPage, setCurrentPage] = useState(
        () => parseInt(searchParams.get("page")) || 1
    );
    const [itemsPerPage, setItemsPerPage] = useState(
        () => parseInt(searchParams.get("itemsPerPage")) || 10
    );
    const [sort, setSort] = useState(searchParams.get("sort") || null);
    const [payslips, setPayslips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const fetchPayslips = async () => {
        setIsLoading(true);
        setTimeout(() => {
            const data = [
                {
                    id: 1,
                    employeeName: "Arun Kumar",
                    employeeId: "EMP101",
                    department: "IT",
                    contact: "9876543210",
                    email: "arun@gmail.com",
                    joiningDate: "10 Jan 2024",
                    salary: "₹45,000",
                    avatar: ""
                },
                {
                    id: 2,
                    employeeName: "Priya Sharma",
                    employeeId: "EMP102",
                    department: "Finance",
                    contact: "9123456780",
                    email: "priya@gmail.com",
                    joiningDate: "15 Feb 2023",
                    salary: "₹52,000",
                    avatar: ""
                },
                {
                    id: 3,
                    employeeName: "Rahul Verma",
                    employeeId: "EMP103",
                    department: "HR",
                    contact: "9988776655",
                    email: "rahul@gmail.com",
                    joiningDate: "20 Mar 2022",
                    salary: "₹40,000",
                    avatar: ""
                },
                {
                    id: 4,
                    employeeName: "Sneha Reddy",
                    employeeId: "EMP104",
                    department: "Developer",
                    contact: "9876501234",
                    email: "sneha@gmail.com",
                    joiningDate: "05 Jul 2024",
                    salary: "₹60,000",
                    avatar: ""
                },
                {
                    id: 5,
                    employeeName: "Vikram Singh",
                    employeeId: "EMP105",
                    department: "Manager",
                    contact: "9090909090",
                    email: "vikram@gmail.com",
                    joiningDate: "11 Nov 2021",
                    salary: "₹75,000",
                    avatar: ""
                },
                {
                    id: 6,
                    employeeName: "Meena Patel",
                    employeeId: "EMP106",
                    department: "Finance",
                    contact: "9012345678",
                    email: "meena@gmail.com",
                    joiningDate: "30 Aug 2020",
                    salary: "₹48,000",
                    avatar: ""
                },

            ];
            setPayslips(data);
            setTotalItems(1);
            setTotalPages(1);
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchPayslips();
    }, [currentPage, itemsPerPage, sort, employeeSearch]);
    useEffect(() => {
        const params = new URLSearchParams();
        if (employeeSearch) params.set("employeeSearch", employeeSearch);
        if (currentPage > 1) params.set("page", currentPage);
        if (itemsPerPage !== 10) params.set("itemsPerPage", itemsPerPage);
        if (sort) params.set("sort", sort);

        setSearchParams(params, { replace: true });
    }, [employeeSearch, currentPage, itemsPerPage, sort]);
    const handleSearch = (value) => {
        setEmployeeSearch(value.trim());
        setCurrentPage(1);
    };

    const itemsPerPageOptions = ITEMS_PER_PAGE_OPTIONS.map(v => ({
        value: v,
        label: v.toString(),
    }));


    return (
        <div className="p-6">
            <div className="flex justify-between mb-3">

                <Breadcrumb />
                {/* <Button variant="primary">
                    <Icon icon="ic:baseline-plus" />
                    Add Payslip
                </Button> */}
            </div>
            <div className="bg-white border rounded-md shadow-sm">
                <div className="flex justify-between items-center p-4 border-b bg-white">
                    <h2 className="text-sm font-semibold text-gray-800">
                        Employee Salary List
                    </h2>
                </div>
                <div className="flex justify-between items-center p-3 border-b">

                    <div className="flex items-center gap-2 text-sm">
                        Row Per Page
                        <Dropdown
                            items={itemsPerPageOptions}
                            selectedValue={itemsPerPage}
                            onSelect={(v) => {
                                setItemsPerPage(v);
                                setCurrentPage(1);
                            }}
                        />
                        Entries
                    </div>

                    {/* <div className="w-60">
                        <Input
                            value={employeeSearch}
                            onChange={handleSearch}
                            placeholder="Search Employee"
                        />
                    </div> */}
                </div>
                <PayslipTable
                    payslips={payslips}
                    isLoading={isLoading}
                    sort={sort}
                    onSortUpdate={setSort}
                />
                <div className="p-3 border-t bg-white">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        showItemsPerPage={false}
                    />
                </div>

            </div>
        </div>
    );

};



export default PaySlip
