class Api::CelebritiesController < Api::ApiController
  before_action :check_presence, only: [:update, :destroy]

  def index
    render json: Celebrity.all
  end

  def destroy
    begin
      File.delete("public/uploads/celebrity/#{subject.photo}") unless subject.photo.nil?
    rescue => ex
      logger.error ex.message
    end

    subject.destroy
    render nothing: true, status: 200
  end

  def create
    @person = Celebrity.new(celebrity_params.except(:category_ids, :book_ids))

    if @person.valid?
      @person.save
      @person.assign_categories(celebrity_params[:category_ids])

      render json: @person
    else
      render_api_error('', 400, @person)
    end
  end

  def update
    @person = subject

    if @person.update(celebrity_params.except(:category_ids, :book_ids))
      @person.assign_categories(celebrity_params[:category_ids])
      @person.assign_books(celebrity_params[:book_ids])
      render json: @person
    else
      render_api_error('', 400, @person)
    end
  end

  private

  def check_presence
    if subject.nil?
      render_api_error('Celebrity not found', 404)
    end
    true
  end

  def subject
    Celebrity.find(params[:id])
  end

  def celebrity_params
    params.require(:celebrity).permit(:name, :bio, :photo, :category_ids => [], :book_ids => [])
  end
end