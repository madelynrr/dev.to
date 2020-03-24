class Api::V1::CollectionListsController < ApplicationController

  def create
    coll = current_user.collection_lists.create(collection_list_params)
    # article = Article.first

    # x = coll.collection_list_articles << article




  end

  private
  def collection_list_params
    params.permit(:name, tag_list: [])
  end


  # def create
  #   collection = current_user.collection_list.create(collection_list_params)
  #   if collection.save
  #     response.status = 200
  #     render json: CollectionListSerializer.new(collection)
  #   else
  #     response.status = 401
  #     render json: {description: user.errors.full_messages.to_sentence}
  #   end
  # end

end
