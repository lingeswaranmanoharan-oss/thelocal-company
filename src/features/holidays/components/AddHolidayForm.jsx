import React ,{forwardRef,useImperativeHandle}from 'react';
import { Input } from '../../../components/Input/Input';
import { Button } from '../../../components/Button/Button';
import { useForm, Watch } from 'react-hook-form';
import { Toggle } from '../../../components/Toggle/Toggle';
import { apiStatusConstants } from '../../../utils/enum';
import toaster from '../../../services/toasterService';
import { addHoliday, updateHoliday } from '../services/services';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DateInput from '../../../components/DateInput/DateInput';

const schema = yup.object({
  holidayName: yup.string().required('Title Required'),
//   weekdayName: yup.string().required(' Required'),
  holidayDate: yup.string().required('Date Required'),
});

const getWeekdayName = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
  });
};

const AddHolidayForm = ({ onClose, getHolidaysCalender, editData, isEditMode,setApiStatus },ref) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      optionalFlag: false,
    },
  });

  const onSubmit = async (data) => {
    
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = isEditMode ? await updateHoliday(editData.id, data) : await addHoliday(data);
      if (response.success) {
        setApiStatus(apiStatusConstants.success);
        toaster.success(response?.message);
        reset();
        onClose();
        getHolidaysCalender();
      } else {
        setApiStatus(apiStatusConstants.failure);
        toaster.error(response.message);
      }
    } catch (error) {
      // console.log(error.response.data?.error)
      setApiStatus(apiStatusConstants.failure);
      console.log(error);
      toaster.error(error.response?.data?.error?.message||error?.data?.error?.message);
    }
  };

  const selectedDate = watch('holidayDate');

  React.useEffect(() => {
    if (editData) {
      reset(editData);
    }
  }, [editData]);

  React.useEffect(() => {
    if (selectedDate) {
      const weekday = getWeekdayName(selectedDate);

      setValue('weekdayName', weekday);
    }
  }, [selectedDate, setValue]);

  const handleDateChange=(value)=>{
    console.log(value)
    setValue('holidayDate',value)
    trigger('holidayDate')
  }

  useImperativeHandle(ref,()=>({
    submitForm:()=>handleSubmit(onSubmit)(),
  }))

  return (
    <form  className="bg-white p-4 ">
      <section className="flex flex-col gap-3 mb-4">
        <Input label="Title" {...register('holidayName')} error={errors.holidayName?.message} />
        <DateInput
        label="Date"
        format="DD-MM-YYYY"
        handleChange={handleDateChange}
        value={watch('holidayDate')}
         error={errors.holidayDate?.message}
        />
        <Input
          label="Weekday Name"
          {...register('weekdayName')}
          error={errors.weekdayName?.message}
          disabled={true}
        />
        <Toggle
          label="Optional"
          error={errors.optionalFlag?.message}
          {...register('optionalFlag')}
        />
      </section>
      
    </form>
  );
};

export default forwardRef(AddHolidayForm);
