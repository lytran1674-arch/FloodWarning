import { Button } from "./Button";

interface PeopleCounterProps {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  children?: React.ReactNode;
}

export default function Counter({
  value,
  children,
  onIncrease,
  onDecrease,
}: PeopleCounterProps) {
  return (
    <>
 
      {children && <p>{children}</p>}
      <div className="flex justify-center items-center lg:gap-10 ">
        <Button onClick={onDecrease} className="border border-black rounded-md text-xl lg:w-16 sm:w-12 w-11">-</Button>

        <span className="text-black">{value}</span>

        <Button onClick={onIncrease} className="border border-black rounded-md text-xl lg:w-16 sm:w-12 w-11">+</Button>
      </div>
    </>
  );
}