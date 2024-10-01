import { useQuery } from '@apollo/client'
import { GENRES, ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
    const [genre, setGenre] = useState('')
    const result = useQuery(ALL_BOOKS, {
        variables: { genre },
    })
    const genresResult = useQuery(GENRES)
    let books
    let genres
    if (result.loading || genresResult.loading) {
        return <div>loading...</div>
    } else {
        books = result.data.allBooks
        genres = genresResult.data.Genres.enumValues
            .map((ev) => {
                return { genre: ev.name, buttonname: ev.name }
            })
            .concat({ genre: '', buttonname: 'all genres' })
    }
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
                            <td>{a.author}</td>
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
                    }}
                >
                    {g.buttonname}
                </button>
            ))}
        </div>
    )
}

export default Books
