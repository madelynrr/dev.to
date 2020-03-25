require "rails_helper"

RSpec.describe API do
  describe "Collection Lists" do
    let(:user) { create(:user) }

    before do
      create(:article)
      sign_in user
    end

    it "can create a collection list" do
      params = { name: "Javascript",
                 tag_list: ["Javascript"] }

      expect(CollectionList.count).to eq(0)

      post "/api/v1/collection_lists", params: params

      expect(response).to be_successful
      expect(CollectionList.count).to eq(1)
      data = JSON.parse(response.body)
      expect(data["collections"].first["name"]).to eq("Javascript")
      expect(data["collections"].first["tag_list"]).to eq(["Javascript"])
      # expect(data["name"]).to eq("Javascript")
      # expect(data["tag_list"]).to eq(["Javascript"])
    end
  end
end
