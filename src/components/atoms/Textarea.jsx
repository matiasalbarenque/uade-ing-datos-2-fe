import { Controller } from 'react-hook-form';
import { Input as InputAnt } from 'antd';
import { Label } from './Label';

export const TextArea = (props) => {
  const { control, name, label, id, rules, rows = 5, ...rest } = props;
  const { TextArea: TextAreaAnt } = InputAnt;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Label label={label} id={id}>
          <TextAreaAnt status={error ? 'error' : ''} {...field} {...rest} rows={rows} id={id} />
        </Label>
      )}
      rules={rules}
    />
  );
};
