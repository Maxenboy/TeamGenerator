class HomeController < ApplicationController
  def index
  end

  def latest_result
  	render json: Namelist.where(uuid: user_uuid).last || Namelist.new
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
    user_namelists = Namelist.where(uuid: user_uuid)
    render json: user_namelists.group(:nbr_of_teams).count
  end
end
