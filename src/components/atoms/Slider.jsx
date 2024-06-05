import { Controller } from 'react-hook-form';
import { Slider as SliderAnt } from 'antd';
import { Label } from './Label';

export const Slider = (props) => {
  const { control, name, id, rules, label, ...rest } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Label label={label} id={id}>
          <SliderAnt {...field} {...rest} id={id} />
        </Label>
      )}
      rules={rules}
    />
  );
};
