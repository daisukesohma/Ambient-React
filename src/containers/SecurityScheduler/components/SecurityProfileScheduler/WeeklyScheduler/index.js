/* eslint-disable react/no-deprecated */
import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'

import DayHeader from './DayHeader'
import TimeRow from './TimeRow'
import EventSelector from './EventSelector'
import './index.css'

class WeeklyScheduler extends React.Component {
  constructor(props) {
    super(props)
    const {
      defaultEvent,
      selectedEvent,
      currentSchedule,
      minutesInCell,
    } = this.props
    let days = []
    if (currentSchedule) {
      days = currentSchedule
    } else {
      for (let i = 0; i < 7; i += 1) {
        const day = []
        const numBlocks = 86400 / (60 * minutesInCell)
        for (let j = 0; j < numBlocks; j += 1) {
          day.push(defaultEvent)
        }
        days.push(day)
      }
    }
    this.state = {
      days,
      startingCell: null,
      currentEvent: selectedEvent || defaultEvent || {},
      oldDays: [...days],
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
    this.handleSelectEvent = debounce(this.handleSelectEvent.bind(this), 20)
    this.numBlocks = 86400 / (60 * minutesInCell)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentSchedule !== this.props.currentSchedule) {
      // eslint-disable-line
      const { days, currentEvent } = this.state
      const { selectedEvent, defaultEvent } = this.props
      const newCurrentEvent =
        newProps.selectedEvent !== selectedEvent ||
        newProps.defaultEvent !== defaultEvent
          ? selectedEvent || defaultEvent
          : currentEvent

      const newDays = newProps.currentSchedule || days
      this.setState({
        days: newProps.currentSchedule || days,
        oldDays: [...newDays],
        currentEvent: newCurrentEvent || {},
      })
    }
  }

  onMouseDown(e) {
    e.preventDefault()
    const rowNum = e.target.getAttribute('data-row')
    const dayNum = e.target.getAttribute('data-day')
    this.setState({
      startingCell: {
        day: parseInt(dayNum, 10),
        time: parseInt(rowNum, 10),
      },
    })
    this.weekTable.addEventListener('mouseover', this.onMouseOver)
    window.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseUp() {
    const { days, startingCell, currentEvent } = this.state

    this.weekTable.removeEventListener('mouseover', this.onMouseOver)
    window.removeEventListener('mouseup', this.onMouseUp)
    const newDays = [...days]
    newDays[startingCell.day][startingCell.time] = currentEvent
    this.setState({ oldDays: days, days: newDays })
  }

  onMouseOver(e) {
    const rowNum = e.target.getAttribute('data-row')
    const dayNum = e.target.getAttribute('data-day')
    this.handleDragOver(parseInt(dayNum, 10), parseInt(rowNum, 10))
  }

  setupTimeRows() {
    const { days } = this.state
    const rows = []
    for (let i = 0; i < this.numBlocks; i += 1) {
      const row = []
      for (let j = 0; j < 7; j += 1) {
        row.push(days[j][i])
      }
      rows.push(row)
    }
    return rows.map((tRow, index) => (
      <TimeRow
        key={index}
        rowNumber={index}
        dayItems={tRow}
        minutesInCell={this.props.minutesInCell}
      />
    ))
  }

  handleSelectEvent(eventSelected) {
    const { currentEvent } = this.state
    if (eventSelected.event !== currentEvent.event) {
      this.setState({ currentEvent: eventSelected })
    }
  }

  handleDragOver(dayNum, rowNum) {
    const { startingCell, currentEvent, oldDays } = this.state

    const dayDiff = dayNum - startingCell.day
    const timeDiff = rowNum - startingCell.time
    const newDays = []

    for (let j = 0; j < 7; j += 1) {
      newDays.push(oldDays[j].slice())
    }
    if (dayDiff !== 0) {
      const dayStart = startingCell.day < dayNum ? startingCell.day : dayNum
      const dayEnd = startingCell.day < dayNum ? dayNum : startingCell.day
      const timeStart = startingCell.time < rowNum ? startingCell.time : rowNum
      const timeEnd = startingCell.time < rowNum ? rowNum : startingCell.time
      for (let j = dayStart; j <= dayEnd; j += 1) {
        if (timeDiff !== 0) {
          for (let i = timeStart; i <= timeEnd; i += 1) {
            newDays[j][i] = currentEvent
          }
        } else {
          newDays[j][startingCell.time] = currentEvent
        }
      }
    } else if (timeDiff !== 0) {
      const timeStart = startingCell.time < rowNum ? startingCell.time : rowNum
      const timeEnd = startingCell.time < rowNum ? rowNum : startingCell.time
      for (let j = timeStart; j <= timeEnd; j += 1) {
        newDays[startingCell.day][j] = currentEvent
      }
    }
    this.setState({ days: newDays })
  }

  render() {
    const { events, legendTitle } = this.props
    const { currentEvent } = this.state
    return (
      // <Paper id="WeeklySchedulerTable">
      //   <div className="ibox-title">
      //     <EventSelector
      //       events={events}
      //       selectedEvent={currentEvent}
      //       selectEvent={this.handleSelectEvent}
      //       legendTitle={legendTitle}
      //     />
      //   </div>
      //   <div className="ibox-content">
      //     <table className="table table-bordered">
      //       <DayHeader />
      //       <tbody
      //         className="week-table"
      //         onMouseDown={this.onMouseDown}
      //         ref={tbody => {
      //           this.weekTable = tbody
      //         }}
      //       >
      //         {this.setupTimeRows()}
      //       </tbody>
      //     </table>
      //   </div>
      // </Paper>
      <div id='WeeklySchedulerTable'>
        <div className='ibox-title'>
          <EventSelector
            events={events}
            selectedEvent={currentEvent}
            selectEvent={this.handleSelectEvent}
            legendTitle={legendTitle}
          />
        </div>
        <div>
          <table className='table table-bordered'>
            <DayHeader />
            <tbody
              className='week-table'
              onMouseDown={this.onMouseDown}
              ref={tbody => {
                this.weekTable = tbody
              }}
            >
              {this.setupTimeRows()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

WeeklyScheduler.propTypes = {
  defaultEvent: PropTypes.object,
  selectedEvent: PropTypes.object,
  currentSchedule: PropTypes.object,
  minutesInCell: PropTypes.number,
  events: PropTypes.array,
  legendTitle: PropTypes.string,
}

WeeklyScheduler.defaultProps = {
  defaultEvent: {},
  selectedEvent: {},
  currentSchedule: {},
  minutesInCell: 30,
  events: [],
  legendTitle: '',
}

export default WeeklyScheduler
