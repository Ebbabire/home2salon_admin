import spinner from "../assets/loadingSvg.svg";

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center">
          <img src={spinner} alt="" className="w-44" />
        </div>
      )}
    </>
  );
};

export default Loading;
