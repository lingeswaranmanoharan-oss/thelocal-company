import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { ErrorMsg } from '../Input/Input';

export default function DateInput({
  className,
  label,
  inputId,
  required,
  maxDate,
  minDate,
  placeholder = 'Select Date',
  format,
  handleChange,
  id,
  value,
  readOnly,
  error,
  views
}) {
  return (
    <div className={clsx('input-wrapper', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="input-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={value ? dayjs(value) : null}
            format={format}
            minDate={minDate ? dayjs(minDate) : null}
            maxDate={maxDate ? dayjs(maxDate) : null}
            views={views}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                InputProps: { readOnly },
                inputProps: { placeholder },
              },
            }}
            onChange={(newValue) => {
              if (!newValue) return;
              handleChange(newValue.format('YYYY-MM-DD'), newValue.format(format), id);
            }}
          />
        </LocalizationProvider>
      </div>
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  );
}
