import { Field, FieldError } from "@/components/ui/field"
import { TimePicker } from "@/components/fx/time-picker"

export function TimePickerPreview({ values }: {values: Record<string, string>;}) {
  const size = values.size as "xs" | "sm" | "md";
  const picker = values.picker as "list" | "wheel";
  const format = values.format as "HH:mm" | "HH:mm:ss";
  const step = Number(values.step) as 15 | 30 | 60;
  const hasValue = values.valueState === "selected" || values.valueState === "clearable";
  const disabled = values.state === "disabled";
  const invalid = values.state === "invalid";
  const visualState = (values.state === "hover" || values.state === "focus" || values.state === "open" ? values.state : undefined) as "hover" | "focus" | "open" | undefined;
  const sharedProps = {
    mode: "popover" as const,
    picker,
    format,
    size,
    step,
    disabled,
    "aria-invalid": invalid ? true : undefined,
    "data-state": visualState,
    clearable: values.valueState === "clearable",
    className: "w-[200px]"
  };

  const node = values.capability === "range" ? (
    <TimePicker
      {...sharedProps}
      range
      defaultValue={hasValue ? { start: "09:30", end: "18:00" } : undefined}
      className="w-[360px]"
    />) : (
    <TimePicker {...sharedProps} defaultValue={hasValue ? "09:30" : undefined} />);

  if (!invalid) return <div className="w-[440px]">{node}</div>;

  return (
    <Field data-invalid className="w-[440px]">
      {node}
      <FieldError>请选择时间</FieldError>
    </Field>);
}
