// Load more button for item list
import { h } from 'preact';
import { PropTypes } from 'preact-compat';

// creates functional component ItemListLoadMoreButton with shoew and onClick props
export const ItemListLoadMoreButton = ({ show, onClick }) => {
  if (!show) {
    return '';
  }

  // if there are more items to display, provides the user a 'load more' button, on click, it runs the loadNextPage function from ReadingList component
  return (
    <div className="load-more-wrapper">
      <button onClick={onClick} type="button">
        Load More
      </button>
    </div>
  );
};

// checks that the prop data types passed in are as expected
ItemListLoadMoreButton.propTypes = {
  show: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
