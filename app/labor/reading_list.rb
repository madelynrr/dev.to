class ReadingList
  # attr_accessor allows access to read or write to the @user variable
  attr_accessor :user
  # initializes by passing in a user (assume it's current user) sets that to an instance variable
  def initialize(user)
    @user = user
  end

  # makes an AR query to find articles and associated reactions. It also includes the user model
  # where the user needs certain criteria defined in a helper method. I believe this returns the list of reading list articles
  def get
    Article.
      joins(:reactions).
      includes(:user).
      where(reactions: reaction_criteria).
      order("reactions.created_at DESC")
  end

  # Looks like the ids of the articles in a reading list are cached for quicker access
  # returns a list of ids based on a helper method
  def cached_ids_of_articles
    Rails.cache.fetch("reading_list_ids_of_articles_#{user.id}_#{user.updated_at.rfc3339}") do
      ids_of_articles
    end
  end

  # Helper method that returns a list of reaction ids based on the reaction_criteria helper method
  def ids_of_articles
    Reaction.where(reaction_criteria).order("created_at DESC").pluck(:reactable_id)
  end

  # Returns the number of articles in a reading list
  def count
    get.size
  end

  # Helper method that filters users reactions/reactions based on them belonging to a user, being associated with an article, AND being part of a reading list.
  def reaction_criteria
    { user_id: user.id, reactable_type: "Article", category: "readinglist" }
  end
end
