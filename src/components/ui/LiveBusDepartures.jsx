import React, { Component } from 'react'

import '../../styles/LiveBusDepartures.css'

class BusInfo extends Component {
  render() {
    if (this.props.bus[0] === 4) {
      return null
    } else {
      const { bus } = this.props
      return (
          <div className="d-flex w-100 justify-content-start mb-1">
            <p className='mr-2'>{bus[2]}</p>
            <p>{bus[3]}</p>
            <p className="ml-auto">
              {
                Math.round(((
                  Math.abs(new Date(bus[5] - Date.now())) % 86400000
                ) % 3600000) / 60000)
              }
              &nbsp;mins
            </p>
          </div>
      )
    }
  }
}

class LiveBusDepartures extends Component {
  render() {
    const { data } = this.props || []
    return (
      <div>
        <h3>Live Bus Departures</h3>
        <p className='LiveBusDepartures-subheading mb-4'>The next buses to arrive at {data[0][1]}</p>
        {data.map(bus => <BusInfo key={bus[4]} bus={bus} />)}
      </div>
    )
  }
}

export default LiveBusDepartures
