import React, { useState, useEffect } from "react";
import RequiredIcon from "../../static/icons/exclamation-mark1.png";
import { t } from "../../translations/Translation";

export default function FileInput({ title, CustomStyle, index, name, value, setValue, error, required, styleMargin, accept }) {

  const [selectedFile, setSelectedFile] = useState(value)
  const handleFileInput = (e) => {
    let file = e.target.files[0]
    setValue(index, name, file);
    if (file) {
      const selectedFileName = e.target.files[0].name;
      const fileNameLabel = document.getElementById(`file-name-label-${index}`);
      fileNameLabel.textContent = selectedFileName;
    } else {
      const fileNameLabel = document.getElementById(`file-name-label-${index}`);
      fileNameLabel.textContent = t("CHOOSE_A_FILE");
    }
  };

  const retainFile = () => {
    const selectedFileName = value?.name;;
    const fileNameLabel = document.getElementById(`file-name-label-${index}`);
    fileNameLabel.textContent = selectedFileName
  }

  useEffect(() => {
    if (value?.name !== "" && value?.name !== undefined) {
      retainFile()
    }
  }, [])

  return (
    <div className={" font-weight-bold " + CustomStyle}>
      <div className={"d-flex justify-content-between " + (error ? '' : styleMargin)} >
        <label className="row mx-0 my-auto ">{title} {required && <p className="text-danger my-auto">&nbsp;*</p>} </label>
        {error && <p className="pt-1 pb-0 px-4 m-1 text-danger required-bg rounded font-weight-normal">
          <img className="box mr-1 mb-1" src={RequiredIcon}></img>
          {error}
        </p>}
      </div>
      <div className="col-md-12 file-input-container ">
        <span id={`file-name-label-${index}`} className="file-name-label"><div className="col-md-8"></div>{t("CHOOSE_A_FILE")}</span>
        <input name={name} type="file" className="file-input" accept={accept ? accept : ""} onChange={handleFileInput} />
      </div>
    </div>)

};