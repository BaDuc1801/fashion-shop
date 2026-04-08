import { Form } from 'antd';
import { cloneElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldValues,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form';

type RenderArgs = {
  field: ControllerRenderProps<FieldValues, string>;
};

interface FormItemProps {
  name: string;
  label?: string;
  rules?: RegisterOptions;
  control?: Control<FieldValues>;
  valuePropName?: 'value' | 'checked';
  getValueFromEvent?: (...args: unknown[]) => unknown;
  children: ReactElement | ((args: RenderArgs) => ReactNode);
}

export const FormItem = ({
  name,
  label,
  rules,
  control,
  valuePropName = 'value',
  getValueFromEvent,
  children,
}: FormItemProps) => {
  const formContext = useFormContext<FieldValues>();
  const currentControl = control ?? formContext?.control;

  if (!currentControl) {
    throw new Error('FormItem requires control prop or FormProvider context.');
  }

  return (
    <Controller
      name={name as never}
      control={currentControl}
      rules={rules}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          validateStatus={fieldState.error ? 'error' : ''}
          help={fieldState.error?.message}
        >
          {typeof children === 'function'
            ? children({ field })
            : cloneElement(children as ReactElement<Record<string, unknown>>, {
                ...(children.props as Record<string, unknown>),
                [valuePropName]: field.value,
                onChange: (...args: unknown[]) => {
                  if (getValueFromEvent) {
                    field.onChange(getValueFromEvent(...args));
                    return;
                  }

                  const firstArg = args[0] as
                    | { target?: { value?: unknown; checked?: unknown } }
                    | unknown;

                  if (
                    firstArg &&
                    typeof firstArg === 'object' &&
                    'target' in (firstArg as Record<string, unknown>)
                  ) {
                    const target = (
                      firstArg as { target?: { value?: unknown; checked?: unknown } }
                    ).target;
                    field.onChange(
                      valuePropName === 'checked' ? target?.checked : target?.value,
                    );
                    return;
                  }

                  field.onChange(firstArg);
                },
              })}
        </Form.Item>
      )}
    />
  );
};
