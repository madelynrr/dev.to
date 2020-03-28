module CollectionLists

  class CollectionListWorker
    include Sidekiq::Worker

    def perform
      collections = CollectionList.all
      collections.each do |collection|
        if (collection.created_at + 2.seconds) < Time.now
          new_collection = CollectionList.create(name: collection.name, user_id: collection.user_id, tag_list: collection.tag_list)

          articles = new_collection.find_articles
          new_collection.articles << articles
        end
      end
    end
  end

  CollectionListWorker.perform_at(1.minutes.from_now)

#   Sidekiq::Cron::Job.create(name: 'CollectionList Update - every day', cron: '0 0 * * *', class: CollectionListWorker)
#
#   if job.valid?
#     job.save
#   else
#     puts job.errors
#   end
end
