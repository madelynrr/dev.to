require "rails_helper"

RSpec.describe API do
  describe "Collection Lists" do
    it "can create a collection list" do
      post "/api/v1/collection_lists"

      expect(CollectionList.count).to eq(0)
      expect(response).to be_successful
      expect(CollectionList.count).to eq(1)
    end
  end
end
