class CollectionList < ApplicationRecord
  belongs_to :user, optional: true

  validates :name, presence: true

  has_many :collection_list_articles
  has_many :articles, through: :collection_list_articles, dependent: :destroy

  acts_as_taggable_on :tags

  def find_articles
    Article.where("created_at >= ?", 1.week.ago.utc).order(:page_views_count).limit(5)
  end
end