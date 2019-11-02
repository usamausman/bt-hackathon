const countryToAirport = {
  spain: 'MAD',
  england: 'LHR',
  france: 'CDG',
  germany: 'FRA',
  USA: 'JFK',
  mexico: 'MEX',
  australia: 'SYD',
  china: 'PEK',
  japan: 'HND',
}

const App = () => {
  const [searched, setSearched] = React.useState(false)
  const form = React.useRef(null)

  let [results, setResults] = React.useState([])
  let [flights, setFlights] = React.useState([])
  let [open, setOpen] = React.useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSearched(true)

    const data = new FormData(form.current)
    // /?keyword=thingtodo&price=opt&page=opt
    let get = await fetch(`/index.php?keyword=${data.get('activity')}`)
    get = await get.json()

    if (!get) {
      alert('There are no results :(')
      get = []
    }

    setResults(get)
  }

  const showFlightsFor = (url) => async () => {
    setOpen(url)

    const data = new FormData(form.current)
    let from = data.get('fromCountry')
    // from = countryToAirport[from.toLowerCase()]
    from = 'france'
    from = countryToAirport[from]
    let start = data.get('from')
    let adults = data.get('adults')

    let result = results.find((result) => result.url === url)
    // let country = result.location.split(',').reverse()[0].toLowerCase()
    let country = 'spain'
    let flights = await fetch(
      `/flights/${from}-${countryToAirport[country]}/${start}/${adults}`
    )
    flights = await flights.json()

    setFlights(flights)
  }

  return (
    <React.Fragment>
      <nav>
        <ul>
          <li class="active">
            <a href="/" class="active">
              Home
            </a>
          </li>
          <li>
            <a href="/">Sign In</a>
          </li>
          <li>
            <a href="/">Refer a Friend</a>
          </li>
        </ul>
      </nav>
      <div class={searched ? 'hasResults' : ''}>
        <img
          class="hero"
          src="https://sunriverpines.com/wp-content/uploads/2018/10/mountains-592185_1280.jpg"
        />
        <form class="choose" action="activities" onSubmit={submit} ref={form}>
          <select name="adults">
            <option value="1">1 Adult</option>
            <option value="2">2 Adults</option>
            <option value="3">3 Adults</option>
            <option value="4">4 Adults</option>
            <option value="5">5 Adults</option>
            <option value="6">6 Adults</option>
          </select>
          <p>looking to</p>
          <input name="activity"></input>
          <p>from</p>
          <input type="country" name="fromCountry"></input>
          <p>departing</p>
          <input type="date" name="from"></input>
          <p>and returning</p>
          <input type="date" name="to"></input>
          <button type="submit">GO</button>
        </form>
        {searched && (
          <div class="results">
            {results.map((result) => (
              <div class="result" key={result.url}>
                <img src={result.image} />
                <div>
                  <a href={result.url}>{result.name}</a>
                  <p class="description">{result.description}</p>
                </div>
                <div>
                  <p>{result.location}</p>
                  <p>{result.duration}</p>
                  <p>£{result.price}</p>
                </div>
                <button onClick={showFlightsFor(result.url)}>
                  Check Flights
                </button>
                {open === result.url && (
                  <div>
                    {flights}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
