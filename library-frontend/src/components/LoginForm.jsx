import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { LOGIN, CURRENT_USER } from '../queries'
import { useNavigate } from 'react-router-dom'
const LoginForm = ({ setError, setToken, setUser }) => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const currentUser = useQuery(CURRENT_USER)
    const [login, result] = useMutation(LOGIN, {
        onCompleted: () => {
            setUsername('')
            setPassword('')
        },
        refetchQueries: [{ query: CURRENT_USER }],
        awaitRefetchQueries: true,
        onError: (error) => {
            const messages = error.graphQLErrors
                .map((e) => e.message)
                .join('\n')
            setError(messages)
        },
    })

    const submit = async (event) => {
        event.preventDefault()
        login({ variables: { username, password } })
    }

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('libraryUserToken', token)
            currentUser.refetch()
        }
    }, [result, setToken, currentUser])

    useEffect(() => {
        if (currentUser.data) {
            setUser(currentUser.data.me)
            localStorage.setItem(
                'libraryUser',
                JSON.stringify(currentUser.data.me),
            )
            if (currentUser.data.me) {
                navigate('/')
            }
        }
    }, [currentUser, setUser, navigate])

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username{' '}
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password{' '}
                    <input
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}
export default LoginForm
LoginForm.propTypes = {
    setError: PropTypes.func,
    setUser: PropTypes.func,
    setToken: PropTypes.func,
}
