require "rails_helper"

RSpec.describe CollectionLists::CollectionListWorker, type: :job do
  describe "#perform" do
    it "creates a new collection list if the collection is older than three seconds" do
      create_list(:collection_list, 2)
      sleep(3)
      create(:collection_list)

      expect(CollectionList.all).to eq(3)

      worker = CollectionListWorker.new

      worker.perform

      expect(CollectionList.all).to eq(5)
    end
  end
end
