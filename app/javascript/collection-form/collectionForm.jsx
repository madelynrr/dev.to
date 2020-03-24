import { h, Component } from 'preact';
import { PropTypes } from 'preact-compat';

export class CollectionForm extends Component {
  constructor(props) {
    super(props);
    this.state = { tags: [], title: '' };
  }

  componentDidMount() {
    this.fetchAllTags();
  }

  fetchAllTags = () => {
    fetch('https://dev.to/api/tags')
      .then(response => response.json())
      .then(tags => this.setState({ allTags: tags }))
      .catch(error => console.log(error));
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleNewTag = event => {
    this.setState({ tags: [...this.state.tags, event.target.value] });
  };

  createCollection = event => {
    event.preventDefault();
    this.postCollection({ tags: this.state.tags, title: this.state.title });
    this.clearState();
  };

  postCollection = collection => {
    const options = {
      method: 'POST',
      body: JSON.stringify(collection),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return fetch('http://localhost:3001/api/v1/collectionlists', options)
      .then(response => {
        if (!response.ok) {
          throw Error('Error posting');
        }
        return response.json();
      })
      .then(collectionData => console.log(collectionData));
  };

  clearState = () => {
    this.setState({ tags: [], title: '' });
  };

  render() {
    const { userTags } = this.props;
    // const orderedTags = userTags.concat(this.state.allTags.map(tag => tag.name));

    return (
      <form className="collection-form">
        <h3>Create A Collection</h3>
        <input
          type="text"
          name="title"
          value={this.state.title}
          onChange={this.handleChange}
          placeholder="Title..."
        />
        <select
          className="collection-tags-list"
          multiple
          onChange={this.handlePropertyChange}
        >
          <option>Select Tags...</option>
          {userTags.map(tag => (
            <option value={tag}>{tag}</option>
          ))}
        </select>
        <p className="select-multiple-msg">
          Hold shift and click to select multiple.
        </p>
        <button id="create-collection-btn" onClick={this.createCollection}>
          Create
        </button>
      </form>
    );
  }
}

CollectionForm.propTypes = {
  userTags: PropTypes.array
};
