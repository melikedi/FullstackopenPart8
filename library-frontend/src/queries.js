import { gql } from '@apollo/client'

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`
export const CURRENT_USER = gql`
    query {
        me {
            favoriteGenre
            username
        }
    }
`
export const GENRES = gql`
    query {
        Genres: __type(name: "Genre") {
            enumValues {
                name
            }
        }
    }
`

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`
export const BOOKS_BY_GENRE = gql`
    query AllBooks($genre: String) {
        allBooks(genre: $genre) {
            title
            authorName
            genres
            published
        }
    }
`
export const ALL_BOOKS = gql`
    query AllBooks {
        allBooks {
            title
            authorName
            genres
            published
        }
    }
`
export const UPDATE_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
        }
    }
`
export const CREATE_BOOK = gql`
    mutation AddBook(
        $title: String!
        $author: String!
        $published: Int!
        $genres: [Genre]!
    ) {
        addBook(
            title: $title
            author: $author
            published: $published
            genres: $genres
        ) {
            title
            authorName
            genres
            published
        }
    }
`
