import { Controller } from 'react-hook-form';
import { DatePicker as DatePickerAnt } from 'antd';
import { Label } from './Label';

export const DatePicker = (props) => {
  const { control, name, label, id, rules, ...rest } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Label label={label} id={id}>
          <DatePickerAnt status={error ? 'error' : ''} {...field} {...rest} id={id} />
        </Label>
      )}
      rules={rules}
    />
  );
};
