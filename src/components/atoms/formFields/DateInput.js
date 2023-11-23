import React from "react";
import DatePicker from "react-multi-date-picker"

export default function DateInput({ title, name, required, CustomStyle, value, setValue, disabled, placeholder }) {
    return (
        <div className={"" + CustomStyle}>
            <div className="" >
                <label className="font-weight-bold  row mx-0 my-auto">{title} {required && <p className="text-danger my-auto">&nbsp;*</p>} </label>
                {/* <input type="date" className="form-control" name={name} value={value} onChange={(e) => setValue(e.target.value)} disabled={disabled} /> */}
                <DatePicker
                    className="custom-calendar"
                    value={value}
                    onChange={(e) => setValue(e.format("DD-MM-YYYY"))}
                    format="DD-MM-YYYY"
                    disabled={disabled}
                    weekStartDayIndex={1}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}
