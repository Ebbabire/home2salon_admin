import spinner from "../assets/loadingSvg.svg";

const Loading = ({
  isLoading,
  width,
}: {
  isLoading: boolean;
  width?: string;
}) => {
  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center">
          <img src={spinner} alt="" className={`${width ? width : "w-44"}`} />
        </div>
      )}
    </>
  );
};

export default Loading;
