require "rails_helper"

RSpec.describe CollectionListArticle do
  describe "Relationships" do
    it { is_expected.to belong_to :collection_list }
    it { is_expected.to belong_to :article }
  end
end
