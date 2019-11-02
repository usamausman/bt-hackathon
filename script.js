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

  let results = []

  const submit = async (e) => {
    e.preventDefault()
    setSearched(!searched)

    const data = new FormData(form.current)
    // /?keyword=thingtodo&price=opt&page=opt
    let get = await fetch(`/?keyword=${data.get('activity')}`)
    get = await get.json()

    console.log(get)
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
          <input type="date" name="from"></input>
          <p>to</p>
          <input type="date" name="to"></input>
          <button type="submit">GO</button>
        </form>
        {searched && (
          <div class="results">
            <div class="result"></div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
