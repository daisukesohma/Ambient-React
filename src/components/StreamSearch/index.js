import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import get from 'lodash/get'
import compact from 'lodash/compact'
import { useSelector } from 'react-redux'
import SearchIcon from '@material-ui/icons/Search'
import clsx from 'clsx'
import { useDebouncedCallback } from 'use-debounce'
// src
import { SearchableSelectDropdown } from 'ambient_ui'
import { SEARCH_STREAMS } from './gql'
import useStyles from './styles'
import OptionWithSnapshot from './OptionWithSnapshot'
import OverflowTip from 'components/OverflowTip'

const propTypes = {
  orderIndex: PropTypes.number,
  onChangeStream: PropTypes.func,
  selectedStream: PropTypes.object,
  client: PropTypes.object,
  placeholder: PropTypes.string,
}

const defaultProps = {
  placeholder: 'Search Streams...',
}

const StreamSearch = ({
  orderIndex,
  onChangeStream,
  selectedStream,
  client,
  placeholder,
}) => {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles()

  const { account } = useParams()

  // prevents page erroring out on invalid regex search
  function isRegexValid(str) {
    // https://stackoverflow.com/questions/8088290/what-is-the-javascript-equivalent-of-preg-match
    const isNotValid = /[^a-zA-Z0-9]/.test(str)
    return !isNotValid
  }

  const getOptions = useDebouncedCallback((input, callback) => {
    client
      .query({
        query: SEARCH_STREAMS,
        variables: {
          accountSlug: account,
          query: input,
          limit: 15,
        },
      })
      .then(res => {
        const options = res.data.searchStreamsV2.map(({ stream }) => {
          return {
            label: stream.name,
            value: stream.id,
            ...stream,
            snapshot: get(stream, 'snapshot.dataStr', null),
            serverSide: true,
            streamName: stream.name,
            regionName: get(stream, 'region.name', ''),
            siteName: get(stream, 'site.name', ''),
          }
        })

        callback(options)
      })
  }, 500)

  // eslint-disable-next-line
  const formatOptionLabel = ({ label, searchWords }) => {
    let replaced = label
    // eslint-disable-next-line
    if (searchWords && searchWords.length) {
      // eslint-disable-next-line
      compact(searchWords).forEach(word => {
        if (isRegexValid(word)) {
          replaced = replaced.replace(
            new RegExp(word, 'gi'),
            `<span style="border-bottom: 1px solid ${palette.primary.main}">${word}</span>`,
          )
        }
      })
    }
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: replaced,
        }}
      />
    )
  }

  const customTheme = theme => ({
    ...theme,
    colors: {
      ...theme.colors, // https://react-select.com/styles#overriding-the-theme
      neutral0: darkMode ? palette.common.black : palette.grey[100],
      neutral5: darkMode ? palette.common.black : palette.grey[100],
      neutral10: darkMode ? palette.common.white : palette.grey[100],
      neutral20: darkMode ? palette.grey[900] : palette.grey[100],
      neutral70: darkMode ? palette.common.white : theme.colors.neutral70,
      neutral80: darkMode ? palette.common.white : theme.colors.neutral80,
      primary25: darkMode ? palette.grey[700] : palette.grey[200],
      primary50: palette.grey[200],
      primary75: darkMode ? palette.grey[600] : palette.grey[100],
      primary: darkMode ? palette.grey[600] : palette.grey[400],
    },
  })

  const onChange = item => {
    onChangeStream(orderIndex, item)
  }

  const getBgColor = state => {
    if (!state.selectProps.darkMode) return palette.grey[100]

    return state.isFocused ? palette.grey[800] : palette.common.black
  }

  return (
    <SearchableSelectDropdown
      isAsync
      icon={SearchIcon}
      placeholder={
        <div className={clsx('am-body1', classes.placeholder)}>
          <OverflowTip text={placeholder || 'Select Stream...'} />
        </div>
      }
      isClearable
      getAsyncOptions={getOptions.callback}
      onChange={onChange}
      value={selectedStream}
      styles={{
        menu: (provided, state) => ({
          ...provided,
          background: palette.grey[state.selectProps.darkMode ? 700 : 100],
          width: 'calc(100% - 14px)',
          marginBottom: 0,
          marginTop: 0,
          marginLeft: 8,
        }),
        container: provided => ({
          ...provided,
          width: '97%',
        }),
        control: provided => ({
          ...provided,
          margin: '8px 8px 1px 8px',
        }),
        singleValue: provided => ({
          ...provided,
          color: palette.grey[700],
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: getBgColor(state),
          color: state.selectProps.darkMode
            ? palette.grey[50]
            : palette.grey[700],
          mixBlendMode: 'normal',
        }),
      }}
      filterOption={false}
      components={{ Option: OptionWithSnapshot }}
      formatOptionLabel={formatOptionLabel}
      theme={customTheme}
    />
  )
}

StreamSearch.propTypes = propTypes
StreamSearch.defaultProps = defaultProps

export default withApollo(StreamSearch)
