import React from "react";


import { FormQMK } from "./FormQMK";

const LoginPage: React.FC = () => {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        p-4
      "
    >
 

  

        {/* LOGIN FORM */}
        <FormQMK />
      </div>

  );
};

export default LoginPage;