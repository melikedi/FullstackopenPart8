import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS } from '../queries'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { updateCache } from '../helper'
const NewBook = ({ setError, token }) => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [published, setPublished] = useState('')
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])
    const [addBook] = useMutation(CREATE_BOOK, {
        onCompleted: () => {
            setTitle('')
            setPublished('')
            setAuthor('')
            setGenres([])
            setGenre('')
        },
        update: (cache, { data }) => {
            updateCache(
                cache,
                { query: ALL_BOOKS, variables: { genre: '' } },
                data.addBook,
            )
        },
        onError: (error) => {
            const messages = error.graphQLErrors
                .map(
                    (e) =>
                        e.message +
                        '\n' +
                        (Object.prototype.hasOwnProperty.call(
                            e.extensions,
                            'error',
                        )
                            ? e.extensions.error.message
                            : ''),
                )
                .join('\n')
            setError(messages)
        },
    })
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [navigate, token])
    const submit = async (event) => {
        event.preventDefault()
        addBook({
            variables: {
                title: title !== '' ? title : null,
                author: author !== '' ? author : null,
                published: published !== '' ? Number(published) : null,
                genres: genres,
            },
        })
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }
    if (!token) {
        return null
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type="number"
                        value={published}
                        onChange={({ target }) => setPublished(target.value)}
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({ target }) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">
                        add genre
                    </button>
                </div>
                <div>genres: {genres.join(' ')}</div>
                <button type="submit">create book</button>
            </form>
        </div>
    )
}

export default NewBook
NewBook.propTypes = {
    token: PropTypes.string,
    setError: PropTypes.func,
}
