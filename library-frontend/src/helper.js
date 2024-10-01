export const updateCache = (cache, query, addedBook) => {
    const uniqById = (books) => {
        const seen = new Set()
        return books.filter((book) => {
            if (seen.has(book.id)) {
                return false
            } else {
                seen.add(book.id)
                return true
            }
        })
    }
    const data = cache.readQuery(query)
    if (data) {
        cache.updateQuery(
            query, // Pass variables here
            ({ allBooks }) => {
                return {
                    allBooks: uniqById(allBooks.concat(addedBook)),
                }
            },
        )
    }
}
