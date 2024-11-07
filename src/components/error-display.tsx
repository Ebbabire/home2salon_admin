import { TbFaceIdError } from "react-icons/tb";
import { Button } from "./ui/button";

const Error = ({ error, size }: { error: Error | null; size?: string }) => {
  return (
    <>
      {error && (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
          <TbFaceIdError size={size || "24rem"} color="999999" />
          <span className="text-lg font-medium text-[#16243D]">
            {error.message}
          </span>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )}
    </>
  );
};

export default Error;
