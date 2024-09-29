import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
const Menu = ({ token, logout, user }) => {
    const padding = {
        paddingRight: 5,
    }
    return (
        <div>
            <Link style={padding} to="/">
                home
            </Link>
            <Link style={padding} to="/authors">
                authors
            </Link>
            <Link style={padding} to="/books">
                books
            </Link>
            {token ? (
                <Link style={padding} to="/newBook">
                    add Book
                </Link>
            ) : null}
            {token ? (
                <Link style={padding} to="/recommendations">
                    recommend
                </Link>
            ) : null}
            {token ? (
                <span>
                    <span> {user ? user.username : '111'} logged in </span>
                    <Link
                        style={padding}
                        onClick={() => {
                            logout()
                        }}
                    >
                        Logout
                    </Link>
                </span>
            ) : (
                <Link style={padding} to="/login">
                    Login
                </Link>
            )}
        </div>
    )
}
export default Menu
Menu.propTypes = {
    token: PropTypes.string,
    logout: PropTypes.func,
    user: PropTypes.object,
}
