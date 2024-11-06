import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="min-h-[calc(100vh-120px)] max-w-screen-lg mt-[150px] mb-[100px] px-4 mx-auto">
      {children}
    </div>
  );
};

export default Container;
