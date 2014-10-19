Rails.application.routes.draw do
  get 'home/index'
  get 'home/latest_result'
  get 'home/shuffle_chart'
  get 'home/user_shuffled_date_chart'
  get 'home/all_shuffled_date_chart'
  post 'home/shuffle'

  root 'home#index'
end
