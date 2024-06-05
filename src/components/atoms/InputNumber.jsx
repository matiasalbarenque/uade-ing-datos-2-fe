import { Controller } from 'react-hook-form';
import { InputNumber as InputNumberAnt } from 'antd';
import { Label } from './Label';

export const InputNumber = (props) => {
  const { control, name, label, id, rules, ...rest } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Label label={label} id={id}>
          <InputNumberAnt status={error ? 'error' : ''} {...field} {...rest} id={id} />
        </Label>
      )}
      rules={rules}
    />
  );
};
