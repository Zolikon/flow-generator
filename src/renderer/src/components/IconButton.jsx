import PropTypes from 'prop-types'
import { resolveTheme } from './themeUtil'

const IconButton = ({ iconName, onClick, theme = 'green' }) => {
  return (
    <button
      className={`group p-2 flex items-center justify-center rounded-full aspect-square w-12 ${resolveTheme(theme)}`}
      onClick={onClick}
    >
      <i className="material-symbols-outlined group-hover:scale-125 transition-all duration-300">{iconName}</i>
    </button>
  )
}

IconButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['blue', 'green', 'red']),
}

export default IconButton
