import { useRef, useState, useEffect } from 'react';
import * as yup from 'yup';
import { Icon } from '@iconify/react';
import { Breadcrumb } from '../../../../components/Breadcrumb/Breadcrumb';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';
import { Button } from '../../../../components/Button/Button';
import { icons, MONTHS } from '../../../../Utils/constants';
import toaster from '../../../../services/toasterService';
import { getCompanyId } from '../../../../Utils/functions';
import { getPayslipTemplate, uploadPayslip } from '../../services/services';
import './UploadPayslip.scss';

const uploadPayslipSchema = yup.object().shape({
    month: yup
        .number()
        .nullable()
        .required('Please select a month')
        .min(1, 'Please select a valid month')
        .max(12, 'Please select a valid month'),
    year: yup
        .number()
        .nullable()
        .required('Please select a year')
        .integer('Please select a valid year'),
    file: yup
        .mixed()
        .nullable()
        .required('Please upload a file')
        .test(
            'fileType',
            'Please upload a valid .xlsx file',
            (value) => !value || (value instanceof File && value.name.endsWith('.xlsx'))
        ),
});

const months = MONTHS

const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    const numberOfYears = [0, 1, 2, 3, 4, 5];
    numberOfYears.forEach((i) => {
        const lastFiveYears = currentYear - i;
        years.push({ value: lastFiveYears, label: lastFiveYears });
    });
    return years;
};

const yearOptions = getYearOptions();

const UploadPayslip = () => {

    const fileInputRef = useRef(null);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    const monthOptions = months.map((eachMonth) => ({
        ...eachMonth,
        disabled: year > currentYear ? true : year === currentYear ? eachMonth.value > currentMonth : false,
    }));

    useEffect(() => {
        if (year === currentYear && month > currentMonth) {
            setMonth(currentMonth);
        }
    }, [year, month, currentYear, currentMonth]);

    const validateField = async (field, value) => {
        try {
            await uploadPayslipSchema.validateAt(field, { [field]: value });
            setErrors((prev) => ({ ...prev, [field]: '' }));
        } catch (error) {
            setErrors((prev) => ({ ...prev, [field]: error.message }));
        }
    };

    const handleFile = async (file) => {
        if (!file) return;
        setSelectedFile(file);
        validateField('file', file);

        const companyId = getCompanyId();
        setIsSubmitting(true);
        try {
            const data = await uploadPayslip(file, { companyId, month, year });
            if (data?.success) {
                toaster.success(data.message);
                setUploadResult(data);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                toaster.error(data?.error?.message);
            }
        } catch (error) {
            const message = error?.data?.message;
            toaster.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        validateField('file', null);
    };

    const handleDownloadSample = async () => {
        const companyId = getCompanyId();
        setIsDownloading(true);
        try {
            const data = await getPayslipTemplate({ companyId, month, year });
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Payslip_Template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toaster.success('Template downloaded');
        } catch (error) {
            const message = error?.data?.message;
            toaster.error(message);
        }
        finally {
            setIsDownloading(false);
        }
    };

    const handleMonthSelect = (value) => {
        setMonth(value);
        validateField('month', value);
    };

    const handleYearSelect = (value) => {
        setYear(value);
        validateField('year', value);
    };


    return (
        <>
            <div className="upload-payslip pt-4">
                <div className="upload-payslip-card bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <div className="upload-payslip-header border-b border-gray-200 px-6 py-4">
                        <h1 className="text-xl font-semibold text-gray-800">Upload Payslip</h1>
                    </div>

                    <div className="upload-payslip-body p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Dropdown
                                label="Year"
                                items={yearOptions}
                                selectedValue={year}
                                onSelect={handleYearSelect}
                                placeholder="Select year"
                                error={errors.year}
                            />
                            <Dropdown
                                label="Month"
                                items={monthOptions}
                                selectedValue={month}
                                onSelect={handleMonthSelect}
                                placeholder="Select month"
                                error={errors.month}
                            />
                        </div>

                        {!uploadResult ? (
                            <div className="upload-payslip-zone-wrapper">
                                <div className="upload-payslip-row grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        className={`upload-payslip-zone upload-payslip-zone-download flex-1 ${isDownloading ? 'is-disabled' : ''}`}
                                        onClick={() => !isDownloading && handleDownloadSample()}
                                        role="button"
                                        tabIndex={isDownloading ? -1 : 0}
                                        onKeyDown={(e) => {
                                            if (!isDownloading && (e.key === 'Enter' || e.key === ' ')) {
                                                e.preventDefault();
                                                handleDownloadSample();
                                            }
                                        }}
                                        aria-disabled={isDownloading}
                                    >
                                        <Icon icon={icons.downloadExcel} className="upload-payslip-icon" />
                                        <p className="upload-payslip-text">
                                            {isDownloading
                                                ? 'Downloading...'
                                                : (() => {
                                                    const monthLabel = months.find((m) => m.value === month)?.label;
                                                    return monthLabel && year
                                                        ? `Download template for ${monthLabel} ${year}`
                                                        : 'Download template';
                                                })()}
                                        </p>
                                        <p className="upload-payslip-sub">Click to get the template</p>
                                    </div>
                                    <div
                                        className={`upload-payslip-zone flex-1 ${selectedFile ? 'has-file' : ''} ${errors.file ? 'has-error' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onClick={handleUploadClick}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleUploadClick();
                                            }
                                        }}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept=".xlsx"
                                            onChange={handleFileChange}
                                        />
                                        {selectedFile ? (
                                            <div className="upload-payslip-file-info">
                                                <Icon icon="mdi:file-document-outline" className="upload-payslip-file-icon" />
                                                <span className="upload-payslip-file-name">{selectedFile.name}</span>
                                                <button
                                                    type="button"
                                                    className="upload-payslip-remove"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveFile();
                                                    }}
                                                    aria-label="Remove file"
                                                >
                                                    <Icon icon="mdi:close-circle" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Icon icon={icons.uploadExcel} className="upload-payslip-icon" />
                                                <p className="upload-payslip-text">Drag & drop your file here</p>
                                                <p className="upload-payslip-sub">or click to browse (.xlsx)</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                    {uploadResult.data && (
                                        <div className="upload-payslip-summary flex flex-wrap items-center gap-4 text-sm">
                                            <span className="upload-payslip-status upload-payslip-status-total">Total records: {uploadResult.data.totalRecords ?? 0}</span>
                                            <span className="upload-payslip-status upload-payslip-status-success">Success: {uploadResult.data.successCount ?? 0}</span>
                                            <span className="upload-payslip-status upload-payslip-status-failed">Failed: {uploadResult.data.failureCount ?? 0}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap items-center gap-3 ml-auto">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="sm"
                                            onClick={handleUploadClick}
                                            disabled={isSubmitting}
                                            className="inline-flex items-center gap-2"
                                        >
                                            <Icon icon={icons.uploadExcel} className="w-5 h-5" />
                                            {isSubmitting ? 'Uploading...' : 'Upload'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownloadSample}
                                            disabled={isDownloading}
                                            className="inline-flex items-center gap-2"
                                        >
                                            <Icon icon={icons.downloadExcel} className="w-5 h-5" />
                                            {isDownloading ? 'Downloading...' : 'Download template'}
                                        </Button>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".xlsx"
                                    onChange={handleFileChange}
                                />
                                <div className="upload-payslip-results">
                                    {uploadResult.data && (
                                        <>
                                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                                <table className="upload-payslip-table min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="upload-payslip-th">Employee ID</th>
                                                            <th className="upload-payslip-th">Employee Name</th>
                                                            <th className="upload-payslip-th">Status</th>
                                                            <th className="upload-payslip-th">Message</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {(uploadResult.data.results || []).map((row, idx) => (
                                                            <tr key={row.employeeId || idx} className="upload-payslip-tr">
                                                                <td className="upload-payslip-td">{row.employeeId ?? '—'}</td>
                                                                <td className="upload-payslip-td">{row.employeeName ?? '—'}</td>
                                                                <td className="upload-payslip-td">
                                                                    <span className={`upload-payslip-status upload-payslip-status-${(row.status || '').toLowerCase()}`}>
                                                                        {row.status ?? '—'}
                                                                    </span>
                                                                </td>
                                                                <td className="upload-payslip-td upload-payslip-td-message">{row.message ?? '—'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadPayslip;
