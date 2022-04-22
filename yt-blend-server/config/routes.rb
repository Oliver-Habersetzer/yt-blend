Rails.application.routes.draw do
  root 'sessions#index'

  get 'sessions/index', as: 'sessions'
  get 'sessions/show/:id' => 'sessions#show', as: 'session_show'
  post 'sessions/create', as: 'create_session'
  delete 'sessions/:id' => 'sessions#destroy', as: 'session_destroy'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
