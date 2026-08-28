import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { WebsiteCardContainer } from "@/components/fx/website-card-container";

export type EditFormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea";
  defaultValue?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
};

export type EditFormValues = Record<string, string>;
export type EditFormErrors = Record<string, string>;

export type EditFormBlockProps = {
  fields: EditFormField[];
  title?: ReactNode;
  description?: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  submitting?: boolean;
  initialValues?: EditFormValues;
  errors?: EditFormErrors;
  onValuesChange?: (values: EditFormValues) => void;
  onSubmit?: (values: EditFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

function getInitialValues(fields: EditFormField[], initialValues?: EditFormValues): EditFormValues {
  return Object.fromEntries(fields.map((field) => [field.name, initialValues?.[field.name] ?? field.defaultValue ?? ""]));
}

export function EditFormBlock({
  fields,
  title = "编辑信息",
  description,
  submitLabel = "保存",
  cancelLabel = "取消",
  submitting = false,
  initialValues,
  errors: externalErrors,
  onValuesChange,
  onSubmit,
  onCancel,
}: EditFormBlockProps) {
  const initial = useMemo(() => getInitialValues(fields, initialValues), [fields, initialValues]);
  const [values, setValues] = useState<EditFormValues>(initial);
  const [localErrors, setLocalErrors] = useState<EditFormErrors>({});
  const [dirty, setDirty] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  const errors = externalErrors ?? localErrors;

  useEffect(() => {
    setValues(initial);
    setDirty(false);
    setLocalErrors({});
  }, [initial]);

  const updateValue = (name: string, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    setDirty(true);
    if (!externalErrors && localErrors[name]) {
      setLocalErrors((current) => ({ ...current, [name]: "" }));
    }
    onValuesChange?.(next);
  };

  const validate = () => {
    const nextErrors: EditFormErrors = {};
    fields.forEach((field) => {
      if (field.required && !values[field.name]?.trim()) nextErrors[field.name] = `${field.label}为必填项`;
    });
    setLocalErrors(nextErrors);
    const firstInvalid = fields.find((field) => nextErrors[field.name]);
    if (firstInvalid) inputRefs.current[firstInvalid.name]?.focus();
    return nextErrors;
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Object.keys(validate()).length > 0) return;
    void onSubmit?.(values);
  };

  const cancel = () => {
    if (dirty && !window.confirm("放弃未保存的修改？")) return;
    setValues(initial);
    setDirty(false);
    setLocalErrors({});
    onCancel?.();
  };

  return (
    <WebsiteCardContainer data-slot="edit-form-block">
      <form onSubmit={submit} noValidate>
        <div className="flex flex-col gap-(--fds-g-spacing-panel-gap) p-(--fds-g-spacing-panel-padding)">
          <div>
            <h2 className="font-heading text-base font-medium">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <FieldGroup>
            {fields.map((field) => {
              const invalid = Boolean(errors[field.name]);
              const common = {
                id: `edit-form-${field.name}`,
                name: field.name,
                value: values[field.name] ?? "",
                placeholder: field.placeholder,
                required: field.required,
                "aria-invalid": invalid || undefined,
                ref: (node: HTMLInputElement | HTMLTextAreaElement | null) => { inputRefs.current[field.name] = node; },
                onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateValue(field.name, event.target.value),
              };
              return (
                <Field key={field.name} data-invalid={invalid || undefined}>
                  <FieldContent>
                    <FieldLabel htmlFor={common.id}>{field.label}{field.required ? " *" : ""}</FieldLabel>
                    {field.type === "textarea" ? <Textarea {...common} /> : <Input {...common} type={field.type ?? "text"} />}
                    {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
                    <FieldError>{errors[field.name]}</FieldError>
                  </FieldContent>
                </Field>
              );
            })}
          </FieldGroup>
          <div className="flex flex-wrap justify-end gap-(--fds-g-spacing-control-gap)">
            {onCancel ? <Button type="button" variant="outline" onClick={cancel} disabled={submitting}>{cancelLabel}</Button> : null}
            <Button type="submit" disabled={submitting}>{submitting ? <Spinner /> : null}{submitLabel}</Button>
          </div>
        </div>
      </form>
    </WebsiteCardContainer>
  );
}
