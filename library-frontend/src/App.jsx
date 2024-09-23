import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Menu from './components/Menu'
import Home from './components/Home'
import Notify from './components/Notify'
import { Routes, Route } from 'react-router-dom'
const App = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 10000)
    }
    return (
        <div>
            <Menu></Menu>
            <Notify errorMessage={errorMessage} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/authors"
                    element={<Authors setError={notify} />}
                />
                <Route path="/books" element={<Books />} />
                <Route
                    path="/newBook"
                    element={<NewBook setError={notify} />}
                />
            </Routes>
        </div>
    )
}

export default App
