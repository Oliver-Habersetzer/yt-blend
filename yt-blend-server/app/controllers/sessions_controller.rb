class SessionsController < ApplicationController
  def create
    @room_id = SecureRandom.uuid
    cookies[:room_id] = @room_id
    $redis.set(@room_id, session[:session_id])

    redirect_to session_show_url(@room_id)
  end

  def broadcast
    ActionCable.server.broadcast "room_#{broadcast_params[:room_id]}", {
      :message => broadcast_params[:message], :from => broadcast_params[:user]}
  end

  def index
    @rooms = $redis.DBSIZE
  end

  def show
    @room_id = params[:id]

    unless $redis.get(@room_id)
      redirect_to sessions_url, notice: "Illegal room id"
      return
    end

    ActionCable.server.broadcast "room_#{@room_id}", "User #{session[:session_id]} entered the room"
  end

  def destroy
    unless $redis.get(params[:id]) == session[:session_id]
      return redirect_to sessions_url, notice: "This is not your room!"
    end

    if $redis.del(params[:id]) == 1
      flash[:notice] = "Room with id '#{params[:id]}' destroyed successfully"

      redirect_to sessions_url
    end
  end

  private

  def broadcast_params
    params.require(:session).permit(:room_id, :user, :message)
  end

end
