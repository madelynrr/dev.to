// Archive / unarchive button for item list

// NOTE: although this element should clearly be a button and not an anchor,
// I think I've stumbled on a (p)React bug similar to this:
// <https://github.com/facebook/react/issues/9023>
// where if I transform it in a button, `e.preventDefault()` in the parent
// handler or `e.stopPropagation` are just ignored
import { h } from 'preact';
import { PropTypes } from 'preact-compat';

// creates functional component ItemListItemArchiveButton with text and onClick props passed down 
export const ItemListItemArchiveButton = ({ text, onClick }) => {
  // allows a user hitting the enter key to function as a click
  const onKeyUp = e => {
    if (e.key === 'Enter') {
      onClick(e);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    // returns a link that either says archive or unarchive based on the text passed down by ReadingList
    <a
      className="archive-button"
      onClick={onClick}
      onKeyUp={onKeyUp}
      tabIndex="0"
      aria-label="archive item"
      role="button"
    >
      {text}
    </a>
  );
};

// checks that the data types passed in as props are as expected
ItemListItemArchiveButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
