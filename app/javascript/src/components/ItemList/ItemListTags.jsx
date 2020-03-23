// Sidebar tags for item list page
import { h } from 'preact';
import { PropTypes } from 'preact-compat';

// maps through the availableTags passed down through ReadingList and creates a link for each one, on click, the link fires off the toggleTag function from ReadingList
export const ItemListTags = ({ availableTags, selectedTags, onClick }) => {
  // maps through the availableTags passed down through ReadingList and creates a link for each one, on click, the link fires off the toggleTag function from ReadingList
  const tagsHTML = availableTags.map(tag => (
    <a
      className={`tag ${selectedTags.indexOf(tag) > -1 ? 'selected' : ''}`}
      href={`/t/${tag}`}
      data-no-instant
      onClick={e => onClick(e, tag)}
    >
      {`#${tag}`}
    </a>
  ));
  // returns the entire collection of tags to be displayed on the dom
  return <div className="tags">{tagsHTML}</div>;
};

// checks that the props data types are coming in as expected
ItemListTags.propTypes = {
  availableTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
};
