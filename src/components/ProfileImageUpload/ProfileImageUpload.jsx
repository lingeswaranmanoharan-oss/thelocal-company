import { useRef, useState } from 'react';
import toaster from '../../services/toasterService';
import { imageUpload } from '../../features/services/commonService';
import { apiStatusConstants } from '../../utils/enum';

const Loader = () => (
  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
);

const ProfileImageUpload = ({
  title = 'Profile Picture',
  helperText = 'JPG, GIF or PNG. Max size of 2MB.',
  value,
  onChange,
  size = 96,
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const maxSize = 2 * 1024 * 1024;
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const handleFileChange = async (e) => {
    try {
      setApiStatus(apiStatusConstants.inProgress);

      const file = e.target.files?.[0];
      if (!file) {
        setApiStatus(apiStatusConstants.initial);
        return;
      }

      if (file.size > maxSize) {
        toaster.warning('File too large. Max size is 2MB');
        setApiStatus(apiStatusConstants.initial);
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setApiStatus(apiStatusConstants.initial);
        toaster.warning('Unsupported file format');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await imageUpload(formData);

      if (response?.success) {
        onChange?.(response.data.imgId);
        toaster.success(response.message);
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

  const isUploading = apiStatus === apiStatusConstants.inProgress;

  return (
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <div
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        className={`relative rounded-full border-2 border-dashed flex items-center justify-center
          ${
            disabled || isUploading
              ? 'opacity-60 cursor-not-allowed'
              : 'cursor-pointer hover:border-orange-500'
          }
        `}
        style={{ width: size, height: size }}
      >
        {/* Image */}
        {value && (
          <img src={value} alt="Profile" className="w-full h-full rounded-full object-cover" />
        )}

        {/* Upload text */}
        {!value && !isUploading && <span className="text-sm text-gray-400">Upload</span>}

        {/* Loader */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
            <Loader />
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        <span className="text-xs text-gray-500">{helperText}</span>
      </div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </div>
  );
};

export default ProfileImageUpload;
