import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useWatch,
} from 'react-hook-form';
import { Input, InputNumber, DatePicker, Switch, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import defaultAvatar from '../../assets/default-avatar.jpg';

interface FormItemProps<T extends FieldValues, K extends Path<T>> {
  name: K;
  control: Control<T>;
  label?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'date' | 'switch' | 'upload';
  rules?: RegisterOptions<T, K>;
  placeholder?: string;
  className?: string;
  size?: 'large' | 'medium' | 'small';
}

export const FormItem = <T extends FieldValues, K extends Path<T>>({
  name,
  control,
  label,
  required,
  type = 'text',
  rules,
  placeholder,
  className,
  size = 'large',
}: FormItemProps<T, K>) => {
  const [preview, setPreview] = useState<string>('');

  const fieldValue = useWatch({ control, name });

  useEffect(() => {
    if (type === 'upload' && fieldValue) {
      setPreview(fieldValue as string);
    }
  }, [fieldValue, type]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={className}>
          {label && (
            <label className="block mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}

          {/* Text input */}
          {type === 'text' && (
            <Input {...field} placeholder={placeholder} size={size} />
          )}

          {/* Number input */}
          {type === 'number' && (
            <InputNumber {...field} className="w-full" size={size} />
          )}

          {/* Date picker */}
          {type === 'date' && (
            <DatePicker
              {...field}
              value={field.value}
              onChange={field.onChange}
              className="w-full"
              size={size}
            />
          )}

          {/* Switch */}
          {type === 'switch' && (
            <Switch checked={field.value} onChange={field.onChange} />
          )}

          {/* Upload (avatar) */}
          {type === 'upload' && (
            <div className="relative w-40 h-40 group">
              <img
                src={preview || defaultAvatar}
                alt="avatar"
                className="w-full h-full object-cover rounded-md transition-opacity duration-200 group-hover:opacity-50"
              />

              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  const url = URL.createObjectURL(file);
                  setPreview(url);
                  field.onChange(url);
                  return false;
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <CiEdit className="text-2xl" />
                </div>
              </Upload>
            </div>
          )}

          {/* Error message */}
          {fieldState.error && (
            <p className="text-red-500 mt-1">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
};
