import { gql } from '@apollo/client'
export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`
export const ALL_BOOKS = gql`
    query AllBooks {
        allBooks {
            title
            author
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
            author
            genres
            published
        }
    }
`
