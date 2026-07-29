import { Field, FieldError } from "@/components/ui/field"
import { TimePicker } from "@/components/fx/time-picker"

export function TimePickerPreview({ values }: {values: Record<string, string>;}) {
  const size = values.size as "xs" | "sm" | "md";
  const picker = values.picker as "list" | "wheel";
  const format = values.format as "HH:mm" | "HH:mm:ss";
  const step = Number(values.step) as 15 | 30 | 60;
  const disabled = values.state === "disabled";
  const invalid = values.state === "invalid";
  const interactionState = values.state === "hover" || values.state === "focus" ? values.state as "hover" | "focus" : undefined;
  const sharedProps = {
    mode: "popover" as const,
    picker,
    format,
    size,
    step,
    disabled,
    "aria-invalid": invalid ? true : undefined,
    "data-state": interactionState,
    clearable: true,
    className: "w-[280px]"
  };

  const node = values.capability === "range" ? (
    <TimePicker
      {...sharedProps}
      range
      className="w-[280px]"
    />) : <TimePicker {...sharedProps} />;

  if (!invalid) return <div className="w-[280px]">{node}</div>;

  return (
    <Field data-invalid className="w-[280px]">
      {node}
      <FieldError>请选择时间</FieldError>
    </Field>);
}
