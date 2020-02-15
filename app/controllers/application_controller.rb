class ApplicationController < ActionController::Base
  # Source: https://github.com/jekuno/milia/issues/76
  before_action :authenticate_tenant!
end
