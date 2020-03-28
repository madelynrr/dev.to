import { h, Component } from 'preact';
import { PropTypes } from 'preact-compat';

export class CollectionForm extends Component {
  constructor(props) {
    super(props);
    this.state = { collectionTags: [], allTags: [], title: '' , error: '', ready: false};
  }

  componentDidMount() {
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
    const { userTags } = this.props;
    this.setState({allTags: userTags.concat(tags.map(tag => tag.name))});
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleNewTag = event => {
    var options = event.target.options;
    var value = [];
    for (var i = 0; i < options.length; i++) {
       if (options[i].selected) {
         value.push(options[i].value);
       }
    }
    this.setState({ collectionTags: value });
  };

  createCollection = event => {
    event.preventDefault();
    !this.state.title || !this.state.collectionTags.length ? this.setState({error: 'Please add a title and select tags!'}) :
    this.postCollection({name: this.state.title, tag_list: this.state.collectionTags });
  };

  postCollection = collection => {
    this.clearState();
    fetch("/api/v1/collectionlists", {
      method: 'POST',
      body: JSON.stringify(collection),
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': window.csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(collections => this.props.addCollection(collections.collections))
      .catch(error => console.log(error));
  };

  clearState = () => {
    this.setState({collectionTags: [], title: '' , error: ''});
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
          onChange={this.handleNewTag}
        >
          <option>Select Tags...</option>
          {this.state.allTags.map(tag => (
            <option value={tag}>{tag}</option>
          ))}
        </select>
        <p className="select-multiple-msg">
          Command + click to select multiple tags.
        </p>
        <button type="submit" id="create-collection-btn" onClick={this.createCollection}>
          Create
        </button>
        <p className="collection-error">{this.state.error}</p>
      </form>
    );
  }
}

CollectionForm.propTypes = {
  userTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  addCollection: PropTypes.func.isRequired,
};
