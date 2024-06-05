import { RobotOutlined } from '@ant-design/icons';

export const EmptyState = (props) => {
  const { text } = props;
  return (
    <div className="px-6 py-10 w-full flex flex-col items-center gap-8 border rounded-md bg-white">
      <div>
        <RobotOutlined className="text-7xl text-slate-500" />
      </div>
      <div className="text-center">
        <span className="text-2xl font-light text-slate-500">{text}</span>
      </div>
    </div>
  );
};
