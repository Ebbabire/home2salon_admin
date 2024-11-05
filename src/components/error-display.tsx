import { TbFaceIdError } from "react-icons/tb";
import { Button } from "./ui/button";

const Error = ({ error }: { error: string }) => {
  return (
    <>
      {error && (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
          <TbFaceIdError size={"24rem"} color="999999" />
          <span className="text-lg font-medium text-[#16243D] dark:text-[#fff]">
            {error}
          </span>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )}
    </>
  );
};

export default Error;
