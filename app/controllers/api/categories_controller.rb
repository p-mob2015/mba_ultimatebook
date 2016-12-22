class Api::CategoriesController < Api::ApiController
  before_action :check_presence, only: [:update, :destroy]

  def index
    render json: Category.all
  end

  def destroy
    subject.destroy
    render nothing: true, status: 200
  end

  def create
    @category = Category.new(category_params)

    if @category.valid?
      @category.save

      render json: @category
    else
      render_api_error('', 400, @category)
    end
  end

  def update
    @category = subject

    if @category.update(category_params)
      render json: @category
    else
      render_api_error('', 400, @category)
    end
  end

  private

  def check_presence
    if subject.nil?
      render_api_error('Category not found', 404)
    end
    true
  end

  def subject
    Category.find(params[:id])
  end

  def category_params
    params.require(:category).permit(:title)
  end
end