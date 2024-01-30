import React, { useState, useEffect } from 'react';
import '../static/common.css';

export default function TimePicker(props) {

    const [selectedHour, setSelectedHour] = useState('00');
    const [selectedMinute, setSelectedMinute] = useState('00');
    useEffect(() => {
        if (props.value) {
            setSelectedHour(props.value.split(':')[0])
            setSelectedMinute(props.value.split(':')[1])
        }
    }, [])

    const onHourClick = (formattedHour) => {
        props.setHourMin(formattedHour + ':' + selectedMinute, props.type, props.index, 99999);
        setSelectedHour(formattedHour);
    }

    const onMinuteClick = (formattedMinute) => {
        props.setHourMin(selectedHour + ':' + formattedMinute, props.type, props.index, 99999);
        setSelectedMinute(formattedMinute)
    }
    return (
        <table className="time-picker ui-timepicker-table ui-widget-content ui-corner-all">
            <tbody>
                <tr>
                    <td className="ui-timepicker-hours">
                        <div className="ui-timepicker-title ui-widget-header ui-helper-clearfix ui-corner-all">Hour</div>
                        <table className="ui-timepicker">
                            <tbody>
                                {[0, 1, 2, 3].map((hourRow) => {
                                    return (
                                        <tr key={hourRow}>
                                            {[0, 1, 2, 3, 4, 5].map((hourCol, i) => {
                                                const hour = hourRow * 6 + hourCol;
                                                const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
                                                return (
                                                    <td onClick={() => onHourClick(formattedHour)}>
                                                        <a className={props.hour !== formattedHour ? "ui-state-default" : "ui-state-active"}>{formattedHour}</a>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </td>
                    <td className="ui-timepicker-minutes">
                        <div className="ui-timepicker-title ui-widget-header ui-helper-clearfix ui-corner-all">Minute</div>
                        <table className="ui-timepicker w-100 text-center">
                            <tbody>
                                {[0, 15, 30, 45].map((minute) => {
                                    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
                                    return (
                                        <tr>
                                            <td key={minute} onClick={() => onMinuteClick(formattedMinute)}>
                                                <a className={props.minute !== formattedMinute ? "ui-state-default w-100" : "ui-state-active w-100"}>{formattedMinute}</a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
