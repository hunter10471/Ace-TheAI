import React from "react";
import Navbar from "../Navbar/Navbar";

interface ContainerProps {
  children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <main className="border-b-[8px] border-primary">
      <Navbar />
      <div className="min-h-[calc(100vh-120px)] max-w-screen-lg mt-[150px] mb-[100px] px-4 mx-auto">
        {children}
      </div>
    </main>
  );
};

export default Container;
