class CollectionListsController < ApplicationController
  def show
    collection = CollectionList.find(params[:id])
    @articles = collection.articles.includes([:taggings]).to_json
  end
end
