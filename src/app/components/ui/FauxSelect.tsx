import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

import { cn } from "./utils";

type FauxSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "onChange"
> & {
  placeholder?: string;
  containerClassName?: string;
  selectClassName?: string;
  children: ReactNode;
  onChange?: (event: {
    target: { value: string; name?: string };
  }) => void;
};

type OptionItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

const WRAPPER_CLASS_PATTERNS = [
  /^w-(?:full|fit|screen|\[.+\]|-?[\d.]+(?:px|rem|em|%|vw|vh)?)$/,
  /^min-w-/,
  /^max-w-/,
  /^flex(?:-[\d.]+)?$/,
  /^shrink(?:-0)?$/,
  /^grow(?:-0)?$/,
  /^basis-/,
  /^col-span-/,
  /^row-span-/,
  /^col-start-/,
  /^col-end-/,
  /^row-start-/,
  /^row-end-/,
  /^self-/,
  /^justify-self-/,
  /^place-self-/,
  /^order-/,
];

function splitClassNames(className?: string) {
  if (!className) return { wrapper: "", select: "" };

  const wrapper: string[] = [];
  const select: string[] = [];

  for (const token of className.split(/\s+/).filter(Boolean)) {
    if (
      WRAPPER_CLASS_PATTERNS.some((pattern) =>
        pattern.test(token),
      )
    ) {
      wrapper.push(token);
    } else {
      select.push(token);
    }
  }

  return {
    wrapper: wrapper.join(" "),
    select: select.join(" "),
  };
}

function toOptionItems(children: ReactNode): OptionItem[] {
  return (
    Array.isArray(children) ? children : [children]
  ).flatMap((child) => {
    if (
      !child ||
      typeof child !== "object" ||
      !("props" in child)
    )
      return [];
    const element = child as any;
    if (element.type !== "option") return [];
    const label = element.props.children ?? "";
    const value = element.props.value ?? String(label);
    return [
      {
        value: String(value),
        label: String(label),
        disabled: Boolean(element.props.disabled),
      },
    ];
  });
}

export function FauxSelect({
  placeholder = "请选择",
  containerClassName,
  selectClassName,
  children,
  className,
  value,
  onChange,
  name,
  disabled,
  required,
  ...props
}: FauxSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const { wrapper, select } = splitClassNames(className);
  const options = useMemo(
    () => toOptionItems(children),
    [children],
  );
  const currentValue =
    value == null
      ? ""
      : Array.isArray(value)
        ? String(value[0] ?? "")
        : String(value);
  const selectedOption = options.find(
    (option) => option.value === currentValue,
  );
  const displayLabel = selectedOption?.label ?? placeholder;
  const isEmpty = currentValue === "";

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () =>
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
  }, []);

  const emitChange = (nextValue: string) => {
    onChange?.({
      target: {
        value: nextValue,
        name,
      },
    });
  };

  const handleSelect = (
    nextValue: string,
    optionDisabled?: boolean,
  ) => {
    if (disabled || optionDisabled) return;
    emitChange(nextValue);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={cn("relative", wrapper, containerClassName)}
    >
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required}
        onClick={() => {
          if (!disabled) setOpen((current) => !current);
        }}
        className={cn(
          "relative flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100",
          isEmpty ? "text-gray-400" : "text-gray-800",
          select,
          selectClassName,
        )}
        {...props}
      >
        <span className="block truncate">{displayLabel}</span>
        <ExpandMoreIcon
          sx={{ fontSize: 20 }}
          className="pointer-events-none absolute right-3 text-gray-400"
        />
      </button>

      {name ? (
        <input type="hidden" name={name} value={currentValue} />
      ) : null}

      {open && !disabled ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div
            role="listbox"
            className="max-h-60 overflow-auto py-1"
          >
            {options.map((option) => {
              const isSelected = option.value === currentValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() =>
                    handleSelect(option.value, option.disabled)
                  }
                  className={cn(
                    "flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50",
                    isSelected
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700",
                    option.disabled &&
                      "cursor-not-allowed opacity-50 hover:bg-transparent",
                  )}
                >
                  <span className="truncate">
                    {option.label}
                  </span>
                </button>
              );
            })}
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">
                暂无选项
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}