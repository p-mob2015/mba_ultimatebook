Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    resources :celebrities
    resources :categories
    resources :genres
    resources :books
    post '/upload/photo', to: 'upload#person'
    post '/upload/cover', to: 'upload#book'
  end
end
