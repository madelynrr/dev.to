import { h, Component } from 'preact';
import { PropTypes } from 'preact-compat';

export class CollectionForm extends Component {
  constructor(props) {
    super(props);
    this.state = { collectionTags: [], allTags: [], title: '' , ready: false};
  }

  componentDidMount() {
    console.log('here1')
    this.fetchAllTags();
  }

  fetchAllTags = () => {
    fetch('https://dev.to/api/tags')
      .then(response => response.json())
      .then(tags => this.createTagArray(tags))
      .then(() => this.setState({ready: true}))
      .catch(error => console.log(error));
  };

  createTagArray = tags => {
    console.log('here')
    const { userTags } = this.props;
    this.setState({allTags: userTags.concat(tags.map(tag => tag.name))});
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleNewTag = event => {
    this.setState({ tags: [...this.state.collectionTags, event.target.value] });
  };

  createCollection = event => {
    event.preventDefault();
    this.postCollection({ tag_list: this.state.collectionTags, name: this.state.title });
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
    return (
      !this.state.ready ? "Loading..." :
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
          {this.state.allTags.map(tag => (
            <option value={tag}>{tag}</option>
          ))}
        </select>
        <p className="select-multiple-msg">
          Shift + click to select multiple tags.
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
