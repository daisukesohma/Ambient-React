export const LightTheme = `
::placeholder {
  color: #4242FF;
  opacity: 1; /* Firefox */
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: #4242FF;
}
::-ms-input-placeholder { /* Microsoft Edge */
  color: #4242FF;
}
input:focus {
  outline: none;
  cursor: text;
}
.react-datepicker-popper {
  top: 10px !important;
}
.react-datepicker{
  border-radius: 4px;
  border: 0px;
  background-color: #F8FBFF;
  box-shadow: 0px 0px 4px 0px grey;
}
.react-datepicker__header {
  border-top-left-radius: 4px;
  background-color: #F8FBFF;
  border-bottom: 0px;
}
.react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
  outline: none;
}
.react-datepicker__day--keyboard-selected,
.react-datepicker__month-text--keyboard-selected,
.react-datepicker__quarter-text--keyboard-selected,
.react-datepicker__year-text--keyboard-selected {
  border-radius: 16px;
  background-color: #4242FF;
  color: #FFF;
  outline: none;
}
.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range,
.react-datepicker__month-text--selected,
.react-datepicker__month-text--in-selecting-range,
.react-datepicker__month-text--in-range,
.react-datepicker__quarter-text--selected,
.react-datepicker__quarter-text--in-selecting-range,
.react-datepicker__quarter-text--in-range,
.react-datepicker__year-text--selected,
.react-datepicker__year-text--in-selecting-range,
.react-datepicker__year-text--in-range {
  border-radius: 16px;
  background-color: #4242FF;
  color: #FFF;
  outline: none;
}
.react-datepicker__month--selected, .react-datepicker__month--in-selecting-range, .react-datepicker__month--in-range,
.react-datepicker__quarter--selected,
.react-datepicker__quarter--in-selecting-range,
.react-datepicker__quarter--in-range {
  border-radius: 16px;
  background-color: #4242FF;
  color: #FFF;
  outline: none;
}
.react-datepicker__time-container {
  border-left: 0px;
}
.react-datepicker__time-container .react-datepicker__time {
  background-color: #F8FBFF;
  outline: none;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
  height: 30px;
  white-space: nowrap;
  padding: 0px 0px;
  justify-content: center;
  align-items: center;
  margin: auto;
  text-align: center;
  padding-top: 6px;
  margin: 8px;
}
.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled {
  outline: none;
  color: #76797E !important;
  cursor: default;
}


.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected:hover {
  background-color: #4242FF;
  outline: none;
}
.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
  background-color: #4242FF;
  color: #FFF;
  font-weight: bold;
  border-radius: 4px;
  outline: none;
}
.react-datepicker__today-button {
  background: #4242FF;
  border-top: 0px;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
  padding: 5px 0;
  clear: left;
  color: #FFF;
}
.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
  list-style: none;
  margin: 0;
  height: calc(195px + (1.7rem / 2));
  overflow-y: scroll;
  padding-right: 0px;
  padding-left: 0px;
  width: 100%;
  box-sizing: content-box;
  outline: none;
}

.react-datepicker__navigation {
  outline: none;
  margin-top: 4px;
}

.react-datepicker__day--selected:hover, .react-datepicker__day--in-selecting-range:hover, .react-datepicker__day--in-range:hover, .react-datepicker__month-text--selected:hover, .react-datepicker__month-text--in-selecting-range:hover, .react-datepicker__month-text--in-range:hover, .react-datepicker__quarter-text--selected:hover, .react-datepicker__quarter-text--in-selecting-range:hover, .react-datepicker__quarter-text--in-range:hover, .react-datepicker__year-text--selected:hover, .react-datepicker__year-text--in-selecting-range:hover, .react-datepicker__year-text--in-range:hover {
  background-color: #4242FF;
  border-radius: 16px;
  outline: none
}

.react-datepicker__day:hover,
.react-datepicker__month-text:hover,
.react-datepicker__quarter-text:hover,
.react-datepicker__year-text:hover {
  border-radius: 16px;
  outline: none;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
  cursor: pointer;
  border-radius: 4px;
  outline: none;
}

.react-datepicker__day--disabled, .react-datepicker__month-text--disabled, .react-datepicker__quarter-text--disabled, .react-datepicker__year-text--disabled {
  outline: none;
  color: #76797E !important;
  cursor: default;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled:hover {
  outline: none;
  cursor: default;
}

.react-datepicker__year-dropdown {
  background: #F8FBFF;
}
`

export const DarkTheme = `
::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #0ABFFC;
  opacity: 1; /* Firefox */
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: #0ABFFC;
}
::-ms-input-placeholder { /* Microsoft Edge */
  color: #0ABFFC;
}
input:focus {
  outline: none;
  cursor: text;
}

.react-datepicker__header {
  text-align: center;
  background-color: #626469;
  border-bottom: 0px;
  border-top-left-radius: 4px;
  border-top-right-radius: 0;
  padding-top: 8px;
  position: relative;
  color: #FFF;
}

.react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
  outline: none;
}

.react-datepicker__today-button {
  background: #0ABFFC;
  border-top: 0px;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
  padding: 5px 0;
  clear: left;
  color: #FFF;
}
.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
  height: 30px;
  white-space: nowrap;
  padding: 0px 0px;
  justify-content: center;
  align-items: center;
  margin: auto;
  text-align: center;
  padding-top: 6px;
  margin: 8px;
}
.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled {
  outline: none;
}

.react-datepicker__day--keyboard-selected,
.react-datepicker__month-text--keyboard-selected,
.react-datepicker__quarter-text--keyboard-selected,
.react-datepicker__year-text--keyboard-selected {
  border-radius: 16px;
  background-color: #0ABFFC;
  color: #FFF;
  outline: none;
}

.react-datepicker__day--selected:hover, .react-datepicker__day--in-selecting-range:hover, .react-datepicker__day--in-range:hover, .react-datepicker__month-text--selected:hover, .react-datepicker__month-text--in-selecting-range:hover, .react-datepicker__month-text--in-range:hover, .react-datepicker__quarter-text--selected:hover, .react-datepicker__quarter-text--in-selecting-range:hover, .react-datepicker__quarter-text--in-range:hover, .react-datepicker__year-text--selected:hover, .react-datepicker__year-text--in-selecting-range:hover, .react-datepicker__year-text--in-range:hover {
  background-color: #0ABFFC;
  border-radius: 16px;
  outline: none
}

.react-datepicker {
  font-family: 'Aeonik-Regular';
  font-size: 0.8rem;
  background-color: #626469;
  color: #FFF;
  border: 0px;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  box-shadow: 0px 0px 4px 0px black;
}

.react-datepicker__current-month,
.react-datepicker-time__header,
.react-datepicker-year-header {
  margin-top: 0;
  color: #FFF;
  font-weight: bold;
  font-size: 0.944rem;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
  background-color: #0ABFFC;
  color: #43454A;
  font-weight: bold;
  border-radius: 4px;
  outline: none;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected:hover {
  background-color: #0ABFFC;
  color: #43454A;
  outline: none;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
  list-style: none;
  margin: 0;
  height: calc(195px + (1.7rem / 2));
  overflow-y: scroll;
  padding-right: 0px;
  padding-left: 0px;
  width: 100%;
  box-sizing: content-box;
  outline: none;
}

.react-datepicker__day-name,
.react-datepicker__day,
.react-datepicker__time-name {
  color: white;
  display: inline-block;
  width: 1.7rem;
  line-height: 1.7rem;
  text-align: center;
  margin: 0.166rem;
}

.react-datepicker__month--selected, .react-datepicker__month--in-selecting-range, .react-datepicker__month--in-range,
.react-datepicker__quarter--selected,
.react-datepicker__quarter--in-selecting-range,
.react-datepicker__quarter--in-range {
  border-radius: 16px;
  background-color: #0ABFFC;
  color: #43454A;
}
.react-datepicker__day--keyboard-selected,
.react-datepicker__month-text--keyboard-selected,
.react-datepicker__quarter-text--keyboard-selected,
.react-datepicker__year-text--keyboard-selected {
  border-radius: 16px;
  background-color: #0ABFFC;
  color: #43454A;
}

.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range,
.react-datepicker__month-text--selected,
.react-datepicker__month-text--in-selecting-range,
.react-datepicker__month-text--in-range,
.react-datepicker__quarter-text--selected,
.react-datepicker__quarter-text--in-selecting-range,
.react-datepicker__quarter-text--in-range,
.react-datepicker__year-text--selected,
.react-datepicker__year-text--in-selecting-range,
.react-datepicker__year-text--in-range {
  border-radius: 16px;
  background-color: #0ABFFC;
  color: #43454A;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
  cursor: pointer;
  background-color: #ccc;
  border-radius: 4px;
  color: #43454A;
  outline: none;
}
.react-datepicker__time-container {
  border-left: 1px solid #aeaeae;
}

.react-datepicker__time-container .react-datepicker__time {
  position: relative;
  background: #626469;
  border-bottom-right-radius: 0.3rem;
  outline: none;
}

.react-datepicker__week-number.react-datepicker__week-number--clickable:hover {
  border-radius: 16px;
  background-color: #ccc;
}

.react-datepicker__day:hover,
.react-datepicker__month-text:hover,
.react-datepicker__quarter-text:hover,
.react-datepicker__year-text:hover {
  border-radius: 16px;
  background-color: #ccc;
  color: #43454A;
}

.react-datepicker__day--disabled:hover, .react-datepicker__month-text--disabled:hover, .react-datepicker__quarter-text--disabled:hover, .react-datepicker__year-text--disabled:hover {
  outline: none;
  background-color: #626469 !important;
  cursor: default;
}

.react-datepicker__navigation {
  outline: none;
  margin-top: 4px;
}
.react-datepicker__day--disabled, .react-datepicker__month-text--disabled, .react-datepicker__quarter-text--disabled, .react-datepicker__year-text--disabled {
  outline: none;
  color: #76797E !important;
  cursor: default;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled:hover {
  outline: none;
  background-color: #626469 !important;
  cursor: default;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled {
  outline: none;
  color: #76797E !important;
}

.react-datepicker__year-dropdown {
  background: #626469;
}

`
