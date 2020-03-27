module CollectionLists

  class CollectionListWorker
    include Sidekiq::Worker

    def perform
      collections = CollectionList.all
      collections.each do |collection|
        if (collection.created_at + 2.seconds) < Time.now
          new_collection = CollectionList.create(name: collection.name, user_id: collection.user_id, tag_list: collection.tag_list)

          new_collection.find_articles
        end
      end
    end

  end
end
