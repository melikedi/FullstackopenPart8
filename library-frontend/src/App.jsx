import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Menu from './components/Menu'
import Home from './components/Home'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client'
import { Routes, Route } from 'react-router-dom'
import { BOOK_ADDED, ALL_BOOKS } from './queries'
import { updateCache } from './helper'

const App = () => {
    useSubscription(BOOK_ADDED, {
        onData: ({ data }) => {
            const bookAdded = data.data.bookAdded
            const message = `A book with title '${bookAdded.title}' is added to library.`
            notify(message)
            updateCache(
                client.cache,
                { query: ALL_BOOKS, variables: { genre: '' } },
                bookAdded,
            )
        },
    })
    const client = useApolloClient()
    const [errorMessage, setErrorMessage] = useState(null)
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 10000)
    }

    useEffect(() => {
        const savedToken = localStorage.getItem('libraryUserToken')
        if (savedToken) {
            setToken(savedToken)
        }
    }, [token])

    useEffect(() => {
        const savedUser = window.localStorage.getItem('libraryUser')
        if (savedUser) {
            const user = JSON.parse(savedUser)
            setUser(user)
        }
    }, [])
    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.clear()
        client.resetStore()
    }

    return (
        <div>
            <Menu token={token} logout={logout} user={user}></Menu>
            <Notify errorMessage={errorMessage} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/authors"
                    element={<Authors setError={notify} token={token} />}
                />
                <Route path="/books" element={<Books />} />
                <Route
                    path="/recommendations"
                    element={<Recommendations user={user} />}
                />
                <Route
                    path="/login"
                    element={
                        <LoginForm
                            setError={notify}
                            setToken={setToken}
                            setUser={setUser}
                        />
                    }
                />
                <Route
                    path="/newBook"
                    element={<NewBook setError={notify} token={token} />}
                />
            </Routes>
        </div>
    )
}

export default App
