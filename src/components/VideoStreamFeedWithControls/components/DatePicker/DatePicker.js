// import React, { Component } from 'react'
// import moment from 'moment-timezone'
// import PropTypes from 'prop-types'
// import { DayPickerSingleDateController } from 'react-dates'
//
// import tsAtMidnight from '../../utils/tsAtMidnight'
// import InfoPanel from '../InfoPanel/InfoPanel'
//
// import { isInclusivelyBeforeDay, isWithinDayBackList } from './utils'
//
// import 'react-dates/initialize'
// import 'react-dates/lib/css/_datepicker.css'
//
// class DatePickerComponent extends Component {
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       focused: true,
//       date: moment.unix(props.videoStreamTS),
//     }
//   }
//
//   componentDidUpdate(prevProps) {
//     const newDay = Math.floor(this.props.videoStreamTS / 86400)
//     const oldDay = Math.floor(prevProps.videoStreamTS / 86400)
//     if (newDay !== oldDay) {
//       this.setState({
//         date: moment.unix(this.props.videoStreamTS),
//       })
//     }
//   }
//
//   onDateChange = date => {
//     const dateTS = date.unix()
//     const todayTS = tsAtMidnight()
//     const diffInTS = todayTS - dateTS
//     let diffInDays = Math.floor(diffInTS / 86400)
//     const remainder = diffInTS % 86400
//     if (remainder > 0) {
//       diffInDays += 1
//     }
//
//     if (diffInDays < 0) {
//       diffInDays = 0
//     }
//     this.setState(
//       {
//         date,
//         selectedDateDiff: diffInDays,
//         selectedDate: date.unix(),
//       },
//       () => {},
//     )
//   }
//
//   onFocusChange = () => {
//     this.setState({ focused: true })
//   }
//
//   onConfirmChange = () => {
//     this.props.toggleDatePicker(() => {
//       this.props.handleDatePickerSelection(
//         this.state.selectedDateDiff,
//         this.state.selectedDate,
//       )
//     })
//   }
//
//   onCancel = () => {
//     this.setState(
//       {
//         date: moment(),
//         selectedDateDiff: 0,
//       },
//       () => {
//         this.props.toggleDatePicker()
//       },
//     )
//   }
//
//   render() {
//     const { focused, date } = this.state
//
//     return (
//       <div
//         style={{
//           bottom: '8.7em',
//           left: '0',
//           position: 'absolute',
//         }}
//       >
//         <DayPickerSingleDateController
//           focused={focused}
//           date={date}
//           onDateChange={this.onDateChange}
//           onFocusChange={this.onFocusChange}
//           isOutsideRange={day =>
//             !isInclusivelyBeforeDay(day, moment()) ||
//             isInclusivelyBeforeDay(
//               day,
//               moment().subtract(this.props.daysBackAccessible, 'days'),
//             )
//           }
//           isDayBlocked={day =>
//             !isWithinDayBackList(day, this.props.daysWithData)
//           }
//           hideKeyboardShortcutsPanel={true}
//           renderCalendarInfo={() => (
//             <InfoPanel
//               onCancel={this.onCancel}
//               onConfirmChange={this.onConfirmChange}
//             />
//           )}
//         />
//       </div>
//     )
//   }
// }
//
// DatePickerComponent.defaultProps = {
//   toggleDatePicker: () => {},
//   videoStreamTS: null,
//   handleDatePickerSelection: () => {},
//   daysBackAccessible: null,
//   subtractDays: null,
//   daysWithData: [],
// }
//
// DatePickerComponent.propTypes = {
//   toggleDatePicker: PropTypes.func,
//   videoStreamTS: PropTypes.number,
//   handleDatePickerSelection: PropTypes.func,
//   daysBackAccessible: PropTypes.number,
//   subtractDays: PropTypes.number,
//   daysWithData: PropTypes.array,
// }
//
// export default DatePickerComponent
