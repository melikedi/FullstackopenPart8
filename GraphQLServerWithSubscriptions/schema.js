const typeDefs = `
    type Subscription {
        bookAdded: Book!
    }  
    enum Genre {
        Philosophy
        Existentialism
        Absurdism
        Theology
        Fiction
        Feminism
        Psychology
        Nihilism
    }
    type User {
        username: String!
        favoriteGenre: String!
        passwordHash:String!
        id: ID!
      }
    type Token {
        value:String!
    }   
    type Book {
        title:String!
        published:Int!
        author:String!
        id:ID!
        genres:[Genre]!
    }
    type Author {
        name:String!
        id:ID!
        born:Int
        bookCount:Int!
    }
    type Query {
        bookCount: Int
        authorCount: Int
        allBooks(author:String, genre:String): [Book!]
        allAuthors: [Author]
        me: User
    }
    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres:[Genre]!
        ): Book
        editAuthor(
            name:String!
            setBornTo:Int!
        ): Author
        createUser(
            username: String!
            password: String!
            favoriteGenre:String
        ): User
        login(
            username: String!
            password: String!
        ): Token       
    }
`;

module.exports = typeDefs;
