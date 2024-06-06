import { TbFaceIdError } from "react-icons/tb";
import { Button } from "./ui/button";

const Error = ({ error }: { error: string }) => {
  return (
    <>
      {error && (
        <div className="flex flex-col gap-2 items-center justify-center h-[50vh]">
          <TbFaceIdError size={"24rem"} color="999999" />
          <span className="text-lg text-[#16243D] dark:text-[#fff] font-medium">
            {error}
          </span>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )}
    </>
  );
};

export default Error;
