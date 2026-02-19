import { forwardRef, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import toaster from '../../services/toasterService';
import { apiStatusConstants } from '../../utils/enum';
import { DeleteIconButton, ViewIconButton } from '../Button/Button';
import { Input } from '../Input/Input';
import { imageUpload } from '../../features/services/commonService';

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const CustomFormTextImageInput = forwardRef(
  (
    {
      label,
      numberValue,
      onNumberChange,
      fileValue,
      onFileChange,
      deleteimg,
      error,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef(null);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [showPopup, setShowPopup] = useState(false);

    const isUploading = apiStatus === apiStatusConstants.inProgress;

    const handleFileChange = async (e) => {
      try {
        setApiStatus(apiStatusConstants.inProgress);

        const file = e.target.files?.[0];
        if (!file) {
          setApiStatus(apiStatusConstants.initial);
          return;
        }

        if (file.size > MAX_SIZE) {
          toaster.warning('File too large. Max size is 2MB');
          setApiStatus(apiStatusConstants.initial);
          return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
          toaster.warning('Unsupported file format');
          setApiStatus(apiStatusConstants.initial);
          return;
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await imageUpload(formData);

        if (response?.success) {
          toaster.success(response.message);
          onFileChange?.(response.data.imgId);
          setApiStatus(apiStatusConstants.success);
        } else {
          toaster.warning(response.message || 'Upload failed');
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (err) {
        console.error(err);
        toaster.error('Something went wrong');
        setApiStatus(apiStatusConstants.failure);
      } finally {
        e.target.value = '';
      }
    };

    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: !error ? 'flex-end' : 'center',
            gap: '8px',
            width: '100%',
          }}
        >
          {/* Document Number Input */}
          <div style={{ flex: 1 }}>
            <Input
              label={label}
              value={numberValue}
              onChange={(e) => onNumberChange?.(e.target.value)}
              error={error}
              disabled={disabled}
              {...props}
            />
          </div>

          {/* View uploaded file */}
          {fileValue && (
            <ViewIconButton callBackFunction={() => window.open(fileValue, '_blank')} />
          )}

          {/* Upload / Delete */}
          {!fileValue ? (
            // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'top' }}>
            <button
              type="button"
              onClick={() => !disabled && !isUploading && inputRef.current?.click()}
              disabled={disabled || isUploading}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Icon icon="ep:upload-filled" height={22} />
            </button>
          ) : (
            // </div>
            <DeleteIconButton
              callBackFunction={() => {
                onFileChange?.('');
                deleteimg?.();
              }}
            />
          )}

          {/* Hidden File Input */}
          <input
            ref={inputRef}
            type="file"
            hidden
            accept=".png,.jpeg,.jpg,.pdf"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
          />
        </div>
      </div>
    );
  },
);

export default CustomFormTextImageInput;
