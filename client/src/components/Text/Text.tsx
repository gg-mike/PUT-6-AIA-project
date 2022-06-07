type TextProps = {
  className?: string;
  children: any;
};

const Text = ({ className, children }: TextProps) => {
  return (
    <p className={`Text ${className ? className : ""}`} style={{ whiteSpace: "pre-wrap" }}>
      {children}
    </p>
  );
};

export default Text;
