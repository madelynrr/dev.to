// Tells babel to use h for JSX, brings Component to build out
import { h, Component } from 'preact';
// Imports PropTypes to double check that the data types you are expecting to receive
// through props are the ones you are getting.
import { PropTypes } from 'preact-compat';
// Imports debounce gto improve browser performance
import debounce from 'lodash.debounce';
import { CollectionForm } from '../collection-form/collectionForm';
// import { Collections } from '../collections/collections';


// Imports several functions from the searchableItemsList File
import {
  defaultState,
  loadNextPage,
  onSearchBoxType,
  performInitialSearch,
  search,
  toggleTag,
  clearSelectedTags,
} from '../searchableItemList/searchableItemList';

// Imports all of the components included in the ItemList folder
import { ItemListItem } from '../src/components/ItemList/ItemListItem';
import { ItemListItemArchiveButton } from '../src/components/ItemList/ItemListItemArchiveButton';
import { ItemListLoadMoreButton } from '../src/components/ItemList/ItemListLoadMoreButton';
import { ItemListTags } from '../src/components/ItemList/ItemListTags';
// Setting default prop StatusViewValid or STATUS_VIEW_ARCHIVED
const STATUS_VIEW_VALID = 'valid';
const STATUS_VIEW_ARCHIVED = 'archived';
// Sets up the two potentail paths for the reading list
const READING_LIST_ARCHIVE_PATH = '/readinglist/archive';
const READING_LIST_PATH = '/readinglist';
// const COLLECTION_PATH = "/collection_lists/:id"

// A functional component called FilterText that has selectedTags, query,
// and value props passed to it (not known from where), checks for selectedTags and
// query array lengths and returns either the value or a message ('Nothing with this filter')
const FilterText = ({ selectedTags, query, value }) => {
  return (
    <h1>
      {selectedTags.length === 0 && query.length === 0
        ? value
        : 'Nothing with this filter 🤔'}
    </h1>
  );
};
// Readlinglist class component (has state/methods) which is why it needs the extends component
export class ReadingList extends Component {
  constructor(props) {
    super(props);

    const { availableTags, statusView, collections } = this.props;
    this.state = defaultState({ availableTags, archiving: false, statusView, collections: []})
    // bind and initialize all shared functions
    // these are the functions that were imported on lines 9-17
    this.onSearchBoxType = debounce(onSearchBoxType.bind(this), 300, {
      leading: true,
    });
    this.loadNextPage = loadNextPage.bind(this);
    this.performInitialSearch = performInitialSearch.bind(this);
    this.search = search.bind(this);
    this.toggleTag = toggleTag.bind(this);
    this.clearSelectedTags = clearSelectedTags.bind(this);
  }

  // On componentDidMount (basically whenever the component renders), it destructures hitsPerPage and statusView from state (equivalent to const hitsPerPage = this.state.hitsPerPage)
  // It also executes the imported performInitialSearch function, which seems to set ReadingList state with search results
  componentDidMount() {
    const { hitsPerPage, statusView } = this.state;
    this.performInitialSearch({
      containerId: 'reading-list',
      indexName: 'SecuredReactions',
      searchOptions: {
        hitsPerPage,
        filters: `status:${statusView}`,
      },
    });

    this.setState({collections: JSON.parse(this.props.collections)})
  }

  // A method that determines statusView in state as either valid or archived
  toggleStatusView = event => {
    // prevents automatic refresh before event can be recorded
    event.preventDefault();
    // destructures query and selectedTags from state (const query = this.state.query)
    const { query, selectedTags } = this.state;
    // determines if status is valid or archived and the resulting path
    const isStatusViewValid = this.statusViewValid();
    const newStatusView = isStatusViewValid
      ? STATUS_VIEW_ARCHIVED
      : STATUS_VIEW_VALID;
    const newPath = isStatusViewValid
      ? READING_LIST_ARCHIVE_PATH
      : READING_LIST_PATH;

    // empty items so that changing the view will start from scratch
    this.setState({ statusView: newStatusView, items: [] });
    // executes the imported search function that returns results after searching in index
    this.search(query, {
      page: 0,
      tags: selectedTags,
      statusView: newStatusView,
    });

    // change path in the address bar
    window.history.replaceState(null, null, newPath);
  };

  // a method that toggles an item's archived status - the item that needs to be archived is passed in as an argument
  toggleArchiveStatus = (event, item) => {
    // prevents automatic refresh before event can be recorded
    event.preventDefault();
    // destructuring statusView, items, and totalCount from state
    const { statusView, items, totalCount } = this.state;
    // sends PUT request to the url referencing the specific item and its archived status
    window.fetch(`/reading_list_items/${item.id}`, {
      method: 'PUT',
      headers: {
        'X-CSRF-Token': window.csrfToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ current_status: statusView }),
      credentials: 'same-origin',
    });
    // removes the archived item from newItems and updates the totalCount in state
    const t = this;
    const newItems = items;
    newItems.splice(newItems.indexOf(item), 1);
    t.setState({
      archiving: true,
      items: newItems,
      totalCount: totalCount - 1,
    });

    // hide the snackbar in a few moments
    setTimeout(() => {
      t.setState({ archiving: false });
    }, 1000);
  };

  addCollection = (collections) => {
    this.setState({collections: collections})
  }

  removeCollection = event => {
    const deletedCollection = this.state.collections.find(collection => collection.name === event.target.id);
    const remaining = this.state.collections.filter(collection => collection.name !== deletedCollection.name)

    fetch(`/api/v1/collectionlists/${deletedCollection.id}`, {
      method: 'DELETE',
      body: JSON.stringify(deletedCollection.id),
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': window.csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(() => this.setState({collections: remaining}))
      .catch(error => console.log(error));
  };


  // returns state's statusView if valid
  statusViewValid() {
    const { statusView } = this.state;
    return statusView === STATUS_VIEW_VALID;
  }

  // method that returns relevant messaging if you don't have any items saved to your reading list yet, or if viewing the archived list, you don't have anything archived
  renderEmptyItems() {
    const { itemsLoaded, selectedTags, query } = this.state;
    // messaging for an empty reading list

    if (itemsLoaded && this.statusViewValid()) {
      return (
        <div className="items-empty">
          <FilterText
            selectedTags={selectedTags}
            query={query}
            value="Your Reading List is Lonely"
          />
          <h3>
            Hit the
            <span className="highlight">SAVE</span>
            or
            <span className="highlight">
              Bookmark
              <span role="img" aria-label="Bookmark">
                🔖
              </span>
            </span>
            to start your Collection
          </h3>
        </div>
      );
    }
    // messaging for archived items
    return (
      <div className="items-empty">
        <FilterText
          selectedTags={selectedTags}
          query={query}
          value="Your Archive List is Lonely"
        />
      </div>
    );
  }

  // every class component has a render method
  render() {
    // destructures most of state
    const {
      collections,
      items,
      itemsLoaded,
      totalCount,
      availableTags,
      selectedTags,
      showLoadMoreButton,
      archiving,
    } = this.state;
    // determines archived status
    const isStatusViewValid = this.statusViewValid();
    // determines if the button on ItemListItem (worst name ever) component should say archive or unarchive
    const archiveButtonLabel = isStatusViewValid ? 'archive' : 'unarchive';
    // creates an ItemListItem component for each reading list item
    const itemsToRender = items.map(item => {
      return (
        <ItemListItem item={item}>
          <ItemListItemArchiveButton
            text={archiveButtonLabel}
            onClick={e => this.toggleArchiveStatus(e, item)}
          />
        </ItemListItem>
      );
    });
    // a snackbar is basically a floating message - in this case, depending on archive status, determines what that floating message should be while in the process of archiving/unarchiving
    const snackBar = archiving ? (
      <div className="snackbar">
        {isStatusViewValid ? 'Archiving...' : 'Unarchiving...'}
      </div>
    ) : (
      ''
    );
    // the jsx that is being rendered
    // 247 : input used to search reading list
    // 251 : displays a list of the user's selected tags and button to clear the tags
    // 268 : seems that these are the cumalitive tags from all the reading list items, while the tags in the section just above are the tags a user is selecting to search/filter of reading list items
    // 274 : if you are currently viewing the reading list, you can click this to view the archive, and visa versa
    // 284 : where the reading list items are actually displayed
    // 294 : button component that allows you to load more reading list items once you have reached the bottom of the page
    // 299 : where the snack bar (floating message) lives on the item
    return (

      <div className="home item-list">
        <div className="side-bar">
          <div className="widget filters">
            <input
              onKeyUp={this.onSearchBoxType}
              placeHolder="search your list"
            />
            <div className="filters-header">
              <h4 className="filters-header-text">my tags</h4>
              {Boolean(selectedTags.length) && (
                <a
                  className="filters-header-action"
                  href={
                    isStatusViewValid
                      ? READING_LIST_PATH
                      : READING_LIST_ARCHIVE_PATH
                  }
                  onClick={this.clearSelectedTags}
                  data-no-instant
                >
                  clear all
                </a>
              )}
            </div>
            <ItemListTags
              availableTags={availableTags}
              selectedTags={selectedTags}
              onClick={this.toggleTag}
            />

            <div className="status-view-toggle">
              <a
                href={READING_LIST_ARCHIVE_PATH}
                onClick={() => this.toggleStatusView()}
                data-no-instant
              >
                {isStatusViewValid ? 'View Archive' : 'View Reading List'}
              </a>
            </div>
          </div>
          <CollectionForm
            key={Date.now()}
            _topLevelWrapper=""
            userTags={availableTags}
            addCollection={this.addCollection}
          />
        </div>

        <div className="items-container">

          <div className={`results ${itemsLoaded ? 'results--loaded' : ''}`}>
            <div className="results-header">
              {isStatusViewValid ? 'Articles' : 'Archived Articles'}
              {` (${totalCount > 0 ? totalCount : 'empty'})`}
            </div>
            <div>
              {items.length > 0 ? itemsToRender : this.renderEmptyItems()}
            </div>
          </div>

          <ItemListLoadMoreButton
            show={showLoadMoreButton}
            onClick={this.loadNextPage}
          />
        </div>

        <div className="collections-container">
          <div className="collections-header">Collections ({collections.length})</div>
            <div className="collection-list">
            {collections ? collections.map(collection =>
              <div className="single-collection">
                <button className="delete-collection-btn" type="button" id={collection.name} onClick={this.removeCollection}>X</button>
                <a className="collection-name" href={`/collectionlists/${collection.id}`} data-no-instant>
                <article className="single-collection-preview">
                  <h2>{collection.name}</h2>
                </article></a></div> ) : <div>No Collections Yet</div>}
            </div>
          </div>

        {snackBar}
      </div>
    );
  }
}
// checks the data types of ReadingList's default props or properties
ReadingList.defaultProps = {
  statusView: STATUS_VIEW_VALID,
  collections: PropTypes.array,
};
// checks the data types of ReadingList's props
ReadingList.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.object),
  availableTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  statusView: PropTypes.oneOf([STATUS_VIEW_VALID, STATUS_VIEW_ARCHIVED]),
};

FilterText.propTypes = {
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  query: PropTypes.arrayOf(PropTypes.string).isRequired,
};


// <div className="reading-list-header">
//   {isStatusViewValid ? 'Reading List' : 'Archive'}
// </div>
