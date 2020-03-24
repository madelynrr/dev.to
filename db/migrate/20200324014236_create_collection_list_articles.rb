class CreateCollectionListArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :collection_list_articles do |t|
      t.references :collection_list, foreign_key: true
      t.references :article, foreign_key: true

      t.timestamps
    end
  end
end
