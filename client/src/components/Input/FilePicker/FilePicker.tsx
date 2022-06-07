import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { updateSubmitBtn, getClasses, setValid } from "../InputUtils";
import Text from "../../Text";
import "./FilePicker.css";

type fileTypes = {
  name: string;
  spec: string;
};

export const IMAGES: fileTypes = { name: "image (jpeg, png)", spec: ".jpeg,.png,image/jpeg,image/png" };

type FilePickerProps = {
  name: string;
  className?: string;
  fileType?: fileTypes;
  maxSizeInKB?: number;
  required?: boolean;
  update: (data?: string) => void;
};

const FilePicker = ({ name, className, fileType, maxSizeInKB, required, update }: FilePickerProps) => {
  const [value, setValue] = useState("");
  const [first, setFirst] = useState(true);
  const [labelText, setLabelText] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const convertAndUpdate = async (file: File | null) => {
    if (!file) return update(undefined);
    const base64 = (await convertBase64(file)) as string;
    update(base64);
  };

  useEffect(() => (required ? getClasses(ref)?.add("not-set") : undefined), []);

  useEffect(() => {
    let file = ref.current?.files ? ref.current.files[0] : null;
    let ret = "";

    if (first) setFirst(false);
    else {
      getClasses(ref)?.remove("not-set");
      if (required && value === "") ret = "This field is required";
      else if (fileType && !fileType.spec.includes(file?.type ? file.type : ""))
        ret = `This file should be type:\n${fileType?.name}`;
      else if (maxSizeInKB && (file ? file.size : 0) / 1024 > maxSizeInKB) ret = `File can't exceed ${maxSizeInKB}KB`;
    }

    setLabelText(ret ? ret : "");
    setValid(ref, !ret);

    convertAndUpdate(ret ? null : file);
    updateSubmitBtn();
  }, [value]);

  return (
    <div className={`FilePicker fr ${className ? className : ""}`}>
      <div>{name}</div>
      <div className="FilePicker-input">
        <input
          id={name.replaceAll(" ", "_")}
          ref={ref}
          type="file"
          onChange={(e: ChangeEvent) => setValue((e.target as any).value)}
          value={value}
          style={{ display: "none" }}
        />
        <label className="FilePicker-control" htmlFor={name.replaceAll(" ", "_")}>
          <FontAwesomeIcon icon={faUpload} />
        </label>
        <div className="FilePicker-value">
          <div>{value}</div>
          <Text>{labelText}</Text>
        </div>
      </div>
    </div>
  );
};

export default FilePicker;
