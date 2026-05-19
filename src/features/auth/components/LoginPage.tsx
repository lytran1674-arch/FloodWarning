import React from "react";


import { Button } from "./ui/Button";

const LoginPage: React.FC = () => {
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: xử lý đăng nhập
    console.log("Đăng nhập...");
  };

  return (
   
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <Button title=""  />
        <div className="bg-blue-50 w-60">
          
          </div>    
      </div>
 
  );
};

export default LoginPage;
