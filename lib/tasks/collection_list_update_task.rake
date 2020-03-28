desc "Update Collection Lists that are a week old"
task collection_list_update: :environment do
  collections = CollectionList.all
  collections.each do |collection|
    if (collection.created_at + 1.weeks) < Time.now
      new_collection = CollectionList.create(name: collection.name, user_id: collection.user_id, tag_list: collection.tag_list)

      articles = new_collection.find_articles
      new_collection.articles << articles
    end
  end
end
