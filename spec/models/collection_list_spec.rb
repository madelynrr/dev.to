require "rails_helper"

RSpec.describe CollectionList do
  describe "Validations" do
    it { is_expected.to validate_presence_of :name }
  end

  describe "Relationships" do
    it { is_expected.to belong_to(:user).optional }
    it { is_expected.to have_many :collection_list_articles }
    it { is_expected.to have_many(:articles).through :collection_list_articles }
  end
end
