require "rails_helper"

RSpec.describe CollectionList do
  describe "Validations" do
    it { is_expected.to validate_presence_of :name }
  end
end
