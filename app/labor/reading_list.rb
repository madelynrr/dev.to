class ReadingList
  # give us read and write access to the user
  attr_accessor :user

  # initialize a new reading list with an incoming user
  def initialize(user)
    @user = user
  end

  # call to database to retrieve articles that where reactions adhere to reading_criteria (helper method below), ordered by most recent
  # includes user, so won't need second database call for the article's user
  def get
    Article.
      joins(:reactions).
      includes(:user).
      where(reactions: reaction_criteria).
      order("reactions.created_at DESC")
  end

  # caches return from ids_of_articles
  def cached_ids_of_articles
    Rails.cache.fetch("reading_list_ids_of_articles_#{user.id}_#{user.updated_at.rfc3339}") do
      ids_of_articles
    end
  end

  # makes a database call to find reactable_ids from Reactions where reaction_criteria is true
  def ids_of_articles
    Reaction.where(reaction_criteria).order("created_at DESC").pluck(:reactable_id)
  end

  # counting up the articles returned
  def count
    get.size
  end

  # defining reaction criteria as having the current user id, being an article, and being in the readingList category
  def reaction_criteria
    { user_id: user.id, reactable_type: "Article", category: "readinglist" }
  end
end
