class CollectionListsController < ApplicationRecord
  def show
    collection = CollectionList.find(params[:id])
    @articles = collection.articles
  end
end
