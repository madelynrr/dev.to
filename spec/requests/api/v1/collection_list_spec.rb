require "rails_helper"

RSpec.describe API do
  describe "Collection Lists" do
    let(:user) { create(:user) }
    let(:article) { create(:article) }

    before do
      sign_in user
    end

    it "can create a collection list" do
      params = { name: "Javascript",
                 tag_list: ["Javascript"] }

      expect(CollectionList.count).to eq(0)

      post "/api/v1/collection_lists", params: params

      expect(response).to be_successful
      expect(CollectionList.count).to eq(1)
    end
  end
end
