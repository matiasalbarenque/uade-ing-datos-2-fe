import { Controller } from 'react-hook-form';
import { Input as InputAnt } from 'antd';
import { Label } from './Label';

export const Input = (props) => {
  const { control, name, label, id, rules, ...rest } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Label label={label} id={id}>
          <InputAnt status={error ? 'error' : ''} {...field} {...rest} id={id} />
        </Label>
      )}
      rules={rules}
    />
  );
};
