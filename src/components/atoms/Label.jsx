export const Label = (props) => {
  const { children, label, id } = props;
  if (label) {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id}>{label}</label>
        {children}
      </div>
    );
  }
  return children;
};
