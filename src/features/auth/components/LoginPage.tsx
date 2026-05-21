import React from "react";

import {   Field } from '../../auth/components/stepper/Field';
import { Stepper } from "../components/stepper/Stepper";
import { Step } from "../components/stepper/Step";

import type { ValidationRule } from '../components/stepper/type';


const passwordRules: ValidationRule[] = [
  { label: 'Tối thiểu 8 ký tự', test: (v) => v.length >= 8 },
  { label: 'Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
    test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v) },
  { label: 'Mật khẩu xác nhận khớp',
    test: (v, vals) => !!vals?.confirm && v === vals.confirm },
];


const LoginPage: React.FC = () => {
  
  return (
  
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8 p-6">

      <div className="w-full max-w-md">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 text-center">
          Ví dụ 1 — Đặt lại mật khẩu
        </p>
        <Stepper
          title="Đặt lại mật khẩu"
          successMessage="Mật khẩu của bạn đã được cập nhật."
          onComplete={(v) => console.log('reset password:', v)}
        >
          <Step title="Xác thực">
            <Field id="email" label="Email" type="email" placeholder="your@email.com" />
          </Step>

          <Step title="Đặt lại mật khẩu" validationRules={passwordRules}>
            <Field id="password" label="Mật khẩu mới" type="password" placeholder="••••••••" />
            <Field id="confirm" label="Xác nhận mật khẩu" type="password" placeholder="••••••••" />
          </Step>

          <Step title="Hoàn tất" />
        </Stepper>
      </div>

      <div className="w-full max-w-md">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 text-center">
          Ví dụ 2 — Đăng ký tài khoản
        </p>
        <Stepper
          title="Tạo tài khoản"
          successMessage="Tài khoản đã được tạo thành công!"
          onComplete={(v) => console.log('register:', v)}
        >
          <Step title="Thông tin">
            <Field id="name" label="Họ và tên" type="text" placeholder="Nguyen Van A" />
            <Field id="email" label="Email" type="email" placeholder="your@email.com" />
          </Step>

          <Step
            title="Bảo mật"
            validationRules={[
              { label: 'Tối thiểu 6 ký tự', test: (v) => v.length >= 6 },
              { label: 'Có ít nhất 1 chữ số', test: (v) => /[0-9]/.test(v) },
              { label: 'Mật khẩu xác nhận khớp', test: (v, vals) => !!vals?.confirm && v === vals.confirm },
            ]}
          >
            <Field id="password" label="Mật khẩu" type="password" placeholder="••••••••" />
            <Field id="confirm" label="Xác nhận" type="password" placeholder="••••••••" />
          </Step>

          <Step title="Hoàn tất" />
        </Stepper>
      </div>

    </div>

  );
};

export default LoginPage;