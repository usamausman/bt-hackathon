const App = () => {
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
      <img
        class="hero"
        src="https://sunriverpines.com/wp-content/uploads/2018/10/mountains-592185_1280.jpg"
      />
      <form class="choose">
        <select name="adults">
          <option value="1">1 Adult</option>
          <option value="2">2 Adults</option>
          <option value="3">3 Adults</option>
          <option value="4">4 Adults</option>
          <option value="5">5 Adults</option>
          <option value="6">6 Adults</option>
        </select>
        <p>looking to</p>
        <select name="activity">
          <option value="surf">Surf</option>
          <option value="hike">Hike</option>
          <option value="eat">Eat</option>
        </select>
        <p>from</p>
        <input type="date" name="from"></input>
        <p>to</p>
        <input type="date" name="to"></input>
        <button type="submit">GO</button>
      </form>
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
