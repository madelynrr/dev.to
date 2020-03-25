FactoryBot.define do
  factory :collection_list, class: "CollectionList" do
    association :user, factory: :user
    name { "Javascript" }
  end
end
