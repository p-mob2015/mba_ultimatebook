class Api::GenresController < Api::ApiController
  before_action :check_presence, only: [:update, :destroy]

  def index
    render json: Genre.all
  end

  def destroy
    subject.destroy
    render nothing: true, status: 200
  end

  def create
    @genre = Genre.new(genre_params)

    if @genre.valid?
      @genre.save

      render json: @genre
    else
      render_api_error('', 400, @genre)
    end
  end

  def update
    @genre = subject

    if @genre.update(genre_params)
      render json: @genre
    else
      render_api_error('', 400, @genre)
    end
  end

  private

  def check_presence
    if subject.nil?
      render_api_error('genre not found', 404)
    end
    true
  end

  def subject
    Genre.find(params[:id])
  end

  def genre_params
    params.require(:genre).permit(:title)
  end
end