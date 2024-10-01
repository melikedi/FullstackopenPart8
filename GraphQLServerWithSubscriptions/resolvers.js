const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filter = {};
      if (args.genre) {
        filter.genres = args.genre;
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filter.author = author._id;
        }
      }
      const books = await Book.find(filter).populate("author");
      return books;
    },
    allAuthors: async (root) => {
      const authors = await Author.aggregate([
        {
          $lookup: {
            from: "books", // Collection to join (it should be in lowercase)
            localField: "_id", // Field from the User collection
            foreignField: "author", // Field from the Order collection
            as: "books", // Name of the array that will contain the joined documents
          },
        },
      ]);
      return authors;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Book: {
    author: (root) => root.author.name,
  },
  User: {
    favoriteGenre: (root) => (root.favoriteGenre ? root.favoriteGenre : ""),
  },
  Author: {
    bookCount: async (root) => {
      console.log("bookCount", root);
      return root.books.length;
    },
  },
  // Author: {
  //   bookCount: async (root) => {
  //     const author = await Author.findOne({ name: root.name });
  //     if (!author) {
  //       return 0;
  //     }
  //     const books = await Book.find({ author: author._id });
  //     return books.length;
  //   },
  // },
  Mutation: {
    createUser: async (root, args) => {
      if (args.password === undefined || args.password.length < 3) {
        throw new GraphQLError(
          "Password with at least 3 characters long should be defined.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.password,
            },
          }
        );
      }
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);
      const user = new User({
        username: args.username,
        passwordHash: passwordHash,
        favoriteGenre: args.favoriteGenre,
      });
      try {
        const savedUser = await user.save();
        return savedUser;
      } catch (error) {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const passwordcorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash);
      if (!passwordcorrect) {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          });
        }
      }
      const book = new Book({ ...args, author: author });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }
      pubsub.publish("BOOK_ADDED", { bookAdded: book });
      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            error,
          },
        });
      }
      return author;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};
module.exports = resolvers;
