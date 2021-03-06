class Api::V1::CollectionListsController < ApplicationController
  def create
    collection = current_user.collection_lists.create(collection_list_params)
    if collection.save
      articles = collection.find_articles
      collection.articles << articles
      render json: { collections: current_user.collection_lists.where("created_at >= ?", 1.week.ago) }
    else
      response.status = 401
    end
  end

  def destroy
    collection = CollectionList.find(params[:id])
    collection.destroy
    render json: { collections: current_user.collection_lists.where("created_at >= ?", 1.week.ago) }
  end

  private

  def collection_list_params
    params.permit(:name, tag_list: [])
  end
end
