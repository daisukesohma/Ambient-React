/* eslint-disable react/no-deprecated */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const promptTextCreator = label => {
  return `Create a Escalation Policy: ${label}`
}

class ProfileSelector extends Component {
  constructor(props) {
    super()
    this.state = {
      selectedPolicy: '',
      options: [
        { value: 'R', label: 'Red' },
        { value: 'G', label: 'Green' },
        { value: 'B', label: 'Blue' },
      ],
      value: undefined,
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.onNewOptionClick = this.onNewOptionClick.bind(this)
    this.handleDeletePolicy = this.handleDeletePolicy.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // eslint-disable-line
    if (nextProps.options) {
      const newOptions = nextProps.options.map((option, index) => {
        return { value: option.id, label: option.name, index }
      })
      this.setState({ options: newOptions, value: nextProps.value }, () => {
        // console.log(this.state);
      })
    }
  }

  handleOnChange(value) {
    this.props.handleSelectPolicy(value)
    // this.setState({ value }, () => {
    //   console.log(this.state);
    // });
  }

  onNewOptionClick(newOption) {
    // const newOptions = this.state.options;
    // newOptions.unshift(newOption);
    this.setState({ value: newOption }, () => {
      this.props.handleCreatePolicy(newOption)
    })
  }

  handleDeletePolicy() {
    const updatedPolicies = this.state.options
    updatedPolicies.splice(this.state.selectedPolicy.index, 1)
    this.setState({ value: undefined, options: updatedPolicies }, () => {
      this.props.handleDeletePolicy()
    })
  }

  render() {
    const { options, value } = this.state
    return (
      <div className=''>
        <Select.Creatable
          options={options}
          onChange={this.handleOnChange}
          value={value}
          promptTextCreator={promptTextCreator}
          onNewOptionClick={this.onNewOptionClick}
          placeholder='Select or Type a Name'
        />
        <div className=''>{this.props.hint}</div>
      </div>
    )
  }
}

ProfileSelector.defaultProps = {
  options: [],
  value: {},
  handleSelectPolicy: () => {},
  handleCreatePolicy: () => {},
  handleDeletePolicy: () => {},
  hint: '',
}

ProfileSelector.propTypes = {
  options: PropTypes.array,
  value: PropTypes.object,
  handleSelectPolicy: PropTypes.func,
  handleCreatePolicy: PropTypes.func,
  handleDeletePolicy: PropTypes.func,
  hint: PropTypes.string,
}

export default ProfileSelector
