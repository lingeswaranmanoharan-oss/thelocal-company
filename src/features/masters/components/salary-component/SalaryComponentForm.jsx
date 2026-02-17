import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';
import { Toggle } from '../../../../components/Toggle/Toggle';
import { addSalaryComponent, updateSalaryComponent, getSalaryComponentById } from '../../services/services';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toaster from '../../../../services/toasterService';

const salaryComponentSchema = yup.object().shape({
    componentName: yup
        .string()
        .required('Component Name is required')
        .min(2, 'Component Name must be at least 2 characters')
        .max(100, 'Component Name must not exceed 100 characters'),
    componentType: yup
        .string()
        .required('Component Type is required'),
    percentageBased: yup.boolean().required(),
    defaultPercentage: yup
        .number()
        .nullable()
        .when('percentageBased', {
            is: true,
            then: (schema) =>
                schema
                    .required('Default Percentage is required')
                    .min(0, 'Default Percentage must be 0 or greater')
                    .max(100, 'Default Percentage must not exceed 100'),
            otherwise: (schema) => schema.nullable(),
        }),
    fixedAmount: yup
        .number()
        .nullable()
        .when('percentageBased', {
            is: false,
            then: (schema) =>
                schema
                    .required('Fixed Amount is required')
                    .min(0, 'Fixed Amount must be 0 or greater'),
            otherwise: (schema) => schema.nullable(),
        }),
    isStatic: yup.boolean().required(),
});

const SalaryComponentForm = () => {
    const navigate = useNavigate();
    const { id: componentId } = useParams();

    const getBackUrl = () => `/masters/salary-component`;

    const [formData, setFormData] = useState({
        componentName: '',
        componentType: '',
        defaultPercentage: null,
        fixedAmount: null,
        percentageBased: true,
        isStatic: true,
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(!!componentId);

    useEffect(() => {
        if (componentId) {
            const fetchData = async () => {
                setIsLoadingData(true);
                try {
                    const response = await getSalaryComponentById(componentId);
                    if (response?.success && response?.data) {
                        const entity = response.data?.data ?? response.data;
                        if (entity && typeof entity === 'object') {
                            const getNum = (val) => (val != null && val !== '' ? Number(val) : null);
                            setFormData({
                                componentName: entity.componentName ?? entity.component_name ?? '',
                                componentType: entity.componentType ?? entity.component_type ?? '',
                                defaultPercentage: getNum(entity.defaultPercentage ?? entity.default_percentage),
                                fixedAmount: getNum(entity.fixedAmount ?? entity.fixed_amount),
                                percentageBased: entity.percentageBased ?? entity.percentage_based ?? true,
                                isStatic: entity.isStatic ?? entity.is_static ?? true,
                            });
                        }
                    }
                } catch (error) {
                    const message = error.response?.data?.error?.message;
                    toaster.error(message);
                } finally {
                    setIsLoadingData(false);
                }
            };
            fetchData();
        }
    }, [componentId]);

    const validateField = async (field, value) => {
        try {
            const dataToValidate = { ...formData, [field]: value };
            await salaryComponentSchema.validateAt(field, dataToValidate);
            setErrors((prev) => ({ ...prev, [field]: '' }));
        } catch (error) {
            setErrors((prev) => ({ ...prev, [field]: error.message }));
        }
    };

    const handleChange = async (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field === 'percentageBased') {
            setErrors((prev) => ({ ...prev, defaultPercentage: '', fixedAmount: '' }));
        } else {
            await validateField(field, value);
        }
    };

    const submitSalaryComponent = async () => {
        try {
            const payload = {
                ...formData,
                defaultPercentage: formData.percentageBased ? formData.defaultPercentage : null,
                fixedAmount: formData.percentageBased ? null : formData.fixedAmount,
            };
            formData.percentageBased ? delete payload.fixedAmount : delete payload.defaultPercentage
            const response = componentId
                ? await updateSalaryComponent(componentId, payload)
                : await addSalaryComponent(payload);

            if (response?.success) {
                toaster.success(response.message);
                navigate(getBackUrl());
            }
        } catch (error) {
            const message = error.response?.data?.error?.message;
            toaster.error(message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            await salaryComponentSchema.validate(formData, { abortEarly: false });
            await submitSalaryComponent();
        } catch (error) {
            if (error.inner) {
                const validationErrors = {};
                error.inner.forEach(({ path, message }) => {
                    if (path) validationErrors[path] = message;
                });
                setErrors(validationErrors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const {
        componentName,
        componentType,
        defaultPercentage,
        fixedAmount,
        percentageBased,
        isStatic,
    } = formData;

    if (isLoadingData) {
        return (
            <div className="pt-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-center py-12">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Input
                                label="Component Name"
                                type="text"
                                value={componentName}
                                onChange={(e) => handleChange('componentName', e.target.value)}
                                error={errors.componentName}
                                required
                            />

                            <Input
                                label="Component Type"
                                type="text"
                                value={componentType}
                                onChange={(e) => handleChange('componentType', e.target.value)}
                                error={errors.componentType}
                                required
                            />

                            <Toggle
                                label="Percentage Based"
                                checked={percentageBased}
                                onChange={(e) => handleChange('percentageBased', e.target.checked)}
                                error={errors.percentageBased}
                            />
                        </div>

                        <div className="space-y-4">
                            {percentageBased ? (
                                <Input
                                    label="Default Percentage"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={defaultPercentage ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value === '' ? null : parseFloat(e.target.value);
                                        handleChange('defaultPercentage', Number.isNaN(val) ? null : val);
                                    }}
                                    error={errors.defaultPercentage}
                                    required
                                />
                            ) : (
                                <Input
                                    label="Fixed Amount"
                                    type="number"
                                    min={0}
                                    value={fixedAmount ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value === '' ? null : parseFloat(e.target.value);
                                        handleChange('fixedAmount', Number.isNaN(val) ? null : val);
                                    }}
                                    error={errors.fixedAmount}
                                    required
                                />
                            )}

                            <Toggle
                                label="Is Static"
                                checked={isStatic}
                                onChange={(e) => handleChange('isStatic', e.target.checked)}
                                error={errors.isStatic}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(getBackUrl())}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" disabled={isLoading}
                        onClick={handleSubmit} >
                            {isLoading
                                ? componentId
                                    ? 'Updating...'
                                    : 'Submitting...'
                                : componentId
                                    ? 'Update'
                                    : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SalaryComponentForm;
