import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'

import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
    split,
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
loadDevMessages()
loadErrorMessages()
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('libraryUserToken')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null,
        },
    }
})
const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
})
const wsLink = new GraphQLWsLink(createClient({ url: 'ws://localhost:4000' }))
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    authLink.concat(httpLink),
)
const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
})
ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <ApolloProvider client={client}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </ApolloProvider>
    </Router>,
)
