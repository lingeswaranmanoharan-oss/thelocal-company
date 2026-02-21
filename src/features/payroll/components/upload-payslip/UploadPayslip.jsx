import { useRef, useState } from 'react';
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
    const currentMonth = new Date().getMonth();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = async (field, value) => {
        try {
            await uploadPayslipSchema.validateAt(field, { [field]: value });
            setErrors((prev) => ({ ...prev, [field]: '' }));
        } catch (error) {
            setErrors((prev) => ({ ...prev, [field]: error.message }));
        }
    };

    const handleFile = (file) => {
        if (!file) return;
        setSelectedFile(file);
        validateField('file', file);
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
            if (error.response) {
                const { message } = error.response.data?.error || {};
                toaster.error(message);
            } else if (error.data) {
                const { message } = error.data.error || {};
                toaster.error(message);
            }
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

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setErrors({});
        const payload = { month, year, file: selectedFile };
        try {
            await uploadPayslipSchema.validate(payload, { abortEarly: false });
        } catch (error) {
            if (error.inner) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    if (err.path) validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            }
            return;
        }

        const companyId = getCompanyId();
        setIsSubmitting(true);
        try {
            const data = await uploadPayslip(selectedFile, { companyId, month, year });
            if (data?.success) {
                toaster.success(data.message);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                toaster.error(data?.error?.message || data?.message || 'Upload failed');
            }
        } catch (err) {
            const message = err.response?.data?.message;
            toaster.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="upload-payslip pt-4">
                <div className="upload-payslip-card bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <div className="upload-payslip-header border-b border-gray-200 px-6 py-4">
                        <h1 className="text-xl font-semibold text-gray-800">Upload Payslip</h1>
                        <Button
                            type="button"
                            variant="outline"
                            size="default"
                            onClick={handleDownloadSample}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-2"
                        >
                            <Icon icon="mdi:download" className="w-5 h-5" />
                            {isDownloading ? 'Downloading...' : 'Download sample Excel'}
                        </Button>
                    </div>

                    <div className="upload-payslip-body p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Dropdown
                                label="Month"
                                items={months}
                                selectedValue={month}
                                onSelect={handleMonthSelect}
                                placeholder="Select month"
                                error={errors.month}
                            />
                            <Dropdown
                                label="Year"
                                items={yearOptions}
                                selectedValue={year}
                                onSelect={handleYearSelect}
                                placeholder="Select year"
                                error={errors.year}
                            />
                        </div>

                        <div className="upload-payslip-zone-wrapper">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload file <span className="text-red-500">*</span>
                            </label>
                            <div className='flex justify-center w-[100%]'>
                                <div
                                    className={`upload-payslip-zone w-[500px] ${selectedFile ? 'has-file' : ''} ${errors.file ? 'has-error' : ''}`}
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
                            {errors.file && <p className="mt-2 text-sm text-center text-red-600">{errors.file}</p>}
                        </div>

                        <div className="flex justify-end flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                            <Button
                                type="button"
                                variant="primary"
                                size="default"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2"
                            >
                                {isSubmitting ? 'Uploading...' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadPayslip;
