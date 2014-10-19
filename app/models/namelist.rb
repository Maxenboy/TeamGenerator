class Namelist < ActiveRecord::Base
  scope :user_lists, ->(uuid) { where(uuid: uuid) }
  scope :recent, -> { where('created_at > ?', 2.weeks.ago) }

  def self.latest_user_list(uuid)
    user_lists(uuid).last
  end  

  def self.group_day_created_count
    group('DATE(created_at)').count
  end

  def self.group_nbr_of_teams_count
    group(:nbr_of_teams).count
  end
end
