import { Controller } from 'react-hook-form';
import { Select as SelectAnt } from 'antd';
import { Label } from './Label';

export const Select = (props) => {
  const { control, name, label, id, rules, ...rest } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Label label={label} id={id}>
          <SelectAnt status={error ? 'error' : ''} {...field} {...rest} id={id} />
        </Label>
      )}
      rules={rules}
    />
  );
};
