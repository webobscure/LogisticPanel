import './App.css'
import { Link } from 'react-router'

function App() {

  return (
    <>
      <div className="greetings">
        <h1 className="greetings-title">
          Система управления автопарком
        </h1>
        <p className="greetings-descr">
          Добро пожаловать в административную панель управления автопарком
        </p>
        <Link to="/admin">
          <button className='greetings-button'>Перейти в админ панель</button>
        </Link>
      </div>
    </>
  )
}

export default App
