class HomeController < ApplicationController
  def index
  end

  def latest_result
  	render json: Namelist.latest_user_list(user_uuid) || Namelist.new
  end

  def shuffle
  	names = Namelist.create(
  		area: 	      params[:area],
  		mentext:      params[:mentext],
  		womentext:    params[:womentext],
  		nbr_of_teams: params[:nbrOfTeams],
      uuid:         params[:uuid]
  	)
  	redirect_to home_index_path(page: :result, radio: params[:radio])
  end

  def shuffle_chart
    render json: Namelist.user_lists(user_uuid)
                         .group_nbr_of_teams_count
  end

  def user_shuffled_date_chart
    render json: Namelist.user_lists(user_uuid)
                         .group_day_created_count
  end

  def all_shuffled_date_chart
    render json: Namelist.all.group_day_created_count
  end
end
