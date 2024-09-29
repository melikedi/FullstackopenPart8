import { useRef } from 'react'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'
import { useState } from 'react'
const SetAuthorBirthYearForm = ({ setError }) => {
    const selectInputRef = useRef()
    const [selectedAuthor, setselectedAuthor] = useState('')
    const [born, setBorn] = useState('')
    const result = useQuery(ALL_AUTHORS)
    const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            const messages = error.graphQLErrors
                .map((e) => e.message)
                .join('\n')
            setError(messages)
        },
    })
    if (result.loading) {
        return null
    }

    const options = result.data.allAuthors.map((a) => ({
        value: a.name,
        label: a.name,
    }))
    const submit = async (event) => {
        console.log(selectedAuthor)
        event.preventDefault()
        updateAuthor({
            variables: {
                name: selectedAuthor ? selectedAuthor.value : null,
                setBornTo: born !== '' ? Number(born) : null,
            },
        })
        selectInputRef.current.clearValue()
        setselectedAuthor('')
        setBorn('')
    }
    return (
        <div>
            <h2>set birthYear</h2>
            <form onSubmit={submit}>
                <div>
                    <Select
                        ref={selectInputRef}
                        defaultValue={selectedAuthor}
                        onChange={setselectedAuthor}
                        options={options}
                    />
                </div>

                <div>
                    born
                    <input
                        type="number"
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>

                <button type="submit">update Author</button>
            </form>
        </div>
    )
}
export default SetAuthorBirthYearForm
