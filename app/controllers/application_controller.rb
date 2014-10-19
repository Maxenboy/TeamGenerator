class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  before_action :set_session_uuid
  helper_method :user_uuid

  def set_session_uuid
    session[:uuid] ||= SecureRandom.hex(32)
    @user_uuid       = session[:uuid]
  end

  def user_uuid
    @user_uuid
  end
end
