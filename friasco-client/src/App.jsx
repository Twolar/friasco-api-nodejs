import "./style.css"

function App() {
  return (
    <>    
      <form className="new-item-form">
        <div className="form-row">
          <label>New Item</label>
          <input type="text"></input>
        </div>
        <button className="btn">Add</button>
      </form>

      <h1 className="header">Todo List</h1>

      <ul className="list">
        <li>
          <label>
            <input type="checkbox"/>TEST TITLE</label>
            <button className="btn btn-danger">Delete</button>
        </li>
      </ul>
    </>
  )
}

export default App
