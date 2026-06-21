import { Button } from "@heroui/react";

const AppButton = ({ isLoading, text }) => {
  return (
    <>
      <Button
        type="submit"
        variant="bordered"
        className=" w-full p-5 bg-[#00298D] text-white font-extrabold"
        isLoading={isLoading}>
        {text}
      </Button>
    </>
  );
};

export default AppButton;
