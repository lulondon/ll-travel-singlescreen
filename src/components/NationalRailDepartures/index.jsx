import React, { Component } from 'react'
import axios from 'axios'

import { rail } from '../../../config/config.json'

import DepartureBoardView from './component'

const { darwinApiProxy, darwinToken, refreshInterval } = rail

const randomRefreshInterval = () => {
  const min = refreshInterval - 1500
  const max = refreshInterval + 1500
  // eslint-disable-next-line no-mixed-operators
  return Math.random() * (min - max) + min
}

class NationalRailDepartures extends Component {
  constructor(props) {
    super(props)
    const {
      station,
      callingPoint,
      filter,
      options,
    } = props

    this.state = {
      departures: [],
      loading: false,
      error: null,
      filter,
      station,
      callingPoint,
      options,
    }

    this.loadDate = this.loadData.bind(this)
  }

  componentDidMount() {
    this.loadData()
    this.initialiseRefreshInterval()
  }

  componentWillReceiveProps(newProps) {
    const { station, callingPoint } = newProps

    this.setState({
      station,
      callingPoint,
    }, () => this.loadData())
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  initialiseRefreshInterval() {
    const timer = setInterval(() => this.loadData(), randomRefreshInterval())
    this.setState({ timer })
  }

  loadData() {
    const {
      station,
      callingPoint,
      options,
    } = this.state

    if (station) {
      this.setState({ loading: true })

      axios.post(`${darwinApiProxy}/getDepartureBoardWithDetails/${station.code}`, {
        token: darwinToken,
        options: {
          destination: callingPoint ? callingPoint.code : null,
          ...options,
        },
      })
        .then(response => this.setState({
          departures: response.data.trainServices,
          loading: false,
          error: null,
        }))
        .catch(() =>
          this.setState({
            loading: false,
            error: 'Connection error',
          }))
    }
  }

  render() {
    const {
      departures,
      station,
      callingPoint,
      error,
      loading,
      filter = '',
    } = this.state

    return (
      <DepartureBoardView
        station={station}
        callingPoint={callingPoint}
        departures={departures
          .filter(service =>
            filter.toLowerCase().indexOf(service.destination.crs.toLowerCase()) < 0)}
        loading={loading}
        error={error}
      />
    )
  }
}

export default NationalRailDepartures
