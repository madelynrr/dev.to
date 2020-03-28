class CollectionListsController < ApplicationController
  def show
    collection = CollectionList.find(params[:id])
    @articles = collection.articles.includes([:taggings]).to_json
    @name = collection.name
  end
end
