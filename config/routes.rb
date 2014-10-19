Rails.application.routes.draw do
  get 'home/index'
  get 'home/latest_result'
  get 'home/shuffle_chart'
  post 'home/shuffle'

  root 'home#index'
end
