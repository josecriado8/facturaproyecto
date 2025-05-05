import { z } from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "./FormComponents/Index";
import generarPDF from "./FormComponents/PDFGenerator";
import { useEffect } from "react";

const conceptSchema = z.object({
    concept: z.string().min(1, { message: "El concepto es obligatorio" }),
    euros: z.string().min(1, { message: "El importe en euros es obligatorio" }),
});

const schema = z.object({
    clientName: z.string().min(1, { message: "Rellene el campo" }),
    street: z.string().min(1, { message: "Rellene el campo" }),
    postalCode: z
        .string()
        .min(1, { message: "Rellene el campo" })
        .regex(/^\d{5}$/, { message: "El código postal debe tener 5 dígitos" }),
    phone: z
        .string()
        .min(1, { message: "Rellene el campo" })
        .regex(/^\d{9}$/, { message: "El teléfono debe tener 9 dígitos" }),
    cifDni: z.string().min(1, { message: "Rellene el campo" }),
    city: z.string().min(1, { message: "Rellene el campo" }),
    conceptos: z.array(conceptSchema).min(1, { message: "Agrega al menos un concepto" }),
    baseImponible: z.string().min(1, { message: "La base imponible es obligatoria" }),
    iva: z.string().min(1, { message: "El IVA es obligatorio" }), 
    importeIva: z.string().min(1, { message: "El importe IVA es obligatorio" }),
    total: z.string().min(1, { message: "El total es obligatorio" }),
});

export type FormValues = z.infer<typeof schema>;

const CustomForm = () => {
    const { control, formState: { errors }, watch, setValue, trigger, getValues } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            conceptos: [{ concept: "", euros: "" }],
            iva: "0"
        },
        mode: "onChange"
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "conceptos"
    });

    // Observa cambios en conceptos e iva
    const conceptos = watch("conceptos");
    const iva = parseFloat(watch("iva") || "0");

    // Lógica de cálculo reutilizable
    const calcularTotales = (conceptosCalc = conceptos, ivaCalc = iva) => {
        const baseImponible = conceptosCalc.reduce(
            (acc, curr) => acc + (parseFloat(curr.euros) || 0),
            0
        );
        setValue("baseImponible", baseImponible.toFixed(2), { shouldValidate: true, shouldDirty: true });

        const importeIva = baseImponible * (ivaCalc / 100);
        setValue("importeIva", importeIva.toFixed(2), { shouldValidate: true, shouldDirty: true });

        const total = baseImponible + importeIva;
        setValue("total", total.toFixed(2), { shouldValidate: true, shouldDirty: true });
    };

    useEffect(() => {
        calcularTotales();
    }, [conceptos, iva, setValue]);

    // Función para manejar el submit y asegurar actualización
    const handleGeneratePDF = async () => {
        const currentValues = getValues();
        calcularTotales(currentValues.conceptos, parseFloat(currentValues.iva || "0"));
        setTimeout(async () => {
            const valid = await trigger();
            if (valid) {
                const data = getValues();
                generarPDF(data);
            }
        }, 0);
    };

    return (
        <form onSubmit={e => { e.preventDefault(); handleGeneratePDF(); }}>
            <div className="form-section">
                <div className="form-section-title">Datos del cliente</div>
                <InputForm name="clientName" control={control} label="Nombre del cliente" type="text" error={errors.clientName} />
                <InputForm name="street" control={control} label="Calle" type="text" error={errors.street} />
                <InputForm name="postalCode" control={control} label="Código Postal" type="number" error={errors.postalCode} inputProps={{ min: 10000, max: 52999 }} />
                <InputForm
                    name="phone"
                    control={control}
                    label="Nº de teléfono"
                    type="number"
                    error={errors.phone}
                    inputProps={{ min: 100000000, max: 999999999 }}
                />
                <InputForm name="cifDni" control={control} label="CIF de empresa / DNI" type="text" error={errors.cifDni} />
                <InputForm name="city" control={control} label="Ciudad" type="text" error={errors.city} />
            </div>
            <div className="form-section">
                <div className="form-section-title">Conceptos del trabajo</div>
                {fields.map((field, index) => (
                    <div key={field.id} className="concepto-row">
                        <InputForm
                            name={`conceptos.${index}.concept`}
                            control={control}
                            label={`Concepto ${index + 1}`}
                            type="text"
                            error={errors.conceptos?.[index]?.concept}
                            inputId={`concepto-${index}`}
                        />
                        <Controller
                            name={`conceptos.${index}.euros`}
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.conceptos?.[index]?.euros ? "is-invalid" : ""}`}
                                        value={field.value ?? ""}
                                        onChange={e => {
                                            field.onChange(e.target.value);
                                            trigger(); 
                                        }}
                                        placeholder="Euros"
                                        aria-invalid={!!errors.conceptos?.[index]?.euros}
                                        aria-describedby={errors.conceptos?.[index]?.euros ? `conceptos.${index}.euros-error` : undefined}
                                    />
                                    {errors.conceptos?.[index]?.euros && (
                                        <div className="error" id={`conceptos.${index}.euros-error`} role="alert">
                                            {errors.conceptos?.[index]?.euros.message}
                                        </div>
                                    )}
                                </>
                            )}
                        />
                        <div className="concepto-actions">
                            <button
                                type="button"
                                className="remove-concept-btn"
                                onClick={() => remove(index)}
                                aria-label={`Eliminar concepto ${index + 1}`}
                            >
                                -
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-concept-btn"
                    onClick={() => append({ concept: "", euros: "" })}
                >
                    + Añadir concepto
                </button>
                {typeof errors.conceptos?.message === "string" && (
                    <div className="error">{errors.conceptos?.message}</div>
                )}
            </div>
            <div className="form-section">
                <div className="form-section-title">Totales</div>
                <InputForm name="baseImponible" control={control} label="Base Imponible" type="number" error={errors.baseImponible} readOnly />
                <InputForm name="iva" control={control} label="IVA (%)" type="number" error={errors.iva} />
                <InputForm name="importeIva" control={control} label="Importe IVA" type="number" error={errors.importeIva} readOnly />
                <InputForm name="total" control={control} label="TOTAL" type="number" error={errors.total} readOnly />
                <button type="submit" className="btn btn-primary">Generar PDF</button>
            </div>
        </form>
    );
};

export default CustomForm;
