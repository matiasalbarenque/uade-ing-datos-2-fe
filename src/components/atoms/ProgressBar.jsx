import { Progress as ProgressAnt } from 'antd';
import { Label } from './Label';

export const ProgressBar = (props) => {
  const { label, id, ...rest } = props;
  return (
    <Label label={label} id={id}>
      <ProgressAnt {...rest} id={id} />
    </Label>
  );
};
