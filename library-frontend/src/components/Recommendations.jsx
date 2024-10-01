import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
const Recommendations = ({ user }) => {
    const navigate = useNavigate()
    const favoriteGenre = user ? user.favoriteGenre : ''
    const result = useQuery(ALL_BOOKS, {
        variables: { genre: favoriteGenre },
        pollInterval: 2000,
    })
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [navigate, user])
    if (result.loading) {
        return <div>loading...</div>
    }
    const books = result.data.allBooks
    const titleStyle = {
        fontStyle: 'italic',
        fontWeight: 'bold',
    }

    return (
        <div>
            <h2>Recommendations</h2>
            <span>
                {favoriteGenre == '' ? (
                    <span> you did not specified a favorite genre </span>
                ) : (
                    <div>
                        <span>
                            books in your favorite genre{' '}
                            <span style={titleStyle}>{favoriteGenre}</span>
                        </span>
                        <table>
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th>author</th>
                                    <th>published</th>
                                </tr>
                                {books.map((a) => (
                                    <tr key={a.title}>
                                        <td>{a.title}</td>
                                        <td>{a.authorName}</td>
                                        <td>{a.published}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </span>
        </div>
    )
}
export default Recommendations
Recommendations.propTypes = {
    user: PropTypes.object,
}
