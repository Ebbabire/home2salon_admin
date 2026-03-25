import { TbFaceIdError } from "react-icons/tb";
import { Button } from "./ui/button";

const Error = ({ error, size }: { error: Error | null; size?: string }) => {
  return (
    <>
      {error && (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <div className="rounded-2xl bg-muted/50 p-6">
            <TbFaceIdError size={size || "5rem"} className="text-muted-foreground/50" />
          </div>
          <span className="text-base font-medium text-foreground">
            {error.message}
          </span>
          <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
        </div>
      )}
    </>
  );
};

export default Error;
