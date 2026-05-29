import { Input } from "antd";
import { Controller, Control, FieldValues, RegisterOptions } from "react-hook-form";

interface FormInputProps {
  control: Control<FieldValues>;
  name: string;
  rules?: RegisterOptions;
  placeholder?: string;
}

const FormInput = ({ control, name, rules, placeholder }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => <Input {...field} placeholder={placeholder} />}
    />
  );
};

export default FormInput;
