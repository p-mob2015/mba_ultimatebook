class Api::BooksController < Api::ApiController
  before_action :check_presence, only: [:update, :destroy]

  def index
    render json: Book.all
  end

  def destroy
    File.delete("public/uploads/book/#{subject.cover}") unless subject.cover.nil?

    subject.destroy
    render nothing: true, status: 200
  end

  def create
    @book = Book.new(book_params.except(:genre_ids))

    if @book.valid?
      @book.save
      @book.assign_genres(book_params[:genre_ids])

      render json: @book
    else
      render_api_error('', 400, @book)
    end
  end

  def update
    @book = subject

    if @book.update(book_params.except(:genre_ids))
      @book.assign_genres(book_params[:genre_ids])
      render json: @book
    else
      render_api_error('', 400, @book)
    end
  end

  private

  def check_presence
    if subject.nil?
      render_api_error('Book not found', 404)
    end
    true
  end

  def subject
    Book.find(params[:id])
  end

  def book_params
    params.require(:book).permit(:title, :isbn, :cover, :amazon, :author, :summary, :genre_ids => [])
  end
end