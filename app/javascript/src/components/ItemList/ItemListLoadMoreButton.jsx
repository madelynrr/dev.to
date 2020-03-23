// Load more button for item list
// Archive / unarchive button for item list

// NOTE: although this element should clearly be a button and not an anchor,
// I think I've stumbled on a (p)React bug similar to this:
// <https://github.com/facebook/react/issues/9023>
// where if I transform it in a button, `e.preventDefault()` in the parent
// handler or `e.stopPropagation` are just ignored
import { h } from 'preact';
import { PropTypes } from 'preact-compat';
// creates functional component ItemListItemArchiveButton with text and onClick props passed down
export const ItemListLoadMoreButton = ({ show, onClick }) => {
  if (!show) {
    return '';
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    // returns a link that either says archive or unarchive based on the text passed down by ReadingList
    <div className="load-more-wrapper">
      <button onClick={onClick} type="button">
        Load More
      </button>
    </div>
  );
};
// checks that the data types passed in as props are as expected
ItemListLoadMoreButton.propTypes = {
  show: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
