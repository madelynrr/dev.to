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

  describe "Methods" do

      before do
        @a1 = create(:article,  created_at: 2.days.ago, page_views_count: 2, tags: ['java', 'react', 'sql']) #should be in list
        @a6 = create(:article, page_views_count: 1, tags: ['java', 'react', 'sql']) #should be in list
        @a2 = create(:article, tags: ['ruby', 'react', 'postgress']) #should not be list
        @a3 = create(:article, created_at: 1.day.ago, page_views_count: 4, tags: ['javascript', 'rails', 'sql']) #should be in list
        @a4 = create(:article, tags: ['graphql', 'react', 'sql']) #should not be list
        @a5 = create(:article, created_at: 1.month.ago, tags: ['java', 'react', 'sql']) #should not be list
        @user = create(:user)
        @collection = @user.collection_lists.create(name: "Hello Java", tag_list: ['java', 'rails'])
      end

      it 'should be able to find articles for a collection' do
        expect(@collection.find_articles.length).to eq(3)
        expect(@collection.find_articles[0].id).to eq(@a3.id)
        expect(@collection.find_articles[1].id).to eq(@a1.id)
        expect(@collection.find_articles[2].id).to eq(@a6.id)
      end
  end
end
