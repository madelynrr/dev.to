# require "rails_helper"
#
# RSpec.describe "CollectionListsController", type: :request do
#
#   before do
#     @a1 = create(:article, tags: ['java', 'react', 'sql'])
#     @a6 = create(:article, tags: ['java', 'react', 'sql'])
#     @a2 = create(:article, tags: ['rails', 'react', 'postgress'])
#     @a3 = create(:article, tags: ['javascript', 'rails', 'sql'])
#     @a4 = create(:article, tags: ['rails', 'react', 'sql'])
#     @a5 = create(:article, tags: ['java', 'react', 'sql'])
#     @user = create(:user)
#     @collection = @user.collection_lists.create(name: "Hello Java", tag_list: ['java', 'rails'])
#     @collection.articles << @collection.find_articles
#   end
#
#   describe "GET collection list" do
#
#     it "returns a collection list page" do
#       get "/collectionlists/#{@collection.id}"
#       expect(response).to be_successful
#     end
#   end
#
# end
