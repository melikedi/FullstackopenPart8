import { useQuery } from '@apollo/client'
import { GENRES, BOOKS_BY_GENRE } from '../queries'
import { useState, useEffect } from 'react'
const Books = () => {
    const [genre, setGenre] = useState('')
    const result = useQuery(BOOKS_BY_GENRE, {
        variables: { genre },
        pollInterval: 2000,
    })
    const resultGenre = useQuery(GENRES)
    useEffect(() => {
        resultGenre.refetch()
    })
    if (result.loading || resultGenre.loading) {
        return <div>loading...</div>
    }

    const books = result.data.allBooks
    const genres = resultGenre.data.Genres.enumValues
        .map((ev) => {
            return { genre: ev.name, buttonname: ev.name }
        })
        .concat({ genre: '', buttonname: 'all genres' })

    return (
        <div>
            <h2>books</h2>
            {genre !== '' ? <h3>selected genre : {genre} </h3> : null}
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
            {genres.map((g) => (
                <button
                    key={g.genre}
                    onClick={() => {
                        setGenre(g.genre)
                        result.refetch()
                    }}
                >
                    {g.buttonname}
                </button>
            ))}
        </div>
    )
}

export default Books
