require "rails_helper"

RSpec.describe API do
  describe "Collection Lists" do
    let(:user) { create(:user) }

    before do
      create(:article)
      sign_in user
    end

    it "can create a collection list" do
      article = Article.first

      params = { name: "Javascript",
                 tag_list: article.tag_list }

      expect(CollectionList.count).to eq(0)

      post "/api/v1/collectionlists", params: params

      expect(response).to be_successful
      expect(CollectionList.count).to eq(1)
      data = JSON.parse(response.body)
      expect(data["collections"].first["name"]).to eq("Javascript")
      expect(data["collections"].first["tag_list"]).to eq(article.tag_list)
    end
  end
end
