export const Skeleton = () => {
  return (
    <div className="*:m-2">
      <Skeleton className="w-[220px] h-[220px]" />
      <div className="flex justify-evenly pb-3">
        <Skeleton className="w-[100px] h-[62px]" />
        <Skeleton className="w-[100px] h-[62px]" />
      </div>
    </div>
  );
};
