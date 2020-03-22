class ReadingListItemsController < ApplicationController
  # index action calling on these helper methods and passing an instance variable set to true to the view (the helper methods are creating an algolia search key, and setting to view to either archived or valid)
  def index
    @reading_list_items_index = true
    set_view
    generate_algolia_search_key
  end

  # update action, reaction created (a "like") and saved, if it's the current user's user id
  def update
    @reaction = Reaction.find(params[:id])
    not_authorized if @reaction.user_id != session_current_user_id

    @reaction.status = params[:current_status] == "archived" ? "valid" : "archived"
    @reaction.save
    head :ok
  end

  private

  # both called whenever reading list index viewed

  # algolia search key created for current user, given params and the search only key in the application.yml file (that's where we stored it, and this is working, but calling differently, ApplicationConfig instead of ENV)
  # Where is Algolia being called... still tracking that down
  def generate_algolia_search_key
    params = { filters: "viewable_by:#{session_current_user_id}" }
    @secured_algolia_key = Algolia.generate_secured_api_key(
      ApplicationConfig["ALGOLIASEARCH_SEARCH_ONLY_KEY"], params
    )
  end

  # passing the view a setting of either archived or validate_url
  def set_view
    @view = if params[:view] == "archive"
              "archived"
            else
              "valid"
            end
  end
end
