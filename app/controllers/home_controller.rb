class HomeController < ApplicationController
  def index
  end

  def latest_result
  	render json: Namelist.last
  end

  def shuffle
  	names = Namelist.create(
  		area: 	      params[:area],
  		mentext:      params[:mentext],
  		womentext:    params[:womentext],
  		nbr_of_teams: params[:nbrOfTeams]
  	)
	redirect_to home_index_path(page: :result,radio: params[:radio])   	
  end
end
