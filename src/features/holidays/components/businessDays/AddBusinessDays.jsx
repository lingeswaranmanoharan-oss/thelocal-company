import React, { useState } from 'react';
import DateInput from '../../../../components/DateInput/DateInput';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../../../components/Button/Button';
import { Input } from '../../../../components/Input/Input';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';
import { apiStatusConditions } from '../../../../utils/functions';
import { apiStatusConstants } from '../../../../Utils/enum';
import { addBusinessDays, updateBusinessDays } from '../../services/services';
import toaster from '../../../../services/toasterService';
import dayjs from 'dayjs';

const schema = yup.object({
  year: yup
    .number()
    .transform((_, val) => (val === '' ? undefined : Number(val)))
    .typeError('Year must be a number')
    .required('Year is required'),
  month: yup.number().typeError('Month must be a number').required('Month is required'),
  workingDays: yup
    .number()
    .transform((_, value) => (value === '' ? undefined : Number(value)))
    .typeError('Only numbers allowed')
    .required('Working days required')
    .max(25, 'Max working days 25 only'),
});

const AddBusinessDays = ({ onClose, getBusinessDays, months, editData, isEditMode }) => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleYearChange = (_, year) => {
    setValue('year', Number(year), {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data) => {
    console.log(data);
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = isEditMode
        ? await updateBusinessDays(editData.id, data)
        : await addBusinessDays(data);
      console.log(response);
      if (response.success) {
        setApiStatus(apiStatusConstants.success);
        toaster.success(response?.message);
        onClose();
        getBusinessDays();
      } else {
        setApiStatus(apiStatusConstants.failure);
        toaster.error(response.message);
      }
    } catch (error) {
      console.log(error);
      setApiStatus(apiStatusConstants.failure);
      console.log(error);
      toaster.error(error.response?.data?.error?.message || error?.data?.error?.message);
    }
  };

  const handlemonthSelect = (month) => {
    // console.log(month);
    setValue('month', month);
    trigger('month');
  };

  React.useEffect(() => {
    if (editData) {
      reset(editData);
    }
  }, [editData]);

  const today = dayjs();
  const currentYear = today.year();
  const currentMonth = today.month() + 1; // dayjs month is 0-based

  const selectedYear = watch('year');

  const filteredMonths = React.useMemo(() => {
    if (!selectedYear) return months;

    if (selectedYear < currentYear) return months;

    if (selectedYear === currentYear) {
      return months.filter((m) => m.value <= currentMonth);
    }
    return [];
  }, [selectedYear, months]);

  React.useEffect(() => {
    const selectedMonth = watch('month');

    if (selectedYear === currentYear && selectedMonth > currentMonth) {
      setValue('month', undefined);
    }
  }, [selectedYear]);

  return (
    <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
      <section className="flex flex-col gap-3 mb-4">
        <DateInput
          label="Select Year"
          format="YYYY"
          views={['year']}
          handleChange={handleYearChange}
          value={watch('year') ? dayjs().year(watch('year')) : null}
          error={errors?.year?.message}
          maxDate={dayjs()}
        />
        <Dropdown
          label="Select month"
          items={filteredMonths}
          onSelect={handlemonthSelect}
          selectedValue={watch('month')}
          error={errors?.month?.message}
        />
        <Input
          label="Working Days"
          {...register('workingDays')}
          error={errors?.workingDays?.message}
        />
      </section>
      <div className="flex">
        <Button
          type="submit"
          className="ml-auto"
          disabled={apiStatus === apiStatusConstants.inProgress}
        >
          {apiStatus === apiStatusConstants.inProgress ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default AddBusinessDays;
