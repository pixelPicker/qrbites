type classNameProp = {
  classname?: React.HTMLAttributes<HTMLDivElement>["className"];
};

export const VegIcon = ({ classname }: classNameProp) => {
  return (
    <div
      className={
        classname + " " +
        "!p-[3px] border-green-600 border-2 flex items-center justify-center"
      }
    >
      <div className="w-2 h-2 bg-green-600 rounded-full" />
    </div>
  );
};

export const NonVegIcon = ({ classname }: classNameProp) => {
  return (
    <div
      className={
        classname + " " +
        "!p-[3px] border-red-600 border-2 flex items-center justify-center"
      }
    >
      <div className="w-2 h-2 bg-red-600 rounded-full" />
    </div>
  );
};
