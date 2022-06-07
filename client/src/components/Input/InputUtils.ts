import { RefObject } from "react";
import { textValidator, numberValidator } from "./Validator";

export const getValidator = (type: string, min?: number, max?: number, required?: boolean, regex?: string) => {
  switch (type) {
    case "text":
    case "password":
      return (value: string | undefined) => textValidator(value, { min, max, required, regex });
    case "url":
      return (value: string | undefined) => textValidator(value, { min, max, required, regex, isUrl: true });
    case "email":
      return (value: string | undefined) => textValidator(value, { min, max, required, regex, isEmail: true });
    case "float":
      return (value: string | undefined) => numberValidator(value, { min, max, required });
    case "integer":
      return (value: string | undefined) => numberValidator(value, { min, max, required, integer: true });
    default:
      return (_: string | undefined) => "";
  }
};

export const setSubmitEnabled = (value: boolean) =>
  ((document.getElementById("submit") as HTMLButtonElement).disabled = !value);

export const updateSubmitBtn = () =>
  setSubmitEnabled(elementsWithClass("invalid") === 0 && elementsWithClass("not-set") === 0);

export const elementsWithClass = (cls: string) => document.getElementsByClassName(cls).length;

export const getClasses = (ref: RefObject<HTMLInputElement>) => ref?.current?.classList;

export const setValid = (ref: RefObject<HTMLInputElement>, value: boolean) => {
  getClasses(ref)?.add(value ? "valid" : "invalid");
  getClasses(ref)?.remove(value ? "invalid" : "valid");
};
