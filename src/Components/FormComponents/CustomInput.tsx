import { Controller, Control, FieldError } from "react-hook-form";
import './CustomInput.css';

interface Props {
    name: string;
    control: Control<any>;
    label: string;
    type?: string;
    error?: FieldError;
    readOnly?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    inputId?: string;
}

const InputForm = ({ name, control, label, type = "text", error, readOnly = false, inputProps, inputId }: Props) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <input
                        id={inputId ?? name}
                        type={type}
                        {...field}
                        value={field.value ?? ""}
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        readOnly={readOnly}
                        {...inputProps}
                    />
                )}
            />
            {error && <div className="error">{error.message}</div>}
        </div>
    );
};

export default InputForm;