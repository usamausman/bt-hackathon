const request = require('request-promise-native')
const express = require('express')

const FLIGHTS_SESSION =
  'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0'
const FLIGHTS_POLL =
  'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/'

const userPrefs = {
  country: 'UK',
  currency: 'GBP',
  locale: 'en-GB',
}

const getFlights = async ({ from, to, depart, people, comeBack }) => {
  const options = {
    json: true,
    resolveWithFullResponse: true,
    headers: {
      'x-rapidapi-host':
        'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': '980ec0e470mshc557b84365c9255p1b30f4jsn5111baeb60ae',
      'content-type': 'application/x-www-form-urlencoded',
    },
  }

  const { headers } = await request.post(FLIGHTS_SESSION, options).form({
    // get search session id
    ...userPrefs,
    originPlace: `${from}-sky`,
    destinationPlace: `${to}-sky`,
    outboundDate: depart,
    inboundDate: comeBack || undefined,
    ...people,
  })

  const sessionID = headers.location.split('/').reverse()[0]

  const { body } = await request.get(FLIGHTS_POLL + sessionID, {
    ...options,
    sort: 'price',
  })

  // looks like last option is cheapest
  const flights = body.Itineraries.map((itinerary) => {
    // console.log(itinerary)
    // console.log(
    //   itinerary.PricingOptions[itinerary.PricingOptions.length - 1].Price
    // ) // cheapest?
    const leg = body.Legs.find((leg) => leg.Id === itinerary.OutboundLegId)
    // console.log(leg.Departure)
    // console.log(leg.Arrival)
    const segments = leg.SegmentIds.map((id) => body.Segments[id])
    segments.forEach((segment) => {
      const origin = body.Places.find(
        (place) => place.Id === segment.OriginStation
      )
      const destination = body.Places.find(
        (place) => place.Id === segment.DestinationStation
      )
      const departure = segment.DepartureDateTime
      const arrival = segment.ArrivalDateTime
      const carrier = body.Carriers.find(
        (carrier) => carrier.Id === segment.Carrier
      )
      const flightNumber = segment.FlightNumber

      // console.log(
      //   `${carrier.Name} #${flightNumber}: ${origin.Name} -> ${destination.Name} from ${departure} to ${arrival}`
      // )
    })
    return {
      price:
        itinerary.PricingOptions[itinerary.PricingOptions.length - 1].Price,
      depart: leg.Departure,
      arrival: leg.Arrival,
      flights: segments.map((segment) => {
        return {
          airport: body.Places.find(
            (place) => place.Id === segment.DestinationStation
          ).Name,
          from: segment.DepartureDateTime,
          to: segment.ArrivalDateTime,
        }
      }),
    }
  })

  return flights
  // return headers
}

const app = express()

app.get('/flights/:from-:to/:date/:adults', async (req, res) => {
  const data = await getFlights({
    from: req.params.from,
    to: req.params.to,
    people: { adults: req.params.adults },
    depart: req.params.date,
  })
  data.sort((a, b) => a.price - b.price)

  res.json(data)
})

app.listen(8001, () => {
  console.log('Listening for flight requests...')
})