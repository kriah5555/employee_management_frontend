//this text input has custom onchange function
import React from "react";
// import RequiredIcon from "../../../static/icons/exclamation.png"
import RequiredIcon from "../../../static/icons/exclamation-mark1.png"


export default function TextInputType2({ title, name, placeholder, required, CustomStyle, value, onChange, error, styleMargin, age }) {
    return (
        <div className={"font-weight-bold " + CustomStyle}>
            <div className={"d-flex justify-content-between " + (error ? '' : styleMargin)} >
                <label className="row mx-0 my-auto">{title} {required && <p className="text-danger my-auto">&nbsp;*</p>} </label>
                {error && <p className="pt-1 pb-0 px-4 m-1 text-danger required-bg rounded font-weight-normal">
                    <img className="box mr-1 mb-1" src={RequiredIcon}></img>
                    {error}
                </p>}
            </div>
            <div className="input-group ">
                <input type="text" className="form-control" placeholder={placeholder} name={name} value={value} onChange={onChange} />
                {age && <div className="input-group-append">
                    <span className="input-group-text">%</span>
                </div>}
            </div>
        </div>
    )
}
