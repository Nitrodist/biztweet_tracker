class SearchesController < ApplicationController
  def update
    s = Search.new
    s.query = params[:q]
    s.save
    render :text => ' ', :status => "200 OK"
  end

  def get
    @searches = Search.order('created_at').last(5).reverse
  end
end
