class CollectionListArticle < ApplicationRecord
  belongs_to :collection_list
  belongs_to :article
end
