import validator from "validator";

export function textValidator(
  value: string | undefined,
  params: {
    min?: number;
    max?: number;
    isUrl?: boolean;
    isEmail?: boolean;
    required?: boolean;
    regex?: string;
  }
): string {
  if (params.required && !value) return "This field is required";
  else if (!value) return "";

  if (params.isUrl && !validator.isURL(value)) return "Value must by a URL";
  if (params.isEmail && !validator.isEmail(value)) return "Value must by a email";
  if (params.min !== undefined && value.length < params.min) return `Min characters: ${params.min}`;
  if (params.max !== undefined && value.length > params.max) return `Max characters: ${params.max}`;
  if (params.regex !== undefined && !value.match(params.regex)) return `Value doesn't much the template`;

  return "";
}

export function numberValidator(
  value: string | undefined,
  params: {
    integer?: boolean;
    min?: number;
    max?: number;
    required?: boolean;
  }
): string {
  if (params.required && !value) return "This field is required";
  else if (!value) return "";

  if (!validator.isNumeric(value)) return "Value must by a number";
  if (params.integer && !validator.isInt(value)) return "Value must by a integer";
  if (params.min !== undefined && parseFloat(value) < params.min) return `Value ≥ ${params.min}`;
  if (params.max !== undefined && parseFloat(value) > params.max) return `Value ≤ ${params.max}`;

  return "";
}
